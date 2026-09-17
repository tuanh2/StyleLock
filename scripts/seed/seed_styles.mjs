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
  console.log("=== Seeding Initial Style Profiles to StyleLock ===");
  console.log("Contract:", CONTRACT);
  console.log("Signer  :", acc.address);

  const styles = [
    {
      artist_display_name: "Alice Kim",
      style_name: "Ink Nocturne",
      descriptor: "Moody watercolor illustrations with rough black ink contours, muted blue and brown palette, asymmetric framing, sparse backgrounds, elongated human proportions and visible paper texture.",
      protected_traits: "rough black ink contours; muted watercolor palette; asymmetric framing; sparse composition; elongated proportions",
      license_terms: "Commercial AI-generated derivatives using this registered style are strictly prohibited without prior authorization.",
      similarity_threshold: 82,
      minimum_confidence: 75,
      bounty_per_case_wei: "250000000000000000", // 0.25 GEN
      reference_manifest_url: "https://stylelock.art/manifests/ink-nocturne.json",
      reference_manifest_hash: "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      reference_collage_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80"
    },
    {
      artist_display_name: "Marcus Vance",
      style_name: "Neon Geometry",
      descriptor: "Flat vector compositions with sharp polygonal geometry, neon orange and electric cyan on deep navy backgrounds, isometric perspectives, and minimalist shadows.",
      protected_traits: "sharp polygonal geometry; neon orange and electric cyan; deep navy backgrounds; isometric framing; minimal hard shadows",
      license_terms: "Commercial generative models trained or imitating these geometric motifs require licensing.",
      similarity_threshold: 80,
      minimum_confidence: 70,
      bounty_per_case_wei: "150000000000000000", // 0.15 GEN
      reference_manifest_url: "https://stylelock.art/manifests/neon-geometry.json",
      reference_manifest_hash: "0x5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
      reference_collage_url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  for (let i = 0; i < styles.length; i++) {
    const s = styles[i];
    console.log(`\nRegistering Style ${i + 1}: ${s.style_name} by ${s.artist_display_name}...`);
    try {
      const hash = await client.writeContract({
        address: CONTRACT,
        functionName: "create_style",
        args: [
          s.artist_display_name,
          s.style_name,
          s.descriptor,
          s.protected_traits,
          s.license_terms,
          s.similarity_threshold,
          s.minimum_confidence,
          s.bounty_per_case_wei,
          s.reference_manifest_url,
          s.reference_manifest_hash,
          s.reference_collage_url
        ]
      });
      console.log("Tx Hash:", hash);
      const receipt = await client.waitForTransactionReceipt({ hash, status: "FINALIZED", retries: 200, interval: 3000 });
      console.log("Receipt status:", receipt.status || receipt.txExecutionResultName || "FINALIZED");
    } catch (e) {
      console.error("Error creating style:", e.message);
    }
  }

  const finalCount = await client.readContract({ address: CONTRACT, functionName: "get_style_count", args: [] });
  console.log("\nTotal Styles on-chain now:", finalCount);
}

main().catch(console.error);
