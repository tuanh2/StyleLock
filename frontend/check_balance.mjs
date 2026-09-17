import { createClient, createAccount } from 'genlayer-js';

const privateKey = '0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f';
const account = createAccount(privateKey);
console.log('User Account Address:', account.address);

const studioNextChain = {
  id: 61997,
  name: 'GenLayer Studio Next',
  rpcUrls: {
    default: {
      http: ['https://studio-next.genlayer.com/api']
    }
  }
};

const client = createClient({
  chain: studioNextChain
});

async function check() {
  try {
    const bal = await client.getBalance({ address: account.address });
    console.log('Balance on Studio Next (61997):', bal.toString(), 'wei', (Number(bal) / 1e18), 'GEN');
  } catch (e) {
    console.error('Error checking balance on Studio Next:', e.message);
  }

  // Also check on studionet
  try {
    const studionetChain = {
      id: 61999,
      name: 'GenLayer Studionet',
      rpcUrls: { default: { http: ['https://studio.genlayer.com/api'] } }
    };
    const client2 = createClient({ chain: studionetChain });
    const bal2 = await client2.getBalance({ address: account.address });
    console.log('Balance on Studionet (61999):', bal2.toString(), 'wei', (Number(bal2) / 1e18), 'GEN');
  } catch (e) {
    console.error('Error checking balance on Studionet:', e.message);
  }
}

check();
