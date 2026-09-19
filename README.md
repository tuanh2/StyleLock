# StyleLock

**Autonomous visual style protection and bounty protocol powered by GenLayer's AI-native consensus.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success)](https://style-lock-dusky.vercel.app)
[![GenLayer Network](https://img.shields.io/badge/GenLayer-Studio%20Next%20(61997)-8B5CF6)](https://explorer-studio-dev.genlayer.com/address/0xbbbDa0a730e27C55Fd8F3CBC6862882d4f670ffc)
[![Multi--Chain Escrow](https://img.shields.io/badge/Multi--Chain-GenLayer%20%7C%20Arc%20%7C%20BNB%20%7C%20Solana-blue)](https://style-lock-dusky.vercel.app)
[![Track](https://img.shields.io/badge/Track-Autonomous%20Protocols-blue)](https://portal.genlayer.foundation/agent-tank)
[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-6%2F6%20Passing-emerald)](./deliverables/e2e-run.json)
[![Unit Tests](https://img.shields.io/badge/Unit%20Tests-16%2F16%20Passing-emerald)](./tests/test_stylelock.py)
[![License](https://img.shields.io/badge/License-MIT-zinc)](./LICENSE)

---

## Overview

Generative AI models and online marketplaces make copying an artist's distinctive visual identity instantaneous. Fine-tuned LoRAs, synthetic prompt packs, and print-on-demand storefronts commercially exploit visual styles without attribution or compensation.

Traditional enforcement mechanisms fail:
- **Centralized DMCA takedowns** are slow, expensive, and opaque.
- **Copyright litigation** costs upwards of $300/hour, inaccessible to independent creators.
- **Traditional smart contracts** (Solidity/EVM) cannot read external web pages or reason about whether two artworks or visual styles are substantially similar.

**StyleLock** provides an autonomous, transparent alternative: artists precommit their style parameters once, crowdsource discovery of unlicensed commercial copies to decentralized hunters, and let GenLayer's AI validators inspect live evidence and release bounties automatically — with zero voting delays, manual reviews, or centralized gatekeepers.

---

## Key Features & Latest Updates

### 1. AI Consensus Verification Engine (GenLayer Native)
- **Non-Deterministic Web Scraping**: Validators fetch live HTML and rendered assets from suspect URLs at transaction time via `gl.nondet.web.render`.
- **Subjective Aesthetic Reasoning**: Independent LLM validators compare line weight, palette, framing, and compositional traits against the artist's precommitted manifest and collage using `gl.nondet.exec_prompt`.
- **Commercial Intent Detection**: Automatically inspects e-commerce storefronts for pricing, shopping carts, checkout forms, or commercial license flags.
- **Autonomous Payouts**: Verified infringements automatically credit bounty pools to the reporting hunter without human intervention.

### 2. Multi-Chain Escrow & Cross-Chain Bounty Funding
StyleLock cleanly separates **AI consensus execution** from **liquidity & patronage**:
- **GenLayer Studio Next (`GEN`)**: Powers the core Intelligent Contract logic, state transitions, and validator gas for AI web evaluation.
- **Arc Network (`USDC`)**: Circle L1 integration (`Chain ID: 5042002`) allowing patrons and artists to fund escrow pools with native USDC.
- **BNB Chain (`USDT`)**: Standard BEP-20 USDT token transfers (`0x55d398326f99059fF775485246999027B3197955`) on Binance Smart Chain (`Chain ID: 56`).
- **Solana (`USDC`)**: Native Phantom wallet signature integration for SPL USDC funding.
- **Real-Time Wallet Verification**: The dApp strictly verifies the active wallet's chain ID (`eth_chainId`) before requesting signatures, ensuring transactions are executed on the user's intended network and currency.

### 3. Truthful Real-Time On-Chain Statistics
- **Zero Mock Overrides**: All metrics (`Total Escrow Pool`, `Active Styles`, `Cases Reviewed`, `Enforcements`) are computed dynamically from on-chain contract state.
- **Continuous 10s Polling**: Automatic background polling keeps balances and dispute logs in sync with the blockchain without page reloads.

### 4. Dedicated Pages & Deep Linking
- **Explore Styles (`/explore` or `/`)**: Live grid of protected visual styles, creator profiles, and available escrow bounties.
- **Hunter Board (`/hunt`)**: Comprehensive feed of all submitted cases, consensus outcomes (`DERIVATIVE`, `CLEAN`, `AMBIGUOUS`), similarity percentages, and public enforcement records.
- **Dedicated Style Detail View (`/style?id=X`)**: Deep-linked profile page showcasing reference collages, protected traits, license terms, and case adjudication history for that specific style.
- **Dedicated Evidence Submission (`/report?style=X`)**: Specialized report view featuring **X / Twitter auto-extraction** (via FXTwitter API) to immediately preview suspect artwork, author, and caption before on-chain submission.
- **Artist Style Registration (`/artist`)**: Intuitive registration wizard to establish a new on-chain visual style profile.

### 5. Tactile Web3 UX & Audio Feedback
- Minimalist typography inspired by modern AI labs.
- Interactive audio cues (completion chimes, transaction confirmations, click sounds) providing immediate physical feedback for Web3 actions.

---

## Protocol Architecture & Division of Labor

```
+─────────────────────────────────────────────────────────────────────────────────────────────+
|                                    React 18 + Vite Frontend                                  |
|         Explore Grid  ·  Hunter Board  ·  Style Detail (/style)  ·  Report View (/report)    |
+─────────────────────────────────────────────────────────────────────────────────────────────+
                 │                                                          │
   [Cross-Chain Bounty Funding]                             [AI Consensus & Dispute Resolution]
                 │                                                          │
     +───────────┴───────────+                                              │
     │  Multi-Chain Escrow   │                                              │
     │  - Arc (USDC Native)  │                                              │
     │  - BNB Chain (USDT)   │                                              │
     │  - Solana (Phantom)   │                                              │
     +───────────────────────+                                              │
                                                                            ▼
                                                          +───────────────────────────────────+
                                                          |      GenLayer Studio Next         |
                                                          |       (Chain ID: 61997)           |
                                                          |  Contract: 0xbbbDa0a7...0ffc      |
                                                          +───────────────────────────────────+
                                                                            │
                                                                   gl.nondet.web.render
                                                                   gl.nondet.exec_prompt
                                                                            │
                                                                            ▼
                                                          +───────────────────────────────────+
                                                          |     Decentralized AI Jury         |
                                                          |     - Scrapes suspect URL         |
                                                          |     - Measures visual similarity  |
                                                          |     - Verifies commercial intent  |
                                                          |     - Reaches consensus (GEN)     |
                                                          +───────────────────────────────────+
```

### Why AI Verification Requires GenLayer & `GEN`
"Is this commercial product reproducing an artist's visual style?" is a **subjective aesthetic judgment** requiring:
1. Fetching external web content at transaction time (`gl.nondet.web.render`).
2. Reasoning about line weight, palette, lighting, and composition (`gl.nondet.exec_prompt`).
3. Reaching decentralized validator consensus on the verdict, score, and commercial status (`gl.vm.run_nondet`).
4. Releasing bounty escrow autonomously based on the consensus outcome.

Solidity cannot fetch web pages. Oracles cannot reason about art aesthetics or commercial licensing terms. **Only GenLayer Intelligent Contracts make this natively possible.**

---

## Verified Deployments & Live Contracts

### GenLayer Studio Next Contract
```
Contract Address: 0xbbbDa0a730e27C55Fd8F3CBC6862882d4f670ffc
Network: GenLayer Studio Next (Chain ID: 61997)
RPC Endpoint: https://studio-next.genlayer.com/api
Explorer: https://explorer-studio-dev.genlayer.com/address/0xbbbDa0a730e27C55Fd8F3CBC6862882d4f670ffc
Live Application: https://style-lock-dusky.vercel.app
```

### Verified On-Chain Transactions (Studio Next)

| Action | Function | Transaction Hash | Result |
| :--- | :--- | :--- | :--- |
| **Contract Deploy** | `deployContract` | [`0x19242ce7...be871861`](https://explorer-studio-dev.genlayer.com/tx/0x19242ce75519f4e9b023f72e20595608cec54137c16fc09b86965327be871861) | FINALIZED (SUCCESS) |
| **Register Style Profile** | `create_style` | [`0xce7cf5e5...b948902a`](https://explorer-studio-dev.genlayer.com/tx/0xce7cf5e510be867e916f1ce7468cbceb486628d9ceca2d550aa4e9bab948902a) | FINALIZED (SUCCESS) |
| **AI Case Adjudication** | `submit_case` | [`0xcb5d1476...3c7c5c19d`](https://explorer-studio-dev.genlayer.com/tx/0xcb5d147609b68e04a1fd6fea36b4e3985e5cc3fedfe543f64183fff3c7c5c19d) | MAJORITY_AGREE (`status: CLEAN`) |
| **Bounty Escrow Funding** | `fund_style` | [`0x145a892b...ce92b901`](https://explorer-studio-dev.genlayer.com/address/0xbbbDa0a730e27C55Fd8F3CBC6862882d4f670ffc) | FINALIZED (SUCCESS) |

---

## Repository Structure

```
StyleLock/
├── contracts/
│   ├── StyleLock.py          # GenLayer Intelligent Contract (Python on GenVM)
│   └── SentinelGuard.py      # Automated security and rate-limiting wrapper
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Network selector, wallet state & tab navigation
│   │   │   ├── Hero.jsx             # Real-time protocol metrics & primary CTA
│   │   │   ├── StyleCard.jsx        # Interactive card with bounty pool & quick actions
│   │   │   ├── StyleDetailView.jsx  # Dedicated deep-linked style page & case history
│   │   │   ├── HunterBoard.jsx      # Global adjudicated disputes & bounty claims
│   │   │   ├── ReportView.jsx       # Dedicated evidence submission with X auto-fetch
│   │   │   ├── DonateModal.jsx      # Multi-chain bounty boost modal (USDC/USDT/GEN)
│   │   │   ├── ChainSelectModal.jsx # Multi-chain network selector (Arc/BNB/Solana/GenLayer)
│   │   │   └── SplashScreen.jsx     # Tactile splash sequence
│   │   ├── data/
│   │   │   └── demoFixtures.js      # Reference presets & initial metadata fixtures
│   │   ├── config.js                # GenLayer client config, RPC endpoints & utilities
│   │   ├── soundEffects.js          # Audio chimes, tactile click feedback & coin sounds
│   │   └── App.jsx                  # Main router, cross-chain signing logic & state
│   ├── package.json
│   └── vite.config.js
├── scripts/
│   ├── list_all_styles.mjs   # Live RPC reader verifying on-chain style counts and pools
│   ├── e2e.mjs               # End-to-end transaction test automation script
│   └── deploy_sentinel.mjs   # Studio Next deployment pipeline
├── tests/
│   ├── test_stylelock.py     # 16 pytest unit tests covering consensus & escrow
│   └── test_sentinel.py      # SentinelGuard integration test suite
└── deliverables/
    └── e2e-run.json          # Verified on-chain test execution log
```

---

## Local Development & Setup

### 1. Prerequisites
- Node.js 18+
- Python 3.11+
- MetaMask (for EVM / GenLayer / Arc / BNB Chain)
- Phantom (for Solana)

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Unit Tests (Python / pytest)
```bash
python -m pytest tests/test_stylelock.py -v
```
Output:
```text
============================== test session starts ==============================
collected 16 items

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

============================== 16 passed in 0.28s ==============================
```

### 4. Run End-to-End On-Chain Tests
```bash
node scripts/e2e.mjs
```
Asserts live state transitions against GenLayer Studio Next (`61997`).

---

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
