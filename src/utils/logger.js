const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// Formato personalizado para os logs
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

// Logger de Desenvolvimento
const devLogger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [new transports.Console()],
});

// Logger de Produção
const prodLogger = createLogger({
  level: 'info',
  format: combine(timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'errors.log', level: 'error' }),
  ],
});

// Escolhe o logger com base no ambiente
const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

module.exports = logger;