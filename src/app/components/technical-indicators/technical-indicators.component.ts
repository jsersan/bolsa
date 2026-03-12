import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  TechnicalIndicatorsService, 
  TechnicalIndicators, 
  TradingSignal, 
  PriceData 
} from '../../services/technical-indicators.service';

@Component({
  selector: 'app-technical-indicators',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technical-indicators.component.html',
  styleUrls: ['./technical-indicators.component.scss']
})
export class TechnicalIndicatorsComponent implements OnInit, OnChanges {
  @Input() priceHistory: PriceData[] = [];
  @Input() currentPrice: number = 0;

  indicators: TechnicalIndicators | null = null;
  signals: TradingSignal[] = [];
  consensus: any = null;
  loading = true;

  constructor(private technicalService: TechnicalIndicatorsService) {}

  ngOnInit() {
    this.calculateIndicators();
  }

  ngOnChanges() {
    this.calculateIndicators();
  }

  calculateIndicators() {
    this.loading = true;

    setTimeout(() => {
      if (this.priceHistory.length >= 50) {
        this.indicators = this.technicalService.calculateIndicators(this.priceHistory);
        this.signals = this.technicalService.generateSignals(this.indicators, this.currentPrice);
        this.consensus = this.technicalService.getConsensus(this.signals);
      }
      this.loading = false;
    }, 500);
  }

  formatNumber(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0.00';
    return value.toFixed(2);
  }

  getConsensusIcon(type: string): string {
    const icons: any = {
      'buy': '🟢',
      'sell': '🔴',
      'neutral': '🟡',
      'strong_buy': '🟢🟢',
      'strong_sell': '🔴🔴'
    };
    return icons[type] || '⚪';
  }

  getConsensusTitle(type: string): string {
    const titles: any = {
      'buy': 'SEÑAL DE COMPRA',
      'sell': 'SEÑAL DE VENTA',
      'neutral': 'NEUTRAL - ESPERAR',
      'strong_buy': 'COMPRA FUERTE',
      'strong_sell': 'VENTA FUERTE'
    };
    return titles[type] || 'SIN SEÑAL';
  }

  getSignalBadge(type: string): string {
    const badges: any = {
      'buy': 'COMPRA',
      'sell': 'VENTA',
      'neutral': 'NEUTRAL',
      'strong_buy': 'COMPRA FUERTE',
      'strong_sell': 'VENTA FUERTE'
    };
    return badges[type] || '';
  }

  getStrengthColor(strength: number): string {
    if (strength >= 80) return 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
    if (strength >= 60) return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
    return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
  }

  getPriceVsSMA(price: number, sma: number | null): string {
    if (sma === null) return '';
    return price > sma ? 'positive' : 'negative';
  }

  getPriceVsSMAText(price: number, sma: number | null): string {
    if (sma === null) return '0.00%';
    const diff = ((price - sma) / sma * 100).toFixed(2);
    return price > sma ? `+${diff}%` : `${diff}%`;
  }

  getValueClass(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    return value > 0 ? 'positive' : value < 0 ? 'negative' : '';
  }

  getADXClass(value: number): string {
    if (value > 25) return 'strong';
    if (value < 20) return 'weak';
    return '';
  }

  getADXText(value: number): string {
    if (value > 25) return 'Tendencia fuerte';
    if (value < 20) return 'Rango lateral';
    return 'Tendencia moderada';
  }

  getRSIClass(value: number | null): string {
    if (value === null) return '';
    if (value > 70) return 'negative'; // Sobrecompra
    if (value < 30) return 'positive'; // Sobreventa
    return '';
  }

  getRSIText(value: number | null): string {
    if (value === null) return 'Sin datos';
    if (value > 70) return 'Sobrecompra';
    if (value < 30) return 'Sobreventa';
    return 'Neutral';
  }

  getStochasticClass(value: number): string {
    if (value > 80) return 'negative';
    if (value < 20) return 'positive';
    return '';
  }

  getCCIClass(value: number | null): string {
    if (value === null) return '';
    if (value > 100) return 'negative';
    if (value < -100) return 'positive';
    return '';
  }

  getWilliamsClass(value: number | null): string {
    if (value === null) return '';
    if (value > -20) return 'negative';
    if (value < -80) return 'positive';
    return '';
  }

  /**
   * Clase para Bandas de Bollinger
   */
  getBollingerClass(price: number, bb: any): string {
    if (!bb) return '';
    if (price <= bb.lower) return 'positive'; // Cerca de banda baja = compra
    if (price >= bb.upper) return 'negative'; // Cerca de banda alta = venta
    return '';
  }

  /**
   * Clase para tendencia de volumen
   */
  getVolumeTrendClass(trend: string): string {
    if (trend === 'high') return 'positive';
    if (trend === 'low') return 'negative';
    return '';
  }

  /**
   * Texto para tendencia de volumen
   */
  getVolumeTrendText(trend: string): string {
    if (trend === 'high') return '🔥 Alto';
    if (trend === 'low') return '📉 Bajo';
    return '➡️ Normal';
  }

  /**
   * Clase para niveles de Fibonacci
   */
  getFibonacciClass(currentPrice: number, fibLevel: number | null | undefined): string {
    if (fibLevel === null || fibLevel === undefined) return '';
    
    const distance = Math.abs(currentPrice - fibLevel);
    const tolerance = fibLevel * 0.02; // 2% tolerancia
    
    if (distance < tolerance) {
      return 'strong'; // Cerca del nivel
    }
    return '';
  }

  /**
   * Verificar si está cerca de un nivel Fibonacci
   */
  isNearFibonacci(currentPrice: number, fibLevel: number | null | undefined): boolean {
    if (fibLevel === null || fibLevel === undefined) return false;
    
    const distance = Math.abs(currentPrice - fibLevel);
    const tolerance = fibLevel * 0.02;
    return distance < tolerance;
  }

  /**
   * Formatear OBV
   */
  formatOBV(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0';
    
    const abs = Math.abs(value);
    if (abs >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (abs >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(0);
  }

  /**
   * Formatear volumen
   */
  formatVolume(value: number | null | undefined): string {
    if (value === null || value === undefined) return '0';
    
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(0);
  }
}