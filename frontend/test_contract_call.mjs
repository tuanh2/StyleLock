import { createClient, createAccount } from 'genlayer-js';
import { studionet } from 'genlayer-js/chains';

const pk = '0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f';
const CONTRACT = '0xD7a4a17dc21236D5Bd112BaDc57C90249b365C35';
const acc = createAccount(pk);
const c = createClient({
  chain: studionet,
  endpoint: 'https://studio.genlayer.com/api',
  account: acc
});

console.log('Testing stats...');
const stats = await c.readContract({
  address: CONTRACT,
  functionName: 'get_stats',
  args: []
});
console.log('Stats:', stats);

const total = JSON.parse(stats).total_reports;
console.log('Total reports:', total);
if (parseInt(total) > 0) {
  const rep = await c.readContract({
    address: CONTRACT,
    functionName: 'get_report',
    args: [total]
  });
  console.log('Latest report:', rep);
}
