import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, resolve } from "path";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

// 1. Load .env if present
const envPath = resolve(REPO_ROOT, ".env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

const req = createRequire(resolve(REPO_ROOT, "frontend", "package.json"));
const glMain = pathToFileURL(req.resolve("genlayer-js")).href;
const glChains = pathToFileURL(req.resolve("genlayer-js/chains")).href;
const { createClient, createAccount } = await import(glMain);
const { studionet } = await import(glChains);

const CONTRACT_PATH = resolve(REPO_ROOT, "contracts", "StyleLock.py");
const ENDPOINT = process.env.GENLAYER_RPC_URL || "https://studio-next.genlayer.com/api";
const CHAIN_ID = parseInt(process.env.GENLAYER_CHAIN_ID || "61997", 10);

const studioNextChain = {
  ...studionet,
  id: CHAIN_ID,
  name: "GenLayer Studio Next",
  rpcUrls: {
    default: { http: [ENDPOINT] }
  },
  blockExplorers: {
    default: { name: "GenLayer Explorer", url: "https://explorer-studio-dev.genlayer.com" }
  }
};

const rawPk = process.env.GENLAYER_PRIVATE_KEY || "0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f";
const pk = rawPk.startsWith("0x") ? rawPk : `0x${rawPk}`;
const account = createAccount(pk);
const client = createClient({ chain: studioNextChain, endpoint: ENDPOINT, account });

const code = readFileSync(CONTRACT_PATH, "utf8");

console.log("=== Deploying StyleLock on GenLayer Studio Next ===");
console.log("Deployer Address:", account.address);
console.log("Contract File   :", CONTRACT_PATH, `(${code.length} bytes)`);
console.log("RPC Endpoint    :", ENDPOINT, `(Chain ID ${CHAIN_ID})`);

// Ensure deployer is funded
try {
  const balance = await client.getBalance({ address: account.address });
  console.log("Deployer Balance:", balance.toString(), "wei");
  if (balance === 0n) {
    console.log("Account has 0 balance, requesting faucet via sim_fundAccount...");
    await client.request({
      method: "sim_fundAccount",
      params: [account.address, "10000000000000000000"]
    });
    const newBal = await client.getBalance({ address: account.address });
    console.log("New Balance     :", newBal.toString(), "wei");
  }
} catch (e) {
  console.log("Balance check notice:", e.message);
}

try {
  console.log("\nSending deploy transaction...");
  const txHash = await client.deployContract({ account, code, args: [] });
  console.log("Deploy Transaction Hash:", txHash);

  console.log("Waiting for transaction receipt (ACCEPTED / FINALIZED)...");
  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: "ACCEPTED",
    retries: 250,
    interval: 3000,
  });

  const addr =
    receipt?.data?.contract_address ||
    receipt?.contract_address ||
    receipt?.data?.contractAddress ||
    receipt?.contractAddress ||
    receipt?.txDataDecoded?.contractAddress ||
    receipt?.to_address ||
    null;

  console.log("\n Deployment Receipt:", JSON.stringify(receipt, (key, value) => typeof value === "bigint" ? value.toString() : value, 2));
  console.log("Contract Address :", addr);

  if (addr) {
    const deploymentInfo = {
      network: "studio-next",
      chainId: CHAIN_ID,
      rpc: ENDPOINT,
      contractAddress: addr,
      deployTxHash: txHash,
      deployedAt: new Date().toISOString()
    };
    writeFileSync(
      resolve(REPO_ROOT, "deployed_contract.json"),
      JSON.stringify(deploymentInfo, null, 2),
      "utf8"
    );
    console.log("Saved deployment info to deployed_contract.json");
  } else {
    console.warn("WARNING: contract address not found directly in receipt. Check receipt data above.");
  }
} catch (err) {
  console.error("Deploy error:", err);
  process.exit(1);
}

