import { logger } from '../lib/logger.js';
import { getRandomInt, shuffleArray } from '../lib/utils.js';
import { sendSttToRandomAddress } from '../modules/blockchain.js';
import { getWalletsData } from '../modules/xlsx.js';
import { RANDOM_SEND_AMOUNT, RANDOM_SEND_SLEEP_RANGE, SHUFFLE_WALLETS, SOMNIA_TESTNET_EXPLORER_URL } from '../../data/config.js';
export const cmdSendSttToRandomAddress = async () => {
    try {
        let wallets = await getWalletsData();
        wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON');
        if (SHUFFLE_WALLETS)
            wallets = shuffleArray(wallets);
        logger.info(`[GOT ${wallets.length} WALLETS]`);
        for (const wallet of wallets) {
            try {
                const amount = RANDOM_SEND_AMOUNT[getRandomInt(0, RANDOM_SEND_AMOUNT.length - 1)];
                const hash = await sendSttToRandomAddress(wallet.privateKey, amount);
                logger.success(`(${wallet.id}) Sent ${amount} $STT ${SOMNIA_TESTNET_EXPLORER_URL}/tx/${hash}`);
                if (wallet == wallets[wallets.length - 1])
                    break;
                const delay = getRandomInt(RANDOM_SEND_SLEEP_RANGE[0], RANDOM_SEND_SLEEP_RANGE[1]);
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
