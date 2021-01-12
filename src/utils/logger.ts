import { Common } from './common';

export class Logger {
  private static levels: {
    [key: string]: number;
  } = {
    trace: 0,
    info: 1,
    warn: 2,
    error: 3
  };

  public name: string;
  private level: number | boolean;

  public constructor(name: string, level: string);
  public constructor(name: string, level: boolean);
  public constructor(name: string, level: string | boolean) {
    this.name = name;
    this.level = typeof(level) === 'string' ? this.toLevel(level) : level;
  }

  public trace(message: string, ...optionalParams: any[]): void {
    this.log('trace', message, ...optionalParams);
  }

  public info(message: string, ...optionalParams: any[]): void {
    this.log('info', message, ...optionalParams);
  }

  public warn(message: string, ...optionalParams: any[]): void {
    this.log('warn', message, ...optionalParams);
  }

  public error(message: string, ...optionalParams: any[]): void {
    this.log('error', message, ...optionalParams);
  }

  private log(level: string, message: string, ...optionalParams: any[]) {
    if (this.enabled(level)) {
      console.log(`${level}: ${message}`, ...optionalParams);
    }
  }

  public enabled(level: string): boolean {
    if (this.level === false) return false;

    return this.level === true || this.level <= this.toLevel(level);
  }

  public toLevel(name: string): number {
    return Common.find(Logger.levels, (_level, key) => key === name);
  }
}
