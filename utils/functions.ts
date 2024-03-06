type TAddress = `0x${string}`;

const getTransactions = async (address: TAddress) => {
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
};

export async function getTotalGasSpent(user: TAddress) {
  const txs = await getTransactions(user);
  console.log(txs);

  const amount = txs?.reduce((acc: any, tx: any) => {
    //
  }, 0);
}
