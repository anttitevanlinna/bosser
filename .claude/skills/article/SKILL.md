---
name: article
description: Full article pipeline from insight to publish-ready. Invoke at any stage — the skill picks up where you are. Use /article to start from an insight, /article draft to jump to rough cut, /article edit to tighten an existing draft, /article publish to finalize.
argument-hint: [stage] [topic-or-file]
---

# Article Pipeline: Zero to Publish-Ready

This skill covers the full lifecycle of an Agents 102 article. It is designed around how Antti actually writes: the agent provides structure and blunt short sentences, Antti rewrites 60-80% in his voice, the agent tightens what Antti wrote.

**The article is Antti's, not the agent's.** The agent's job is: never let him start from a blank page, never make him hold the full arc in his head, and never write in a consultant voice.

## Stages

The pipeline has 6 stages. Invoke at any stage — if a draft already exists, skip ahead.

### Stage 1: Insight Capture
**Trigger:** Conversation surfaces something worth writing about.
**Action:**
1. Name the insight in one sentence
2. Write it as a user signal in `continuous-research/user-signals/comments/`
3. Ask: "Is this an article?" — if yes, proceed

### Stage 2: Research Validation
**Trigger:** `/article research <topic>` or naturally after Stage 1
**Action:**
1. Launch 1-2 OODA research agents in background to validate/expand the insight
2. While OODA runs, sketch the rough structure with Antti
3. When OODA returns, extract: named examples, specific data points, counter-evidence
4. Decide together: is there enough for an article? What's the thesis?

**Research agents MUST inherit the rules file.** Before launching, read `.claude/rules/research-rules.md` and prepend its full contents to the subagent prompt. Do not paraphrase; do not summarize; paste verbatim. No exceptions. Every source needs a URL and type label. Evidence ladder applies.

### Stage 3: Rough Cut
**Trigger:** `/article draft <topic>` or naturally after Stage 2
**Action:** Write the rough cut to `content/<slug>.md` with frontmatter:

```yaml
---
title: <title>
slug: <slug>
date: <today>
status: draft
target: <linkedin|newsletter|site>
---
```

**CRITICAL — Rough cut rules:**
- **Short declarative sentences.** One idea per line. No flowing paragraphs.
- **No consultant voice.** Blunt, direct, punchy. If it sounds like McKinsey, delete it.
- **No transitions.** No "moreover," "furthermore," "in addition." Just the next line.
- **Named examples with specifics.** Companies, products, numbers, dates. Never generic.
- **Structure the arc.** The reader should feel the sequence: what's the setup, what are the patterns/examples, what does it mean, what do you do about it.
- **Do NOT write a polished opening.** Write 3-4 candidate opening lines Antti can pick from. Or leave a `[OPENING — Antti writes]` marker.
- **Do NOT write the closing.** Write 2-3 candidate closing lines, or leave a marker.
- **Every section heading is a short punchy statement**, not a category label. "What it replaces" not "Current State Analysis."
- **Include a "What it replaces" framing** — what does the reader's world look like today before this insight? Meetings, manual work, old tools. Make them recognise their own pain.
- **End each pattern/example with a one-line reframe** in italics. E.g., *"The SaaS vendor shipped a colleague, not a connector."*

**Length target:** 800-1200 words for LinkedIn, 1500-2500 for newsletter/site.

### Stage 4: Antti Rewrites
**Trigger:** Antti edits the file by hand.
**Action:** Stay out of the way. Do not re-edit what Antti is writing. Wait for him to say he's done or ask for help.

**When Antti asks for specific edits:**
- Make exactly the edit requested, nothing more
- Suggest paragraph breaks where sentences do too much work
- Identify the "money line" — the sentence CTOs will screenshot — and suggest giving it its own line
- Watch for LLM tell words: "honest," "delve," "landscape" (as verb), "importantly," "comprehensive"

### Stage 5: Visual Aids
**Trigger:** Antti asks for a map, diagram, or visual — or the article's structure suggests one.
**Action:**
- **Wardley maps:** Build as HTML/canvas in `site/` with download-as-PNG button. Use authentic Wardley styling (evolution axis, dashed zone dividers, component dots). Iterate positions WITH Antti — don't guess blind, ask what overlaps.
- **Other diagrams:** HTML/SVG in `site/`, same download pattern.
- **For Wardley maps:** Also save OWM DSL version in `content/` for reference.

**When positioning elements and you can't see the output:** Ask Antti what's overlapping instead of guessing fixes. Blind pixel-nudging wastes rounds.

### Stage 6: Publish Prep — gated
**Trigger:** `/article publish <file>` or Antti says it's ready.

**Pre-flight gate (blocks the `status: draft → ready` flip):**

1. **Load rule files.** Read `.claude/rules/content-rules.md` and the relevant compendium (sales_copy for buyer-facing, writing for internal).
2. **Banned-word scan — blocking.** Grep for `\bhonest`, `\bdelve`, `\blandscape\b.*verb`, `\bimportantly`, `\bcrucial`, `\britual`, `\bceremony`. Any hit blocks the flip. Fix or get explicit Antti override before proceeding.
3. **Source-URL scan — blocking.** Every factual claim needs a URL. Grep for unsourced statistic patterns (round-number percentages, "studies show", "research finds" without `[`). Any unsourced claim blocks the flip. Mark `[SOURCE NEEDED]` or remove.
4. **Orphaned-placeholder scan — blocking.** Grep for `[OPENING —`, `[CLOSING —`, `[TODO`, `[SOURCE NEEDED`, `[UNVERIFIED STAT`. Any hit blocks the flip.
5. **Goalcheck — blocking if article targets CTOs.** Parse frontmatter. If `audience` includes CTO or `target` is newsletter/site/linkedin, run `/goalcheck <file> a` and require a passing signal. A failing goalcheck blocks the flip. "We'll fix it later" is not allowed — later is now.

Only after all five gates pass:

6. Update frontmatter: `status: draft` → `status: ready`
7. Commit with descriptive message
8. Push to main
9. Note: another agent handles publishing to Bosser site — just get it to main

**Override:** Antti can override any gate with an explicit "ship it anyway" instruction. Log the override in the commit message so `/refresh` can audit later whether overrides correlate with post-hoc corrections.

## What this skill does NOT do

- **Write in Antti's voice.** The rough cut is raw material. Antti writes the article.
- **Decide the thesis.** That comes from conversation, not from the skill.
- **Add the competence-first thesis everywhere.** That's the business model, not every article's conclusion. Only include if it genuinely fits.
- **Polish prose.** Rough is better than smooth. Blunt short lines that Antti can accept/reject individually.
- **Make the article longer.** Shorter is always better. If a line doesn't earn its place, cut it.

## Rule files to load before writing

Before drafting, editing, or finalizing any article, read:
- `.claude/rules/research-rules.md` — evidence ladder, source-type labels, freshness, zombie-stat guard
- `.claude/rules/content-rules.md` — points to the right compendium for this surface (sales_copy for buyer-facing, writing for internal)

Prepend these to any research subagent prompt verbatim.

## Content standards

- **Sources:** Every factual claim needs a named company + specific practice + URL. Evidence ladder from `.claude/rules/research-rules.md` applies.
- **Freshness:** Only cite last 6 months. Older = historical context only, explicitly dated.
- **Tone:** Practitioner, not analyst. "I tried this" beats "research suggests." First person where it's true.
- **Structure:** Setup → patterns/examples → what's evolving → what to do. Not: introduction → body → conclusion.
- **The test:** Would a CTO share this with their team? If not, what's missing?

## Files

- Articles: `content/<slug>.md`
- Visuals: `site/<slug>.html` (with download-as-PNG)
- OWM maps: `content/<slug>.owm`
- User signals captured during research: `continuous-research/user-signals/`
