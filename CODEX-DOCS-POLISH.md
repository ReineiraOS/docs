# CODEX — Docs Polish Pass (docs only)

> **Hand-off model:** Claude built the substance (architecture-accuracy update on branch
> `docs/permissionless-architecture-update`). **Codex's job is the prose polish layer** — tone, flow,
> consistency, tightening — on the **same set of pages**, in a **separate PR**. Do **not** change facts.

## What just landed (don't re-litigate it)

The docs were updated to match the protocol's **permissionless-settlement** architecture. The on-chain operator
stack was deleted; settlement is now permissionless. The facts below are **canonical and correct** — your polish
must not contradict or reintroduce the old model:

- Settlement is **permissionless**: anyone calls `CCTPV2EscrowReceiver.settle(message, attestation)`; safety comes
  from Circle's **CCTP attestation verified on-chain**. A relayer only affects speed; if it's down, anyone can settle.
- **No** operator registration, GOV staking, slashing, exclusive claim window / permissionless-delay, operator
  fees, unbonding, minimum stake, `claimTask`/`executeTask`. The `OperatorRegistry`, `OperatorSlashingManager`,
  `FeeManager`, `TaskExecutor`, `CCTPHandler`, and the whole `orchestration` package are **gone**.
- "Operators" = permissionless **relayers** (thin bots: watch CCTP burns → fetch attestation → `settle()`).
- Coordinator = lightweight **burn-notification inbox** (round-robin SSE); no on-chain registry, no `selectOperator`.
- Recourse pools = **LP-funded** (LP capital + premiums); claims **cap at pool liquidity**. EigenLayer restaking is
  an **optional future** deep-backstop, not built. (Recourse LP "staking" of capital **is** correct — keep it.)
- Still true: zero protocol fee; FHE escrow on Fhenix; CCTP V2; **Recourse**=technical / **Shield**=brand;
  **RSS**=Reineira Settlement Standard; **Gate** primitive.

## Scope — POLISH only

Polish the pages changed in the content PR (all under `src/pages/docs/`):

`Overview, MentalModel, Architecture, Economics, RunOperator, CoordinatorNetwork, Contracts, Security, Risk,
Resilience, Status, CrossChain, GasPerformance, Governance, McpServer, RecourseModule, research/OpenProblems,
research/AgenticComposition, rss/RssWhatIs, rss/RssConformance, rss/RssLicensing`

Do:

1. **Smooth the seams** left by deletions. Several pages had whole sections/tables removed (e.g. `Contracts` lost the
   Orchestration table; `Security` lost the slashing-parameter rows; `CoordinatorNetwork`/`RunOperator` lost the
   operator-stack narrative). Fix abrupt transitions, dangling intros ("the three layers below…" when one was cut),
   and headings that no longer match their body.
2. **Terminology consistency.** Prefer **"relayer"** for the off-chain settlement bot; reserve "operator" only where
   it reads naturally as a synonym already framed as permissionless. Be consistent within and across pages.
3. **Tighten the rewritten paragraphs.** The accuracy edits were drafted for correctness, not rhythm — tighten
   wordiness, fix any double-negatives ("there is no … no … no"), and match each page's existing voice/heading style.
4. **`<StatusBadge status="spec" />` audit.** Keep "spec" only where the thing is genuinely still spec'd (e.g. a real
   underwriter-policy roadmap item). Remove/relabel any "spec" badge that was attached to the deleted operator
   economics. Don't invent new statuses.
5. **Cross-page coherence.** The "four primitives" framing (Escrow, Gate, Recourse, Operator) appears in places; make
   sure "Operator" is consistently presented as a permissionless relayer role (or, on RSS pages, as off-chain and
   outside the standard, per `RssWhatIs`). Align nav/LinkCard descriptions with the updated page bodies.

Do **not**:

- Change any **fact, address, status value, or number** (gas figures, recourse params, contract addresses).
- Reintroduce any deleted concept (staking, slashing, bonding, claim windows, operator fees, `OperatorRegistry`,
  `TaskExecutor`, `FeeManager`, `orchestration`).
- Add new components, imports, routes, or pages. Touch only `src/pages/docs/**`.
- Edit the protocol repo or anything outside `docs/`.

## Acceptance gates (CI must stay green)

Run before opening the PR — all must pass:

```bash
npx prettier --check .
npm run lint        # eslint
npm run build       # tsc (via vite) + vite build
npm run test        # vitest
```

Plus a self-check: grep the changed pages for reintroduced stale terms and confirm none are **affirmative** claims:

```bash
grep -rInE "claimTask|TaskExecutor|OperatorRegistry|OperatorSlashingManager|exclusive window|unbond|cUSDC bond|orchestration" src/pages/docs
# remaining hits must be negations ("no exclusive window") or absent
```

## PR conventions

- Branch off `docs/permissionless-architecture-update` (so the polish stacks on the content PR), or off `main` if it
  has merged first.
- Title: `docs: polish pass for permissionless-architecture update`.
- Keep the diff **prose-only** — a reviewer should see wording changes, not factual or structural ones.
