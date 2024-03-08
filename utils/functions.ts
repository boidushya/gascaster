import { formatGwei } from "viem";
import client from "./client";
import { normalize } from "viem/ens";

async function getTransactions(address: TAddress) {
  const endpoint = `https://api.etherscan.io/api
	?module=account
	&action=txlist
	&address=${address}
	&startblock=0
	&endblock=99999999
	&sort=asc
	&apikey=${process.env.ETHERSCAN_API_KEY}`;

  const response = await fetch(endpoint);
  const data = await response.json();
  return data.result;
}

async function getEthPrice() {
  const endpoint = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.ETHERSCAN_API_KEY}`;
  const response = await fetch(endpoint);
  const data = await response.json();
  return data.result.ethusd;
}

export async function getAddressFromEns(ens: string) {
  const ensAddress = await client.getEnsAddress({
    name: normalize(ens),
  });
  if (ensAddress === null) {
    throw new Error("No address found for ENS name");
  }

  return ensAddress;
}

export async function getGasTextContent(address: TAddress, isOwner: boolean) {
  const term = isOwner ? "You" : "They";
  const totalGas = await getTotalGasSpent(address);
  const ethPrice = await getEthPrice();

  return {
    term,
    totalGas,
    price: (ethPrice * totalGas).toFixed(2),
  };
}

export async function getTotalGasSpent(user: TAddress) {
  const txs = await getTransactions(user);

  // biome-ignore lint/suspicious/noExplicitAny: cba
  const amount = txs?.reduce((acc: any, tx: any) => {
    const gasUsed = parseInt(tx.gasUsed);
    const gasPrice = parseFloat(formatGwei(tx.gasPrice));

    return acc + (gasUsed * gasPrice) / 1e9;
  }, 0);

  return amount.toFixed(5);
}

export function getAddressFromUser(user: IInteractor | undefined) {
  if (user) {
    if (user.verifiedAddresses.ethAddresses.length > 0) {
      return user.verifiedAddresses.ethAddresses[0] as TAddress;
    }
    return user.custodyAddress as TAddress;
  }
  return null;
}

export function getBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return process.env.VERCEL_PROD_URL;
}

type TAddress = `0x${string}`;
type IInteractor = {
  activeStatus: "active" | "inactive";
  custodyAddress: string;
  displayName: string;
  fid: number;
  followerCount: number;
  followingCount: number;
  object: "user";
  pfpUrl: string;
  profile: {
    bio: {
      text: string;
      mentionedProfiles: string[];
    };
  };
  username: string;
  verifications: string[];
  verifiedAddresses: {
    ethAddresses: string[];
    solAddresses: string[];
  };
  viewerContext?: {
    following: boolean;
    followedBy: boolean;
  };
};
