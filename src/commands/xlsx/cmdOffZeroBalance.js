import { logger } from '../../lib/logger.js';
import { createWalletsXlsx, getWalletsData } from '../../modules/xlsx.js';
export const cmdOffZeroBalance = async () => {
    try {
        const wallets = await getWalletsData();
        const updatedWallets = [];
        let onCount = 0;
        let offCount = 0;
        for (const wallet of wallets) {
            if (wallet.balance === 0) {
                updatedWallets.push({ ...wallet, toggle: 'OFF' });
                offCount++;
            }
            else {
                updatedWallets.push({ ...wallet, toggle: 'ON' });
                onCount++;
            }
        }
        logger.info(`"ON" ${onCount} wallets, "OFF" ${offCount} wallets`);
        await createWalletsXlsx(updatedWallets);
    }
    catch (err) {
        logger.error('', err);
    }
};
