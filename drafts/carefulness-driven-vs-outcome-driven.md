---
title: "Carefulness-Driven vs. Outcome-Driven Development"
slug: "carefulness-driven-vs-outcome-driven"
author: "Antti Tevanlinna"
created_at: "2026-10-21"
tags: ["ai", "software", "quality", "leadership"]
newsletter: false
estimated_reading_time: ""
status: draft
---

# Carefulness-Driven vs. Outcome-Driven Development

The topic is curiosity-driven development versus outcome-driven development. And curiosity is actually not the right word. The right word would be carefulness-driven versus outcome-driven.

What I mean by that at the core is that the original software engineering, even before Agile, at the times when software creation was really a craft, was much about the carefulness of the developer. That the requirements were right, that the design was right, and especially that the code was right. That the code would not crash, it would not cause trouble.

The main way of doing the quality was that the developer took very precise care and caution and thought through it very deliberately. Not to add anything in the software that would cause the software to misbehave or to crash or to have bugs.

So that's what I mean by caution-driven development.

## I know it will work

One story about my work. It was actually about 20 years ago. Close enough.

I used to work with a developer, and he was responsible single-handedly of a system critical component, a backend service. If that service was down for more than a day, we would be in crisis mode. So it was a mission critical service handling one aspect of the whole system single-handedly.

The service actually wasn't that big. Assume something like 10 to 20 classes, a database with maybe 8 tables. So something that you would call a small microservice today.

But the story is that we would quite often find ourselves bottlenecked on that component. We would go and talk to the developer and get estimates on how long things take. Sometimes it would take a month for a change that some of us felt was not trivial but easy enough.

Once I remember talking to the developer, and I asked him: how do you verify things, how do you test things? He said that he does a few things, that he tries out the database queries by hand and so forth.

But then he plainly said: I think through the change, and after I thought through the change, I can write the code, and then I basically know that it will work.

So this is my prime example of caution-driven development. Maybe that's not the right word, even. That is a case where the human analyzes through it fully. And then since you know it works, there is a good likelihood that it will work, whatever the change is.

## The limit of a single mind

The thing is that, of course, that sets the upper limit to how much a single mind can crunch through and analyze in breadth and depth. And traditionally, we've known the limits, and the limit is pretty fixed.

## The craft died once already

I think the modern software engineering killed the original craft. The unit testing, BDD, automated system testing became, well, not the exact norm, but it allowed us to maintain velocity at scale much better than this meticulous checking and manual testing, the very traditional approaches that we had around year 2000.

So in that sense the original developer was dead in 2010. That method no longer was acceptable.

The method that has been prevailing by now has been the method where we actually do a semi-good job with acceptance criteria. We write system tests, we write integration tests, we write unit tests, we have our test pyramid at hand. So it's not black and white in that way.

## The same ceiling, in reverse

And now LLMs and agentic development change the whole landscape.

The more I look at this, you can't really scale agentic coding beyond what you can check as human, as long as you're working in the old style. Where it's caution driven, and human checks and human spot checking and human evaluation based.

It is not that much different than the traditional way, where you first thought through it and then you code it. Now you first have the LLM code it, and then you still need to think through it to be able to evaluate the resulting code as human.

This caution-driven, qualitative definitions and checks by human is pretty much bound to the 2x or 4x that we're seeing quite a lot now.

## One level upwards

But I still think the missing piece is getting more and more one level upwards. It's to go into definitions of architecture, definitions of latency of responses, definitions of reliability of services.

And that is, of course, where we're going. Where we're going is outcome-driven development. You specify the outcome as measurable things, properties of the resulting system. Then you leave the agent to build it against those criteria and metrics and outcomes, and the agent will get there.

And once we have those one level upwards outcomes, instead of simple binary acceptance criteria, then what happens is that your agents start to define acceptance criteria and these binary checks. And then that scales.

The only way to get beyond that ceiling is to start writing down the actual outcomes, the actual properties of the software that you need. Only when you can define those properties, only once you can have your agent check against those and double check and triple check, and only when you have calibrated and found trust on those checks, only then you get past this 2x, 4x.

It is quite interesting as I talk through this. It just means that the traditional "let's write a few acceptance criteria down and let's then get coding, and maybe talk to humans in the meanwhile" paradigm is just now dead.

## And trust?

Calibration and reliability, I think, will be large enough topics for their own post and discussion.

But the short answer is: how is trust built? Trust is built from repeated piecemeal correctness, in terms of matching the assumptions of whoever is the person trusting.
