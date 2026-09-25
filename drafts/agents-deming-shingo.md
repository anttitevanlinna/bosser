---
title: "Agents, Deming & Shingo"
slug: "agents-deming-shingo"
author: "Antti Tevanlinna"
created_at: "2026-08-19"
tags: ["ai", "processes", "strategy", "leadership"]
newsletter: false
estimated_reading_time: ""
---

# Agents, Deming & Shingo

*Draft skeleton. Bullets, not prose yet.*

## Hook

- Everybody in Lean and Agile quotes Deming. Almost nobody quotes Shingo.
- Deming diagnoses. Shingo prescribes. You need both.
- Follows from "Stop chatting. Build a system." That one said build the loop. This one is about what you actually put in it.

## Two piles: special and common

- Special cause: assignable. Stale path. Broken tool. Missing doc. Two rules in the file contradicting each other. Fixable once.
- Common cause: the sampler itself. Ambiguity that was always there. The model's baseline rate for that failure. Belongs to the system.
- The whole game is knowing which pile you are in. Nobody sorts. Everybody writes a rule.

## The funnel (tampering)

- Deming's funnel experiment. Nudge after every miss and the scatter gets worse. Reliably worse than doing nothing.
- "Agent did something wrong, root cause it, store the rule" is the tampering protocol with better branding.
- Root cause analysis assumes an assignable cause exists. Often there isn't one.
- Honest post mortem is usually: the model does this maybe 3% of the time. Nobody wants that answer.
- And the agent will happily invent a tidier one. Ask why it erred and you get a narrative. You then carve the narrative into the rules file forever.

## The rules file becomes the problem

- Deming point 10: eliminate slogans and exhortations.
- Forty ALWAYS-REMEMBER-TO lines is a wall of motivational posters for a probabilistic worker.
- Worse: the file is context, context is finite. Scar tissue crowds out the rules that mattered.
- Your variance reduction mechanism turns into a variance source. Bleakly funny.

## The thing Deming could never do

- He could not re rerun a shift under identical conditions. Factories do not rewind.
- You can. Same task, fresh session, five times.
- Fails one in five: common cause. Do not write a rule. Change the architecture.
- Fails five in five: assignable. Go fix the thing.
- Cost of doing this: almost nothing. Yet nobody does it. Every session treated as a unique anecdote worth a permanent rule.
- Ties back: you cannot classify a cause from n=1. One session IS n=1. That is what the 100 000 sessions thing was actually about. Sample size, not volume.

## Enter Shingo

- Mistakes are inevitable. Defects are optional. That distinction is the whole thing.
- Poka yoke. The jig that only fits one way round. The connector that will not seat backwards.
- Nobody has to remember anything. That is the trick.
- A rule is a request to remember. Poka yoke deletes remembering from the loop.

## The ladder (weakest at the bottom, where everyone lives)

1. Make it unavailable. Read only credentials beat "do not touch prod". Constrain the action space and the failure mode has no rule because the move does not exist.
2. Make being wrong structurally impossible. A schema instead of "return valid JSON". A typed tool instead of a hopeful string.
3. Catch at source. A hook that blocks the commit. A test that runs before you even see the output. Same session, same minute.
4. Catch downstream. Review, CI. Works, but the defect already travelled.
5. Remind. The rules file. Weakest rung.

- Everyone spends their time on 5. Writing a sentence feels like progress. Building a jig feels like work.
- That might be the whole article in one line.

## Shingo's amendment to Deming

- Shingo distrusted sampling. He wanted 100% inspection at source.
- Impossible in a factory on cost grounds, which is why he made inspection mechanical and cheap.
- In our world it costs nothing. A hook fires every session, forever, zero marginal cost.
- The constraint that shaped Toyota does not constrain us at all. We just kept the habits anyway.

## The meta

- Agents build agents. The thing doing the work is also the thing building the jigs.
- So the system gets progressively more reliable. In principle it compounds on its own.
- But only with measurement. No measurement and you are back to anecdotes and posters.
- And only with constant action. The loop does not run itself just because you set it up once.
- Note to self: this might be the real ending, not the poster question.

## Open ending (not a summary)

- Not saying never write a rule. Special causes are real and rules are the right tool for them.
- Saying: sort first. Then pick the rung.
- Question to leave hanging: how much of your rules file is a jig, and how much is a poster?

## Not yet placed

- Detection latency. The cost of an agent error scales with how far it travels before someone notices.
- Source inspection vs informative inspection, Shingo's own terms. Maybe too inside baseball.
- Something on why "be more careful" is the same failed instruction whether the worker is human or a model.

## Personal note: satisficing vs absolutes (added 2026-08-24)

- I always coded into "satisficing" with TDD. Green bar, ship, move on. Absolute beauty or perfect form was never the point for me.
- Suspicion: agentic quality is hardest for people who lived with absolutes. The code must be *right*, the answer must be *the* answer. A worker that is correct 97% of the time is not a tool to them, it is an insult.
- Same split in business life. Zero defects as a moral stance vs defects as a rate you manage.
- TDD was already a statistical mindset in disguise: you never proved the code correct, you built jigs that made the wrong thing fail loudly. Poka yoke for people who did not know the word.
- Possible placement: near the ladder, or as the personal angle in the hook. Explains why some readers will find this article obvious and others offensive.

## Note: quality is not inspecting every car (added 2026-08-24)

- Toyota did not get quality by inspecting every finished car fully. That is the Detroit model: build it, then find out. Shingo and the Japanese figured out you cannot inspect quality in at the end.
- Quality comes from the process being unable to produce the defect, plus cheap checks at each station, plus the line stopping the moment something is off (andon).
- The agentic parallel: reading every agent output end to end is final inspection. It does not scale and everybody knows it, which is why "review everything" quietly becomes "review nothing".
- Suspect the same methods carry straight over: jigs at each step, station-level checks (hooks, tests, schemas), stop-the-line on anomaly, and statistical sampling of the rest.
- Tension to resolve with the "Shingo's amendment" section: he wanted 100% inspection *at source*, cheap and mechanical, not 100% inspection of the finished car by a human. Those are opposites, and the article should say so clearly.

## Note: emergent lines vs designed lines (added 2026-08-24)

- Clear difference: a manufacturing line is designed, put together, then evolved slowly. An agent pipeline can be fully emergent, the agents assemble and reshape the line as they go.
- But the quality question does not change. Output quality and action validity in an agent pipeline behave very like mass car making: rates, stations, defects that travel.
- So: the *structure* of the line is new. The *quality discipline* on the line is not. Do not let the novelty of the first fool you into reinventing the second.

## Note: the control chart is the interesting bit (added 2026-08-24)

- Keep Ohno out. The chart is the spine of the piece.
- Deming's real move was not "sort causes", it was the instrument that lets you sort: the control chart. Plot the failure rate over time, draw the limits, and the process tells you which pile a point is in. No judgement, no post mortem, no narrative from the agent.
- Point inside the limits: common cause. Touch nothing. Writing a rule here is tampering by definition.
- Point outside the limits: special cause. Now, and only now, go root cause it.
- Nobody running agents has a chart. They have anecdotes: the one bad session on Tuesday. That is a single data point with no limits around it, which is exactly the situation the chart was invented to stop people reacting to.
- Reruns are how you draw the chart. Same task, fresh session, N times gives you the baseline and the limits. Every subsequent session is a plotted point. That is what the rerun section is actually for; it is the chart, not a trick.
- The chart also tells you when the jig worked: the mean drops and the limits tighten. Without it, "we added a hook" is a feeling.
- Cheapest control chart in history: an eval suite run on a schedule, results on a line. Nobody does it because it looks like overhead. It is the only thing that is not overhead.
- Likely restructure: the chart is the hinge between the Deming half (diagnose) and the Shingo half (prescribe). Show the chart, then ask which rung of the ladder fixes the out-of-limit points and which architectural change lowers the mean.
