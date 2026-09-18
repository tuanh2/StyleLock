import { createClient } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';

export const CONTRACT_ADDRESS =
  (import.meta).env?.VITE_CONTRACT_ADDRESS || '0xbbbDa0a730e27C55Fd8F3CBC6862882d4f670ffc';

export const STUDIONET_CHAIN = studioDevnet;
export const RPC_ENDPOINT = (import.meta).env?.VITE_GENLAYER_RPC || 'https://studio-next.genlayer.com/api';
export const EXPLORER_URL = 'https://explorer-studio-dev.genlayer.com';

const CHAIN_ID_HEX = '0x' + STUDIONET_CHAIN.id.toString(16); // 0xF22D (61997)

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask not found. Please install MetaMask extension.');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: CHAIN_ID_HEX }],
    });
  } catch (err) {
    if (err.code === 4902 || err.code === -32603) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CHAIN_ID_HEX,
          chainName: 'GenLayer Studio Next',
          nativeCurrency: { name: 'GEN Token', symbol: 'GEN', decimals: 18 },
          rpcUrls: [RPC_ENDPOINT],
          blockExplorerUrls: [EXPLORER_URL],
        }],
      });
    } else {
      throw err;
    }
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  return accounts[0];
}

export function getWriteClient(account) {
  if (!window.ethereum) {
    throw new Error('MetaMask not found.');
  }
  const client = createClient({
    chain: STUDIONET_CHAIN,
    endpoint: RPC_ENDPOINT,
    account,
    provider: window.ethereum,
  });

  const origWriteContract = client.writeContract.bind(client);
  client.writeContract = async (args) => {
    if (!args.fees) {
      try {
        args.fees = await client.estimateTransactionFees({});
      } catch (err) {
        console.warn('Auto fee estimation error:', err);
      }
    }
    return origWriteContract(args);
  };

  return client;
}

export function getReadClient() {
  return createClient({
    chain: STUDIONET_CHAIN,
    endpoint: RPC_ENDPOINT,
  });
}

export function extractExecution(receipt) {
  const cd = receipt?.consensus_data || {};
  let lr = cd.leader_receipt;
  if (Array.isArray(lr)) lr = lr[0];
  const res = lr?.result || {};
  return {
    consensus: receipt?.result_name,
    execution_result: lr?.execution_result,
    status: res?.status,
    payload: typeof res?.payload === 'string' ? res.payload : undefined,
  };
}

export function txExplorerUrl(hash) {
  return `${EXPLORER_URL.replace(/\/$/, '')}/tx/${hash}`;
}

export function addressExplorerUrl(addr) {
  return `${EXPLORER_URL.replace(/\/$/, '')}/address/${addr}`;
}

const WEI_PER_GEN = 1_000_000_000_000_000_000n;

export function genToWei(gen) {
  const s = String(gen).trim();
  if (!s || isNaN(Number(s))) return '0';
  const [whole, frac = ''] = s.split('.');
  const fracPadded = (frac + '000000000000000000').slice(0, 18);
  return (BigInt(whole || '0') * WEI_PER_GEN + BigInt(fracPadded || '0')).toString();
}

export function weiToGen(wei) {
  try {
    const w = typeof wei === 'bigint' ? wei : BigInt(String(wei || '0'));
    if (w === 0n) return '0';
    const whole = w / WEI_PER_GEN;
    const frac = w % WEI_PER_GEN;
    if (frac === 0n) return whole.toLocaleString('en-US');
    const fracStr = frac.toString().padStart(18, '0').replace(/0+$/, '').slice(0, 4);
    return whole.toLocaleString('en-US') + (fracStr ? '.' + fracStr : '');
  } catch {
    return '0';
  }
}
