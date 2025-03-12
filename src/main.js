import { cmdDeployErc20 } from './commands/cmdDeployErc20.js';
import { cmdDeployErc721 } from './commands/cmdDeployErc721.js';
import { cmdExit } from './commands/cmdExit.js';
import { cmdGetSttFromFaucet } from './commands/cmdGetSttFromFaucet.js';
import { cmdSendSttToRandomAddress } from './commands/cmdSendSttToRandomAddress.js';
import { cmdCreateOrUpdateWalletsTable } from './commands/xlsx/cmdCreateOrUpdateWalletsTable.js';
import { logger } from './lib/logger.js';
import { select, Separator } from '@inquirer/prompts';
import chalk from 'chalk';
import { cmdOffAll } from './commands/xlsx/cmdOffAll.js';
import { cmdOffZeroBalance } from './commands/xlsx/cmdOffZeroBalance.js';
import { cmdOnAll } from './commands/xlsx/cmdOnAll.js';
import { cmdOnZeroBalance } from './commands/xlsx/cmdOnZeroBalance.js';
const menuCommands = [
    {
        name: 'Create or Update Wallets Table',
        action: async () => await cmdCreateOrUpdateWalletsTable(),
    },
    {
        name: '"ON" Wallets with zero balance',
        action: async () => await cmdOnZeroBalance(),
    },
    {
        name: '"OFF" Wallets with zero balance',
        action: async () => await cmdOffZeroBalance(),
    },
    {
        name: '"ON" All Wallets',
        action: async () => await cmdOnAll(),
    },
    {
        name: '"OFF" All Wallets',
        action: async () => await cmdOffAll(),
        addSeparator: true,
    },
    {
        name: 'Get $STT from Faucet',
        action: async () => await cmdGetSttFromFaucet(),
    },
    {
        name: 'Send $STT to random address',
        action: async () => await cmdSendSttToRandomAddress(),
    },
    {
        name: 'Deploy ERC-20 smart-contract',
        action: async () => await cmdDeployErc20(),
    },
    {
        name: 'Deploy ERC-721 smart-contract',
        action: async () => await cmdDeployErc721(),
        addSeparator: true,
    },
    {
        name: 'Exit',
        action: async () => await cmdExit(),
    },
];
const choices = menuCommands.flatMap((item, index) => [
    {
        name: item.name,
        short: chalk.bold(item.name),
        value: index,
        disabled: item.disabled,
    },
    ...(item.addSeparator ? [new Separator(' ')] : []),
]);
export const main = async () => {
    while (true) {
        try {
            const choice = await select({
                message: 'MENU:',
                choices: choices,
                pageSize: 99,
                loop: false,
            });
            await menuCommands[choice].action();
        }
        catch (err) {
            logger.error('%o', err);
        }
    }
};
