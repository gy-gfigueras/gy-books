import {
  LogEnvironment,
  LogLevel,
  LogOrigin,
  type LogData,
  type LogEntry,
} from './log.types';

const LOGS_ENDPOINT =
  process.env.LOGS_URL || 'https://s1200613.eu-nbg-2.betterstackdata.com/';

/** Resolve the current runtime environment from `LOG_ENV`. */
function resolveEnvironment(): LogEnvironment {
  const env = process.env.LOG_ENV?.toUpperCase();
  if (env === LogEnvironment.PRO) return LogEnvironment.PRO;
  if (env === LogEnvironment.DEV) return LogEnvironment.DEV;
  return LogEnvironment.LOCAL;
}

const LOG_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '\x1b[36m', // cyan
  [LogLevel.INFO]: '\x1b[32m', // green
  [LogLevel.WARN]: '\x1b[33m', // yellow
  [LogLevel.ERROR]: '\x1b[31m', // red
};
const RESET = '\x1b[0m';
const DIM = '\x1b[2m';

/** Print a compact, coloured line to stdout — only when LOG_ENV=LOCAL. */
function logLocal(entry: LogEntry): void {
  if (process.env.LOG_ENV?.toUpperCase() !== LogEnvironment.LOCAL) return;

  const color = LOG_COLORS[entry.level];
  const prefix = `${color}[${entry.level}]${RESET}`;
  const hasExtra = Object.keys(entry.data).length > 0;
  const extra = hasExtra ? ` ${DIM}${JSON.stringify(entry.data)}${RESET}` : '';

  console.log(`${prefix} ${entry.message}${extra}`);
}

/**
 * Send a structured log entry to the external logging service.
 *
 * @param level    - Severity of the event.
 * @param message  - Human-readable description. Use `{id}` as placeholder for the entity id.
 * @param data     - Optional contextual payload (`profileId`, `additionalData`).
 * @param entityId - Optional entity id injected into `{id}` placeholders in the message.
 */
export async function sendLog(
  level: LogLevel,
  message: string,
  data: LogData = {},
  entityId?: string
): Promise<void> {
  const formattedMessage = entityId
    ? message.replace('{id}', entityId)
    : message;

  const env = resolveEnvironment();

  const entry: LogEntry = {
    env,
    level,
    message: formattedMessage,
    origin: LogOrigin.WINGWORDS,
    data,
  };

  logLocal(entry);

  try {
    const response = await fetch(LOGS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.LOGS_AUTH_TOKEN || '',
      },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      console.error(`[Logger] Failed to send log (${response.status})`);
    }
  } catch {
    // Silently swallow – logging must never break the request flow.
  }
}
