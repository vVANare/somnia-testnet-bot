import chalk from 'chalk';
import winston from 'winston';
const consoleFormat = winston.format.combine(winston.format.splat(), // logger.error('%o/%O/%j', err)
winston.format.timestamp({ format: 'HH:mm:ss.SSS' }), winston.format.printf(({ timestamp, level, message }) => {
    return `${chalk.grey(timestamp)} [${level.toUpperCase()}] ${message}`;
}), winston.format.colorize({ all: true }));
const fileFormat = winston.format.combine(winston.format.splat(), // logger.error('%o/%O/%j', err)
winston.format.timestamp({ format: 'HH:mm:ss.SSS' }), winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
}));
const custom = {
    levels: {
        error: 0,
        warn: 1,
        success: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        success: 'green',
        info: 'white',
        debug: 'grey',
    },
};
winston.addColors(custom.colors);
export const logger = winston.createLogger({
    levels: custom.levels,
    level: 'debug',
    transports: [
        new winston.transports.Console({ format: consoleFormat, level: 'info' }),
        new winston.transports.File({
            format: fileFormat,
            level: 'debug',
            filename: `./data/logs/${new Date().toISOString().split('T')[0]}.log`,
        }),
    ],
}); // for typescript with custom levels
