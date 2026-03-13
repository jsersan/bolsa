// Configuración de APIs para datos bursátiles
// NO SUBAS ESTE ARCHIVO A REPOSITORIOS PÚBLICOS (ya está en .gitignore)

export const environment = {
  production: false,
  // ESTO ES LO QUE TE FALTA DEFINIR:
  yahooFinance: {
    enabled: true,
    backendUrl: 'http://localhost:3000/api'
  },
  useMockData: false,
  activeAPI: 'yahooFinance'
};