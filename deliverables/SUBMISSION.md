# StyleLock — Explorer & Hackathon Submission

## Basic Info

- **Project Name**: StyleLock
- **Tagline**: Protect the style you built. (Autonomous style protection for creators)
- **Track**: Autonomous Protocols
- **Network**: GenLayer Studionet (Chain ID 61999 / Studio Next compatible)
- **Contract Address**: `0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD`
- **Explorer Contract Link**: https://genlayer-explorer.vercel.app/address/0x63f0708BDd5C52e8f2A5f9308Aeb6057a09042FD

---

## Short Description (max 160 chars)

Autonomous visual style protection protocol: artists precommit policies, hunters discover AI derivatives, GenLayer consensus enforces rewards automatically.

---

## Long Description (max 500 chars)

StyleLock is an autonomous style protection protocol for visual creators on GenLayer. Artists register their visual identity (collage, descriptor, protected traits, similarity threshold, and bounty pool). Anyone can act as a Style Hunter submitting public storefront/marketplace URLs. GenLayer validators independently inspect the original artwork, suspect content, and commercial context. When consensus determines the content crosses the threshold, StyleLock automatically records the violation and allocates the bounty — no vote or moderator required.

---

## Why Autonomous Protocols

In StyleLock, a human creator defines their protection policy once at registration:
1. Bounty hunter discovers a suspected commercial derivative and submits a public URL.
2. GenLayer validators independently fetch web and visual evidence via `gl.nondet.web.render`.
3. Multi-validator semantic consensus evaluates style similarity, trait reproduction, and commercial signals.
4. Contract autonomously enforces the outcome:
   - Allocates the hunter bounty from the artist's escrow pool.
   - Creates an immutable StyleLock Enforcement Record.
   - Increments confirmed detection statistics and domain violation counters.
   - Permanently flags the suspect URL to prevent duplicate claims.
5. Zero human moderator, artist vote, or centralized admin approval is required.

---

## Verified Live Transactions on GenLayer

| Step | Method | Status | Tx Hash | Explorer Link |
|---|---|---|---|---|
| Contract Deployment | `deployContract` | ACCEPTED | `0x7e73e01e…0704b0cdc` | [View Tx](https://genlayer-explorer.vercel.app/tx/0x7e73e01e05a95cb74ac1ae516878e13647ed494d841c04a964726b0a704b0cdc) |
| Register Style #1 (Ink Nocturne) | `create_style` | ACCEPTED | `0x4f952f3e…07736144` | [View Tx](https://genlayer-explorer.vercel.app/tx/0x4f952f3e6287cc1e06bef2c988be04f1951f9cab812fd080474a298007736144) |
| Register Style #2 (Neon Geometry) | `create_style` | ACCEPTED | `0xd3811133…346d1c67` | [View Tx](https://genlayer-explorer.vercel.app/tx/0xd3811133408d2fdb84981dddde2cd9bca705cccc4519d4e8e5da5419346d1c67) |
| Case Adjudication #1 | `submit_case` | MAJORITY_AGREE (SUCCESS) | `0x1045756a…35fe7528` | [View Tx](https://genlayer-explorer.vercel.app/tx/0x1045756a1167583b0ffce4383d93b3030fe9117e0a043ac18c1a354535fe7528) |

---

## GenLayer Features Used

| Feature | Method | Purpose |
|---|---|---|
| `gl.nondet.web.render` | `submit_case()` | Fetches suspect public webpage content and storefront context live on-chain |
| `gl.nondet.exec_prompt` | `submit_case()` | LLM evaluates combination uniqueness, visual traits, and commercial signals |
| `gl.vm.run_nondet` | `submit_case()` | Validators independently verify semantic verdict, commercial context, and score tolerance |
| `gl.public.write.payable` | `fund_style()` | Accepts native GEN bounty funding into style escrow |
| `@gl.evm.contract_interface` + `emit_transfer` | `claim_reward()` | Pull-payment delivering native GEN to hunter EOAs without IC-to-IC address resolution issues |
