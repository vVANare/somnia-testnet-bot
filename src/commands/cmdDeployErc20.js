import { logger } from '../lib/logger.js';
import { getRandomInt, shuffleArray } from '../lib/utils.js';
import { deployErc20 } from '../modules/blockchain.js';
import { getWalletsData } from '../modules/xlsx.js';
import { DEPLOY_SLEEP_RANGE, SHUFFLE_WALLETS, SOMNIA_TESTNET_EXPLORER_URL } from '../../data/config.js';
export const cmdDeployErc20 = async () => {
    try {
        let wallets = await getWalletsData();
        wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON');
        if (SHUFFLE_WALLETS)
            wallets = shuffleArray(wallets);
        logger.info(`[GOT ${wallets.length} WALLETS]`);
        for (const wallet of wallets) {
            try {
                const tx = await deployErc20(wallet.privateKey);
                logger.success(`(${wallet.id}) Deployed ERC-20 smart-contract ${SOMNIA_TESTNET_EXPLORER_URL}/tx/${tx?.hash}`);
                if (wallet == wallets[wallets.length - 1])
                    break;
                const delay = getRandomInt(DEPLOY_SLEEP_RANGE[0], DEPLOY_SLEEP_RANGE[1]);
                logger.info(`Sleeping for ${delay} seconds`);
                await Bun.sleep(delay * 1000);
            }
            catch (err) {
                logger.error('', err);
            }
        }
    }
    catch (err) {
        logger.error('', err);
    }
};
