# Transcript: carefulness-driven vs. outcome-driven development

Antti's own words, verbatim, in the order given. No edits.

---

## 2026-10-21

The topic is curiosity-driven development versus outcome-driven development. And curiosity is actually not the right word. The right word would be carefulness-driven versus outcome-driven. And what I mean by that at the core is that the original software engineering, even before Agile, and like at the times when software creation was really a craft, was much about the carefulness of the developer, that the requirements were right, that the design was right, and especially that the code was right, that the code would not crash, it would not cause trouble. And the main way of doing the quality was that the developer took very precise care and caution and thought through it very deliberately, not to add anything in the software that would cause the software to misbehave or to crash or to have bugs. So that's what I mean by caution-driven development.

---

One story about my work. It was actually about 20 years ago. Close enough. I used to work with a developer, and he was responsible single-handedly of a system critical component, a backend service. If it was down, we would not basically have let's put it this way. If that service was down, we would not, like if that service was down for more than a day, we would be in crisis mode. So it was a mission critical service handling one aspect of the whole system single-handedly. The service actually wasn't that big. Like, assume something like 10 to 20 classes, a database with maybe 8 tables. So something that you would call a small microservice today. But the story is that we would quite often find ourselves bottlenecked on that component, and then we would go and talk to the developer and get estimates on how long things take, and sometimes it would take a month for a change that some of us felt was kind of not trivial but easy enough. And then once I remember talking to the developer, and I asked him that how do you verify things, how do you test things, and he said that basically that he does a few things, that he tries out the database queries by hand and so forth. But basically then he kind of plainly said that I think through the change, and after I thought through the change, I can write the code, and then I basically know that it will work.
