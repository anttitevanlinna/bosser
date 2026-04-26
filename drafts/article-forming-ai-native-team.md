# How to Form an AI-Native Team — The Evidence-Based Playbook

**Status:** Draft | **Target:** Deploying Agents newsletter | **Evidence base:** OODA cycles 72-80, 12 company observations, 170+ research files
**Angle:** Every recommendation traces to a named company, a specific finding, and an evidence level. A CTO can verify every claim.

---

## The Setup (Week -4 to 0)

**Pick 3-5 people. Not more.** Every successful AI-native team in the research is small: Anthropic (2-4), Tesla (3-5), StrongDM (3), Every Inc (~1 per product), F-Secure greenfield (3-5). Large teams add coordination overhead that negates the AI multiplier.

**Selection criteria — the research tells you exactly what to screen for:**
- **One seed practitioner minimum** (non-negotiable — every successful transition had one, every failure lacked one). This person has genuine depth with coding agents. Not "used ChatGPT" — built with Claude Code or equivalent. Their practice level determines the team's trajectory.
- **Domain expertise + technical curiosity** for the rest. The "just enough technical background" pattern (F-Secure observation): not engineers, not pure business people. People with structured thinking who can steer agents. The finance person who automated bookkeeping with Claude. The tech director who went from slides to hosting platforms.
- **High agency.** Self-directed people who act without permission. The experience-first sequence depends on "person sees their own future → acts." That requires people who act.
- **Screen OUT:** People who need detailed instructions. People uncomfortable with ambiguity. People whose identity is tied to a specific technical skill that agents now do.

**The leader must be a practitioner.** Not a manager who "supports AI." A player-coach who writes specs, reviews agent output, and demonstrates daily. The research is brutal on this: "The leader's practice level determines team trajectory." A non-practicing leader produces individual gains, not team transformation. Shopify worked because Lutke uses the tools. Amazon Kiro failed because SVPs mandated tools they didn't use.

## The On-Ramp (Week 1-2)

**Deliver the WOW first. Not strategy. Not vision. The WOW.**

The validated sequence: WOW → competence → person sees future → acts. Don't explain what an AI-native team will be. Show them.

- **Day 1-2: CollabAI/MobAI session.** Everyone in a room, working on a REAL problem from your domain, with agents. Not a demo — hands-on. This is the WOW moment generator. It doesn't sustain (structurally non-replicating, requires facilitation) but it's the best ignition mechanism we've found. BCG data: 5+ hours hands-on = 79% regular users vs 67% without.

- **Day 3-5: Individual compound engineering.** Everyone gets their own Claude Code setup with a shared CLAUDE.md. Each person tackles their own domain problem solo. The seed practitioner is available but doesn't drive — they answer questions. This is where people discover what THEY can build. The finance person realizes she can replace Excel. The compliance person realizes she can automate quarterly reviews. The WOW becomes personal.

- **End of week 1: First SwarmAI session.** Same problem, everyone generates in parallel, group pools and evaluates. This is where collective learning explodes — 5 different prompting strategies and their outcomes, side by side. The group's collective judgment becomes the verification mechanism.

## The Working Model (Week 3+)

**Spec-driven leadership.** Level 3 convergence from cycle 74 — Karpathy, StrongDM, Spotify, Mollick, Osmani, 30+ frameworks all point the same way. The leader writes specifications in markdown. The team (human + agents) implements. Review is against the spec.

Daily rhythm:
1. **Leader writes/updates specs** — what to build, acceptance criteria, constraints
2. **Team generates in parallel** (SwarmAI mode) — each person steers agents on their piece
3. **Group evaluation** — pool outputs, collective judgment on quality, pick best approach
4. **Capture learnings** — compound engineering step: update CLAUDE.md, create new agents from patterns, each cycle improves the next

**Kill ceremonies pre-emptively.** AMPECO cancelled sprints, demos, and grooming when they went to daily shipping. Don't wait for ceremonies to feel obsolete — start without them. Replace with:
- 15-minute daily alignment (not standup — alignment on specs and blockers)
- Continuous shipping (not sprints)
- Automated tests as quality gate (not review meetings)

## The Verification Architecture (Week 4+)

**This is where most teams plateau and you won't.** The absorption bottleneck hits fast: agents generate faster than humans can evaluate. 95% right at overwhelming volume.

Build verification from day one:
1. **Level 1:** Human reviews everything (week 1-2, acceptable at small scale)
2. **Level 2:** Rule-based automated checks — brand guidelines, compliance rules, acceptance criteria as checkable assertions. Human reviews exceptions only. (Week 3-4 target)
3. **Level 3:** Agent-evaluates-agent — LLM judges achieve 80-85% agreement with humans at 500x cost reduction. Multi-agent review where agents play different roles (critic, domain expert, defender). (Month 2+ target)

**Don't skip levels.** Level 2 generates the data that trains Level 3. StrongDM's holdout scenarios (acceptance criteria the coding agent never sees, judged by a separate evaluator) are the gold standard.

## The Conditions Creator (Ongoing)

**Appoint one explicitly.** Not the team leader — someone whose job is the infrastructure of AI-nativeness:
- Maintain the MCP catalog, CLAUDE.md, shared prompt libraries
- Run weekly knowledge sharing (Varonis-style guild, but lighter)
- Find natural influencers in adjacent teams (PwC's network analysis approach)
- Measure peer spread, not training completion
- Step back as the team self-sustains

The 1:45 ratio from Citi suggests you need roughly 1 conditions creator per 45 people once you start spreading beyond the first team.

## What Will Go Wrong (Plan For It)

The research tells you the failure modes in advance:

| Failure mode | Source | How to prevent |
|---|---|---|
| Absorption overwhelm | Cycle 76 (Faros: 91% review time increase) | Build verification architecture from week 1, don't wait |
| "Humans ignore AI in group sessions" | Cycle 75 (MobAI red flag) | Move past CollabAI to SwarmAI quickly — everyone generates, nobody watches passively |
| Supervision paradox — skills atrophy | Anthropic observation | Rotate who writes specs vs. who reviews. Keep everyone's judgment sharp. |
| Tool adoption without transformation | Varonis (cycle 77 — downgraded) | Measure HOW work changes, not tool usage rates. 100% Copilot usage ≠ AI-native. |
| Mandate backlash | Shopify backlash, Amazon Kiro catastrophe | Leader practices first. Change decision structures, not performance reviews. |
| Solo genius, no spread | Every Inc limitation | SwarmAI sessions force collective learning. Don't let one person become the bottleneck. |

## The One Sentence Version

Find 3-5 high-agency people with one genuine seed practitioner, give them the WOW through hands-on experience (not slides), move fast from mob to solo to swarm, build verification infrastructure from day one, appoint a conditions creator to maintain the scaffolding, and kill every ceremony that doesn't survive contact with daily shipping.

---

## Evidence Sources (for fact-checking before publication)

| Claim | Source | Evidence level |
|---|---|---|
| Teams of 2-5 | Anthropic, Tesla, StrongDM, Every Inc, F-Secure | L2-L3 (convergence across 5+ cases) |
| Seed practitioner required | Compound Trigger Model (cycle 73) — 5/5 successes had seeds, 4/4 failures lacked them | L3 |
| Leader must practice | Shopify (worked), Amazon Kiro (failed), HBR 70% C-suite <1hr/week | L3 |
| WOW → competence → sees future → acts | Cycle 78 — 7 independent signals | L3 emerging |
| CollabAI as WOW generator | Cycle 75, practitioner experience across 2 sectors | L2 |
| SwarmAI parallel generation | Practitioner-originated concept, no external evidence yet | L1 |
| Spec-driven leadership | Cycle 74 — Karpathy, StrongDM, Spotify, Mollick, Osmani, 30+ frameworks | L3 |
| Absorption bottleneck | Cycle 76 — Faros 10K devs, DX 135K devs, DORA, CodeRabbit, 10+ sources | L3 |
| Verification 3-level progression | Rules-verification-scarcity meta-pattern | L4 |
| Conditions Creator role | Cycle 72 — Citi, PwC, Varonis, Microsoft/HBR, Mollick | L2 (approaching L3) |
| Agent-evaluates-agent 80-85% agreement | arXiv research, LLM-as-Judge literature | L2-L3 |
| AMPECO killed ceremonies | AMPECO practitioner blog | L2 |
| Varonis = tool adoption not transformation | Cycle 77 deep dive — suspicious scope | L2 (downgraded) |
| Amazon Kiro catastrophe | Medium practitioner analysis, multiple sources | L2 |

*Draft generated from Agents 102 research system, March 31, 2026. All claims require source URL verification before publication per content pipeline verification gate.*
