# ServiceVoice

**A voice-first assistant — with text chat as a fallback — that tells Ethiopian citizens exactly what they need for a municipal service, before they ever stand in line.**

---

## The Problem

Citizens routinely spend hours waiting in line at local Kebele and Woreda offices just to ask what documents they need for something as routine as renewing a business license, replacing an ID card, or registering a birth. The information exists, but it's not accessible — it's locked behind an in-person visit, an official who may or may not be available, and a process that assumes you already know what to bring.

For low-literacy citizens, the barrier is worse: even when written requirements exist, reading dense administrative language isn't an option. The result is wasted trips, repeat visits, and time lost that a five-minute conversation should have prevented.

## The Solution

ServiceVoice is a 24/7 information desk, voice-first by design. A citizen simply asks, out loud, in their own language — "what do I need to renew my business license?" — and gets back a clear spoken answer: the exact documents required, the steps involved, and any fee, with the source of that information shown on screen for verification.

For citizens who prefer typing, or are in a setting where speaking isn't practical, the same question-and-answer flow is also available as text chat — same knowledge base, same citations, same answer, just typed instead of spoken. Voice remains the primary, defining way to use ServiceVoice; text chat is there so no one is blocked from getting an answer.

No reading dense government documents, no waiting in line just to ask a question.

## Why This App Is Needed

- **The problem is universal.** Every adult interacts with Kebele/Woreda services at some point — IDs, licenses, civil registration.
- **The barrier is accessibility, not availability.** The information already exists; citizens just can't get to it without a trip they could have avoided.
- **Voice removes the literacy wall.** A citizen who can't confidently read a government checklist can still ask a question out loud.
- **Text chat covers the rest.** Some citizens prefer typing, or are somewhere speaking aloud isn't comfortable — the same answers stay reachable either way.
- **It scales without adding staff.** One well-researched knowledge base serves unlimited citizens, unlike an office with limited counter hours.

## Who Uses It

**Primary user: Citizen** — anyone who needs to know the requirements for a specific municipal service before making a trip to the office, by voice or by text.

No login, no account, no second role — one person, one question, one answer.

## Core Workflow

1. Citizen opens the app and either speaks or types their question.
2. Voxide (for voice) or the text input transcribes/reads the question and matches it to the correct service.
3. The app looks up the service in its researched, cited knowledge base.
4. The answer is delivered in the same mode the citizen used — spoken aloud for voice, written for text chat — with a matching on-screen checklist and a visible source citation either way.
5. If the service has a real fee, the citizen can optionally pay it via Links.et.
6. Citizen leaves fully informed — no office visit required just to ask.

## Features

### MVP — build and demo this hackathon
- **Voice ask** — citizen speaks their question naturally, no typing required
- **Voice answer** — spoken response with documents, steps, and fee
- **Text chat** — the same ask-and-answer flow available by typing, for citizens who prefer it or can't speak aloud in the moment
- **Document checklist** — on-screen list mirroring the answer, with a visible source citation
- **Step-by-step mode** — walks the citizen through the process one step at a time instead of one long answer, useful for multi-step services
- **Language switch** — toggle between Amharic, Oromiffa, and English, for both voice and text

### Roadmap — real ideas, not this hackathon's scope
- **Public feedback dashboard** — citizens rate whether an answer was accurate/helpful, visible publicly to build trust over time. Deferred: this adds a second role (moderation), a submissions database, and a feature surface with no direct hackathon scoring value. Worth pursuing post-hackathon if the project continues.
- **SMS/USSD access** — the same question-and-answer flow over SMS or a USSD menu, for citizens without a smartphone. This is the single most important accessibility gap ServiceVoice doesn't yet close — smartphone ownership is not universal, and USSD reaches basic-phone users the app cannot. Deferred because it requires a second delivery channel and telecom integration outside Voxide, and doesn't touch the hackathon's core voice requirement — but it's the clearest next step for this product to have real reach.

## Services Covered (MVP)

1. Kebele ID card — new or replacement
2. Business license renewal
3. Birth certificate registration
4. Kebele residence / support letter

## Stack

| Requirement | How ServiceVoice uses it |
|---|---|
| **Voxide** | Core voice interaction — citizen speaks, app responds aloud. Required and central to the product; text chat is a secondary mode built on the same underlying Q&A engine. |
| **Scholarxiv** | Used to document our ideation process — how we identified the problem and arrived at this solution. |
| **Links.et** | Optional — used only for services that carry a real government fee. |
| **EthioDeploy** | Hosting for the web platform. |

## What Makes This Trustworthy

Every answer ServiceVoice gives — whether spoken or typed  is backed by a cited source, not an AI guess. We scoped to four well-researched services rather than claiming universal coverage, because a wrong answer about government requirements has real cost to a citizen who acts on it.
