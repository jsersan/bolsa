import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class YahooFinanceService {
  
  // Usar proxy CORS para evitar errores de bloqueo
  private corsProxy = 'https://api.allorigins.win/raw?url=';
  
  // Mapeo de símbolos a Yahoo Finance
  private symbolMap: { [key: string]: string } = {
    'ACCIONA': 'ANA.MC',
    'ACCIONA ENERGÍA': 'ANE.MC',
    'ACERINOX': 'ACX.MC',
    'ACS CONST.': 'ACS.MC',
    'AENA': 'AENA.MC',
    'AMADEUS IT': 'AMS.MC',
    'ARCEL.MITTAL': 'MTS.MC',
    'BANKINTER': 'BKT.MC',
    'BBVA': 'BBVA.MC',
    'CAIXABANK': 'CABK.MC',
    'CELLNEX TEL.': 'CLNX.MC',
    'COLONIAL': 'COL.MC',
    'ENAGAS': 'ENG.MC',
    'ENDESA': 'ELE.MC',
    'FERROVIAL INTL RG': 'FER.MC',
    'FLUIDRA': 'FDR.MC',
    'GRIFOLS': 'GRF.MC',
    'IAG (IBERIA)': 'IAG.MC',
    'IBERDROLA': 'IBE.MC',
    'INDRA A': 'IDR.MC',
    'INDITEX': 'ITX.MC',
    'LABORAT.ROVI': 'ROVI.MC',
    'LOGISTA': 'LOG.MC',
    'MAPFRE': 'MAP.MC',
    'MERLIN PROP.': 'MRL.MC',
    'NATURGY': 'NTGY.MC',
    'PUIG BRANDS S RG': 'PUIG.MC',
    'REDEIA CORPORACIÓN': 'RED.MC',
    'REPSOL': 'REP.MC',
    'B.SABADELL': 'SAB.MC',
    'SACYR': 'SCYR.MC',
    'SANTANDER': 'SAN.MC',
    'SOLARIA': 'SLR.MC',
    'TELEFONICA': 'TEF.MC',
    'UNICAJA BANCO': 'UNI.MC',
    '^IBEX': '^IBEX'
  };

  constructor(private http: HttpClient) {}

  /**
   * Obtener cotización de Yahoo Finance con proxy CORS
   */
  getQuote(symbol: string): Observable<any> {
    const ticker = this.symbolMap[symbol] || symbol;
    
    // URL de Yahoo Finance con proxy CORS
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    const url = `${this.corsProxy}${encodeURIComponent(yahooUrl)}`;

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((response: string) => {
        const data = JSON.parse(response);
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];

        return {
          c: meta.regularMarketPrice,
          d: meta.regularMarketPrice - meta.chartPreviousClose,
          dp: ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100,
          h: quote.high[quote.high.length - 1] || meta.regularMarketPrice,
          l: quote.low[quote.low.length - 1] || meta.regularMarketPrice,
          o: quote.open[0] || meta.regularMarketPrice,
          pc: meta.chartPreviousClose,
          t: meta.regularMarketTime,
          volume: quote.volume[quote.volume.length - 1] || 0
        };
      }),
      catchError(error => {
        console.error(`Error fetching Yahoo Finance quote for ${ticker}:`, error);
        throw error;
      })
    );
  }

  /**
   * Convertir respuesta de Yahoo Finance al formato de tu app
   */
  convertToStockData(symbol: string, quote: any): any {
    return {
      symbol: symbol,
      name: symbol,
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
      volume: this.formatVolume(quote.volume),
      previousClose: quote.pc,
      dayHigh: quote.h,
      dayLow: quote.l,
      time: new Date(quote.t * 1000).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  }

  /**
   * Formatear volumen
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
   * Verificar si está configurado
   */
  isConfigured(): boolean {
    return true;
  }
}