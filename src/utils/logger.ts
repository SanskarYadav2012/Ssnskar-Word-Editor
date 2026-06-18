import type { LogEntry } from '@/types';

type Listener = (entries: LogEntry[]) => void;

const MAX_ENTRIES = 500;

class Logger {
  private entries: LogEntry[] = [];
  private listeners = new Set<Listener>();
  private counter = 0;

  log(level: LogEntry['level'], message: string): void {
    const entry: LogEntry = {
      id: ++this.counter,
      level,
      message,
      timestamp: Date.now(),
    };
    this.entries = [...this.entries.slice(-(MAX_ENTRIES - 1)), entry];
    this.emit();
    const consoleFn =
      level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    consoleFn(`[Sanskar] ${message}`);
  }

  info(message: string): void {
    this.log('info', message);
  }
  warn(message: string): void {
    this.log('warn', message);
  }
  error(message: string): void {
    this.log('error', message);
  }
  debug(message: string): void {
    this.log('debug', message);
  }

  clear(): void {
    this.entries = [];
    this.emit();
  }

  getEntries(): LogEntry[] {
    return this.entries;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.entries);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) listener(this.entries);
  }
}

export const logger = new Logger();
