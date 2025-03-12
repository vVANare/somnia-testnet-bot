import { logger } from '../lib/logger.js';
export const cmdExit = async () => {
    logger.success('Exiting...');
    process.exit(0);
};
