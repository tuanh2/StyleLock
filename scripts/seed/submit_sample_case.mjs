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

const CONTRACT = process.env.CONTRACT_ADDRESS || "0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD";
const ENDPOINT = "https://studio.genlayer.com/api";
const pk = "0x61f62f1b64f6ee87449ecf3cf7a25719298ec3739f70da36b23b88f785a69b8f";
const acc = createAccount(pk);
const client = createClient({ chain: studionet, endpoint: ENDPOINT, account: acc });

async function main() {
  console.log("=== Submitting Sample Evidence Case to StyleLock ===");
  console.log("Contract:", CONTRACT);
  console.log("Hunter  :", acc.address);

  const suspectUrl = "https://raw.githubusercontent.com/genlayerlabs/genlayer-project-boilerplate/v2-dev/README.md#commercial-ai-art-pack-moody-watercolor-illustrations-price-14-usd";
  const claimText = "Commercial AI asset pack selling 12 watercolor illustrations with rough black ink contours, muted palettes, and asymmetric layouts copied from Alice Kim's Ink Nocturne style.";

  console.log("Target Style ID: 1 (Ink Nocturne)");
  console.log("Suspect URL    :", suspectUrl);
  console.log("Claim          :", claimText);

  console.log("\nSending submit_case transaction...");
  const hash = await client.writeContract({
    address: CONTRACT,
    functionName: "submit_case",
    args: ["1", suspectUrl, claimText]
  });
  console.log("Tx Hash:", hash);

  console.log("Waiting for multi-validator AI consensus & finalization...");
  const receipt = await client.waitForTransactionReceipt({
    hash,
    status: "FINALIZED",
    retries: 200,
    interval: 3000
  });

  console.log("\nReceipt received!");
  console.log("Consensus Result:", receipt?.result_name || "FINALIZED");
  console.log("Execution Result:", receipt?.consensus_data?.leader_receipt?.[0]?.execution_result || receipt?.status);

  // Read recorded case on-chain
  const caseRaw = await client.readContract({
    address: CONTRACT,
    functionName: "get_case",
    args: ["1"]
  });
  console.log("\nOn-Chain Case Record #1:");
  console.log(caseRaw);
}

main().catch(console.error);
