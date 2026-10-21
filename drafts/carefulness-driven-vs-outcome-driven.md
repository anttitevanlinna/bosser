---
title: "Carefulness-Driven vs. Outcome-Driven Development"
slug: "carefulness-driven-vs-outcome-driven"
author: "Antti Tevanlinna"
created_at: "2026-10-21"
tags: ["ai", "software", "quality", "leadership"]
newsletter: false
estimated_reading_time: "5 min"
status: draft
---

# Carefulness-Driven vs. Outcome-Driven Development

[OPENING — Antti picks or writes. Candidates:]
- *"I first called this curiosity-driven development. Wrong word. The right word is carefulness."*
- *"For most of software history, quality lived in one place. The developer's head."*
- *"Agents don't take care. They take a guess. That changes where quality has to come from."*

## Software used to be a craft of care

Before Agile. Before the cloud. When software creation was really a craft.

Quality came from the carefulness of the developer.

The requirements had to be right. The design had to be right. And above all, the code had to be right.

The code would not crash. It would not cause trouble.

The main way of getting there was simple. The developer took precise care. Thought it through. Deliberately. Line by line. Nothing went into the software that could make it misbehave, crash, or carry a bug.

That is what I mean by carefulness-driven development. Some would say caution-driven.

Donald Knuth put it best: "Beware of bugs in the above code; I have only proved it correct, not tried it."

*Quality was a property of the person.*

## The care was never written down

Carefulness lived in heads. The senior developer who "just knew" which module would break. The reviewer who read every line. The architect who said no.

We built habits around it. Code reviews. Design reviews. Sign-offs. All of them are ways to put a second careful head next to the first one.

Agile moved some of it into tests and feedback loops. But mostly the care stayed where it was. In the developer. That is why a great developer was worth ten average ones.

*We scaled software by scaling careful people.*

## Agents don't take care

An agent does not worry. It does not lie awake thinking about the edge case.

It produces the plausible. Very fast. Most of the time good. Sometimes confidently wrong.

And now the volume. In [The Red Queen](https://anttitevanlinna.github.io/bosser/articles/red-queen.html) I wrote about developers pushing 100 changes a day. Traditionally we managed 1-5.

You cannot be careful about 100 changes a day. Not the old way. Reading every line is not care anymore. It is babysitting. I wrote about that in [Outcome Orientation and Scaling AI](https://anttitevanlinna.github.io/bosser/articles/outcome-orientation-scaling-ai.html).

*Carefulness does not scale with the agent. It becomes the bottleneck.*

## Outcome-driven development

So where does quality come from now?

From outcomes. Defined up front. Checked by evidence, not by a careful reader.

What should the software do? For whom? How do we know it did?

Then you let the agent run and check the result against that. Tests. Evals. Telemetry. What the user actually managed to do.

The question shifts from "did someone think this through?" to "can we show it works?"

*Quality becomes a property of the system, not the person.*

## Care moves, it doesn't disappear

[ANTTI — my guess at your thesis here. Keep, change or cut.]

This is not a farewell to carefulness. It is a relocation.

The care goes into defining the outcome. Precisely. Into deciding what "right" means before anything is built.

The care goes into the checks. A careless check is worse than none. It gives you a green light on the wrong thing.

The care goes into what the agent cannot see. Is this what the user needed? Does it fit the business? Would I put my name on it?

The old craft people were not wrong. They were careful in the only place they could be. In the code.

Now the code is the cheap part. Be careful about the outcome instead.

## What to do on Monday

- Ask your team where quality actually comes from today. If the answer is "Pekka reads everything", you are carefulness-driven.
- Write down the outcome before the agent writes the code. One paragraph. How will we know?
- Turn your careful people into check-builders. Their judgment, written down, is the asset that scales.
- Watch for babysitting. Every hour spent reading agent output line by line is an outcome you did not define.

[CLOSING — Antti picks or writes. Candidates:]
- *"Careful people built the software we run on. Now they need to build the checks."*
- *"Carefulness was the craft. Outcomes are the system. You need both, just not in the same place anymore."*
- *"Don't be careful about the code. Be careful about what 'done' means."*
