import { logger } from '../../lib/logger.js';
import { createWalletsXlsx, getWalletsData } from '../../modules/xlsx.js';
export const cmdOnAll = async () => {
    try {
        const wallets = await getWalletsData();
        const updatedWallets = [];
        for (const wallet of wallets) {
            updatedWallets.push({ ...wallet, toggle: 'ON' });
        }
        logger.info(`"ON" ${updatedWallets.length} wallets, "OFF" 0 wallets`);
        await createWalletsXlsx(updatedWallets);
    }
    catch (err) {
        logger.error('', err);
    }
};
