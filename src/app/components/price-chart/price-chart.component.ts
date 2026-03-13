import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
 
// Registrar todos los componentes de Chart.js
Chart.register(...registerables);
 
export interface PriceHistoryPoint {
  date: string;
  price: number;
  high?: number;
  low?: number;
}
 
@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-chart.component.html',
  styleUrl: './price-chart.component.scss',
})

export class PriceChartComponent implements OnInit, OnChanges {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input() data: PriceHistoryPoint[] = [];
  @Input() title: string = 'Evolución del Precio';
  @Input() symbol: string = '';
  
  chart: Chart | null = null;
  selectedPeriod: number = 365; // 1 año por defecto
  
  periods = [
    { label: '1M', value: 30 },
    { label: '3M', value: 90 },
    { label: '6M', value: 180 },
    { label: '1A', value: 365 },
    { label: 'YTD', value: -1 }, // Year to date
    { label: '4A', value: 1460 }
  ];
 
  stats: {
    max: number;
    min: number;
    avg: number;
    change: number;
  } | null = null;
 
  ngOnInit() {
    this.createChart();
  }
 
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }
  }
 
  changePeriod(days: number) {
    this.selectedPeriod = days;
    this.updateChart();
  }
 
  private getFilteredData(): PriceHistoryPoint[] {
    if (this.selectedPeriod === -1) {
      // YTD: desde enero del año actual
      const yearStart = new Date(new Date().getFullYear(), 0, 1);
      return this.data.filter(point => new Date(point.date) >= yearStart);
    }
    
    return this.data.slice(-this.selectedPeriod);
  }
 
  private calculateStats(data: PriceHistoryPoint[]) {
    if (data.length === 0) {
      this.stats = null;
      return;
    }
 
    const prices = data.map(d => d.price);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const change = ((lastPrice - firstPrice) / firstPrice) * 100;
 
    this.stats = { max, min, avg, change };
  }
 
  private createChart() {
    const filteredData = this.getFilteredData();
    this.calculateStats(filteredData);
 
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
 
    const labels = filteredData.map(point => {
      const date = new Date(point.date);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        year: this.selectedPeriod > 365 ? '2-digit' : undefined
      });
    });
 
    const prices = filteredData.map(point => point.price);
    
    // Determinar color del gradiente según tendencia
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isPositive = lastPrice >= firstPrice;
 
    const gradient = ctx.createLinearGradient(0, 0, 0, 350);
    if (isPositive) {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
    } else {
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0.01)');
    }
 
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: this.symbol,
          data: prices,
          borderColor: isPositive ? '#10b981' : '#ef4444',
          backgroundColor: gradient,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          pointHoverRadius: 6,
          hoverBackgroundColor: isPositive ? '#10b981' : '#ef4444',
          pointHoverBorderColor: 'white',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: isPositive ? '#10b981' : '#ef4444',
            borderWidth: 2,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                return `Precio: ${value !== null ? value.toFixed(4) : '0.0000'}€`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 8,
              color: '#6b7280',
              font: {
                size: 11,
                weight: 500 as const
              }
            }
          },
          y: {
            position: 'right',
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              callback: (value) => {
                return `${(value as number).toFixed(2)}€`;
              },
              color: '#6b7280',
              font: {
                size: 12,
                weight: 600 as const
              }
            }
          }
        }
      }
    };
 
    this.chart = new Chart(ctx, config);
  }
 
  private updateChart() {
    if (!this.chart) {
      this.createChart();
      return;
    }
 
    const filteredData = this.getFilteredData();
    this.calculateStats(filteredData);
 
    const labels = filteredData.map(point => {
      const date = new Date(point.date);
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short',
        year: this.selectedPeriod > 365 ? '2-digit' : undefined
      });
    });
 
    const prices = filteredData.map(point => point.price);
 
    // Actualizar color según tendencia
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isPositive = lastPrice >= firstPrice;
 
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, 350);
      if (isPositive) {
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
      } else {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.01)');
      }
 
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = prices;
      this.chart.data.datasets[0].borderColor = isPositive ? '#10b981' : '#ef4444';
      this.chart.data.datasets[0].backgroundColor = gradient;
      this.chart.data.datasets[0].hoverBackgroundColor = isPositive ? '#10b981' : '#ef4444';
      
      if (this.chart.options.plugins?.tooltip) {
        this.chart.options.plugins.tooltip.borderColor = isPositive ? '#10b981' : '#ef4444';
      }
      
      this.chart.update();
    }
  }
 
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}