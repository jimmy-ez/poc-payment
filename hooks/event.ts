import { _abi } from "../typechain/abi/ERC20";
import { ethers, ContractEventPayload, EventLog } from "ethers"

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
            console.log(`from: ${from}, to: ${to}, amount: ${am}`);
            console.log(`recieveAmount: ${recieveAmount}`);
            if (to == merchantAddress && amount == recieveAmount) {
                resolve(txEvent.log);
            }
        });
    });
}

export async function getEventsOff() {
    token.removeAllListeners("Transfer")
}

// re-connect