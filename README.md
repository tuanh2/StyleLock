# StyleLock

> **Protect the style you built.**  
> *Autonomous visual style protection protocol for creators on GenLayer.*

[![GenLayer Network](https://img.shields.io/badge/GenLayer-Studionet%20(61999)-8B5CF6)](https://genlayer-explorer.vercel.app)
[![Track](https://img.shields.io/badge/Track-Autonomous%20Protocols-blue)](https://portal.genlayer.foundation/agent-tank)
[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-Passing-emerald)](./deliverables/e2e-run.json)
[![License](https://img.shields.io/badge/License-MIT-zinc)](./LICENSE)

---

## 1. The Problem

Artists currently have no scalable, decentralized way to protect their established visual styles against unauthorized commercial AI exploitation (LoRAs, synthetic asset packs, print-on-demand merch storefronts). 

Traditional copyright enforcement (DMCA notices, litigation) is slow, centralized, and expensive ($300/hour legal fees). More critically, **traditional smart contracts cannot read web content or reason about aesthetic similarity**.

---

## 2. The Solution: StyleLock

StyleLock empowers artists to precommit an autonomous protection policy:
- An artist registers a **Style Profile** with reference artworks, visual descriptors, protected traits, a similarity threshold (e.g. 82%), and funds a bounty pool.
- Anyone can become a **Style Hunter**. When a hunter discovers a suspected commercial derivative, they submit the public URL.
- **GenLayer AI validators independently retrieve live web evidence, analyze style reproduction, evaluate commercial signals, and reach decentralized consensus.**
- If consensus satisfies the creator's predefined policy, **StyleLock autonomously executes enforcement actions**:
  1. Allocates the hunter bounty from the escrow pool to the hunter's claimable rewards.
  2. Generates an immutable **StyleLock Enforcement Record**.
  3. Increments confirmed detection statistics and domain violation counters.
  4. Blacklists the suspect URL for that style to prevent duplicate bounty claims.
  5. Queues external notice webhooks.

**Zero human votes or manual admin interventions are required.**

---

## 3. Why GenLayer?

Determining whether visual content substantially reproduces an artist's distinctive style cannot be resolved with simple deterministic math:
- It requires **live web rendering** of arbitrary storefront URLs (`gl.nondet.web.render`).
- It requires **subjective, semantic reasoning** over visual traits and commercial context (`gl.nondet.exec_prompt`).
- It requires **decentralized consensus** among independent AI validators (`gl.vm.run_nondet`).

Without GenLayer, StyleLock would collapse into trusting a single centralized server or off-chain API key. GenLayer provides the tamper-proof, multi-validator consensus necessary for autonomous on-chain enforcement.

---

## 4. Why Autonomous Protocols Track?

StyleLock is not an advisory report where an artist must log in, vote, and approve every case. It is a **self-executing autonomous protocol**:
```
Artist defines policy once
          │
          ▼
Hunter submits suspect URL
          │
          ▼
GenLayer validators evaluate evidence independently
          │
          ▼
Semantic consensus reached (same verdict, commercial context, score tolerance)
          │
   ┌──────┴───────────────────────────┐
   │                                  │
[DERIVATIVE + Commercial + Threshold] [CLEAN / AMBIGUOUS]
   │                                  │
   ▼                                  ▼
Autonomous State Transition       No Action / Logged
   ├── Bounty allocated to hunter
   ├── Enforcement record #SL-XXXX created
   ├── Detection statistics incremented
   └── URL blacklisted
```

---

## 5. Live Deployed Contract & Verified Transactions

- **Contract Address**: [`0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD`](https://genlayer-explorer.vercel.app/address/0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD)
- **Network**: GenLayer Studionet (Chain ID 61999) / Studio Next Compatible
- **RPC Endpoint**: `https://studio.genlayer.com/api`
- **Explorer**: `https://genlayer-explorer.vercel.app`

### Verified On-Chain Transactions

| Action | Function | Tx Hash | Result |
|---|---|---|---|
| Contract Deploy | `deployContract` | [`0x7e73e01e…0704b0cdc`](https://genlayer-explorer.vercel.app/tx/0x7e73e01e05a95cb74ac1ae516878e13647ed494d841c04a964726b0a704b0cdc) | FINALIZED (ACCEPTED) |
| Register Style #1 | `create_style` (Ink Nocturne) | [`0x4f952f3e…07736144`](https://genlayer-explorer.vercel.app/tx/0x4f952f3e6287cc1e06bef2c988be04f1951f9cab812fd080474a298007736144) | FINALIZED (ACCEPTED) |
| Register Style #2 | `create_style` (Neon Geometry) | [`0xd3811133…346d1c67`](https://genlayer-explorer.vercel.app/tx/0xd3811133408d2fdb84981dddde2cd9bca705cccc4519d4e8e5da5419346d1c67) | FINALIZED (ACCEPTED) |
| Sample Case #1 | `submit_case` | [`0x1045756a…35fe7528`](https://genlayer-explorer.vercel.app/tx/0x1045756a1167583b0ffce4383d93b3030fe9117e0a043ac18c1a354535fe7528) | MAJORITY_AGREE (SUCCESS) |

---

## 6. Consensus Design & Validation

Instead of merely validating schema keys, StyleLock implements rigorous semantic validation:
```python
def validator_fn(leader_res) -> bool:
    if not isinstance(leader_res, gl.vm.Return):
        return False
    
    leader_data = json.loads(leader_res.calldata) if isinstance(leader_res.calldata, str) else leader_res.calldata
    mine = leader_fn()
    mine = json.loads(mine) if isinstance(mine, str) else mine

    # 1. Semantic Verdict Agreement
    if str(mine["verdict"]).upper() != str(leader_data["verdict"]).upper():
        return False
    
    # 2. Commercial Context Agreement
    if bool(mine["commercial_use"]) != bool(leader_data["commercial_use"]):
        return False
    
    # 3. Similarity tolerance within 10 points
    if abs(int(leader_data["similarity"]) - int(mine["similarity"])) > 10:
        return False

    # 4. Confidence tolerance within 15 points
    if abs(int(leader_data["confidence"]) - int(mine["confidence"])) > 15:
        return False

    return True
```

---

## 7. Project Structure

```
d:/gen hack/
├── contracts/
│   └── StyleLock.py          # GenLayer Intelligent Contract
├── tests/
│   └── test_stylelock.py     # 16 unit tests (decision matrix, consensus, anti-spam)
├── frontend/
│   ├── src/
│   │   ├── components/       # Navbar, Hero, StyleCard, SubmitModal, CaseView, HunterBoard, etc.
│   │   ├── data/             # Demo market presets and initial styles
│   │   ├── config.js         # genlayer-js client, MetaMask integration, explorer helpers
│   │   ├── App.jsx           # Main application router and state
│   │   └── index.css         # Tailwind styles
│   └── package.json
├── scripts/
│   ├── deploy/
│   │   └── deploy_stylelock.mjs # Deployment script
│   ├── seed/
│   │   ├── seed_styles.mjs      # Style registration script
│   │   └── submit_sample_case.mjs
│   └── e2e.mjs               # Recorded end-to-end wallet flow & invariant check
└── deliverables/
    ├── e2e-run.json          # Machine-auditable record of on-chain verification
    └── SUBMISSION.md         # Hackathon submission form
```

---

## 8. Quickstart & Local Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Test Suite
```bash
pytest tests/test_stylelock.py -v
```

### 3. Run End-to-End Verification
```bash
node scripts/e2e.mjs
```

### 4. Launch Frontend
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Legal & Technical Disclaimer

StyleLock provides decentralized evidence assessment and autonomous policy enforcement, not a formal judicial or legal copyright infringement determination.
