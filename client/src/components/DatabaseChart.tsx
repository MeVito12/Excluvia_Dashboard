
import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Dados expandidos com mais informações
const extendedData = {
  all: [
    { name: 'Empresa A', usuarios: 1240, transacoes: 890, receita: 45000, crescimento: 12.5, satisfacao: 8.7, downtime: 0.2 },
    { name: 'Empresa B', usuarios: 980, transacoes: 1200, receita: 38000, crescimento: -2.3, satisfacao: 7.9, downtime: 1.1 },
    { name: 'Empresa C', usuarios: 1560, transacoes: 756, receita: 52000, crescimento: 18.7, satisfacao: 9.1, downtime: 0.1 },
    { name: 'Empresa D', usuarios: 820, transacoes: 1100, receita: 28000, crescimento: 5.8, satisfacao: 8.2, downtime: 0.8 },
    { name: 'Empresa E', usuarios: 1340, transacoes: 950, receita: 41000, crescimento: 8.9, satisfacao: 8.5, downtime: 0.4 },
    { name: 'Empresa F', usuarios: 2100, transacoes: 1450, receita: 67000, crescimento: 22.1, satisfacao: 9.3, downtime: 0.05 },
    { name: 'Empresa G', usuarios: 675, transacoes: 580, receita: 19500, crescimento: -5.2, satisfacao: 7.1, downtime: 2.3 },
  ],
  'empresa-a': [
    { name: 'Jan', usuarios: 1100, transacoes: 780, receita: 42000, crescimento: 10.2, satisfacao: 8.5, downtime: 0.3 },
    { name: 'Fev', usuarios: 1180, transacoes: 820, receita: 43500, crescimento: 11.8, satisfacao: 8.6, downtime: 0.2 },
    { name: 'Mar', usuarios: 1240, transacoes: 890, receita: 45000, crescimento: 12.5, satisfacao: 8.7, downtime: 0.2 },
  ],
  'empresa-b': [
    { name: 'Jan', usuarios: 1020, transacoes: 1150, receita: 39000, crescimento: 2.1, satisfacao: 8.1, downtime: 0.9 },
    { name: 'Fev', usuarios: 1000, transacoes: 1180, receita: 38500, crescimento: -0.5, satisfacao: 8.0, downtime: 1.0 },
    { name: 'Mar', usuarios: 980, transacoes: 1200, receita: 38000, crescimento: -2.3, satisfacao: 7.9, downtime: 1.1 },
  ],
};

const pieData = [
  { name: 'Ativo', value: 78, color: 'hsl(var(--accent))' },
  { name: 'Inativo', value: 15, color: 'hsl(var(--primary))' },
  { name: 'Manutenção', value: 7, color: 'hsl(var(--muted-foreground))' },
];

const performanceData = [
  { name: 'Empresa A', performance: 98.7, memoria: 75, cpu: 45 },
  { name: 'Empresa B', performance: 94.2, memoria: 82, cpu: 67 },
  { name: 'Empresa C', performance: 99.1, memoria: 68, cpu: 38 },
  { name: 'Empresa D', performance: 96.8, memoria: 79, cpu: 52 },
  { name: 'Empresa E', performance: 97.5, memoria: 71, cpu: 41 },
  { name: 'Empresa F', performance: 99.8, memoria: 62, cpu: 29 },
  { name: 'Empresa G', performance: 91.3, memoria: 88, cpu: 73 },
];

interface DatabaseChartProps {
  type: 'bar' | 'line' | 'pie' | 'area' | 'performance';
  title: string;
  selectedCompany?: string;
}

const DatabaseChart = ({ type, title, selectedCompany = 'all' }: DatabaseChartProps) => {
  const getData = () => {
    if (type === 'performance') return performanceData;
    if (type === 'pie') return pieData;
    return extendedData[selectedCompany as keyof typeof extendedData] || extendedData.all;
  };

  const data = getData();

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
              <Line 
                type="monotone" 
                dataKey="crescimento" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
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
              <Area 
                type="monotone" 
                dataKey="satisfacao" 
                stroke="hsl(var(--accent))" 
                fill="hsl(var(--accent))" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'performance':
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
              <Bar dataKey="performance" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="memoria" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cpu" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
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
    <Card className="p-6 bg-white border-border/50">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{title}</h3>
      {renderChart()}
    </Card>
  );
};

export default DatabaseChart;
