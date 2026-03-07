import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { YahooFinanceService } from './yahoo-finance';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
  time: string;
}

export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  constructor(
    private http: HttpClient,
    private yahooFinanceService: YahooFinanceService
  ) {}

  /**
   * Obtiene datos del IBEX 35
   */
  getIBEX35Data(): Observable<IndexData> {
    // Si useMockData está activado, devolver datos simulados
    if (environment.useMockData) {
      console.log('📊 Usando datos simulados para IBEX 35');
      return of(this.getMockIndexData());
    }

    // Si Yahoo Finance está habilitado
    if (environment.yahooFinance?.enabled && this.yahooFinanceService.isConfigured()) {
      console.log('🌐 Obteniendo IBEX 35 desde Yahoo Finance...');
      return this.yahooFinanceService.getQuote('^IBEX').pipe(
        map(quote => ({
          name: 'IBEX 35',
          value: quote.c,
          change: quote.d,
          changePercent: quote.dp,
          timestamp: new Date(quote.t * 1000).toISOString()
        })),
        catchError(error => {
          console.warn('⚠️ Error obteniendo IBEX 35, usando datos simulados:', error);
          return of(this.getMockIndexData());
        })
      );
    }

    // Fallback a datos simulados
    console.warn('⚠️ No API configured, using mock data');
    return of(this.getMockIndexData());
  }

  /**
   * Obtiene datos de todas las acciones del IBEX 35
   */
  getIBEX35Stocks(): Observable<StockData[]> {
    const ibexStocks = [
      'AMADEUS IT', 'ACERINOX', 'INDRA A', 'ARCEL.MITTAL', 'SOLARIA',
      'REPSOL', 'ENAGAS', 'LABORAT.ROVI', 'REDEIA CORPORACIÓN', 
      'FERROVIAL INTL RG', 'ACCIONA', 'ACCIONA ENERGÍA', 'ACS CONST.',
      'AENA', 'B.SABADELL', 'BANKINTER', 'BBVA', 'CAIXABANK',
      'CELLNEX TEL.', 'COLONIAL', 'ENDESA', 'FLUIDRA', 'GRIFOLS',
      'IAG (IBERIA)', 'IBERDROLA', 'INDITEX', 'LOGISTA', 'MAPFRE',
      'MERLIN PROP.', 'NATURGY', 'PUIG BRANDS S RG', 'SANTANDER',
      'SACYR', 'TELEFONICA', 'UNICAJA BANCO'
    ];

    // Si useMockData está activado, devolver datos simulados
    if (environment.useMockData) {
      console.log('📊 Usando datos simulados para acciones IBEX 35');
      return of(this.getMockStockData(ibexStocks));
    }

    // Si Yahoo Finance está habilitado
    if (environment.yahooFinance?.enabled && this.yahooFinanceService.isConfigured()) {
      console.log('🌐 Obteniendo acciones IBEX 35 desde Yahoo Finance...');
      
      // Crear observables para cada acción
      const stockObservables = ibexStocks.map(symbol =>
        this.yahooFinanceService.getQuote(symbol).pipe(
          map(quote => this.yahooFinanceService.convertToStockData(symbol, quote)),
          catchError(error => {
            console.warn(`⚠️ Error obteniendo ${symbol}, usando datos simulados`);
            return of(this.getMockStockData([symbol])[0]);
          })
        )
      );

      // Ejecutar todas las solicitudes en paralelo
      return forkJoin(stockObservables);
    }

    // Fallback a datos simulados
    console.warn('⚠️ No API configured, using mock data');
    return of(this.getMockStockData(ibexStocks));
  }

  /**
   * Obtiene datos del Mercado Continuo
   */

  /**
   * Obtiene datos del Mercado Continuo - LISTA COMPLETA
   */
  getMercadoContinuoStocks(): Observable<StockData[]> {
    const continuoStocks = [
      // IBEX 35
      'ACCIONA', 'ACCIONA ENERGÍA', 'ACERINOX', 'ACS CONST.', 'AENA',
      'AMADEUS IT', 'ARCEL.MITTAL', 'B.SABADELL', 'BANKINTER', 'BBVA',
      'CAIXABANK', 'CELLNEX TEL.', 'COLONIAL', 'ENAGAS', 'ENDESA',
      'FERROVIAL INTL RG', 'FLUIDRA', 'GRIFOLS', 'IAG (IBERIA)', 'IBERDROLA',
      'INDRA A', 'INDITEX', 'LABORAT.ROVI', 'LOGISTA', 'MAPFRE',
      'MERLIN PROP.', 'NATURGY', 'PUIG BRANDS S RG', 'REDEIA CORPORACIÓN',
      'REPSOL', 'SACYR', 'SANTANDER', 'SOLARIA', 'TELEFONICA', 'UNICAJA BANCO',
      
      // Resto del Mercado Continuo (ordenados alfabéticamente)
      'ADOLFO DMGZ', 'AEDAS HOMES', 'AIRBUS GROUP', 'AIRTIFICIAL INT.',
      'ALANTRA PART', 'ALMIRALL', 'ALQU SEG ASSET RG', 'AMPER',
      'AMBREST HOLDINGS', 'APERAM', 'ARTECHE', 'ATRESMEDIA', 'ATRYS HEALTH',
      'AUDAX REN.', 'AZKOYEN', 'B.RIOJANAS', 'BERKELEY ENERGIA',
      'BETTER CONSULT', 'C. BAVIERA', 'CAF', 'CAM', 'CAMINHO PROPICIO RG',
      'CIE AUTOMOTIVE', 'CIRSA ENTERPRIS RG', 'CLEOP', 'COEMAC',
      'COCA-COLA', 'COMPAÑÍA LEVANTINA', 'CONSTRUCCIONES RUBAU',
      'CORP FINANC ALBA', 'COX ABG GROUP RG', 'CUPULAS PROPERT RG',
      'DEOLEO', 'DESA', 'DOMINION', 'DURO FELGUERA', 'EBRO FOODS',
      'ECOENER', 'EDREAMS', 'ELECNOR', 'ENCE', 'ENERSIDE ENERGY',
      'ERCROS', 'EUSKALTEL', 'EZENTIS', 'FAES', 'FCC', 'G.E.SAN JOSE',
      'GAM (GALQ)', 'GESRENTA BCN RG', 'GESTAMP', 'GLOBAL DOM.',
      'GRANDVOYAGE TRAV BR', 'GRENERGY REN.', 'GREYMILE RG', 'GRIFOLS B',
      'HOTELBEDS', 'IBERPAPEL', 'IBERV HOTELES RG', 'INICIAT FARO 24 RG',
      'INM. DEL SUR', 'INMOBIL MARBELLA RG', 'INMOCEMENTO', 'INNOV SIM SOL RG',
      'INNOV SOLUT ECO', 'INSTAL.ACCIONA', 'IZERTIS', 'LAB. REIG',
      'LIBERTAS 7', 'LINEA DIRECTA BR', 'LINGOTES ESP', 'MASA RENTAL RG',
      'MASMOVIL', 'MEDIASET', 'MELIA HOTELS', 'METROVACESA', 'MFE RG-A',
      'MIN Y PROD I', 'MIQUEL COSTAS', 'MONTEBALITO', 'NATURHOUSE',
      'NEINOR HOMES', 'NEOENERGIA', 'NEOTRONIC', 'NEXTIL', 'NH HOTELES',
      'NICOLÁS CORREA', 'NYESA', 'OBR.H.LAIN', 'OBRASCON HUARTE',
      'ORYZON GEN.', 'PAPELES Y CARTONES', 'PESCANOVA', 'PHARMA MAR R',
      'PRIM', 'PRISA', 'PROSEGUR', 'PROSEGUR CASH', 'QUEST FOR GROWTH',
      'REALIA', 'REIG JOFRE', 'RENTA 4', 'RENTA CORP.', 'SIEMENS GAMESA',
      'SOLTEC', 'SOLTEC POWER', 'SQUIRREL MEDIA', 'ST CROIX HLD IMM RG',
      'SUPERMERCADOS DÍA', 'TALGO', 'TEC.REUNIDAS', 'TR JARDIN DEL MA BR',
      'TUBACEX', 'TUBOS REUNID', 'URBAR INGENIEROS BR', 'URBAS',
      'VERTICE 360', 'VIDRALA', 'VISCOFAN', 'VOCENTO'
    ];

    console.log('📊 Usando datos simulados para Mercado Continuo');
    return of(this.getMockStockData(continuoStocks));
  }


  /**
   * Obtiene datos de una acción específica por su símbolo
   */
  getStockData(symbol: string): Observable<StockData> {
    // Si useMockData está activado, devolver datos simulados
    if (environment.useMockData) {
      return of(this.getMockStockData([symbol])[0]);
    }

    // Si Yahoo Finance está habilitado
    if (environment.yahooFinance?.enabled && this.yahooFinanceService.isConfigured()) {
      return this.yahooFinanceService.getQuote(symbol).pipe(
        map(quote => this.yahooFinanceService.convertToStockData(symbol, quote)),
        catchError(error => {
          console.warn(`⚠️ Error obteniendo ${symbol}, usando datos simulados`);
          return of(this.getMockStockData([symbol])[0]);
        })
      );
    }
    
    // Fallback a datos simulados
    return of(this.getMockStockData([symbol])[0]);
  }

  /**
   * Formatea el volumen de forma legible
   */
  private formatVolume(volume: number): string {
    if (volume >= 1000000) {
      return Math.floor(volume / 1000000) + 'M';
    } else if (volume >= 1000) {
      return Math.floor(volume / 1000) + 'K';
    }
    return volume.toString();
  }

  /**
   * Datos simulados para desarrollo y fallback
   */
  private getMockIndexData(): IndexData {
    return {
      name: 'IBEX 35',
      value: 17074,  // Valor actualizado de ecobolsa
      change: -170,
      changePercent: -0.99,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Genera datos simulados basados en ecobolsa.com
   */
/**
   * Genera datos simulados COMPLETOS del Mercado Continuo (desde ecobolsa.com)
   */
private getMockStockData(stocks: string[]): StockData[] {
  const mockData: { [key: string]: Partial<StockData> } = {
    // ===== IBEX 35 =====
    'ACCIONA': { price: 209.80, change: -6.20, changePercent: -2.87, volume: '88K', previousClose: 216.00, dayHigh: 217.80, dayLow: 207.20 },
    'ACCIONA ENERGÍA': { price: 19.90, change: -0.24, changePercent: -1.19, volume: '322K', previousClose: 20.14, dayHigh: 20.60, dayLow: 19.78 },
    'ACERINOX': { price: 12.42, change: -0.20, changePercent: -1.58, volume: '860K', previousClose: 12.62, dayHigh: 12.84, dayLow: 12.36 },
    'ACS CONST.': { price: 102.70, change: -2.70, changePercent: -2.56, volume: '468K', previousClose: 105.40, dayHigh: 105.80, dayLow: 100.70 },
    'AENA': { price: 25.46, change: -0.02, changePercent: -0.08, volume: '1M', previousClose: 25.48, dayHigh: 25.72, dayLow: 25.12 },
    'AMADEUS IT': { price: 54.62, change: 0.88, changePercent: 1.64, volume: '2M', previousClose: 53.74, dayHigh: 54.92, dayLow: 53.60 },
    'ARCEL.MITTAL': { price: 47.90, change: -1.51, changePercent: -3.06, volume: '403K', previousClose: 49.41, dayHigh: 50.14, dayLow: 47.70 },
    'B.SABADELL': { price: 2.99, change: -0.018, changePercent: -0.60, volume: '21M', previousClose: 3.09, dayHigh: 3.048, dayLow: 2.94 },
    'BANKINTER': { price: 13.25, change: -0.195, changePercent: -1.45, volume: '2M', previousClose: 13.45, dayHigh: 13.56, dayLow: 13.45 },
    'BBVA': { price: 18.37, change: -0.18, changePercent: -0.97, volume: '14M', previousClose: 18.55, dayHigh: 18.81, dayLow: 18.25 },
    'CAIXABANK': { price: 9.87, change: -0.175, changePercent: -1.74, volume: '10M', previousClose: 10.045, dayHigh: 10.13, dayLow: 9.706 },
    'CELLNEX TEL.': { price: 29.29, change: -0.57, changePercent: -1.91, volume: '2M', previousClose: 29.86, dayHigh: 30.40, dayLow: 28.65 },
    'COLONIAL': { price: 5.285, change: 0.005, changePercent: 0.09, volume: '2M', previousClose: 5.28, dayHigh: 5.33, dayLow: 5.26 },
    'ENAGAS': { price: 14.765, change: 0.115, changePercent: 0.78, volume: '1M', previousClose: 14.65, dayHigh: 14.845, dayLow: 14.555 },
    'ENDESA': { price: 33.26, change: 0.23, changePercent: 0.70, volume: '785K', previousClose: 33.03, dayHigh: 33.56, dayLow: 32.95 },
    'FERROVIAL INTL RG': { price: 57.06, change: -0.98, changePercent: -1.69, volume: '941K', previousClose: 58.04, dayHigh: 59.06, dayLow: 56.24 },
    'FLUIDRA': { price: 21.24, change: -0.64, changePercent: -2.93, volume: '236K', previousClose: 21.88, dayHigh: 22.06, dayLow: 21.20 },
    'GRIFOLS': { price: 10.06, change: -0.35, changePercent: -3.36, volume: '2M', previousClose: 10.41, dayHigh: 10.595, dayLow: 10.045 },
    'IAG (IBERIA)': { price: 4.21, change: -0.079, changePercent: -1.85, volume: '15M', previousClose: 4.28, dayHigh: 4.37, dayLow: 4.27 },
    'IBERDROLA': { price: 19.215, change: -0.085, changePercent: -0.44, volume: '11M', previousClose: 19.30, dayHigh: 19.455, dayLow: 19.02 },
    'INDITEX': { price: 51.88, change: -1.40, changePercent: -2.15, volume: '3M', previousClose: 53.02, dayHigh: 53.38, dayLow: 51.88 },
    'INDRA A': { price: 59.95, change: -1.90, changePercent: -3.07, volume: '927K', previousClose: 61.85, dayHigh: 63.00, dayLow: 59.55 },
    'LABORAT.ROVI': { price: 80.85, change: 0.15, changePercent: 0.19, volume: '113K', previousClose: 80.70, dayHigh: 81.05, dayLow: 79.65 },
    'LOGISTA': { price: 30.32, change: -0.18, changePercent: -0.59, volume: '249K', previousClose: 30.50, dayHigh: 30.68, dayLow: 30.08 },
    'MAPFRE': { price: 3.656, change: -0.040, changePercent: -1.08, volume: '2M', previousClose: 3.696, dayHigh: 3.738, dayLow: 3.614 },
    'MERLIN PROP.': { price: 14.22, change: -0.28, changePercent: -1.93, volume: '1M', previousClose: 14.50, dayHigh: 14.58, dayLow: 14.09 },
    'NATURGY': { price: 24.96, change: 0.44, changePercent: 1.79, volume: '2M', previousClose: 24.52, dayHigh: 25.02, dayLow: 24.66 },
    'PUIG BRANDS S RG': { price: 15.07, change: -0.17, changePercent: -1.12, volume: '584K', previousClose: 15.24, dayHigh: 15.45, dayLow: 15.06 },
    'REDEIA CORPORACIÓN': { price: 14.87, change: 0.01, changePercent: 0.07, volume: '2M', previousClose: 14.86, dayHigh: 15.02, dayLow: 14.82 },
    'REPSOL': { price: 20.76, change: 0.54, changePercent: 2.67, volume: '8M', previousClose: 20.22, dayHigh: 20.82, dayLow: 20.20 },
    'SACYR': { price: 4.158, change: -0.046, changePercent: -1.09, volume: '3M', previousClose: 4.204, dayHigh: 4.228, dayLow: 4.058 },
    'SANTANDER': { price: 9.582, change: -0.119, changePercent: -1.23, volume: '42M', previousClose: 9.701, dayHigh: 9.821, dayLow: 9.364 },
    'SOLARIA': { price: 19.32, change: -0.255, changePercent: -1.30, volume: '1M', previousClose: 19.575, dayHigh: 20.08, dayLow: 18.96 },
    'TELEFONICA': { price: 3.671, change: 0.103, changePercent: 2.89, volume: '17M', previousClose: 3.568, dayHigh: 3.671, dayLow: 3.568 },
    'UNICAJA BANCO': { price: 2.502, change: -0.030, changePercent: -1.18, volume: '7M', previousClose: 2.532, dayHigh: 2.556, dayLow: 2.462 },

    // ===== RESTO MERCADO CONTINUO =====
    'ADOLFO DMGZ': { price: 5.40, change: -0.05, changePercent: -0.92, volume: '636', previousClose: 5.45, dayHigh: 5.65, dayLow: 5.40 },
    'AEDAS HOMES': { price: 23.50, change: -0.10, changePercent: -0.42, volume: '8K', previousClose: 23.60, dayHigh: 23.55, dayLow: 23.30 },
    'AIRBUS GROUP': { price: 175.62, change: -0.54, changePercent: -0.31, volume: '5K', previousClose: 176.16, dayHigh: 178.16, dayLow: 172.68 },
    'AIRTIFICIAL INT.': { price: 0.0904, change: -0.0005, changePercent: -0.55, volume: '631K', previousClose: 0.0909, dayHigh: 0.092, dayLow: 0.090 },
    'ALANTRA PART': { price: 8.90, change: -0.04, changePercent: -0.45, volume: '11K', previousClose: 8.94, dayHigh: 9.06, dayLow: 8.82 },
    'ALMIRALL': { price: 11.98, change: -0.12, changePercent: -0.99, volume: '169K', previousClose: 12.10, dayHigh: 12.20, dayLow: 11.86 },
    'ALQU SEG ASSET RG': { price: 13.80, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 13.80, dayHigh: 13.80, dayLow: 13.80 },
    'AMPER': { price: 0.1572, change: -0.0018, changePercent: -1.13, volume: '12M', previousClose: 0.159, dayHigh: 0.161, dayLow: 0.155 },
    'AMBREST HOLDINGS': { price: 2.81, change: 0.02, changePercent: 0.72, volume: '31K', previousClose: 2.79, dayHigh: 2.85, dayLow: 2.76 },
    'APERAM': { price: 37.40, change: -1.24, changePercent: -3.19, volume: '2K', previousClose: 38.64, dayHigh: 39.06, dayLow: 37.32 },
    'ARTECHE': { price: 23.60, change: -0.60, changePercent: -2.46, volume: '7K', previousClose: 24.20, dayHigh: 24.20, dayLow: 23.60 },
    'ATRESMEDIA': { price: 4.96, change: 0.01, changePercent: 0.20, volume: '350K', previousClose: 4.95, dayHigh: 5.02, dayLow: 4.91 },
    'ATRYS HEALTH': { price: 2.81, change: 0.00, changePercent: 0.00, volume: '17K', previousClose: 2.81, dayHigh: 2.81, dayLow: 2.76 },
    'AUDAX REN.': { price: 1.238, change: -0.002, changePercent: -0.16, volume: '497K', previousClose: 1.240, dayHigh: 1.274, dayLow: 1.220 },
    'AZKOYEN': { price: 8.90, change: -0.18, changePercent: -1.98, volume: '5K', previousClose: 9.08, dayHigh: 9.14, dayLow: 8.80 },
    'B.RIOJANAS': { price: 2.22, change: 0.06, changePercent: 2.78, volume: '16K', previousClose: 2.16, dayHigh: 2.25, dayLow: 2.0415 },
    'BERKELEY ENERGIA': { price: 0.291, change: -0.002, changePercent: -0.68, volume: '727K', previousClose: 0.293, dayHigh: 0.2965, dayLow: 0.286 },
    'BETTER CONSULT': { price: 4.60, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 4.60, dayHigh: 4.60, dayLow: 4.60 },
    'C. BAVIERA': { price: 50.40, change: -0.40, changePercent: -0.79, volume: '1K', previousClose: 50.80, dayHigh: 51.00, dayLow: 50.00 },
    'CAF': { price: 58.10, change: -0.20, changePercent: -0.34, volume: '41K', previousClose: 58.30, dayHigh: 59.00, dayLow: 57.50 },
    'CAM': { price: 1.34, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 1.34, dayHigh: 1.34, dayLow: 1.34 },
    'CAMINHO PROPICIO RG': { price: 1.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 1.00, dayHigh: 1.00, dayLow: 1.00 },
    'CIE AUTOMOTIVE': { price: 28.85, change: -0.35, changePercent: -1.20, volume: '59K', previousClose: 29.20, dayHigh: 29.90, dayLow: 28.65 },
    'CIRSA ENTERPRIS RG': { price: 14.15, change: -0.26, changePercent: -1.80, volume: '70K', previousClose: 14.41, dayHigh: 14.45, dayLow: 14.08 },
    'CLEOP': { price: 1.15, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 1.15, dayHigh: 1.15, dayLow: 1.15 },
    'COCA-COLA': { price: 86.70, change: -2.10, changePercent: -2.36, volume: '6K', previousClose: 88.80, dayHigh: 88.40, dayLow: 86.20 },
    'COX ABG GROUP RG': { price: 9.40, change: -0.06, changePercent: -0.63, volume: '3K', previousClose: 9.46, dayHigh: 9.44, dayLow: 9.36 },
    'CUPULAS PROPERT RG': { price: 1670.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 1670.00, dayHigh: 1670.00, dayLow: 1670.00 },
    'DEOLEO': { price: 0.226, change: 0.00, changePercent: 0.00, volume: '381K', previousClose: 0.226, dayHigh: 0.231, dayLow: 0.224 },
    'DESA': { price: 18.50, change: -0.20, changePercent: -1.07, volume: '1K', previousClose: 18.70, dayHigh: 18.50, dayLow: 16.90 },
    'DURO FELGUERA': { price: 0.178, change: -0.002, changePercent: -1.11, volume: '100K', previousClose: 0.180, dayHigh: 0.1818, dayLow: 0.175 },
    'EBRO FOODS': { price: 19.34, change: -0.06, changePercent: -0.31, volume: '25K', previousClose: 19.40, dayHigh: 19.44, dayLow: 19.14 },
    'ECOENER': { price: 4.76, change: -0.16, changePercent: -3.25, volume: '6K', previousClose: 4.92, dayHigh: 4.98, dayLow: 4.75 },
    'EDREAMS': { price: 3.075, change: 0.105, changePercent: 3.54, volume: '1M', previousClose: 2.970, dayHigh: 3.170, dayLow: 3.010 },
    'ELECNOR': { price: 27.65, change: 0.00, changePercent: 0.00, volume: '71K', previousClose: 27.65, dayHigh: 27.85, dayLow: 27.15 },
    'ENCE': { price: 2.334, change: 0.004, changePercent: 0.17, volume: '270K', previousClose: 2.330, dayHigh: 2.360, dayLow: 2.316 },
    'ERCROS': { price: 3.040, change: -0.060, changePercent: -1.94, volume: '508K', previousClose: 3.100, dayHigh: 3.135, dayLow: 3.035 },
    'EZENTIS': { price: 0.0818, change: 0.0018, changePercent: 2.25, volume: '675K', previousClose: 0.080, dayHigh: 0.0819, dayLow: 0.0792 },
    'FAES': { price: 4.735, change: -0.015, changePercent: -0.32, volume: '164K', previousClose: 4.750, dayHigh: 4.800, dayLow: 4.700 },
    'FCC': { price: 10.80, change: 0.04, changePercent: 0.37, volume: '20K', previousClose: 10.76, dayHigh: 11.26, dayLow: 10.78 },
    'G.E.SAN JOSE': { price: 8.32, change: -0.17, changePercent: -2.00, volume: '203K', previousClose: 8.49, dayHigh: 8.52, dayLow: 8.17 },
    'GAM (GALQ)': { price: 1.43, change: -0.01, changePercent: -0.69, volume: '39K', previousClose: 1.44, dayHigh: 1.44, dayLow: 1.40 },
    'GESRENTA BCN RG': { price: 131.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 131.00, dayHigh: 131.00, dayLow: 131.00 },
    'GESTAMP': { price: 3.10, change: 0.006, changePercent: 0.19, volume: '307K', previousClose: 3.094, dayHigh: 3.140, dayLow: 3.078 },
    'GLOBAL DOM.': { price: 3.08, change: -0.03, changePercent: -0.96, volume: '315K', previousClose: 3.11, dayHigh: 3.135, dayLow: 3.060 },
    'GRANDVOYAGE TRAV BR': { price: 3.40, change: -0.08, changePercent: -2.30, volume: '0', previousClose: 3.48, dayHigh: 3.48, dayLow: 3.48 },
    'GRENERGY REN.': { price: 105.00, change: 0.60, changePercent: 0.57, volume: '39K', previousClose: 104.40, dayHigh: 109.40, dayLow: 103.00 },
    'GREYMILE RG': { price: 3.20, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 3.20, dayHigh: 3.20, dayLow: 3.20 },
    'GRIFOLS B': { price: 7.45, change: -0.10, changePercent: -1.32, volume: '127K', previousClose: 7.55, dayHigh: 7.60, dayLow: 7.335 },
    'HOTELBEDS': { price: 6.79, change: -0.01, changePercent: -0.15, volume: '241K', previousClose: 6.80, dayHigh: 6.99, dayLow: 6.75 },
    'IBERPAPEL': { price: 19.95, change: 0.05, changePercent: 0.25, volume: '5K', previousClose: 19.90, dayHigh: 20.10, dayLow: 19.65 },
    'IBERV HOTELES RG': { price: 18.20, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 18.20, dayHigh: 18.20, dayLow: 18.20 },
    'INICIAT FARO 24 RG': { price: 1.83, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 1.83, dayHigh: 1.83, dayLow: 1.83 },
    'INM. DEL SUR': { price: 16.20, change: 0.00, changePercent: 0.00, volume: '465', previousClose: 16.20, dayHigh: 16.50, dayLow: 16.10 },
    'INMOBIL MARBELLA RG': { price: 4.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 4.00, dayHigh: 4.00, dayLow: 4.00 },
    'INMOCEMENTO': { price: 3.90, change: -0.02, changePercent: -0.51, volume: '7K', previousClose: 3.92, dayHigh: 3.94, dayLow: 3.83 },
    'INNOV SIM SOL RG': { price: 5.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 5.00, dayHigh: 5.00, dayLow: 5.00 },
    'INNOV SOLUT ECO': { price: 0.565, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 0.565, dayHigh: 0.565, dayLow: 0.565 },
    'IZERTIS': { price: 8.78, change: -0.06, changePercent: -0.68, volume: '61K', previousClose: 8.84, dayHigh: 8.88, dayLow: 8.62 },
    'LAB. REIG': { price: 2.44, change: -0.02, changePercent: -0.81, volume: '75K', previousClose: 2.46, dayHigh: 2.48, dayLow: 2.43 },
    'LIBERTAS 7': { price: 3.34, change: -0.06, changePercent: -1.76, volume: '10K', previousClose: 3.40, dayHigh: 3.46, dayLow: 3.34 },
    'LINEA DIRECTA BR': { price: 1.186, change: -0.002, changePercent: -0.17, volume: '278K', previousClose: 1.188, dayHigh: 1.190, dayLow: 1.172 },
    'LINGOTES ESP': { price: 5.25, change: 0.00, changePercent: 0.00, volume: '556', previousClose: 5.25, dayHigh: 5.40, dayLow: 5.25 },
    'MASA RENTAL RG': { price: 114.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 114.00, dayHigh: 114.00, dayLow: 114.00 },
    'MELIA HOTELS': { price: 8.02, change: -0.03, changePercent: -0.37, volume: '380K', previousClose: 8.05, dayHigh: 8.14, dayLow: 7.92 },
    'METROVACESA': { price: 11.55, change: -0.25, changePercent: -2.12, volume: '62K', previousClose: 11.80, dayHigh: 11.95, dayLow: 11.55 },
    'MFE RG-A': { price: 2.96, change: -0.052, changePercent: -1.73, volume: '21K', previousClose: 3.012, dayHigh: 3.070, dayLow: 2.934 },
    'MIN Y PROD I': { price: 8.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 8.00, dayHigh: 8.00, dayLow: 8.00 },
    'MIQUEL COSTAS': { price: 14.05, change: -0.15, changePercent: -1.06, volume: '3K', previousClose: 14.20, dayHigh: 14.15, dayLow: 14.05 },
    'MONTEBALITO': { price: 1.76, change: 0.04, changePercent: 2.33, volume: '2K', previousClose: 1.72, dayHigh: 1.80, dayLow: 1.68 },
    'NATURHOUSE': { price: 2.52, change: 0.01, changePercent: 0.40, volume: '88K', previousClose: 2.51, dayHigh: 2.60, dayLow: 2.46 },
    'NEINOR HOMES': { price: 18.18, change: 0.02, changePercent: 0.11, volume: '248K', previousClose: 18.16, dayHigh: 18.36, dayLow: 18.00 },
    'NEXTIL': { price: 0.804, change: -0.004, changePercent: -0.50, volume: '633K', previousClose: 0.808, dayHigh: 0.824, dayLow: 0.790 },
    'NICOLÁS CORREA': { price: 10.50, change: 0.60, changePercent: 6.06, volume: '10K', previousClose: 9.90, dayHigh: 10.50, dayLow: 9.80 },
    'NYESA': { price: 0.0058, change: -0.0004, changePercent: -6.45, volume: '51M', previousClose: 0.0062, dayHigh: 0.0062, dayLow: 0.0058 },
    'OBR.H.LAIN': { price: 0.3965, change: -0.007, changePercent: -1.73, volume: '14M', previousClose: 0.4035, dayHigh: 0.4125, dayLow: 0.394 },
    'ORYZON GEN.': { price: 2.77, change: -0.03, changePercent: -1.07, volume: '248K', previousClose: 2.80, dayHigh: 2.699, dayLow: 2.760 },
    'PESCANOVA': { price: 0.270, change: 0.006, changePercent: 2.27, volume: '150K', previousClose: 0.264, dayHigh: 0.270, dayLow: 0.262 },
    'PHARMA MAR R': { price: 80.40, change: 0.25, changePercent: 0.31, volume: '32K', previousClose: 80.15, dayHigh: 81.00, dayLow: 78.40 },
    'PRIM': { price: 13.20, change: 0.10, changePercent: 0.76, volume: '2K', previousClose: 13.10, dayHigh: 13.45, dayLow: 13.00 },
    'PRISA': { price: 0.333, change: 0.013, changePercent: 4.06, volume: '100K', previousClose: 0.320, dayHigh: 0.333, dayLow: 0.309 },
    'PROSEGUR': { price: 2.775, change: 0.010, changePercent: 0.36, volume: '197K', previousClose: 2.765, dayHigh: 2.805, dayLow: 2.725 },
    'PROSEGUR CASH': { price: 0.626, change: -0.004, changePercent: -0.63, volume: '845K', previousClose: 0.630, dayHigh: 0.632, dayLow: 0.613 },
    'REALIA': { price: 1.045, change: 0.00, changePercent: 0.00, volume: '14K', previousClose: 1.045, dayHigh: 1.045, dayLow: 1.025 },
    'RENTA 4': { price: 19.00, change: -0.20, changePercent: -1.04, volume: '1K', previousClose: 19.20, dayHigh: 19.20, dayLow: 19.00 },
    'RENTA CORP.': { price: 0.800, change: -0.0089, changePercent: -1.10, volume: '14K', previousClose: 0.8089, dayHigh: 0.814, dayLow: 0.790 },
    'SOLTEC': { price: 0.908, change: 0.059, changePercent: 6.95, volume: '8M', previousClose: 0.849, dayHigh: 1.060, dayLow: 0.863 },
    'SQUIRREL MEDIA': { price: 2.35, change: -0.13, changePercent: -5.24, volume: '6K', previousClose: 2.48, dayHigh: 2.40, dayLow: 2.34 },
    'ST CROIX HLD IMM RG': { price: 72.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 72.00, dayHigh: 72.00, dayLow: 72.00 },
    'SUPERMERCADOS DÍA': { price: 40.50, change: -0.40, changePercent: -0.98, volume: '51K', previousClose: 40.90, dayHigh: 41.45, dayLow: 40.05 },
    'TALGO': { price: 2.81, change: 0.03, changePercent: 1.08, volume: '54K', previousClose: 2.78, dayHigh: 2.86, dayLow: 2.77 },
    'TEC.REUNIDAS': { price: 31.42, change: 0.60, changePercent: 1.95, volume: '221K', previousClose: 30.82, dayHigh: 31.76, dayLow: 30.68 },
    'TR JARDIN DEL MA BR': { price: 1.00, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 1.00, dayHigh: 1.00, dayLow: 1.00 },
    'TUBACEX': { price: 3.085, change: -0.040, changePercent: -1.28, volume: '199K', previousClose: 3.125, dayHigh: 3.230, dayLow: 3.055 },
    'TUBOS REUNID': { price: 0.2625, change: -0.0105, changePercent: -3.85, volume: '449K', previousClose: 0.273, dayHigh: 0.2715, dayLow: 0.260 },
    'URBAR INGENIEROS BR': { price: 0.073, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 0.073, dayHigh: 0.073, dayLow: 0.073 },
    'URBAS': { price: 0.0021, change: 0.00, changePercent: 0.00, volume: '0', previousClose: 0.0021, dayHigh: 0.0021, dayLow: 0.0021 },
    'VIDRALA': { price: 75.70, change: 0.40, changePercent: 0.53, volume: '65K', previousClose: 75.30, dayHigh: 76.60, dayLow: 75.30 },
    'VISCOFAN': { price: 59.50, change: -0.10, changePercent: -0.17, volume: '114K', previousClose: 59.60, dayHigh: 60.40, dayLow: 59.20 },
    'VOCENTO': { price: 0.690, change: 0.00, changePercent: 0.00, volume: '26K', previousClose: 0.690, dayHigh: 0.696, dayLow: 0.670 }
  };

  return stocks.map(stock => {
    const mock = mockData[stock] || {};
    const basePrice = mock.price || Math.random() * 100 + 10;
    const changePercent = mock.changePercent || (Math.random() * 10 - 5);
    const change = mock.change || (basePrice * changePercent / 100);

    return {
      symbol: stock,
      name: stock,
      price: basePrice,
      change: change,
      changePercent: changePercent,
      volume: mock.volume || this.formatVolume(Math.floor(Math.random() * 50000000)),
      previousClose: mock.previousClose || (basePrice - change),
      dayHigh: mock.dayHigh || (basePrice + Math.abs(change) * 1.2),
      dayLow: mock.dayLow || (basePrice - Math.abs(change) * 1.2),
      time: 'CIERRE'
    };
  });
}
}