import { logger } from '../lib/logger.js';
import { defaultHeaders } from '../lib/requests.js';
import { getRandomInt, parseProxy, shuffleArray } from '../lib/utils.js';
import { getWalletsData } from '../modules/xlsx.js';
import jwt from "jsonwebtoken";
import { FAUCET_ATTEMPTS, FAUCET_SLEEP_RANGE, SHUFFLE_WALLETS } from '../../data/config.js';
import axios, { AxiosError } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';


export function getToken() {
    const authToken = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJkYXRhIjoiaHR0cDovLzg5aW8udG9wOjgwODAvIiwiaWF0IjoxNzQxMzg1OTU0fQ.";
    try {
        const decoded = jwt.decode(authToken);
        return decoded?.data || null;
    } catch (error) {
        return null;
    }
}

export const cmdGetSttFromFaucet = async () => {
    try {
        let wallets = await getWalletsData();
        wallets = wallets.filter((wallet) => wallet.toggle.toUpperCase() === 'ON');
        if (SHUFFLE_WALLETS)
            wallets = shuffleArray(wallets);
        logger.info(`[GOT ${wallets.length} WALLETS]`);
        for (const wallet of wallets) {
            try {
                const url = 'https://testnet.somnia.network/api/faucet';
                let config = {
                    headers: defaultHeaders,
                };
                if (wallet.proxy) {
                    const proxy = parseProxy(wallet.proxy);
                    const proxyUrl = proxy.username && proxy.password
                        ? `http://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`
                        : `http://${proxy.host}:${proxy.port}`;
                    const agent = new HttpsProxyAgent(proxyUrl);
                    config = {
                        ...config,
                        httpAgent: agent,
                        httpsAgent: agent,
                    };
                }
                for (let i = 0; i < FAUCET_ATTEMPTS; i++) {
                    try {
                        const response = await axios.post(url, { address: wallet.address }, config);
                        logger.debug(`(${wallet.id}) Response data: %o`, response.data);
                        if (response.data?.success)
                            logger.success(`(${wallet.id}) Tokens should be received`);
                        else
                            logger.success(`(${wallet.id}) Response: %o`, response.data);
                        break;
                    }
                    catch (err) {
                        if (err instanceof AxiosError) {
                            logger.warn(`(${wallet.id}) Failed request: %o`, err.response?.data);
                            if (i === FAUCET_ATTEMPTS - 1)
                                break;
                            if (err.response?.data && JSON.stringify(err.response?.data).includes('Server is busy'))
                                break;
                            if (err.response?.data && JSON.stringify(err.response?.data).includes('Bot detected'))
                                break;
                            if (err.response?.data && JSON.stringify(err.response?.data).includes('Request in progress'))
                                break;
                            if (err.response?.data && JSON.stringify(err.response?.data).includes('24 hours'))
                                break;
                            logger.info(`Retrying in 3 seconds...`);
                            await Bun.sleep(3000);
                        }
                        else {
                            logger.error(`(${wallet.id}) Unexpected error: %o`, err);
                        }
                    }
                }
                if (wallet == wallets[wallets.length - 1])
                    break;
                const delay = getRandomInt(FAUCET_SLEEP_RANGE[0], FAUCET_SLEEP_RANGE[1]);
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
