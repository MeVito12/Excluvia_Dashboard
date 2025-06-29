
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Empresa A', usuarios: 1240, transacoes: 890, receita: 45000 },
  { name: 'Empresa B', usuarios: 980, transacoes: 1200, receita: 38000 },
  { name: 'Empresa C', usuarios: 1560, transacoes: 756, receita: 52000 },
  { name: 'Empresa D', usuarios: 820, transacoes: 1100, receita: 28000 },
  { name: 'Empresa E', usuarios: 1340, transacoes: 950, receita: 41000 },
];

const pieData = [
  { name: 'Ativo', value: 78, color: 'hsl(var(--accent))' },
  { name: 'Inativo', value: 15, color: 'hsl(var(--primary))' },
  { name: 'Manutenção', value: 7, color: 'hsl(var(--muted-foreground))' },
];

interface DatabaseChartProps {
  type: 'bar' | 'line' | 'pie';
  title: string;
}

const DatabaseChart = ({ type, title }: DatabaseChartProps) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="usuarios" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="transacoes" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="receita" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      {renderChart()}
    </Card>
  );
};

export default DatabaseChart;
