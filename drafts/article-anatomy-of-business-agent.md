# The Anatomy of a Business Agent Project

**Draft article — how business agents actually get built with Claude Code.**

---

## The starting point: agents are only as good as their information

This has always been true, and most people have always known it. An agent without accurate, structured information is just an LLM guessing. It might guess well — but guessing is not what you want from a system that does real work.

The information is broad. It can be numbers. It can be knowledge. It can be customer feedback, market analysis, regulatory requirements, competitive positioning, internal strategy documents. Whatever the domain, whatever the goal — the information is where everything starts.

This is what separates a business agent from a chatbot. A chatbot takes whatever you type and responds. A business agent works from a curated body of information that has been deliberately assembled, verified, and structured for a specific purpose. The information is not incidental — it is the foundation.

---

## Phase 1: Information curation

Before you build the agent, you build the information it will work from.

This is the phase most people skip — and it's why most business agents produce mediocre output. They connect an LLM to a database or a document folder and say "go." The result is an agent that knows everything and understands nothing, because the information was never curated for the task.

With Claude Code, Phase 1 looks like this:

**You feed it everything relevant to the goal.** Articles. Strategy documents. Customer comments. Trade publications. Market research. Competitive analysis. Internal memos. Financial data. Whatever is pertinent — you bring it in.

**Claude Code reads, stores, and structures it.** Not as a dump of raw text — as organized, goal-oriented information. It extracts what matters, identifies gaps, flags contradictions, and builds a structured knowledge base that serves the specific purpose you're building toward.

**The goal shapes the curation.** This is critical. You don't curate information in the abstract — you curate it for something. The goal determines what's relevant, what's missing, and how the information should be organized.

### Example: A roadmap drafting agent

Say the goal is an agent that drafts product roadmaps. Phase 1 means curating three bodies of information:

1. **Market information.** What's happening in the market? Competitor moves, technology shifts, customer behavior changes, regulatory developments. Not a generic market report — the specific market dynamics that affect roadmap decisions.

2. **Customer information.** What are customers saying, asking for, complaining about? Direct feedback, support tickets, sales conversations, churn reasons, feature requests. The voice of the customer, structured for roadmap relevance.

3. **Business strategy.** Where is the company going? Strategic priorities, resource constraints, revenue targets, partnership commitments, technical debt decisions. The internal context that shapes what's possible and what matters.

Each of these is a Claude Code session. You point it at the sources, give it the goal, and let it read, extract, and structure. The output is not a summary — it is a structured information base that the agent will work from.

### What makes this different from "just uploading documents"

Three things:

- **Curation is active, not passive.** You don't dump files into a folder. You make deliberate choices about what goes in, challenge Claude Code to find gaps, and iterate until the information base is complete for the purpose.
- **Structure serves the goal.** The information isn't organized by source — it's organized by how the agent will use it. Market dynamics grouped by their roadmap implications. Customer feedback clustered by theme and urgency. Strategy distilled into decision constraints.
- **Quality is verified.** Contradictions are surfaced. Outdated information is flagged. Gaps are named explicitly — "we don't have data on X" is more valuable than pretending X doesn't matter.

Phase 1 is not a preliminary step you rush through to get to the "real" work. Phase 1 IS the work. The quality of the agent's output is determined here — everything after this is architecture and execution on top of the information you've curated.

---

## Phase 2: Goal definition

You arrive at Phase 1 with a vague idea of what you want to build. That's fine — you need the vague idea to know what information to curate. But the real goal is born inside the context you built in Phase 1.

This is the crucial sequence: information first, then goals. Not the other way around. When you define goals before understanding the information landscape, you get aspirational goals disconnected from reality. When you define goals after curating the information, the goals are grounded — shaped by what you actually know, what's actually available, and what's actually possible.

With Claude Code, Phase 2 is a conversation. You have the curated context from Phase 1 sitting in your project directory. You open a session and talk through what the system should accomplish — with Claude Code reading the context as you discuss. The goal emerges from the dialogue between your intent and the information reality.

### A system, not a single goal

Here's what practice teaches you: a single goal rarely captures what a real business system needs to do. A roadmap drafting agent doesn't just "draft roadmaps." It might have four goals, in priority order:

1. **Synthesize market and customer signals** into a structured view of what matters now.
2. **Draft roadmap candidates** that align with business strategy and resource constraints.
3. **Surface trade-offs explicitly** — what you're choosing and what you're giving up.
4. **Maintain a living context** that updates as new information arrives.

Four goals. Priority-ordered. Each one specific enough to build toward, broad enough to allow the agent judgment in how it gets there.

The world doesn't fit a single goal. A compliance monitoring system might need to: (1) track regulatory changes, (2) assess impact on current operations, (3) draft response recommendations, (4) maintain audit trail. These are related but distinct — and the priority order matters because it tells the agent what to optimize for when goals conflict.

### What you produce

Phase 2 produces goal files — markdown documents in your project that state what the system is for. Not feature specs. Not user stories. Goals: what the system accomplishes, in what priority, with what constraints.

These goal files become part of the stable context that Phase 3 builds on.

---

## Phase 3: Procedures, guardrails, and the plan

Phase 1 gave you context. Phase 2 gave you goals. Phase 3 is the plan: how does the system get from the information to the goals?

This is where you establish:

- **Processes.** What steps does the agent follow? In what order? What's the workflow — not as a rigid Zapier pipeline, but as a described approach the agent can reason within?
- **Procedures.** How does the agent handle specific situations? When it finds contradictory information, what does it do? When it's uncertain, does it flag or decide? These are the operational rules.
- **Guardrails.** What must the agent never do? What boundaries does it operate within? Guardrails are not suggestions — they are hard constraints. "Never send external communications without human review." "Never use data older than 30 days for financial projections." "Always cite sources."
- **Quality criteria.** What does good output look like? Not in the abstract — specifically. For the roadmap agent: "Every recommendation must reference at least one customer signal and one strategic priority." For the compliance agent: "Every regulatory change must be linked to the specific internal process it affects."

With Claude Code, Phase 3 often uses plan mode — you describe what the system needs to do, and Claude Code helps you think through the procedures, identify edge cases, and structure the guardrails. But the human drives. The procedures reflect your domain expertise, your organization's standards, your judgment about what matters.

### Everything is stored as markdown

This is the key architectural point: Phases 1, 2, and 3 all produce markdown files in directories. The context is `.md` files. The goals are `.md` files. The procedures and guardrails are `.md` files. Nothing is hidden in a database, locked in a platform, or encoded in a proprietary format.

The entire foundation of the business agent is readable, editable, version-controlled text. Anyone can open it, understand it, challenge it, improve it. The CLAUDE.md file ties it together — telling Claude Code where to find the context, what goals to pursue, and what guardrails to respect.

This is the architecture the business world has been missing. Not a platform. Not a workflow tool. A directory of structured text that an LLM-based agent can read, reason about, and act on — with full human visibility into every piece.

```
project/
├── CLAUDE.md              ← the agent's operating instructions
├── context/               ← Phase 1: curated information
│   ├── market/
│   ├── customers/
│   └── strategy/
├── goals/                 ← Phase 2: what the system accomplishes
│   ├── goal-1-synthesize.md
│   ├── goal-2-draft.md
│   ├── goal-3-tradeoffs.md
│   └── goal-4-maintain.md
├── procedures/            ← Phase 3: how the agent works
│   ├── processes.md
│   ├── guardrails.md
│   └── quality-criteria.md
└── output/                ← what the agent produces
```

Three phases. All stable. All stored. All human-readable. This is the foundation — and everything the agent does from here builds on it.

---

## Phase 4: Try it out

Now you run it. Context is curated. Goals are defined. Procedures and guardrails are written. The CLAUDE.md ties it together. You open Claude Code and let the system work.

It will fail.

Not maybe. Not sometimes. It will fail. The first run will produce something that resembles what you wanted — close enough to see the shape, far enough to see the problems. This is not a setback. This is the method.

### The failures are the information

The problems that surface in Phase 4 are the most valuable output of the entire process so far. They tell you things that no amount of planning could have revealed:

- The procedures assumed a sequence that doesn't work in practice.
- The guardrails are too tight in one area and missing entirely in another.
- The agent interpreted a goal differently than you intended — and sometimes its interpretation was better.
- Information you thought was complete has gaps you couldn't see until the agent tried to use it.
- Two goals contradict each other in edge cases you didn't anticipate.

These failures are your friend. Every one of them is a specific, actionable insight about what needs to change. Not abstract — concrete. "The agent produced a roadmap that ignored the Q3 resource constraint because the strategy context didn't specify headcount limits." That's a gap you can fix in five minutes. You would never have found it by thinking harder about Phase 1.

### How to try it

Any structured thinking method works. First principles. Hypothesis testing. Just running it case by case. The point is: do it, observe what happens, and take notes.

With Claude Code, Phase 4 is a session where you:

1. **Run the system against a real task.** Not a test case — a real piece of work you actually need done. The roadmap agent drafts a real roadmap. The compliance agent reviews a real regulatory change.
2. **Read the output critically.** Not "is it good?" but "where did it go wrong, and why?" The why matters more than the what — it tells you which phase to fix.
3. **Review the session.** Look at how Claude Code reasoned through the task. Where did it make judgment calls? Were they the right ones? Where did it get stuck? Where did it confidently produce something wrong?

---

## Phase 5: Learn and revise

Phase 4 produces failures. Phase 5 turns those failures into improvements. This is the OODA loop applied to the system itself.

### Revise at the right level

The failures from Phase 4 point backward to the phase where the problem originated:

**Procedure failures → revise Phase 3.** The agent followed the wrong process, applied the wrong guardrail, or missed a quality criterion. Fix the procedures. Tighten the guardrails. Add the missing criterion. This is the most common type of revision — and the cheapest to make.

**Goal failures → revise Phase 2.** The goals are impossible, contradictory, or not ranked correctly. The agent optimized for Goal 2 at the expense of Goal 1 because the priority wasn't clear. Or a goal that seemed important turns out to be irrelevant once you see the system in action. Change the goals. Re-prioritize. Drop the goal that doesn't serve the real purpose.

**Context failures → revise Phase 1.** The information base is missing something critical. The agent couldn't make a good judgment because it didn't have the data. Or the information is there but structured wrong — organized by source when it should be organized by decision type. Go back and curate what's missing. Restructure what's misaligned.

### Double learning

The important discipline: don't just fix what broke. Ask whether the failure reveals something about the levels above it.

A procedure failure might reveal that the goal was wrong. A goal failure might reveal that the context was incomplete. The levels are connected — a fix at one level often exposes a needed fix at another.

This is what separates a learning loop from a debugging loop. Debugging fixes the symptom. Learning fixes the cause — and then checks whether the cause has a cause.

### The cycle continues

Phases 1-3 were never done correctly the first time. They were done well enough to reach Phase 4 — which is exactly right. The point of doing 1-3 imperfectly is to get to 4 quickly, where the real learning happens.

After Phase 5, you go back to Phase 4. Try it again. New failures surface — fewer, different, more subtle. Revise again. Each cycle produces a system that is more reliable, more aligned with the actual work, and more trusted by the people who use it.

```
Phase 1 (Context) → Phase 2 (Goals) → Phase 3 (Procedures)
    ↑                    ↑                    ↑
    └────────────────────┴────────────────────┘
                    Phase 5 (Learn & Revise)
                         ↑
                    Phase 4 (Try It Out)
                         ↓
                    [failures = information]
```

This is the anatomy. Not a linear build-and-deploy. A learning loop where the system gets better because the failures are specific and the revisions are targeted. The architecture is not the directory structure — it's this cycle.

---

## That's it

Five phases. Surprisingly simple.

You accumulate knowledge in directories. Context files, goal files, procedure files, guardrail files — tens of them, sometimes hundreds. All markdown. All readable. All version-controlled. Then you run it with Claude Code.

That's the architecture of a business agent. Not a platform. Not a framework. Not a workflow tool. A directory of structured text and an LLM that can read it, reason about it, and act on it.

### Two modes of running

**Interactive: human in the seat.** You open Claude Code, give it the task, and watch it work. You steer. You catch mistakes. You redirect when it goes off track. This is how you start — Phase 4 is always interactive. You need to see what the system does before you trust it to do it alone.

**Headless: the agent runs autonomously.** Claude Code runs without a human watching every step. It reads the context, follows the procedures, respects the guardrails, and produces output. A human reviews the output — not the process. This is where the system goes once you've cycled through Phases 4 and 5 enough times to trust it.

The progression from interactive to headless is the trust gradient. It doesn't happen by decree — it happens because you've seen the system work, fixed its failures, and built confidence through cycles of trying and revising.

### Why file-based RAG wins

This isn't an accident. The Anthropic team building Claude Code noticed it early. As Boris Cherny put it: "we noticed file-based RAG with bash tools beats other solutions."

Two reasons:

**Zero dependencies.** No vector database. No embeddings pipeline. No framework. No SaaS platform. No infrastructure team. Just files. The barrier to entry is "can you create a directory." Everything you need ships with every operating system ever made — a file system and a text editor. Compare this to the typical enterprise RAG stack: vector DB (Pinecone, Weaviate, Chroma), embedding model, chunking strategy, retrieval pipeline, re-ranking, prompt assembly. Each component is a failure point, a vendor dependency, and a maintenance burden. Files have none of this.

**LLMs are trained on text. Text files play to their strongest capability.** Claude Code reads and writes text. That's what it does best — by a wide margin. When your entire agent architecture IS text files, you're working with the grain of the model. Every other retrieval approach adds translation layers: text → embeddings → vectors → similarity search → retrieved chunks → reassembled context. Each translation loses information. File-based RAG skips all of it. The model reads the file. That's the retrieval.

This also explains why the architecture is so accessible. You don't need to understand embeddings, vector similarity, or retrieval pipelines. You need to understand directories and text files. A procurement manager can open the context files, read them, and understand exactly what the agent knows. Try doing that with a vector database.

### Who else is building this way

We ran a research pass in March 2026 to find other practitioners applying the same pattern. The question: is this a convergent practice or a solo discovery?

**The building blocks are converging. The full architecture is not.**

At least 10-15 independent practitioners are building file-based business agent systems in Q1 2026. The convergent pattern: markdown files as the brain, Claude Code as the runtime, no application code, no database, everything human-readable and version-controlled.

Six named practitioners:

- **Brad Feld** runs an entire company from ~2,000 lines of markdown across 12 skill files (CompanyOS). Connected to 8 external systems. Has a weekly telemetry loop that measures skill usage. The closest match — but the improvement is metrics-driven, not architecture-driven. He measures what the system does, not which phase of the architecture needs fixing.

- **Obie Fernandez** built a CTO operating system at ZAR — 11,579 lines of organizational knowledge in 3 weeks. Folders for context, decisions, meetings, playbooks, team. The context accumulates over time. But the structure emerged bottom-up (Claude designed the folder layout) rather than being deliberately architected.

- **Mohit Tater** built a freelance business co-pilot from five markdown files. Has an `/improve-system` command where Claude suggests updates to the system's own files. This is the closest anyone has come to a "learn and revise" phase — the system explicitly modifies itself based on experience. But it's ad-hoc ("when something feels off"), not systematic.

- **Seth Levine** runs his VC operations from a terminal using Brad Feld's CompanyOS. Drafting legal emails, analyzing fee proposals, managing calendar. User of the pattern, not architect of it.

- **Emily Kramer (MKT1)** packages marketing frameworks as Claude Code skills for non-technical marketers. Domain-specific knowledge in markdown files. No learning loop.

- **Othman Adi** built a planning-with-files system — persistent markdown for task plans, findings, and progress. Philosophy: "context windows are volatile like RAM; filesystem is persistent." But this is persistence, not learning.

The broader trend confirms the technical foundation. Academic research (McMillan, 9,649 experiments across 11 models) shows frontier models benefit from filesystem-based context retrieval. Trade publications document the shift from complex retrieval stacks to simple file reading.

**What nobody has articulated:** The five-phase lifecycle. Specifically: deliberate information curation as a prerequisite phase before defining goals. Goals emerging from context, not before it. A systematic learning loop where failures diagnose which phase — context, goals, or procedures — needs revision.

Everyone else either treats files as a productivity tool (make my day more efficient) or lets structure emerge organically. Nobody has described the architecture as a designed learning system that gets smarter through targeted revision.

**What this means:** The timing window is 6-12 months. The skills ecosystem is growing fast. Someone will eventually articulate the learning loop. But right now, the gap between "markdown files make agents smart" (convergent) and "here's the lifecycle that makes them learn" (not yet converging) is real — and it's the gap where the actual value lives.

### Why this is the missing architecture

The business world has been looking for the business agent architecture in the wrong places. They looked at platforms — Salesforce AgentForce, ServiceNow, Microsoft Copilot Studio. They looked at workflow tools — n8n, Zapier, Make. They looked at agent frameworks — LangChain, CrewAI, AutoGen.

The architecture was never a platform. It was never a tool. It was a practice:

1. Curate the information.
2. Define the goals.
3. Write the procedures and guardrails.
4. Try it out.
5. Learn and revise.

Files in directories. An LLM that reads them. A human who steers the learning. That's the whole thing.

The reason nobody found it is that it's too simple to sell. You can't package "write markdown files and iterate" as an enterprise platform. You can't charge a license fee for directories. You can't build a vendor ecosystem around text files.

But simplicity is the point. The architecture is simple so that the hard part — the domain knowledge, the judgment, the learning — stays with the people who have it. The business professionals. The ones who know what a good procurement decision looks like, what a compliant process requires, what a customer actually needs.

The technology serves them. Not the other way around.

### Bonus: what you get for free

Two things that fall out of the file-based architecture that you didn't plan for but turn out to matter enormously:

**Multi-agent is just reading and writing shared files.** You don't need a multi-agent framework. You don't need message passing, event buses, or orchestration layers. One agent writes its output to a file. Another agent reads that file as input. Files are the information transmission method. A market research agent writes findings to `context/market/`. A roadmap agent reads from that directory. They don't need to know about each other. They don't need to be coordinated. They share a file system. That's the coordination mechanism — the same one that has worked for every collaborative system since the invention of shared directories. When you want to add a third agent, you add a third directory. No framework changes. No protocol upgrades. No integration work.

**Multi-user is Dropbox.** This sounds too simple to be true, but it works. Put the project directory in Dropbox, OneDrive, or any file sync service. Multiple people can now work with the same agent context. One person curates market information. Another updates customer feedback. A third refines the guardrails. Each person opens Claude Code in their synced copy of the directory. The agents read the same context files. The learning accumulates in the same place. You will be surprised, but it works — because the architecture is just files, and we solved multi-user file collaboration twenty years ago. No shared database. No access control system. No SaaS platform with seat licenses. A synced folder.
