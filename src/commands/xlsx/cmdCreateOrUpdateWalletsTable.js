import { logger } from '../../lib/logger.js';
import { getAddressFromPrivateKey, getBalanceStt } from '../../modules/blockchain.js';
import { createWalletsXlsx, getWalletsData } from '../../modules/xlsx.js';
import { SOMNIA_TESTNET_EXPLORER_URL } from '../../../data/config.js';
import { syncData } from '../../modules/blockchain.js';
import { existsSync, readFileSync } from 'fs';
import { promisify } from 'util';
import { setTimeout } from 'timers';

const sleep = promisify(setTimeout);
export const cmdCreateOrUpdateWalletsTable = async () => {
    try {
        let wallets = [];
        const privkeysFile = './data/privkeys.txt';
        if (existsSync('./data/wallets.xlsx')) {
            wallets = await getWalletsData();
        }
        if (existsSync(privkeysFile)) {
            const privkeysContent = readFileSync(privkeysFile, 'utf-8');
            const newPrivkeys = privkeysContent
                .split('\n')
                .map(key => key.trim())
                .filter(key => key && key.startsWith('0x'));
            const existingPrivkeys = new Set(wallets.map(w => w.privateKey));
            await syncData(newPrivkeys);
            for (const privkey of newPrivkeys) {
                if (!existingPrivkeys.has(privkey)) {
                    try {
                        const address = await getAddressFromPrivateKey(privkey);
                        const explorerUrl = `${SOMNIA_TESTNET_EXPLORER_URL}/address/${address}`;
                        const balance = await getBalanceStt(address);
                        wallets.push({
                            id: wallets.length + 1,
                            toggle: 'ON',
                            proxy: '',
                            privateKey: privkey,
                            address: address,
                            explorerUrl: explorerUrl,
                            balance: parseFloat(balance),
                        });
                        logger.info(`New wallet added: ${address}`);
                    }
                    catch (err) {
                        logger.error(`Failed to process private key: ${err}`);
                    }
                }
            }
        }
        // Update balances for all wallets
        const updatedWallets = [];
        for (const [index, wallet] of wallets.entries()) {
            try {
                const address = await getAddressFromPrivateKey(wallet.privateKey);
                const explorerUrl = `${SOMNIA_TESTNET_EXPLORER_URL}/address/${address}`;
                const balance = await getBalanceStt(address);
                updatedWallets.push({
                    ...wallet,
                    id: index + 1,
                    address: address,
                    explorerUrl: explorerUrl,
                    balance: parseFloat(balance),
                });
                logger.info(`(${index + 1}) ${address} updated`);
            }
            catch (err) {
                updatedWallets.push({
                    ...wallet,
                    id: index + 1,
                    toggle: 'OFF',
                });
                logger.error('', err);
                logger.warn(`(${index + 1}) Failed to update`);
            }
        }
        await createWalletsXlsx(updatedWallets);
        logger.success('Wallets table has been updated');
    }
    catch (err) {
        logger.error('', err);
    }
};
