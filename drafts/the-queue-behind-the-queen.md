---
title: "The Queue Behind the Queen"
slug: "the-queue-behind-the-queen"
author: "Antti Tevanlinna"
created_at: "2026-10-21"
tags: ["ai", "processes", "leadership"]
newsletter: false
estimated_reading_time: "5 min"
status: draft
---

# The Queue Behind the Queen

Last time I wrote about the Red Queen. It takes all the running you can do to stay in the same place. Agents make your rivals faster, so you get faster, so they get faster.

I ended with a promise of sorts. You will not hide from the queen. But nobody keeps their sanity using the old ways.

So what are the old ways that break first?

My answer: the queue.

## Writing got cheap. Finishing did not.

Every piece of work has a cheap part and an expensive part.

In software, writing the code was the cheap part even before agents. Review, testing, integration, security, deployment, keeping it running. That was where the calendar time went.

Agents shrank the cheap part to almost nothing. The expensive part is exactly as big as it was.

Same in business work. Drafting the strategy options was never the hard part. Choosing one, aligning people around it and committing is the hard part. Now you get ten options instead of two. The leadership team still has the same Tuesday afternoon to decide.

*Agents sped up the part that was never the bottleneck.*

## The numbers are in

Faros AI published telemetry from 22,000 developers across 4,000 teams, comparing high and low AI adoption inside the same companies ([AI Engineering Report Q2 2026](https://www.faros.ai/research/ai-acceleration-whiplash)).

Task throughput up a third. Epics completed up two thirds. Great.

Median review time: five times longer. Incidents per pull request: roughly three times as many. Code churn: up almost tenfold. Deployments per week: down 12%.

Read that again. More work started. More work "done". Fewer deployments.

Their earlier report said the same thing more gently: developers merging 98% more pull requests, review time up 91%, company-level delivery flat ([Faros AI](https://www.faros.ai/ai-productivity-paradox)).

Note: Faros sells engineering analytics. Take the exact figures with a grain of salt. The direction is what matters, and the direction matches what I see in teams.

## Little's Law doesn't care about your AI strategy

There is an old and boring equation in operations. Work in progress equals throughput times cycle time.

Push more work in at the front. The capacity at the back stays the same. Work in progress piles up. Everything waits longer.

The developer feels more productive. Five pull requests this week instead of two. The dashboard is green.

The reviewer, who also has three features of their own, now has twice the pile. They cannot read faster. So they skim. Or they wait. Or they approve.

The team is not shipping faster. The team is queueing faster.

Goldratt said this forty years ago. An improvement anywhere else than the constraint is an illusion.

*If you were already overloaded, agents make it worse. Not because agents are bad. Because you optimised the wrong step.*

## Where the queue forms

I see four places. Every one of them is human.

**Review.** Somebody has to say "yes, this is right". That somebody did not get 5X.

**Decisions.** More options, more analyses, more scenarios. The same amount of judgment to spend on them.

**Integration.** Every change lands somewhere. In a codebase, a process, a customer's head. Each of those absorbs change at its own pace.

**Attention.** The scarcest one. Everything above competes for it.

The Red Queen race runs on generation. The finishing line is in these four places.

## So what do you do?

Not "use less AI". The queen does not allow that.

A few things I have seen work.

**Find the constraint first.** Before rolling out the next tool, ask where work actually waits today. Measure waiting, not output. If you don't know where the queue is, you will make it longer.

**Point the agents at the constraint.** Most companies aim their agents at generation, because that is what the demos show. Aim them at review, testing, and verification instead. A quarter of pull requests are already reviewed by an agent in the Faros data. That is the right direction. Then check the checker.

**Limit work in progress.** Kanban people have been saying this for twenty years. It just became urgent. If one person can absorb three changes a day, starting ten does not help anyone.

**Make the change smaller.** Faros saw pull requests grow by half. Big changes are slow to review and expensive to get wrong. Small, frequent, reversible. Same old lesson, higher stakes.

**Decide less, decide earlier.** For business work, the queue is often in the leadership team. Agree on what you will not do before the agents produce twenty versions of it.

*The question is not how fast you can generate. The question is how fast you can absorb.*

## Running in place, in the right place

The Red Queen says you must run twice as fast just to get somewhere.

Fine. But running faster at the wrong step only grows the pile at the next one.

The companies that keep up with the queen will not be the ones who generate the most. They will be the ones who learned to finish.

<!--
Alternative openings:
1. "My team shipped five times more pull requests last month. We deployed less."  [only if true for a team Antti knows]
2. "Every AI tool demo shows the first 20% of the work. None of them show the queue."
3. "Agents made writing cheap. Nobody told the reviewer."

Alternative closings:
1. "Generation is the queen's race. Absorption is yours."
2. "Don't ask how much your agents produced this week. Ask how much of it you finished."
3. End on a question: "Where is your queue?"
-->
