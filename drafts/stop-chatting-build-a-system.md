---
title: "Stop Chatting. Build a System"
slug: "stop-chatting-build-a-system"
author: "Antti Tevanlinna"
created_at: "2026-08-10"
tags: ["ai", "processes", "strategy", "leadership"]
newsletter: false
estimated_reading_time: ""
---

# Stop Chatting. Build a System

Stop chatting. Build a system. I keep parroting this over and over. What changed is that now we can build the basic system for repeated performance in pretty much any information, software or similar field. Need a system for roadmap management and curation? Prompt for it. Prompt for it in a specific way. That the system is self-improving. 

Remind yourself: your agent looks only at the task at hand; unless you have said the task handling includes improving for the next time.

Your performance is really about the next 100 sessions. I actually should say it really is about the next 100 000 sessions. 100 agent sessions is the dose for the week for many. 

Sure: you can complete a task quick by handholding the agent. You tell the agent what to do next. But then it is very close to chat. And chat is the worst. You chat. Maybe make some actions from the chat. But poof at the end, nothing is saved. And I know someone will say that chats have memory now. Something is remembered. But this is not a system. 

We build for the future sessions. Building a system can be distilled into 3 simple moves. 

# Retro & root-causing

Your agent does something wrong. Just stop it. Usually best stopped the instance something unexpected or wrong happens. Then the context is more fresh and the agent is better at figuring out what happened. 

Prompt: "YXZ was wrong. Here's why ... Run a root cause analysis on why this happened." 

And at the end of the session:

Prompt: "Let's do a retro of this session. What was good, bad and could be improved? (Insert your favorite retro style)"

Both of these produce usually pretty usable improvements, mitigations and changes. 

Simple ways of getting going with system building: "Let's store this so that every next session can use these improvements"

A system is something that recurs and controls how things work. You build your own system bit by bit. 

# Rule extraction from session

A more sophisticated way is to double use the agent. The first order of business for the agent is to handle the task at hand. The second order of business is to learn the preferences, rules and style of the person creating whatever is being created. The agent does whatever the agent is asked to do. 

Prompt: "Build me a system that captures our rules and my taste from my steering. Each comment is a potential source of better and more complete definitions of the rules and the taste. Capture what needs capturing. At end of each session we review learnings. At any point I can say let's learn and we will process what needs processing. Make sure this loads to all sessions.". 

Slightly longer but I'm sure you get the whiff. And there are infinite variations. 

You built a system that both handles tasks and learns. Sounds quite like double loop learning (nod to Chris Argyris). Cause it is.

# Compounding and rule loading

Prompt: "See what rules we have. Ensure they load. Make sure the system compounds, self-improves and continually evolves."

This might already yield that you have that working. The point is to automatically have your agent running the learning loop. Many call that compounding. 

Double loop learning is that the system changes its fundamental assumptions and the rules governing it as it learns. Double loop learning is thus something more than "I spotted a mistake and corrected that". A system learns to learn. Try pushing that past a few sessions and you will notice how that is both possible and hard. 

# No need for external plugins

I don't want to name the right way to do this. This loop can get built with surprisingly sloppy prompting. Tuning will take time of course. 

The saying goes: there are many ways to skin a cat. 

There are countless places where to store the learning. There are frameworks and plugins. Nobody has really benchmarked which is best. And the field moves again at speed of light. 

# Deming knew it

The Lean and Agile people liked to quote Deming - the quality guru. I very much appreciate the theory of quality based on actual distributions and the worldview where outcomes are not pre-determined but variation and chance exists. 

"You arrive at stable system by reducing causes of variation" (Paraphrased)

The process is roughly:

1. **Achieve statistical control:** bring the process to a state where output is predictable.
2. **Remove special causes:** find and eliminate assignable or special causes of variation (the "noise").
3. **Manage common causes:** once stable, reduce the common causes of variation that belong to the system itself.

Highly valid with the probabilistic nature of the LLM and the agent. Old stuff still works. Build a system. 
