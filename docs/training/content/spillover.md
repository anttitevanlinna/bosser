---
title: "When Will Agentic Coding Spill to Other Functions?"
slug: when-will-agentic-coding-spill-to-other-functions
byline: "Written by Claude Opus. Steered by Antti Tevanlinna."
date: 2026-02-21
tags:
  - agents
  - verification
  - coding
  - finance
  - legal
  - nordic
status: published
---

**Written by Claude Opus. Steered by Antti Tevanlinna.**

> Coding agents work because code has tests. The question for every other business function: what's yours?

# When Will Agentic Coding Spill to Other Functions?

Coding agents work. Not "showing promise" work. Not demo-day work. Production work. Spotify merges 650 agent-generated pull requests into production every month, saving 60-90% of engineering time on complex code migrations [11]. Their CEO told investors that the company's best developers "have not written a single line of code since December." Karpathy went from 80% manual coding to 80% agent coding in weeks and called it "the biggest change to my basic coding workflow in two decades of programming."

In Moore's terms, this looks like the chasm crossing — when the thing that was once only for experts becomes accessible. Whether the pattern holds beyond coding is the open question. Everyone watching asks the same: when does this come to my function?

To answer that, you have to understand why coding worked first. Based on our research, the decisive factor was not the models — it was the domain.

## Five ingredients that made coding ready

Willison put it cleanly: "With code you get a powerful form of fact checking for free -- run the code and see if it works." That is the first ingredient. Executable verification. Code either compiles or it does not. Tests pass or they fail. The agent gets an objective, instant signal on whether its output is correct.

But verification alone is not enough. Coding has four more structural ingredients. Rich tooling -- files, terminal, git, test runners -- so the agent can act, not just think. Safe iteration -- git means every experiment is reversible, every mistake recoverable. Task decomposability -- software naturally breaks into bounded units where "done" is objectively verifiable. And a massive practitioner ecosystem writing publicly about what works, so the knowledge compounds in the open.

Spotify's engineering blog makes the infrastructure prerequisite explicit: their agents run formatters, linting, builds, and full test suites before opening a pull request [11]. The years of investment in testing infrastructure is what made autonomous coding viable. The AI was ready. The domain was ready too.

These five ingredients are specific to software engineering — in our analysis, they function as domain infrastructure rather than AI capabilities. And this is where every other business function needs to look.

## Scoring the other domains

We evaluated 112 sources across 8 business domains — coding, finance, legal, compliance, customer service, operations, HR, and sales — using the same methodology. We applied three gates to every claim: Is it truly agentic -- multi-step autonomous work, not a chatbot or a dashboard? Is the evidence independent of the vendor selling it? Is there a specific outcome -- named company, specific practice, measurable result?

Of our 112 sources, 45% passed. (Methodology: three-gate classification applied by our continuous research program; see [7] for the system.)

In coding, the practitioner-to-vendor signal ratio runs roughly 50 to 1. Hundreds of practitioners writing openly about real deployments, and the tools barely need marketing because they sell themselves. In operations, we evaluated 21 sources and 12 passed the agentic gate — the highest pass rate outside coding, driven by measurable process outcomes. Customer service had 17 sources with 8 passing, though 5 of the 17 were chatbots wearing an "agent" label. Finance had 14 sources and only 5 passed -- every fintech claims "agentic" but Goldman Sachs, the strongest signal, is still in early stages of its trade accounting agents. HR had 16 sources, 6 passed, and compliance had 9 with 5 passing.

In our sample, the pattern holds across every domain we examined. Where verification loops exist -- numbers balance, rules are met, tickets resolve -- agents are starting to get traction. Where "correct" is subjective and feedback is slow, practitioners are absent and vendor announcements fill the void.

## Where the real spillover is starting

**Finance.** Vic.ai in Norway processes 500 million invoices with autonomous AP agents that cross-reference ERPs and self-correct when numbers don't reconcile [2]. Goldman Sachs is deploying trade accounting agents on Claude — automating reconciliation tasks across operations that touch the firm's $2.5 trillion in managed assets [3]. Numbers either balance or they don't — that's the verification signal.

**Legal.** Legora in Sweden launched agentic workflows for law firms — multi-step, multi-tool, goal-directed legal task execution across 250+ firms [4]. Max Junestrand, their CEO, told Artificial Lawyer "we don't do yearly planning" because AI moves too fast [5]. Contract clauses are either correct or they aren't.

**Compliance.** Spektr in Denmark automates KYC due diligence — pulling data from multiple sources, cross-referencing, flagging inconsistencies [6]. Regulatory rules are met or they're not.

Notice the pattern. Every domain where real agents are emerging has a fast verification loop — a way for the agent to check its own work without asking a human. Finance has reconciliation. Legal has citation accuracy. Compliance has rule validation. This is the coding test suite, translated into business language.

## The vendor narrative collapses

Of our 112 evaluated sources, 21 were pure vendor fluff — announcements without deployments, press releases without practitioners. Another 23 were chatbots mislabeled as agents. In our sample, 40% of sources labeled "agentic" were either vendor announcements without real deployments or chatbots mislabeled as agents.

This matters because of compound errors. Narayanan at Princeton explains why agents need "domain-specific verifiers like compilers" [9]. Without them, 95% per-step reliability collapses to 36% over 20 steps. That exponential decay helps explain why verification matters in practice: each additional step without a correction signal multiplies the error. In our sample, domains without fast, objective verification showed the same pattern — vendor announcements without practitioners.

Announcements without practitioners are billboards without roads. When SAP announces agents but practitioners are absent from the conversation, the signal is clear. When a domain has 10 vendor press releases and zero practitioner blog posts, the ratio tells you everything.

In our sample, we found no domain with production agents that lacked some form of verification infrastructure. HR? Zero autonomous agent deployments found across the Nordics or globally in our research [7]. Sales? Anssi Ruokonen at Basware reports 61% of agent deployments in finance were experiments that failed [8] — and finance is the *easy* domain. Strategy, procurement, product management — domains where verification infrastructure has not yet emerged. Narayanan frames this precisely: you need "domain-specific verifiers like compilers" for agents to self-correct [9]. Without them, compound errors kill autonomy.

## Learning to see the crossing

Here is what the chasm crossing looked like for coding, in real time. You can learn to recognize this pattern in your own domain.

Stage one: solo builders experiment. Individual developers tried early agents. Osika built GPT Engineer. Willison documented workflows. Karpathy was skeptical. It was a curiosity, not a movement.

Stage two: practitioners flip. Multiple independent practitioners reported the same threshold -- not gradually getting better, but a discontinuity. Karpathy's 80/20 inversion happened in weeks. Willison shifted to parallel agent workflows. The convergence of independent reports was the signal, not any single claim.

Stage three: enterprise credibility. Spotify published a three-part engineering blog series documenting 1,500+ merged pull requests. A CEO said it on an earnings call. This is the signal enterprises trust -- not because Spotify did anything solo builders had not done, but because "our team tried it" carries more weight than "some builder on X did it."

Stage four: tooling democratizes. Lovable, built by Osika in Stockholm, has scaled to millions of users building products on the platform daily. What started as an expert practice reached a broader population of builders. In Moore's framework, this is what the chasm crossing looks like.

Now you know the pattern. Where is your domain? Count the independent practitioners writing publicly. Not vendor announcements. Not analyst predictions. Practitioners describing what they built and what happened. When 10 to 20 of them say the same thing independently, that is your signal. When an enterprise team confirms what the solo builders have been reporting, that convergence is the credibility signal.

## The spillover sequence

Based on what's actually deployed, the spillover sequence in our research follows this gradient:

**First wave (verification exists):** Coding. Finance and legal where reconciliation creates natural test suites.
**Second wave (hybrid loops emerging):** Customer service, where resolution is measurable but human escalation is still needed. Compliance-heavy processes where rules provide verification. Operations — the highest agentic signal density outside coding in our research, with measurable process outcomes, though deployments still rely on human-in-the-loop verification.
**Third wave (verification must be built):** HR and sales — domains where we found the widest gap between vendor claims and practitioner evidence, and where verification infrastructure has not yet emerged.
**Open question:** Strategy, procurement, product management. Whether objective verification is possible here remains unclear.

The loudest voices in this space don't even use the word "agents." Anton Osika at Lovable calls it "vibe coding." Junestrand calls Legora a "legal AI workspace." Ethan Mollick at Wharton writes about "Claude Cowork" — using Claude Code for non-technical work [10]. The market talks outcomes. The architecture is agentic. The label doesn't matter.

What separated domains in our research was not whether AI could be applied, but whether the domain had built its own version of a test suite. That turns out to be **the more useful question for every business function: "What's our test suite?"**

---

**Sources**

[1] Narayanan, A. "AI as Normal Technology" — capability-reliability gap analysis. Princeton. https://www.normaltech.ai/p/ai-as-normal-technology

[2] Hagerup, A. "VicAgents Are Here: Vic.ai's Vision for Intelligent AI in Finance" — VicAgents launch, 500M+ invoices at 99% accuracy. Vic.ai blog, Jun 2025. https://www.vic.ai/blog/vic-agents-future-of-autonomous-finance

[3] Goldman Sachs taps Anthropic's Claude to automate accounting, compliance roles. CNBC, Feb 2026. https://www.cnbc.com/2026/02/06/anthropic-goldman-sachs-ai-model-accounting.html

[4] Legora Launches Market-First Agentic Workflows to Orchestrate Legal Tasks. BusinessWire, Jun 2025. https://www.businesswire.com/news/home/20250625950992/en/Legora-Launches-Market-First-Agentic-Workflows-to-Orchestrate-Legal-Tasks

[5] Junestrand, M. — "We're Setting the Precedent" interview. Artificial Lawyer, Dec 2025. https://www.artificiallawyer.com/2025/12/01/max-junestrand-legora-were-setting-the-precedent/

[6] Spektr 2.0 Launches, Unveiling AI Agent Builder to Transform Compliance for Fintechs. FFNews, Aug 2025. https://ffnews.com/newsarticle/fintech/spektr-2-0-launches-unveiling-ai-agent-builder-to-transform-compliance-for-fintechs/

[7] Nordic practitioner research, Agents 102 continuous research program, Feb 2026. Zero autonomous HR agent deployments found across 7 Nordic domain tracks.

[8] Ruokonen, A. (Basware) — "Agentic AI drives finance ROI in accounts payable automation." AI Intelligence News, Feb 2026. https://www.artificialintelligence-news.com/news/agentic-ai-drives-finance-roi-in-accounts-payable-automation/

[9] Narayanan, A. — "Why do coding agents work so well and what would it take to replicate their success in other domains?" X.com, Dec 2025. https://x.com/random_walker/status/2018342421696766147

[10] Mollick, E. — "A Guide to Which AI to Use in the Agentic Era." oneusefulthing.org, Feb 2026. https://www.oneusefulthing.org/p/a-guide-to-which-ai-to-use-in-the

[11] Spotify Engineering. "The Rise of the AI Engineer" — three-part series on autonomous code migrations, 650+ merged PRs/month. Spotify R&D Blog, 2025. https://engineering.atspotify.com/2025/06/the-rise-of-the-ai-engineer/

---

## Commentary

I created Agents 101 — a 7-module training program that teaches people to build with Claude Code. Not developers. Marketers, sales leads, HR, product managers. Close to 40 people trained at F-Secure so far.

Here's what I see from week 2 onward: the non-coders start building. Real dashboards. Real automations. Things that look and feel like agent-driven workflows. They don't call them "agents" — they call them "my thing that pulls the data and makes the report." But the pattern is the same one Claude Code uses: multi-step, tool-using, iterative.

The verification gap in this article is real. When I teach the evals module, the developers get it instantly — "it's like writing tests." For non-technical functions, the concept doesn't transfer automatically — until they find their own equivalent. The finance person realizes their reconciliation rules ARE the test suite. The compliance person realizes their regulatory checklist IS the verifier. The HR person realizes... they don't have one yet.

That moment — when someone in a non-coding function figures out what their "test suite" is — that's when agents become real for them. Not when a vendor ships a feature. Not when a consultancy publishes a framework. When the person doing the work sees how to verify the output.

In my experience, the pattern is consistent: organizations are at the chatbot stage not because the AI isn't ready, but because their domain verification hasn't been designed yet. The organizations building their verification infrastructure are creating the conditions for agents. That work is yours to start.

*— Antti Tevanlinna*
