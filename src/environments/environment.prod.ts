// Configuración de APIs para datos bursátiles
// NO SUBAS ESTE ARCHIVO A REPOSITORIOS PÚBLICOS (ya está en .gitignore)

export const environment = {
    production: false,
    
    // Opción 1: RapidAPI - Yahoo Finance (Recomendada)
    // Regístrate en: https://rapidapi.com/sparior/api/yahoo-finance15
    // Plan gratuito: 500 requests/mes
    rapidapi: {
      key: 'b5f042675cmsh67003905f12575cp1ebaecjsna372ad395838',
      host: 'yahoo-finance15.p.rapidapi.com',
      enabled: true
    },
    
    // Opción 2: Alpha Vantage (Alternativa gratuita)
    alphavantage: {
      key: 'TU_ALPHAVANTAGE_KEY_AQUI',
      enabled: false
    },
    
    // Opción 3: Yahoo Finance directa
    yahooFinanceDirect: {
      enabled: false
    },
    
    // Si todas las APIs están deshabilitadas, se usarán datos simulados
    useMockData: false
  };