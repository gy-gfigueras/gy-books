import {
  LogEnvironment,
  LogLevel,
  LogOrigin,
  type LogData,
  type LogEntry,
} from './log.types';

const LOGS_ENDPOINT =
  process.env.LOGS_URL || 'https://s1200613.eu-nbg-2.betterstackdata.com/';

/** Resolve the current runtime environment from `NODE_ENV`. */
function resolveEnvironment(): LogEnvironment {
  switch (process.env.NODE_ENV) {
    case 'production':
      return LogEnvironment.PRO;
    case 'development':
      return LogEnvironment.DEV;
    default:
      return LogEnvironment.LOCAL;
  }
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

  const entry: LogEntry = {
    env: resolveEnvironment(),
    level,
    message: formattedMessage,
    origin: LogOrigin.WINGWORDS,
    data,
  };

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
