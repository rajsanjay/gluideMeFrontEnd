import type { Connection } from '../types';

declare const LeaderLine: any;

export class ConnectionManager {
  private lines: Map<string, any> = new Map();
  private initialized: boolean = false;
  private domObserver: MutationObserver | null = null;

  constructor() {
    // Create a mutation observer to watch for DOM changes
    this.domObserver = new MutationObserver(() => {
      if (this.initialized) {
        this.repositionLines();
      }
    });

    // Start observing the document with the configured parameters
    this.domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  private waitForElements(fromId: string, toId: string, maxAttempts = 20): Promise<[HTMLElement, HTMLElement]> {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      
      const checkElements = () => {
        const fromElement = document.getElementById(fromId);
        const toElement = document.getElementById(toId);
        
        if (fromElement && toElement) {
          const fromPoint = fromElement.querySelector('.connection-point-right');
          const toPoint = toElement.querySelector('.connection-point-left');
          
          if (fromPoint && toPoint) {
            resolve([fromPoint as HTMLElement, toPoint as HTMLElement]);
          } else if (attempts >= maxAttempts) {
            reject(new Error('Connection points not found'));
          } else {
            attempts++;
            setTimeout(checkElements, 50);
          }
        } else if (attempts >= maxAttempts) {
          reject(new Error(`Elements not found: ${fromId}, ${toId}`));
        } else {
          attempts++;
          setTimeout(checkElements, 50);
        }
      };
      
      checkElements();
    });
  }

  public async createConnection(
    fromId: string,
    toId: string,
    options: {
      color: string;
      onClick?: () => void;
    }
  ): Promise<any> {
    try {
      const [fromPoint, toPoint] = await this.waitForElements(fromId, toId);
      
      const connectionId = `${fromId}-${toId}`;
      if (this.lines.has(connectionId)) {
        this.removeLine(connectionId);
      }

      // Ensure elements are ready
      await new Promise(resolve => setTimeout(resolve, 50));

      const line = new LeaderLine(fromPoint, toPoint, {
        color: options.color,
        size: 2,
        startSocket: 'right',
        endSocket: 'left',
        endPlug: 'arrow',
        path: 'straight',
        startSocketGravity: 50,
        endSocketGravity: 50,
        dash: false
      });

      if (options.onClick) {
        line.element.style.cursor = 'pointer';
        line.element.addEventListener('click', options.onClick);
      }

      // Add hover effect
      line.element.addEventListener('mouseenter', () => {
        line.setOptions({ size: 3, dash: { animation: true } });
      });
      
      line.element.addEventListener('mouseleave', () => {
        line.setOptions({ size: 2, dash: false });
      });

      this.lines.set(connectionId, line);
      this.initialized = true;
      return line;
    } catch (error) {
      console.error('Error creating leader line:', error);
      return null;
    }
  }

  private removeLine(connectionId: string) {
    const line = this.lines.get(connectionId);
    if (line) {
      try {
        line.remove();
        this.lines.delete(connectionId);
      } catch (error) {
        console.error('Error removing leader line:', error);
      }
    }
  }

  public clearLines() {
    Array.from(this.lines.entries()).forEach(([connectionId]) => {
      this.removeLine(connectionId);
    });
    this.lines.clear();
    this.initialized = false;
  }

  public async drawConnections(
    connections: Connection[],
    selectedId: string | null,
    onLineClick: (connection: Connection) => void
  ) {
    this.clearLines();
    await new Promise(resolve => setTimeout(resolve, 100));

    for (const conn of connections) {
      await this.createConnection(conn.from, conn.to, {
        color: selectedId === conn.id ? '#ef4444' : '#3b82f6',
        onClick: () => onLineClick(conn),
      });
    }
  }

  public repositionLines() {
    requestAnimationFrame(() => {
      this.lines.forEach(line => {
        try {
          if (line && typeof line.position === 'function') {
            line.position();
          }
        } catch (error) {
          console.error('Error repositioning line:', error);
        }
      });
    });
  }

  public destroy() {
    this.clearLines();
    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }
  }
}