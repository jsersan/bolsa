// Configuración de APIs para datos bursátiles
// NO SUBAS ESTE ARCHIVO A REPOSITORIOS PÚBLICOS (ya está en .gitignore)

export const environment = {
    yahooFinance: {
        enabled: true  // ← SIN API KEY
      },
    finnhub: {
      key: 'd6lsshpr01quej91bu9gd6lsshpr01quej91bua0',  // ← Pega tu key
      enabled: false
    },
    useMockData: false,  // ← Cambiar a false
    activeAPI: 'yahooFinance'  
};