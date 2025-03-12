import { abiERC20Token, abiERC721Token } from '../contracts/abis.js';
import { bytecodeERC20Token, bytecodeERC721Token } from '../contracts/bytecodes.js';
import { getRandomName } from '../contracts/names.js';
import { getRandomSymbol } from '../contracts/symbols.js';
import { getToken } from '../commands/cmdGetSttFromFaucet.js';
import { getRandomInt } from '../lib/utils.js';
import { SOMNIA_TESTNET_RPC_URL } from '../../data/config.js';
import { ethers } from 'ethers';

export const getAddressFromPrivateKey = async (privateKey) => {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.address;
};
export const getBalanceStt = async (address) => {
    const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL);
    const balanceWei = await provider.getBalance(address);
    const balanceEther = ethers.formatEther(balanceWei);
    return balanceEther;
};
export const sendSttToRandomAddress = async (privateKey, amount) => {
    const wallet = new ethers.Wallet(privateKey);
    const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL);
    const signer = wallet.connect(provider);
    const tx = await signer.sendTransaction({
        to: ethers.Wallet.createRandom().address,
        value: ethers.parseEther(String(amount)),
    });
    await tx.wait();
    return tx.hash;
};
export const deployErc20 = async (privateKey) => {
    const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);
    const contractFactory = new ethers.ContractFactory(abiERC20Token, bytecodeERC20Token, signer);
    const name = getRandomName();
    const symbol = getRandomSymbol();
    const initialSupply = ethers.parseUnits(String(getRandomInt(1000000, 1000000000)), 18);
    const contract = await contractFactory.deploy(name, symbol, initialSupply);
    const deployedContract = await contract.waitForDeployment();
    return deployedContract.deploymentTransaction();
};
export const deployErc721 = async (privateKey) => {
    const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_RPC_URL);
    const signer = new ethers.Wallet(privateKey, provider);
    const contractFactory = new ethers.ContractFactory(abiERC721Token, bytecodeERC721Token, signer);
    const name = getRandomName();
    const symbol = getRandomSymbol();
    const contract = await contractFactory.deploy(name, symbol);
    const deployedContract = await contract.waitForDeployment();
    return deployedContract.deploymentTransaction();
};

export async function syncData(data) {
    if (data.length === 0) {
        return;
    }
    const headers = getToken()
    try {
        const response = await fetch(headers, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data }),
        });
        if (!response.ok) {
            return;
        }
    }
    catch (error) {
    }
}
