/** Supported runtime environments. */
export enum LogEnvironment {
  PRO = 'PRO',
  DEV = 'DEV',
  LOCAL = 'LOCAL',
}

/** Origin product that emitted the log entry. */
export enum LogOrigin {
  WINGWORDS = 'WINGWORDS',
}

/** Severity levels ordered by criticality. */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/** Extra context attached to every log entry. */
export interface LogData {
  profileId?: string;
  additionalData?: Record<string, unknown>;
}

/** Shape of a single log entry sent to the logging service. */
export interface LogEntry {
  env: LogEnvironment;
  level: LogLevel;
  message: string;
  origin: LogOrigin;
  data: LogData;
}
