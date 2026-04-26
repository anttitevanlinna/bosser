# The Business Agent Architecture Gap

**Thesis:** There is no established architecture, practice, or shared mental model for building business agents. The coding agent world has solved this. The business agent world hasn't even named the problem.

---

## The gap

Coding agents have a clear architecture:

- **Tools:** File system, terminal, search, browser. Well-defined, well-understood.
- **Evaluation:** Run the tests. Compile the code. Does it work? Yes or no.
- **Iteration loop:** Generate → test → fix → test again. The feedback loop is tight and automatic.
- **Human role:** Code review. Clear, bounded, familiar.
- **Frameworks:** Claude Code, Cursor, Copilot, Codex. Mature, documented, widely adopted.
- **Mental model:** Everyone who codes already understands what a coding agent does — it does what they do, faster.

Business agents have none of this:

- **Tools:** What tools does a procurement agent need? A compliance agent? A financial reconciliation agent? There is no standard toolkit. Every deployment invents its own.
- **Evaluation:** What's the equivalent of "run the tests" for a customer service agent? For a contract review agent? Business output has no compiler. Quality is judgment, not boolean.
- **Iteration loop:** There is no tight feedback loop. Business processes produce outcomes over days and weeks, not milliseconds. The agent writes a procurement email — did it work? You won't know for a month.
- **Human role:** Where does the human sit? It's not code review. It's not approval/rejection. It's something new — and nobody has named it or designed patterns for it.
- **Frameworks:** Nothing. Every business agent deployment is custom. There are no shared patterns, no reference architectures, no "here's how you build a finance agent."
- **Mental model:** The business professional has no mental model for what an agent does. Not because they're slow — because nobody has given them one. The coding agent maps onto an existing practice (writing code). The business agent maps onto... what?

## The two false archetypes

When people try to understand business agents, they reach for the two things they already know. Both are wrong — and believing either one blocks the real architecture from forming.

### False archetype 1: The chatbot

"We'll give people an AI they can chat with." This is the default enterprise response. It's not an agent. It's a conversation.

Chatting is not building. A person typing questions and reading answers is using a search engine with better prose. No tools. No autonomy. No multi-step work. No judgment. The AI answers — the human still does all the work.

The chatbot archetype is seductive because it's safe. Nobody gets fired for deploying a chatbot. But it also produces nothing that compounds. Every conversation starts from zero. There is no memory, no learning, no capability that builds on itself. The chatbot doesn't do work — it assists a human who is doing work. That's a copilot at best, and a fancy FAQ at worst.

The test: **Is the AI doing multi-step autonomous work with tools?** If a human has to read the output and then go do the actual task, it's a chatbot, not an agent. The business world is flooded with chatbots marketed as agents. This is the single biggest source of confusion — and the reason most enterprises think they "have agents" when they have chat interfaces.

### False archetype 2: The workflow automation tool

"We'll build it in n8n / Zapier / Make / Power Automate." This is the second default. It's also not an agent. It's a flowchart.

Workflow automation tools are deterministic pipelines: if this, then that, then this. They are powerful for what they do — connecting systems, moving data, triggering actions. But they lack everything that makes an agent an agent:

- **No autonomy.** The workflow follows a fixed path. It cannot decide to take a different approach when the first one fails. It cannot reason about what to do next. Every branch must be pre-defined by a human.
- **No learning.** The workflow does the same thing the thousandth time as the first time. It does not get better. It does not adapt to new patterns. It does not accumulate judgment.
- **No adaptability.** When the business process changes — a new regulation, a new vendor, a new approval step — someone must manually rewire the workflow. The tool cannot adapt on its own.
- **No composability.** Workflows are brittle chains. You cannot easily combine two workflows into a larger capability. You cannot have one workflow reason about another. They don't compose — they concatenate.

The workflow automation archetype is seductive because it feels like building. You drag boxes, draw arrows, connect APIs. It looks like architecture. But it produces rigid pipelines, not adaptive systems. The "agent" built in Zapier is an automation — useful, but fundamentally different from an agent that reasons, adapts, and exercises judgment.

The test: **Can it handle a situation its builder didn't anticipate?** An agent reasons through novel situations. A workflow fails or follows the wrong branch. This is the categorical difference.

### Why the false archetypes matter

When an organization believes it has "deployed agents" but has actually deployed chatbots and workflow automations, it draws the wrong conclusions:

- "We tried agents, they didn't deliver much" — because they didn't try agents.
- "Agents are just chatbots with extra steps" — because that's all they built.
- "Our automation team can handle this" — because they mapped it onto tools they already know.

The real business agent sits in the space between these two: it reasons like the LLM behind the chatbot, but it acts like the automation tool. It has tools. It has autonomy. It adapts. It exercises judgment. And nobody has the architecture for building that thing in a business context.

## Why this gap exists

Three reasons:

**1. The builders and the users are different populations.**

Coding agents were built by developers, for developers. The person building the tool understood the domain perfectly — because it was their own domain. The mental model transferred naturally.

Business agents are built by developers, for business professionals. The builder doesn't understand procurement. The procurement person doesn't understand agents. Nobody holds both sides of the equation. The architecture can't emerge because the person who could design it doesn't exist yet — or is extremely rare.

**2. Business processes are made of judgment, not logic.**

Code has right answers. Tests pass or fail. Business processes are judgment calls wrapped in context wrapped in relationships. "Should we approve this vendor?" is not a boolean question. It depends on risk appetite, relationship history, market conditions, regulatory environment, and six other things that live in people's heads, not in databases.

An architecture for business agents must handle judgment — and nobody has figured out how. The trust gradient (read-only → advisory → autonomous) is a start, but it's a governance model, not an architecture.

**3. There is no shared language.**

When developers talk about coding agents, they share vocabulary: tools, context windows, system prompts, function calling, chain of thought. When business professionals encounter agents, they have no vocabulary. They reach for what they know — "chatbot," "automation," "RPA" — and every analogy is wrong. A chatbot answers questions. An agent does work. RPA follows scripts. An agent reasons.

Without shared language, there can be no shared architecture. The practice can't develop because practitioners can't talk to each other about what they're building.

## What the architecture needs to include

This is speculative — the architecture doesn't exist yet. But based on what we've seen in early deployments, it needs to address:

### The tool question
What does a business agent connect to? Not file systems and terminals — ERP systems, email, calendars, CRM, document management, approval workflows. These integrations don't exist as clean APIs. They exist as enterprise middleware, legacy systems, and manual processes. The tool architecture for business agents is an integration architecture — and integration is the hardest problem in enterprise software.

### The evaluation question
How do you know a business agent did good work? Not "did it execute correctly" but "did it make a good judgment call?" This requires:
- Domain-specific evaluation criteria (what does "good" mean in procurement vs. compliance vs. HR?)
- Human evaluation patterns (who reviews, how often, what do they look for?)
- Outcome tracking over time (the agent's decision today produces results in 3 months — how do you close that feedback loop?)

### The judgment architecture
Where does human judgment sit in relation to agent reasoning? Not "human in the loop" as a checkbox — as an actual architecture. When does the agent decide alone? When does it draft and wait? When does it flag and escalate? These thresholds are domain-specific, context-dependent, and evolving. The architecture needs to handle all three.

### The trust gradient
How does an organization move from "the agent shows us what it would do" to "the agent does it and we review" to "the agent does it and we spot-check"? This is a progression, not a switch. It requires:
- Measurable trust levels
- Clear criteria for advancing trust
- Rollback mechanisms when trust is violated
- Domain-specific trust calendars (compliance moves slower than marketing)

### The mental model transfer
How do you give a business professional a mental model for what an agent is and does — without requiring them to become a developer? This is the pedagogical challenge. The coding world solved it accidentally (developers already had the model). The business world needs it solved deliberately.

## Why this matters for Agents 102

This gap IS our curriculum. Modules 1-3 build the mental model. Modules 4-6 add the disciplines (security, quality, evals) that business agents need but have no established patterns for. Module 7 confronts the platform reality. Module 8 shows the flywheel.

But more than the curriculum — this gap is the market. The consultancies are selling "agentic enterprise" frameworks without having built a business agent. The vendors are shipping "AI agents" that are chatbots with better marketing. The developers are building coding agents for developers.

Nobody is systematically teaching business professionals how to architect, build, evaluate, and govern business agents. That's the gap. That's what we fill.

## The practitioner's advantage

We've built business agents. The research system in this project is a business agent — it does multi-step autonomous research work, evaluates sources, synthesizes findings, and produces structured output. The curriculum exercises are business agent exercises — participants build agents that do business work, not coding work.

The architecture will emerge from practice, not from frameworks. It will be discovered by people building business agents, failing, adjusting, and building again. The consultancy that publishes the "Business Agent Architecture Framework" without having built one will produce the same result as every other framework-without-practice: governance of an abstraction.

We practice first. The architecture comes from what we learn.
