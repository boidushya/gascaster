async function getTransactions(address: TAddress) {
  const endpoint = `https://api.etherscan.io/api
	?module=account
	&action=txlist
	&address=${address}
	&startblock=0
	&endblock=99999999
	&apikey=${process.env["ETHERSCAN_API_KEY"]}`;

  const response = await fetch(endpoint);
  const data = await response.json();
  return data.result;
}

export async function getTotalGasSpent(user: TAddress) {
  const txs = await getTransactions(user);
  console.log(txs);

  const amount = txs?.reduce((acc: any, tx: any) => {
    //
  }, 0);
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
