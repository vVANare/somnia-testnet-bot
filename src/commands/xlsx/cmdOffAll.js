import { logger } from '../../lib/logger.js';
import { createWalletsXlsx, getWalletsData } from '../../modules/xlsx.js';
export const cmdOffAll = async () => {
    try {
        const wallets = await getWalletsData();
        const updatedWallets = [];
        for (const wallet of wallets) {
            updatedWallets.push({ ...wallet, toggle: 'OFF' });
        }
        logger.info(`"ON" 0 wallets, "OFF" ${updatedWallets.length} wallets`);
        await createWalletsXlsx(updatedWallets);
    }
    catch (err) {
        logger.error('', err);
    }
};
