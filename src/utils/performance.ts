// Performance monitoring utilities for production
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component render times
  trackRender(componentName: string, renderTime: number): void {
    this.metrics.set(`render_${componentName}`, renderTime);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${componentName} rendered in ${renderTime}ms`);
    }
  }

  // Track database operations
  trackDatabaseOperation(operation: string, duration: number): void {
    this.metrics.set(`db_${operation}`, duration);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Database: ${operation} completed in ${duration}ms`);
    }
  }

  // Track user interactions
  trackUserAction(action: string): void {
    const timestamp = Date.now();
    this.metrics.set(`action_${action}`, timestamp);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`User Action: ${action} at ${new Date(timestamp).toISOString()}`);
    }
  }

  // Get Web Vitals
  getWebVitals(): void {
    if ('performance' in window) {
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.set('fcp', entry.startTime);
        }
      });

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.set('lcp', lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      }

      // Cumulative Layout Shift
      if ('PerformanceObserver' in window) {
        let clsValue = 0;
        const observer = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          this.metrics.set('cls', clsValue);
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      }
    }
  }

  // Get memory usage
  getMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.set('memory_used', memory.usedJSHeapSize);
      this.metrics.set('memory_total', memory.totalJSHeapSize);
      this.metrics.set('memory_limit', memory.jsHeapSizeLimit);
    }
  }

  // Export metrics for analysis
  exportMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  // Clear metrics
  clearMetrics(): void {
    this.metrics.clear();
  }
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();

  const trackRender = (componentName: string, startTime: number) => {
    const duration = performance.now() - startTime;
    monitor.trackRender(componentName, duration);
  };

  const trackUserAction = (action: string) => {
    monitor.trackUserAction(action);
  };

  const trackDatabaseOperation = (operation: string, startTime: number) => {
    const duration = performance.now() - startTime;
    monitor.trackDatabaseOperation(operation, duration);
  };

  return {
    trackRender,
    trackUserAction,
    trackDatabaseOperation,
    getMetrics: () => monitor.exportMetrics()
  };
}
