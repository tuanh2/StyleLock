import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, resolve } from "path";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

const req = createRequire(resolve(REPO_ROOT, "frontend", "package.json"));
const glMain = pathToFileURL(req.resolve("genlayer-js")).href;
const glChains = pathToFileURL(req.resolve("genlayer-js/chains")).href;
const { createClient, createAccount } = await import(glMain);
const { studionet } = await import(glChains);

const CONTRACT_PATH = resolve(REPO_ROOT, "contracts", "StyleLock.py");
const ENDPOINT = "https://studio-next.genlayer.com/api";
const CHAIN_ID = 61997;

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

const pk = process.env.GENLAYER_PRIVATE_KEY || "0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f";
const account = createAccount(pk);
const client = createClient({ chain: studioNextChain, endpoint: ENDPOINT, account });

const code = readFileSync(CONTRACT_PATH, "utf8");

console.log("=== Deploying StyleLock on GenLayer Studio Next ===");
console.log("Deployer Address:", account.address);
console.log("Contract File   :", CONTRACT_PATH, `(${code.length} bytes)`);
console.log("RPC Endpoint    :", ENDPOINT, `(Chain ID ${CHAIN_ID})`);

try {
  const txHash = await client.deployContract({ code, args: [] });
  console.log("\nDeploy Transaction Hash:", txHash);

  console.log("Waiting for transaction receipt (FINALIZED)...");
  const receipt = await client.waitForTransactionReceipt({
    hash: txHash,
    status: "FINALIZED",
    retries: 200,
    interval: 3000,
  });

  const addr =
    receipt?.data?.contract_address ||
    receipt?.contract_address ||
    receipt?.data?.contractAddress ||
    receipt?.contractAddress ||
    receipt?.to_address ||
    null;

  console.log("Deployment Result:", receipt?.txExecutionResultName || receipt?.status || "SUCCESS");
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
  }
} catch (err) {
  console.error("Deploy error:", err);
  process.exit(1);
}
