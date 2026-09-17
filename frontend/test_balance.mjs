import { createClient, createAccount } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

const pk = '0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f';
const acc = createAccount(pk);
const c = createClient({
  chain: studionet,
  endpoint: 'https://studio.genlayer.com/api',
  account: acc
});

console.log('Address:', acc.address);
try {
  const bal = await c.getBalance({ address: acc.address });
  console.log('Balance:', bal.toString());
} catch (e) {
  console.log('Balance check failed:', e.message);
}
