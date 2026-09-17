import { createClient, createAccount } from 'genlayer-js';
import { studioDevnet } from 'genlayer-js/chains';
import fs from 'fs';
import path from 'path';

const pk = process.env.GENLAYER_PRIVATE_KEY || '0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f';
const account = createAccount(pk);
const client = createClient({
  chain: studioDevnet,
  endpoint: 'https://studio-next.genlayer.com/api',
  account
});

async function deploy() {
  console.log('=== Deploying StyleLock on Studio Next (Chain ID 61997) ===');
  console.log('Deployer Address:', account.address);
  
  const balance = await client.getBalance({ address: account.address });
  console.log('Balance:', balance.toString(), 'wei');

  const contractPath = path.resolve('..', 'contracts', 'StyleLock.py');
  const code = fs.readFileSync(contractPath, 'utf8');
  console.log('Contract size:', code.length, 'bytes');

  console.log('Estimating transaction fees...');
  const fees = await client.estimateTransactionFees({});
  console.log('Estimated fee value:', fees.feeValue.toString());

  console.log('Deploying contract...');
  const txHash = await client.deployContract({ code, args: [], fees });
  console.log('DEPLOY_TX_HASH:', txHash);

  console.log('Waiting for receipt (status: ACCEPTED)...');
  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: 'ACCEPTED',
    retries: 250,
    interval: 3000
  });

  console.log('Result:', receipt.txExecutionResultName);
  const contractAddress = receipt.data?.contract_address || receipt.recipient;
  console.log('Contract Address:', contractAddress);
  console.log('Explorer URL:', `https://explorer-studio-dev.genlayer.com/address/${contractAddress}`);

  // Save deployment info
  const info = {
    network: 'studio-next',
    chainId: 61997,
    rpc: 'https://studio-next.genlayer.com/api',
    contractAddress,
    deployTxHash: txHash,
    deployer: account.address,
    explorerUrl: `https://explorer-studio-dev.genlayer.com/address/${contractAddress}`,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(path.resolve('..', 'deployed_contract.json'), JSON.stringify(info, null, 2), 'utf8');
  console.log('Saved deployment info to deployed_contract.json');
}

deploy().catch(console.error);
