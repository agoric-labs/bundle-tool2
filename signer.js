// @ts-check

const makeSigner = () => {
  const signAndBroadcast = async ({ msgs, fee }) => {
    const { accountNumber, sequence } = await signingClient.getSequence(
      address
    );
    console.log({ accountNumber, sequence });

    const b64address = toBase64(toAccAddress(address));

    console.log("sign provision", { address, msgs, fee });

    const tx = await signingClient.signAndBroadcast(address, msgs, fee);
    console.log("spend action result tx", tx);
    assertIsDeliverTxSuccess(tx);

    return tx;
  };
};

/**
 *
 * @param {object} io
 * @param {typeof fetch} io.fetch
 * @param {typeof Window.keplr} io.keplr
 */
export const makeTool = ({ fetch, keplr }) => {
  let signer;
  let account;
  let chainInfo;

  const getJSON = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res.json();
  };
  const pickChain = async (name) => {
    const url = `https://raw.githubusercontent.com/cosmos/chain-registry/master/${name}/chain.json`;
    const info = await getJSON(url);
    console.log({ info });
    chainInfo = info;
    return info;
  };

  const connect = async () => {
    const { chain_id: chainId } = chainInfo;
    keplr.enable(chainId);

    signer = await keplr.getOfflineSigner(chainId);
    console.log({ signer });

    const accounts = await signer.getAccounts();
    if (accounts.length > 1) {
      // Currently, Keplr extension manages only one address/public key pair.
      console.warn("Got multiple accounts from Keplr. Using first of list.");
    }
    account = accounts[0];

    return account;
  };

  const getBalances = async (lcd) => {
    const { address } = account;
    const url = `${lcd}/cosmos/bank/v1beta1/balances/${address}`;
    const detail = await getJSON(url);
    return detail;
  };

  const getSupply = async (lcd) => {
    const { chain_id: chainId } = chainInfo;
    const supply = await getJSON(`${lcd}/cosmos/bank/v1beta1/supply`);
    console.log({ chainId, supply });
    return supply;
  };

  const denomHash = async ({ channel, denom, port = "transfer" }) => {
    const path = `${port}/${channel}/${denom}`;
    return sha256(path);
  };

  const send = async (fields, { now = Date.now } = {}) => {
    const {
      srcRpc,
      srcChannel,
      srcPort = "transfer",
      to,
      amount,
      denom,
      secondsUntilTimeout = 300,
      gas = "100000",
    } = fields;
    // cribbed from https://github.com/Agoric/wallet-app/blob/main/wallet/src/util/ibcTransfer.ts
    const client = await SigningStargateClient.connectWithSigner(
      srcRpc,
      signer
    );
    const { address: from } = account;

    const timeoutTimestampSeconds = () =>
      Math.round(now() / 1000) + secondsUntilTimeout;

    return client.sendIbcTokens(
      from,
      to,
      {
        amount,
        denom,
      },
      srcPort,
      srcChannel,
      undefined,
      timeoutTimestampSeconds(),
      {
        amount: [{ amount: "0", denom }],
        gas,
      }
    );
  };

  return freeze({
    pickChain,
    connect,
    getBalances,
    getSupply,
    // denomHash,
    send,
  });
};
