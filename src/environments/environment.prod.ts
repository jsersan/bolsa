export const environment = {
  production: true,
  
  yahooFinance: {
    enabled: true,
    // CAMBIA ESTO por tu URL real de Render/Railway
    backendUrl: 'https://burtsa-backend.onrender.com/api' 
  },
  
  finnhub: {
    key: '',
    enabled: false
  },
  
  useMockData: false, // Correcto, en producción no queremos datos falsos
  activeAPI: 'yahooFinance'
};