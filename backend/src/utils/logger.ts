import winston from 'winston';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level}: ${message}${metaString}`;
});

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    process.env.NODE_ENV === 'production' ? json() : logFormat
  ),
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? json()
          : combine(colorize(), logFormat)
    })
  ]
});
