---
title: "Personal-to-Team Agent Patterns — A Practitioner's Design Language"
slug: "personal-to-team-agent-patterns"
author: "Antti Tevanlinna"
created_at: "2026-04-20"
tags: ["patterns", "agents", "personal-to-team", "design-patterns", "sharing"]
newsletter: true
estimated_reading_time: "7 min (est.)"
status: "note / unstarted"
target: "newsletter"
---

# Personal-to-Team Agent Patterns — A Practitioner's Design Language

**Status: note, not a draft yet.** The catalog scaffold lives in `strategy/personal-to-team-patterns.md`. When Antti fills in real patterns from his practice, this newsletter post becomes the public version.

## Why this is a statement piece

Nobody has written this catalog. Vendors sell "share the whole agent" because it's the marketplace pitch. Consultancies don't have enough personal agents scaled to team level to see the shape. Builder-practitioners have one or two patterns each in their head — not a language.

The statement: **here is a design language for sharing agents.** Not a tool, not a platform. A set of named patterns the reader can match against their own situation.

Design patterns worked for software in 1994 because Gang of Four named what smart developers were already doing, made it discussable, and shortened the time from "I have a problem" to "I know which solution fits." Same leverage here. Personal-to-team sharing is where every builder leader gets stuck — the buyer's situation varies wildly (Salesforce-shop vs. SharePoint-shop vs. personal-Claude-only vs. cloud-agent-platform) but the patterns are finite.

## Core claim for the post

The four canonical sharing strategies (share context / share skill / share output-push / share interface-pull) are the taxonomy. The real value is the **context-specific patterns underneath each** — and the routing: *given your situation, here's your pattern and here's the trap.*

Example one-liner: *"Got Salesforce with live data? Don't cache. MCP-native access, each teammate's own credentials, governance stays where governance already lived."*

## Voice note for drafting

Seth × Rory × Risto applies. Avoid "design patterns" as a jargon hook if it lands as software-only; reframe as "named patterns" or "moves." Practitioner tone — this is what works when you've actually scaled personal agents to team level. Not academic.

## Connection to the larger arc

- Fits the existing article pipeline alongside Intent Taktik, Absorption Bottleneck, Anatomy of a Business Agent.
- Reinforces the "practitioner, not analyst" positioning — catalog is grounded in Antti's practice + Agentics Helsinki community observations.
- Directly supports the training: Module 7 uses this catalog, and the post doubles as lead-generation for the training (reader who sees themselves in one of the patterns is warm for Bootstrap).

## Before writing

- Catalog needs real examples filled in first. Don't draft the post until the patterns have practitioner-grade teeth.
- Candidate lede: *"I've spent two years watching people build personal agents that work. The second act — making them work for the team — is where most of them fail. Not because the tech fails. Because there's no language yet for what sharing actually means."*
- Candidate structure: (1) why personal-to-team is where it breaks, (2) the four strategies as the taxonomy, (3) 5–7 named patterns with one-paragraph sketches, (4) the routing table, (5) one "and here's the part everyone misses" — the people plan.

## Open question

Does the post reveal all ~15 patterns, or 5 with the signal that the full catalog exists inside the training? Scarcity argument says teaser; generosity argument says full catalog published builds the practitioner reputation faster. Probably: full catalog public, full routing + people-plan depth inside the training.

<!-- maintainer -->

Canonical catalog: `strategy/personal-to-team-patterns.md`
Related article pipeline entries: article-anatomy-of-business-agent.md, article-absorption-bottleneck.md
Related memory: project_how_to_share_an_agent.md (the four strategies), project_m7_design_anchors.md (M7 uses this catalog)
