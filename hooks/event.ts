import { _abi } from "../typechain/abi/ERC20";
import { ethers, ContractEventPayload, EventLog, EventFilter } from "ethers"
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { useState } from "react";

const provider = new ethers.JsonRpcProvider(
    "https://eth-goerli.g.alchemy.com/v2/0VW8Cn6CPGpo5RIWLwyiDIA344e2ulkk",
    // "https://eth-mainnet.g.alchemy.com/v2/Qke5JUU4VQOxfwyao5dl49AmdVLhFoOU"
)

const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY ? process.env.NEXT_PUBLIC_PRIVATE_KEY : "")
const signer = wallet.connect(provider);
const token = new ethers.Contract(process.env.NEXT_PUBLIC_USDT_FAKE ? process.env.NEXT_PUBLIC_USDT_FAKE : "", _abi, signer)

export async function getEventsOn(merchantAddress: string, amount: Number): Promise<any> {
    return new Promise((resolve, reject) => {
        const filter = token.filters.Transfer(null, merchantAddress);
        token.on(filter, (txEvent: ContractEventPayload) => {
            const log: EventLog = txEvent.log;
            const [from, to, am] = log.args;
            const recieveAmount = Number(am / BigInt(10 ** 18))
            // console.log(`from: ${from}, to: ${to}, amount: ${am}`);
            // console.log(`recieveAmount: ${recieveAmount}`);
            if (to == merchantAddress && amount == recieveAmount) {
                resolve(txEvent.log);
            }
        });
    });
}

export async function getEventsOff() {
    token.removeAllListeners("Transfer")
}


export async function getHistoryEvent(merchantAddress: string, fromBlock: number, toBlock: number) {
    const filter = token.filters.Transfer(null, merchantAddress);
    // await token.queryFilter(filter, -10) // from last 10 block
    await token.queryFilter(filter, fromBlock, toBlock).then((res) => {
        console.log("res ::: ", res);
    })
}
export async function startMoralis() {
    await Moralis.start({
        apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    });
}

export async function getNativeTransaction(fromBlock: number, toBlock: number) {
    const address = signer.address;
    const chain = EvmChain.GOERLI;
    const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        address,
        chain,
        fromBlock,
        toBlock
    });
    console.log(response.toJSON());
}


// QR code from backend
// Tricker transaction status
// fetch previod event from blockNumber
// re-connect