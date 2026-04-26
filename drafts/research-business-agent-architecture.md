# Research: Who Else Is Building Business Agents on File-Based Architecture?

**Research date:** 2026-03-08
**Research method:** People-first, 3 search rounds, OODA structure
**Question:** Is Antti's five-phase business agent architecture (curate context → define goals → procedures/guardrails → try it → learn/revise, all in markdown files) a convergent pattern or genuinely ahead?

---

## Executive Summary

**The file-based architecture pattern IS converging — but not Antti's full five-phase lifecycle.**

What's converging (Level 3 — 10+ independent practitioners):
- Markdown files as the "brain" of business agents (skills, rules, context)
- Claude Code / Cursor as the runtime for non-coding business work
- Persistent context that accumulates across sessions
- Human-readable, version-controlled, editable by anyone

What is NOT converging (Antti appears ahead):
- The deliberate five-phase lifecycle (curate → goals → procedures → try → learn)
- Information curation as a distinct, prerequisite phase BEFORE building
- The explicit learning loop where failures point back to which phase needs fixing
- The architecture as an organizational learning system, not a personal productivity tool

Most practitioners discovered the file pattern bottom-up ("I put markdown files in a directory and Claude got smart") rather than top-down ("I designed a learning architecture and files are the implementation"). This is the key difference.

---

## Named Practitioners Found

### 1. Brad Feld — CompanyOS (Adventures in Claude)
**Proximity to Antti's architecture: 7/10**

- **What he built:** CompanyOS — a skills-only system (no application code) that runs an entire company from ~2,000 lines of markdown across 12 skill files, 5 commands, 2 agents. Connected to 8 external systems via MCP (Linear, Gmail, Calendar, Help Scout, Notion, Sentry, Stripe, Granola).
- **Architecture:** Each skill is a single markdown file with 7 sections: frontmatter, when to use, context, process, output format, guardrails, standalone mode. Deliberate "skills only" constraint — no orchestration layer.
- **Learning element:** Has a `co-feedback` command that runs weekly pattern analysis on skill usage telemetry. Measures itself. But this is operational metrics, not the "failures point to which phase needs fixing" loop.
- **What's similar:** Files as the brain, guardrails in markdown, human-readable, version-controlled, business operations (not coding).
- **What's different:** No explicit information curation phase. No "goals emerge from context" design. More operational (run the business) than strategic (learn and improve the system). The improvement is telemetry-driven, not architecture-driven.
- **Source:** [Running a Company on Markdown Files](https://adventuresinclaude.ai/posts/2026-02-21-running-a-company-on-markdown-files/) [practitioner direct]
- **Evidence level:** Level 2 (single experiment, well-documented)

### 2. Seth Levine — VC running daily operations from terminal
**Proximity to Antti's architecture: 5/10**

- **What he built:** Uses CompanyOS (Brad Feld's system) to run his VC work from a terminal — drafting legal emails, analyzing fee proposals, managing calendar, apartment research.
- **Architecture:** Same CompanyOS structure. Skills + rules + agent definitions in markdown.
- **Learning element:** Not described. Productivity-focused — batch processing work while on calls.
- **What's similar:** Non-coding business operations via markdown files. Cognitive overhead reduction through unified context.
- **What's different:** User of the pattern, not architect. No learning loop described. Productivity tool, not organizational learning system.
- **Source:** [Running My Day From a Terminal Window](https://sethlevine.com/archives/2026/02/running-my-day-from-a-terminal-window.html) [practitioner direct]
- **Evidence level:** Level 2 (single experiment)

### 3. Obie Fernandez — CTO Operating System at ZAR
**Proximity to Antti's architecture: 6/10**

- **What he built:** A markdown-based CTO operating system. Folder structure: context/, decisions/, drafts/, journal/, meetings/, actions/, notes/, playbooks/, priorities/, projects/, recruiting/, reference/, team/. 11,579 lines of organizational knowledge in 3 weeks.
- **Architecture:** Let Claude design the folder structure (unlike Antti who designed the architecture deliberately). System captures information as side effect of natural conversation — "always listening, always organizing."
- **Learning element:** Context accumulates over time. Can reference decisions from weeks ago, compare 1:1 notes, surface patterns. But the learning is implicit (knowledge accumulation) rather than explicit (failures → diagnose → fix specific phase).
- **What's similar:** Markdown files as organizational knowledge. Persistent context across sessions. Version-controlled. Real business operations (82 meeting notes, 23 team members).
- **What's different:** Bottom-up emergence (Claude designed the structure) vs. top-down architecture. No explicit curation-before-goals phase. No deliberate learning cycle. Personal CTO tool, not a replicable organizational pattern.
- **Source:** [Building a Personal CTO Operating System with Claude Code](https://obie.medium.com/building-a-personal-cto-operating-system-with-claude-code-b3fb9c4933c7) [practitioner direct]
- **Evidence level:** Level 2 (single experiment, measurable outcomes)

### 4. Mohit Tater — Business Co-Pilot for Freelancer
**Proximity to Antti's architecture: 6/10**

- **What he built:** Five markdown files in a folder: CLAUDE.md (instructions), Goals.md, Life-Context.md, Dashboard.md, Plan.md, Log.md. Manages freelance business — revenue goals, daily planning.
- **Architecture:** Explicitly file-based. Five files, no complex software. Has an `/improve-system` command where Claude suggests updates to the files themselves.
- **Learning element:** The `/improve-system` command is the closest to Antti's "learn & revise" phase found in any practitioner. The system explicitly improves itself by modifying its own files.
- **What's similar:** Files-only architecture. Goals in files. Self-improvement loop. Context-first approach (Life-Context.md).
- **What's different:** Solo freelancer scale, not organizational. No explicit five-phase lifecycle. The improvement is ad-hoc ("when something feels off") rather than systematic (failures diagnose which phase to fix).
- **Source:** [I Built a Business Co-Pilot Using Claude Code](https://medium.com/@tatermohit/i-built-a-business-co-pilot-using-claude-code-heres-the-exact-system-cfe32ee59558) [practitioner direct]
- **Evidence level:** Level 2 (single experiment)

### 5. MKT1 / Emily Kramer — Marketing Skills for Claude Code
**Proximity to Antti's architecture: 4/10**

- **What they built:** Marketing frameworks (channel strategy, positioning, GACCS Briefs) packaged as Claude Code skills/plugins. Marketers building agents for non-coding work.
- **Architecture:** Skills as markdown files with domain knowledge. Designed for non-technical users.
- **Learning element:** Not described. Framework application, not learning loop.
- **What's similar:** Non-coding business domain. Markdown-based skills. Business practitioners, not developers.
- **What's different:** Framework application (apply MKT1 frameworks) rather than learning architecture. No curation phase, no iterative improvement cycle.
- **Source:** [What 4 Gen Marketers Are Building with Claude Code](https://newsletter.mkt1.co/p/real-marketers-claude-code-builds) [practitioner direct]
- **Evidence level:** Level 2 (multiple practitioners, single domain)

### 6. Othman Adi — Planning With Files (Manus-style)
**Proximity to Antti's architecture: 5/10**

- **What he built:** Claude Code skill implementing persistent markdown planning. task_plan.md for phases/progress, findings.md for research, progress.md for session logs. Philosophy: "context windows are volatile like RAM; filesystem is persistent — anything important gets written to disk."
- **Architecture:** Files as working memory. Overcomes context window limits by externalizing state to disk.
- **Learning element:** Session recovery and progress tracking. But no explicit learning-from-failure loop.
- **What's similar:** Files as persistent state. Planning before execution. Phase-structured approach.
- **What's different:** Primarily for coding/development workflows. No business domain application. No learning cycle — it's persistence, not learning.
- **Source:** [GitHub: planning-with-files](https://github.com/OthmanAdi/planning-with-files) [practitioner direct]
- **Evidence level:** Level 2 (open-source tool, adoption unclear)

---

## The Broader Pattern: Context Engineering as a Discipline

Beyond individual practitioners, "context engineering" is emerging as a recognized discipline in 2026:

- **Damon McMillan (academic):** 9,649 experiments across 11 models and 4 formats (YAML, Markdown, JSON, TOON) showing that frontier models benefit from filesystem-based context retrieval. Markdown is effective for structured agent context. [Source: arxiv.org/html/2602.20478v1] [academic/research]

- **The New Stack (trade):** Published "The case for running AI agents on Markdown files instead of MCP servers" — documenting the skills-vs-MCP architectural debate. Skills (markdown files) replace bloated MCP servers, cutting token costs by ~100x for some operations. [Source: thenewstack.io/skills-vs-mcp-agent-architecture/](https://thenewstack.io/skills-vs-mcp-agent-architecture/) [domain trade publication]

- **Arize (practitioner analysis):** "AI Agent Interfaces in 2026: Filesystem vs API vs Database" — concluding that filesystem wins by default because "everything else is worse" and the education already happened during pretraining. [Source: arize.com/blog/agent-interfaces-in-2026-filesystem-vs-api-vs-database-what-actually-works/](https://arize.com/blog/agent-interfaces-in-2026-filesystem-vs-api-vs-database-what-actually-works/) [practitioner analysis]

- **Anthropic (Cowork platform):** Launched Cowork in January 2026 — bringing Claude Code's skills/plugins pattern to non-developer knowledge workers. Skills, connectors, slash commands, and sub-agents bundled into plugins for business operations. [Source: claude.com/blog/cowork-plugins-across-enterprise](https://claude.com/blog/cowork-plugins-across-enterprise) [vendor — Level 0 for claims, noted for platform direction]

- **AGENTS.md files:** Associated with 29% reduction in median runtime and 17% reduction in output tokens across Claude Code projects. 72.6% of Claude Code projects specify application architecture in these files. [Source: medium.com/data-science-collective](https://medium.com/data-science-collective/the-complete-guide-to-ai-agent-memory-files-claude-md-agents-md-and-beyond-49ea0df5c5a9) [SOURCE NEEDED — original study not found]

---

## Analysis: What's Converging vs. What's Unique

### Convergent Pattern (Level 3 — 10+ independent signals)

**"Markdown files as the brain of business agents"** is a confirmed convergent pattern. At least 10-15 independent practitioners are building file-based agent systems for non-coding business work. The pattern includes:

1. Markdown files for instructions, context, and guardrails
2. Claude Code (or similar) as the runtime
3. Skills/rules that the agent loads contextually
4. No application code, no web UI, no database
5. Version-controlled, human-readable, editable

This convergence accelerated in Q1 2026, driven by Claude Code's skills mechanism and Anthropic's Cowork launch. The pattern is moving from developer-only to business-user-accessible.

### Not Yet Convergent — Where Antti Appears Ahead

**The five-phase lifecycle as an organizational learning architecture** has no clear parallel found:

| Phase | Antti's Architecture | Closest Parallel Found |
|-------|---------------------|----------------------|
| 1. Information curation (before building) | Deliberate, prerequisite phase | Obie's context/ folder (emergent, not deliberate) |
| 2. Goals emerge from context | Context-first design | Mohit's Goals.md (but goals written independently) |
| 3. Procedures & guardrails as files | Explicit, maintained | Brad's skill guardrails section (within skills, not separate) |
| 4. Try it, expect failure | Failure as information | Not articulated by anyone as a design principle |
| 5. Learn & revise (loop back to specific phase) | Systematic diagnosis | Mohit's /improve-system (ad-hoc, not systematic) |

**The key differentiator is phase 4+5 as a designed loop.** Everyone else treats failures as bugs to fix. Antti's architecture treats failures as diagnostic information that points back to which phase (context? goals? guardrails?) needs revision. This is the Toyota Kata / PDSA influence — the meta-practice of improvement, not just the practice.

### Counter-Evidence: Why This Gap Might Close

1. **Anthropic is building in this direction.** Cowork plugins, skill authoring best practices, and the AGENTS.md pattern are platform-level support for file-based architecture. As more non-developers use this, someone will articulate the learning loop.

2. **The "skills" ecosystem is growing fast.** Microsoft published a skills repo. Smithery has a skills marketplace. As skills proliferate, the "how do I improve my skills over time?" question will naturally arise.

3. **Brad Feld's telemetry loop** (co-feedback weekly analysis) is a proto-version of phase 5. It measures usage but doesn't yet diagnose which part of the architecture to fix.

4. **Mohit Tater's /improve-system** is the closest to phase 5 — explicitly modifying the system's own files based on experience. One step away from systematizing it.

---

## What We Did Not Find

1. **No practitioner articulating a complete lifecycle.** Everyone describes what they built. Nobody describes how it learns and improves as a system. The learning element is always implicit or ad-hoc.

2. **No organizational deployment.** Every example found is a solo practitioner or small team. Nobody described deploying a file-based business agent architecture across an organization with multiple users, shared context, and organizational learning.

3. **No "curation before goals" articulation.** Nobody explicitly describes the information curation phase as prerequisite. Context is either emergent (Obie) or pre-existing (Brad). The deliberate act of curating information BEFORE defining what the agent should do is not described.

4. **No training programs teaching this pattern.** Codecademy has a "how to build Claude skills" tutorial. MKT1 teaches marketers to build. But nobody is teaching the architectural pattern — the WHY behind files, the lifecycle, the learning loop. This is the curriculum gap Agents 102 fills.

5. **No Nordic practitioners found.** All practitioners identified are US-based. No Nordic signal for this pattern.

6. **No business-domain-specific learning architectures.** The pattern is domain-agnostic ("run my company") not domain-specific ("improve our sales process through iterative agent learning"). Antti's architecture applied to specific business domains (sales, HR, operations) would be genuinely novel.

---

## Verdict

**The building blocks are converging. The architecture is not.**

Antti is working with the same materials (markdown files, Claude Code, skills pattern) that 10-15 other practitioners discovered independently. This is good — it confirms the foundation is sound and the tooling is ready.

But the five-phase lifecycle — especially the deliberate curation phase and the systematic learning loop — is ahead of what anyone else has articulated. The closest practitioners (Mohit Tater, Brad Feld) have proto-versions of individual phases but haven't connected them into a designed learning system.

**Timing window:** 6-12 months. The skills ecosystem is growing fast. Someone will articulate the learning loop. The question is whether Antti ships the training (teaching others to build this way) before someone else writes the blog post that names the pattern.

**Strategic implication for Agents 102:** The curriculum doesn't need to convince people that file-based agents work — that's already converging. It needs to teach the lifecycle that makes them LEARN. That's the value-add over "just put markdown files in a directory."

---

## All Sources

| Source | Type | URL |
|--------|------|-----|
| Adventures in Claude — Running a Company on Markdown Files | practitioner direct | https://adventuresinclaude.ai/posts/2026-02-21-running-a-company-on-markdown-files/ |
| Seth Levine — Running My Day From a Terminal Window | practitioner direct | https://sethlevine.com/archives/2026/02/running-my-day-from-a-terminal-window.html |
| Obie Fernandez — Building a Personal CTO Operating System | practitioner direct | https://obie.medium.com/building-a-personal-cto-operating-system-with-claude-code-b3fb9c4933c7 |
| Mohit Tater — I Built a Business Co-Pilot Using Claude Code | practitioner direct | https://medium.com/@tatermohit/i-built-a-business-co-pilot-using-claude-code-heres-the-exact-system-cfe32ee59558 |
| MKT1 — What 4 Gen Marketers Are Building with Claude Code | practitioner direct | https://newsletter.mkt1.co/p/real-marketers-claude-code-builds |
| OthmanAdi — Planning With Files (GitHub) | practitioner direct | https://github.com/OthmanAdi/planning-with-files |
| rsmdt — The Agentic Startup (GitHub) | practitioner direct | https://github.com/rsmdt/the-startup |
| The New Stack — Skills vs MCP Agent Architecture | domain trade publication | https://thenewstack.io/skills-vs-mcp-agent-architecture/ |
| Arize — Agent Interfaces in 2026: Filesystem vs API vs Database | practitioner analysis | https://arize.com/blog/agent-interfaces-in-2026-filesystem-vs-api-vs-database-what-actually-works/ |
| McMillan — Codified Context: Infrastructure for AI Agents (arxiv) | academic/research | https://arxiv.org/html/2602.20478v1 |
| Simon Willison — Structured Context Engineering for File-Native Systems | practitioner analysis | https://www.alldevblogs.com/article/simon-willison/structured-context-engineering-for-file-native-agentic-systems |
| Shrivu Shankar — How I Use Every Claude Code Feature | practitioner direct | https://blog.sshh.io/p/how-i-use-every-claude-code-feature |
| Complete Guide to CLAUDE.md and AGENTS.md | practitioner analysis | https://medium.com/data-science-collective/the-complete-guide-to-ai-agent-memory-files-claude-md-agents-md-and-beyond-49ea0df5c5a9 |
| Anthropic — Cowork and Plugins for Enterprise | vendor (Level 0) | https://claude.com/blog/cowork-plugins-across-enterprise |
| Anthropic — Using CLAUDE.MD Files | vendor (Level 0) | https://claude.com/blog/using-claude-md-files |
