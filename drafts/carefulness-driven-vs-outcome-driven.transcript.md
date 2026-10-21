# Transcript: carefulness-driven vs. outcome-driven development

Antti's own words, verbatim, in the order given. No edits.

---

## 2026-10-21

The topic is curiosity-driven development versus outcome-driven development. And curiosity is actually not the right word. The right word would be carefulness-driven versus outcome-driven. And what I mean by that at the core is that the original software engineering, even before Agile, and like at the times when software creation was really a craft, was much about the carefulness of the developer, that the requirements were right, that the design was right, and especially that the code was right, that the code would not crash, it would not cause trouble. And the main way of doing the quality was that the developer took very precise care and caution and thought through it very deliberately, not to add anything in the software that would cause the software to misbehave or to crash or to have bugs. So that's what I mean by caution-driven development.

---

One story about my work. It was actually about 20 years ago. Close enough. I used to work with a developer, and he was responsible single-handedly of a system critical component, a backend service. If it was down, we would not basically have let's put it this way. If that service was down, we would not, like if that service was down for more than a day, we would be in crisis mode. So it was a mission critical service handling one aspect of the whole system single-handedly. The service actually wasn't that big. Like, assume something like 10 to 20 classes, a database with maybe 8 tables. So something that you would call a small microservice today. But the story is that we would quite often find ourselves bottlenecked on that component, and then we would go and talk to the developer and get estimates on how long things take, and sometimes it would take a month for a change that some of us felt was kind of not trivial but easy enough. And then once I remember talking to the developer, and I asked him that how do you verify things, how do you test things, and he said that basically that he does a few things, that he tries out the database queries by hand and so forth. But basically then he kind of plainly said that I think through the change, and after I thought through the change, I can write the code, and then I basically know that it will work.

---

So this is my prime example of caution-driven development. Maybe that's not the right word, even. That is a case where the human analyzes through it fully. And then since you know it works, there is a good likelihood that it will work, whatever the change is. The thing is that, of course, that sets the upper limit to how much a single mind can crunch through and analyze in breadth and depth. And traditionally, we've known the limits, and the limit is pretty fixed. And now LLMs and agentic development changes the whole landscape. And that is, of course, where we're going. And where we're going is the outcome-driven development, that you specify the outcome as measurable things, properties of the resulting system, and then you leave the agent to build it against those criteria and metrics and outcomes, and the agent will get there.

---

And I know that you know this, but the more I look at this, you can't really scale agentic coding beyond beyond what you can check as human, as long as you're working in the old style, where it's caution driven, and human checks and human spot checking and human evaluation based. It is not that much different than the traditional way, where you first thought through it and then you code it. Now you first have the LLM code it, and then you need to still think through it to be able to evaluate it as human, that is the resulting code, right?

---

So the moral of the story is that this caution-driven and qualitative definitions and checks by human is pretty much bound to the 2x or 4x that we're seeing quite a lot now. And the only way to get beyond that ceiling is to start writing down the actual outcomes, the actual properties of the software that you need. And only when you can define those properties, only once you can have your agent check against those and double check and triple check, and only when you have calibrated and found trust on those checks, only then you get past this 2x, 4x.
