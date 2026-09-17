# StyleLock

**Autonomous visual style protection and bounty protocol powered by GenLayer's AI-native consensus.**

[![GenLayer Network](https://img.shields.io/badge/GenLayer-Studionet%20(61999)-8B5CF6)](https://explorer-next.studio.genlayer.com/address/0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD)
[![Track](https://img.shields.io/badge/Track-Autonomous%20Protocols-blue)](https://portal.genlayer.foundation/agent-tank)
[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-6%2F6%20Passing-emerald)](./deliverables/e2e-run.json)
[![Unit Tests](https://img.shields.io/badge/Unit%20Tests-16%2F16%20Passing-emerald)](./tests/test_stylelock.py)
[![License](https://img.shields.io/badge/License-MIT-zinc)](./LICENSE)

---

## Problem

Generative AI models and marketplaces make copying an artist's distinctive visual identity instantaneous. Fine-tuned LoRAs, synthetic prompt packs, and print-on-demand storefronts commercially exploit visual styles without attribution or compensation.

Traditional enforcement mechanisms fail:
- **Centralized DMCA takedowns** are slow, expensive, and opaque.
- **Copyright litigation** costs upwards of $300/hour, inaccessible to independent creators.
- **Traditional smart contracts** (Solidity/EVM) cannot read external web pages or reason about whether two artworks or visual styles are substantially similar.

Creators need an autonomous, transparent mechanism: precommit style parameters once, crowdsource discovery of unlicensed commercial copies, and let decentralized AI validators inspect live evidence and release bounties automatically — with zero voting, manual reviews, or centralized gatekeepers.

---

## How It Works

```
1. REGISTER     Artist precommits Style Profile (descriptors, traits, threshold, collage URL)
                and deposits bounty escrow.
                                     │
2. DISCOVER     Style Hunter finds an unauthorized commercial product listing on the web.
                                     │
3. ADJUDICATE   Hunter submits suspect URL -> GenLayer AI validators:
                - Fetch live web content from suspect URL (gl.nondet.web.render)
                - Read reference collage & manifest
                - Perform multi-trait semantic comparison
                - Check for commercial intent (pricing, cart, license terms)
                - Reach multi-validator consensus
                                     │
4. VERDICT      One of three consensus outcomes:
                DERIVATIVE -> Similarity >= threshold + Commercial use confirmed:
                              - Bounty allocated from escrow to hunter claimable pool
                              - Immutable Enforcement Record #SL-XXXX generated
                              - Detection counters incremented
                              - Suspect URL permanently logged
                CLEAN      -> Distinct traits, no infringement -> No bounty
                AMBIGUOUS  -> Mixed signals or below confidence -> No bounty
                                     │
5. WITHDRAW     Hunter calls claim_reward() to pull credited bounties to their wallet
                (pull-payment escrow pattern).
```

---

## Architecture

```
+---------------------+     +----------------------+     +---------------------+
|   React Frontend    | --> |   GenLayer Network   | --> |   LLM Validators    |
|  (Vite + Tailwind)  |     |     (Studionet)      |     |      (AI Jury)      |
+---------------------+     +----------------------+     +---------------------+
           │                           │                            │
      MetaMask                Intelligent Contract            Web Rendering
      genlayer-js              (Python on GenVM)             Trait Analysis
                               Bounty Escrow                Consensus Engine
                               Style Registry               Enforcement Records
```

---

## Why This Dies Without GenLayer

"Is this commercial product reproducing an artist's distinctive visual style?" is a **subjective aesthetic judgment** that requires:

1. **Reading real web content** from arbitrary storefront URLs at transaction time (`gl.nondet.web.render`)
2. **Reasoning about similarity** in creative expression, line weight, palette, and commercial context (`gl.nondet.exec_prompt`)
3. **Reaching consensus** among multiple independent AI validators on verdict, score, and commercial signals (`gl.vm.run_nondet`)
4. **Deterministic finality** — the consensus verdict triggers autonomous state transitions and credits bounty escrow without human intervention

Solidity cannot fetch web pages. Oracles cannot reason about aesthetics or commercial licensing. Only GenLayer's Intelligent Contracts can execute this subjective adjudication on-chain natively.

---

## Tech Stack

- **Smart Contract**: Python (GenLayer Intelligent Contract running on GenVM)
- **Frontend**: React 18 + Vite + TailwindCSS
- **Design System**: Technical minimalist aesthetic inspired by de1.ai (black text on crisp white background, subtle purple accents)
- **Chain Integration**: genlayer-js SDK + MetaMask
- **Network**: GenLayer Studionet (Chain ID: 61999) / Studio Next Compatible
- **Testing**: pytest (16/16 unit tests passed) + gltest + Node.js E2E automation

---

## Contract Address & Verified Transactions

```
Contract Address: 0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD
Network: GenLayer Studionet (Chain ID: 61999)
RPC Endpoint: https://studio.genlayer.com/api
Explorer: https://explorer-next.studio.genlayer.com/address/0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD
```

### Verified On-Chain Transactions

| Action | Function | Transaction Hash | Result |
| :--- | :--- | :--- | :--- |
| **Contract Deploy** | `deployContract` | [`0x7e73e01e...0704b0cdc`](https://explorer-next.studio.genlayer.com/tx/0x7e73e01e05a95cb74ac1ae516878e13647ed494d841c04a964726b0a704b0cdc) | FINALIZED (SUCCESS) |
| **Register Style #1** | `create_style` (*Ink Nocturne*) | [`0x4f952f3e...07736144`](https://explorer-next.studio.genlayer.com/tx/0x4f952f3e6287cc1e06bef2c988be04f1951f9cab812fd080474a298007736144) | FINALIZED (SUCCESS) |
| **Register Style #2** | `create_style` (*Neon Geometry*) | [`0xd3811133...346d1c67`](https://explorer-next.studio.genlayer.com/tx/0xd3811133408d2fdb84981dddde2cd9bca705cccc4519d4e8e5da5419346d1c67) | FINALIZED (SUCCESS) |
| **Case Adjudication** | `submit_case` | [`0x1045756a...35fe7528`](https://explorer-next.studio.genlayer.com/tx/0x1045756a1167583b0ffce4383d93b3030fe9117e0a043ac18c1a354535fe7528) | MAJORITY_AGREE (`status: CLEAN`) |

---

## Deploy the Contract

### Prerequisites

- Python 3.11+
- GenLayer CLI or access to [GenLayer Studio](https://studio.genlayer.com)

### Via GenLayer Studio (Recommended)

1. Open [studio.genlayer.com](https://studio.genlayer.com)
2. Click **New Contract**
3. Paste the contents of `contracts/stylelock.py`
4. Click **Deploy**
5. Copy the deployed contract address

### Via Deployment Script

```bash
cd frontend && npm install
export GENLAYER_PRIVATE_KEY="0x..."
node ../scripts/deploy.mjs
```

---

## Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy Frontend to Vercel

```bash
cd frontend
npx vercel
```

Or connect this repository directly in the Vercel Dashboard:
- **Root Directory**: `frontend`
- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## Run Tests

### Unit Tests (Python / pytest)

```bash
python -m pytest tests/test_stylelock.py -v
```

Output:
```text
tests/test_stylelock.py::test_initial_state PASSED
tests/test_stylelock.py::test_create_style PASSED
tests/test_stylelock.py::test_fund_bounty_pool PASSED
tests/test_stylelock.py::test_create_style_unauthorized_fails PASSED
tests/test_stylelock.py::test_create_style_invalid_threshold PASSED
tests/test_stylelock.py::test_validator_fn_agreement PASSED
tests/test_stylelock.py::test_validator_fn_verdict_disagreement PASSED
tests/test_stylelock.py::test_validator_fn_commercial_disagreement PASSED
tests/test_stylelock.py::test_validator_fn_similarity_divergence PASSED
tests/test_stylelock.py::test_submit_case_derivative PASSED
tests/test_stylelock.py::test_submit_case_clean PASSED
tests/test_stylelock.py::test_submit_case_noncommercial PASSED
tests/test_stylelock.py::test_claim_reward PASSED
tests/test_stylelock.py::test_claim_reward_no_balance PASSED
tests/test_stylelock.py::test_get_enforcement_records PASSED
tests/test_stylelock.py::test_is_suspect_blacklisted PASSED

================ 16 passed in 0.28s ================
```

### Recorded End-to-End Wallet Flow

`scripts/e2e.mjs` executes the full user journey on GenLayer Studionet, asserts transaction execution results, and writes the output log to `deliverables/e2e-run.json`:

```bash
cd frontend
node ../scripts/e2e.mjs
```

All 6 on-chain assertions pass:
1. `get_style_count() == 2`
2. `get_style("1").style_name == "Ink Nocturne"`
3. `get_style("2").style_name == "Neon Geometry"`
4. `get_case_count() >= 1`
5. `case_1.status in ["ENFORCED", "CLEAN"]`
6. `total_escrow_pool >= 0`

The latest run record is committed at [`deliverables/e2e-run.json`](deliverables/e2e-run.json).

---

## License

MIT
