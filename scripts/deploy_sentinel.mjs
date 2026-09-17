import { createAccount, createClient } from "genlayer-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PRIVATE_KEY = "0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f";
const CONTRACT_PATH = resolve("./contracts/SentinelGuard.py");

// Studio Next Network config for Agent Tank Hackathon
const STUDIO_NEXT_CHAIN = {
  id: 61997,
  name: "GenLayer Studio Next",
  rpcUrls: {
    default: { http: ["https://studio-next.genlayer.com/api"] },
    public: { http: ["https://studio-next.genlayer.com/api"] }
  }
};

async function main() {
  console.log("🚀 Initializing deployment for SentinelGuard.py...");
  console.log("📌 Target Contract:", CONTRACT_PATH);
  console.log("🌐 Network: Studio Next (RPC: https://studio-next.genlayer.com/api, Chain ID: 61997)");

  const account = createAccount(PRIVATE_KEY);
  console.log("🔑 Account Address:", account.address);

  const contractCode = readFileSync(CONTRACT_PATH, "utf8");
  
  const client = createClient({
    chain: STUDIO_NEXT_CHAIN,
    endpoint: "https://studio-next.genlayer.com/api",
    account
  });

  try {
    console.log("⏳ Deploying contract on-chain...");
    const transactionHash = await client.deployContract({
      account,
      code: contractCode,
      args: []
    });

    console.log("📝 Transaction Hash:", transactionHash);
    console.log("⏳ Waiting for transaction receipt & finalized consensus...");

    const receipt = await client.waitForTransactionReceipt({
      hash: transactionHash,
      retries: 60,
      interval: 3000
    });

    console.log("✅ Receipt received!");
    console.log(JSON.stringify(receipt, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));

    const contractAddress = receipt?.data?.contract_address || receipt?.txDataDecoded?.contractAddress || receipt?.contractAddress;
    console.log("\n=======================================================");
    console.log("🎉 DEPLOY SUCCESSFUL!");
    console.log("📍 Deployed Contract Address:", contractAddress || "See receipt above");
    console.log("🔗 Explorer URL: https://explorer-studio-dev.genlayer.com/");
    console.log("=======================================================\n");

  } catch (err) {
    console.error("❌ Deploy Error:", err);
    
    // Fallback: Try deploying with studionet chain if studio-next endpoint needs chain object
    console.log("\n🔄 Retrying with Studio hosted endpoint (https://studio.genlayer.com/api)...");
    try {
      const clientStudio = createClient({
        endpoint: "https://studio.genlayer.com/api",
        account
      });
      const txHash = await clientStudio.deployContract({
        account,
        code: contractCode,
        args: []
      });
      console.log("📝 Fallback Transaction Hash:", txHash);
      const receipt = await clientStudio.waitForTransactionReceipt({ hash: txHash, retries: 60, interval: 3000 });
      console.log("✅ Fallback Receipt:", JSON.stringify(receipt, null, 2));
    } catch (fallbackErr) {
      console.error("❌ Fallback Deploy Error:", fallbackErr);
    }
  }
}

main();
