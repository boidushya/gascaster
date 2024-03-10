import { formatGwei } from "viem";
import client from "./client";
import { normalize } from "viem/ens";

const CHAINS_LIST = [
  {
    name: "Avalanche",
    id: 43114,
  },
  {
    name: "Base",
    id: 8453,
  },
  {
    name: "Linea",
    id: 59144,
  },
  {
    name: "ZKSync Era",
    id: 324,
  },
  {
    name: "Polygon",
    id: 137,
  },
  {
    name: "Optimism",
    id: 10,
  },
];

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

async function getGasForChain(chainId: number | string) {
  const Auth = Buffer.from(
    `${process.env.INFURA_KEY}:${process.env.INFURA_SECRET}`
  ).toString("base64");
  const response = await fetch(
    `https://gas.api.infura.io/networks/${chainId}/suggestedGasFees`,
    {
      headers: {
        Authorization: `Basic ${Auth}`,
      },
    }
  );

  const data = await response.json();

  return data.estimatedBaseFee;
}

export async function getL2GasData(): Promise<{ fee: number; name: string }[]> {
  const result = [];
  for (const chain of CHAINS_LIST) {
    try {
      const gas = await getGasForChain(chain.id);
      result.push({
        fee: gas,
        name: chain.name,
      });
    } catch (e) {
      console.error(e);
    }
  }
  return result;
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
