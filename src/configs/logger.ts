import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { env } from "@/configs/index.js";

const { colorize, combine, errors, json, printf, timestamp } = winston.format;

const consoleFormat = printf(({ level, message, stack, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;

  if (stack) {
    msg += `\n${stack}`;
  }

  if (Object.keys(metadata).length > 0) {
    msg += `\n${JSON.stringify(metadata, null, 2)}`;
  }

  return msg;
});

// Create logger instance
export const logger = winston.createLogger({
  exceptionHandlers: [
    new DailyRotateFile({
      datePattern: "YYYY-MM-DD",
      filename: "logs/exceptions-%DATE%.log",
      maxFiles: "14d",
      maxSize: "20m",
    }),
  ],
  format: combine(errors({ stack: true }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  level: env.logLevel,
  rejectionHandlers: [
    new DailyRotateFile({
      datePattern: "YYYY-MM-DD",
      filename: "logs/rejections-%DATE%.log",
      maxFiles: "14d",
      maxSize: "20m",
    }),
  ],
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        colorize({ colors: { fatal: "red" } }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        consoleFormat,
      ),
    }),

    // Error log file (rotate daily)
    new DailyRotateFile({
      datePattern: "YYYY-MM-DD",
      filename: "logs/error-%DATE%.log",
      format: combine(timestamp(), json()),
      level: "error",
      maxFiles: "14d",
      maxSize: "20m",
    }),

    // Combined log file (rotate daily)
    new DailyRotateFile({
      datePattern: "YYYY-MM-DD",
      filename: "logs/combined-%DATE%.log",
      format: combine(timestamp(), json()),
      maxFiles: "30d",
      maxSize: "20m",
    }),
  ],
});

// Don't log to files in test environment
if (env.nodeEnv === "test") {
  logger.clear();
  logger.add(
    new winston.transports.Console({
      level: "error",
      silent: true,
    }),
  );
}
