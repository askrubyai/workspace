# Ruby's Lessons Learned

*Updated after every task. Re-read at session start.*

## Operating Rules (derived from patterns)
1. **Execute, don't ask** — Reuben wants action, not options (Feb 12)
2. **Be specific** — "Found 3 issues: X, Y, Z" not "found some issues" (Feb 2)
3. **Think like a creative editor** — Make Reuben's life easier, not more work (Feb 13)
4. **Self-contained outputs** — Viewer/reader should understand without context (Feb 13)
5. **Work continuously overnight** — Stagger work, use quiet hours productively (Feb 13)

6. **Story format > bullet points for pitches** — Reuben thinks in narratives. Open with a real event, paint a picture, then reveal the solution. (Feb 16)
7. **Be honest about viability mid-pitch** — Flag real problems (Polymarket liquidity too thin) instead of hiding them. Reuben pivots fast when given honest data. (Feb 15-16)
8. **Names should tell the whole story** — soanpari, sealevel.fun, goldfloor. One word/phrase that communicates the concept. Funny > corporate. No parent brand in the name. (Feb 15)
9. **Iterate the pitch WITH Reuben, not FOR him** — Send versions, get feedback, pivot fast. V1→V5 in 12 hours = correct pace. (Feb 15-16)
10. **Spawn math verification agents** — When making quantitative claims in pitches, verify with a parallel agent before presenting. Builds trust. (Feb 16)

---

## Pitch Building Playbook (learned from GoldFloor, Feb 15-16)

### The Process
1. **Start with the problem** — Find a real, recent, painful event. Gold crashed 9% on Jan 30? That's your opener. Numbers + dates + "this just happened" = urgency.
2. **Paint the picture** — "$50K in $GOLD, you wake up and $4,500 is gone." Make it feel personal to the reader.
3. **Simple solution, one sentence** — "GoldFloor puts a floor under your gold." If it takes a paragraph to explain, simplify.
4. **UX before tech** — Slider → cost → one button → done. The reader should feel how easy it is BEFORE they learn how it works.
5. **Show the math in a table** — One clean table with hedge levels, costs, yields, net to user. Tables > paragraphs for numbers.
6. **Why THIS matters for THEM** — Frame as complementary, not selling. "This unlocks institutional capital for you" > "give us money."
7. **Keep it under 2 minutes** — Reuben's rule. If the reader scrolls more than 3x, it's too long.
8. **End with team, not ask** — Let the work speak. A strong pitch doesn't need a "please fund us" section.

### Research Process
1. **Explore ALL hedging/backend options** — Don't anchor to the first idea. We went prediction markets → vaults → routing layer → perps. Each pivot was data-driven.
2. **Pull real data** — Polymarket gamma API, actual liquidity numbers, real fee structures. "Nearest strike is 8.8% below spot with $1-5K liquidity" kills bad ideas fast.
3. **Be honest about what doesn't work** — Sending Reuben the honest Polymarket spread analysis led to the perps pivot, which was 10x better.
4. **Check multiple venues** — Flash Trade, Lighter, Ostium, Binance. Compare fees, chains, leverage, oracle compatibility.
5. **Verify quantitative claims** — Spawn a sub-agent to independently check the math before putting it in the pitch.

### Naming Process
1. **Brainstorm 50+ names** across categories: wordplay, Hindi/Sanskrit, descriptive, domain-first
2. **Test the "explain in 1 word" rule** — goldfloor = your gold has a floor. sealevel.fun = sea level rising. outcomes.world = prediction outcomes.
3. **Funny/unserious > corporate** — foolsgold, soanpari, crashpad > "GoldGuard Pro"
4. **Check domain availability** early — .xyz, .fun, .finance, creative TLDs
5. **Don't use the parent brand** — "Oroboros" was rejected because it had "Oro" in it. The product should stand alone.
6. **Let Reuben pick** — Give 5-6 favorites with reasoning, let him choose. He has strong taste.

### Anti-Patterns (What NOT to Do)
- ❌ Don't present slides/decks — Reuben wants clean Notion writeups
- ❌ Don't use vaults/bootstrapped liquidity in MVP — "Who tf is going to put $100K?"
- ❌ Don't choose backends definitively — Leave as TBD, show options
- ❌ Don't add "The Ask" section if the pitch is strong — Let the work speak
- ❌ Don't write "open source" unless strategically important
- ❌ Don't use prediction markets for precise hedging — Buckets too wide, liquidity too thin

## Task Log
<!-- Newest entries at top -->

### GoldFloor Pitch (Feb 15-16) — Rating: 4.5/5
- **What:** Built GRAIL grant pitch for Oro Finance, 5 versions in 12 hours
- **What worked:** Story format, honest viability flags, real data (Polymarket API, crash stats), fast pivots, parallel agents for research + math verification
- **What didn't:** V1-V3 were too long/complex, vault idea was DOA, should have gone to perps sooner
- **Reuben feedback:** "I like the current version" (V5 story format with perps)
- **Lesson:** Start with the simplest possible backend (existing liquidity), iterate UP in complexity only if needed
