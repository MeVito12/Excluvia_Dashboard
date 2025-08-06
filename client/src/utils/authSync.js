// Utilitário para sincronizar autenticação do localStorage
export function forceLogout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userBusinessCategory');
  console.log('[AUTH-SYNC] 🔄 localStorage cleared, please login again');
  window.location.reload();
}

// Executar automaticamente se houver inconsistência
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
  try {
    const userData = JSON.parse(currentUser);
    // Se o email não corresponder ao role esperado, forçar logout
    if (userData.email === 'usuario@sistema.com' && userData.id === '11b6f959-b34c-45e8-b490-196dc6c2c403') {
      console.log('[AUTH-SYNC] ⚠️ Detected inconsistent auth data, forcing logout...');
      forceLogout();
    }
  } catch (e) {
    console.log('[AUTH-SYNC] ❌ Error parsing localStorage, clearing...');
    forceLogout();
  }
}