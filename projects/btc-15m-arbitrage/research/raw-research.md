=== THREAD 1: @0xMovez - Polymarket Weather/Clawdbot ===

@0xMovez (Movez):
📰 How to run Polymarket weather trading Clawdbot ? No code. Using Simmer SDK & SpartanLab "skill base"

Today I was searching X for MoltBot-related content and thinking about its use cases in the context of Polymarket.

Suddenly, I came across this post from [@TheSpartanLabs](https://x.com/TheSpartanLabs) that had only 200 views:

[Embedded Tweet: https://x.com/i/status/2016713865149763796]

Basically Spartan Labs is creating modular trading "skills" (automated trading modules) for the OpenClaw AI agents that enable Polymarket trading through natural language commands.

Using their «skills base» and Simmer SDK, which allows users to build custom trading strategies through conversational chat without coding, you can’t create you trading assistant right in you TG, Discord or even Slack chats.

## How its works ?

The "skills" are Python-based modules that integrate with Polymarket's Polygon contracts and CLOB (Central Limit Order Book) API.   

Users can execute trades through natural language prompts "Buy $50 YES on market X" or "Find me hedging opportunities," and the AI agent handles the execution automatically.

## What skills are coming to Polymarket trading?

As of now, they've already announced 6 skills that are coming:

- Weather trading: 

Trade weather markets using NOAA forecast data. Automatically monitors temperature predictions and executes trades when forecasts match market buckets.

> Inspired by [gopfan2's](https://polymarket.com/profile/0xf2f6af4f27ec2dcf4072095ab804016e14cd5817?via=following) $2M+ weather trading strategy

How it works: 

1. Fetches NOAA forecast data for configured locations

2. Matches predictions to market buckets (e.g., "34-35°F")

3. Calculates confidence based on forecast certainty

4. Executes trades when confidence exceeds threshold

---

- Copytrading

Monitors wallets from your configured whale list or top traders. Larger positions from tracked wallets create stronger signal weight.

> Follow wallets with 60%+ win rates from alphawhale.trade

How it works:

1. Monitors configured whale wallet addresses

2. Aggregates positions with size-weighted scoring

3. Filters for high-conviction positions

4. Mirrors positions with configurable max size

---

- Signal Sniper

Trade on breaking news from RSS feeds with built-in risk controls. Works with any RSS feed - news sites, Twitter-to-RSS, newsletters.

> Catch news before markets react with Claude-powered analysis

1. Polls configured RSS feeds for new articles

2. Matches headlines against your keywords

3. Checks market liquidity and current positions

4. Executes trade or alerts you based on config

---

- Trade Journal

Auto-log every trade with entry thesis, market conditions, and outcomes. Monthly calibration reports identify mistakes and improve your edge.

More details coming soon...

---

- Arbitrage Scanner

Scans correlated markets for mispricings. When YES+YES on mutually exclusive outcomes < $1.00, profit is guaranteed.

More details coming soon...

---

- X Sentiment

More details coming soon...

That sounds really big in my opinion and I'm sure it's just a small part of what's coming.

---

# How to start your own Clawbot using Simmer SDK ?

The second question I asked myself, when I got an answer to what I had found, was "how can I start my own Clawdbot for Polymarket trading?"

And we'll break this point down into 4 sub-points:

- Installing Clawdbot on your device

- Connecting it to ChatGPT 5.2 and a Telegram bot

- Installing Simmer SDK

- Funding your wallet on Simmer and launching the bot

Thanks to Simmer founder Adrian, who helped me a lot with all the troubles along the way and answered all my questions until I was done.

---

## Step 1: Install Clawdbot on your Mac/PC

First of all, I recommend you explore OpenClaw's official documentation to understand all the risks involved in installing it on your devices.

The installation procedure isn't hard, but you need to do it correctly for your bot to work well and avoid getting a ton of troubles like I had.

1) Go to the official MoltBot site ( clawd . bot ) and find the one-liner installation code

```bash
curl -fsSL https://molt.bot/install.sh | bash
```

2) Open your "terminal" (I'm using Mac for installation) and paste it there. Give it 2-3 minutes to be done.

3) Start Clawdbot "Onboarding guide".

If you haven't seen a "code" as in the picture below, run the onboarding guide command.

```bash
openclaw onboard

```

4) Next, choose the options I'm about to list:

- I understand this is powerful and inherently risky: YES

- Onboarding mode: QUICK START

- Model/auth provider: OpenAI ( Codex Auth + API Key )

- OpenAI aut method: ChatGPT OAuth

Then it will ask you to connect your ChatGPT account, which MoltBot will use to analyze information.

I bought ChatGPT Plus ($20 per month) for my Clawdbot. You may connect any other provider from the list that you want or are already using. It doesn't matter.

5) Connect the Telegram bot to communicate with Moltbot:

- Select Telegram bot API

- Go to @BotFather in Telegram and send /newbot

- Then create a name for your bot and a @username that ends with "bot"

Then enter this token to your terminal.

- After this, send a message to your Telegram bot and it will send you back your bot ID and your pairing code. Send them to the terminal too.

6) Complete the Clawdbot installation by selecting the same options as I did.

---

## Step 2: Set up Simmer Agent

Now lets start with setting up Simmer agent.

- First, go to ( simmer . markets ) and connect your EVM wallet.

- Press the wallet button in the right corner and deposit USDCe (Polygon), POL, and USDC (Base) to your platform account.

- Then go to the Agent tab at the top → choose OpenClaw on the left → Overview tab and click "manual" Installation.

- Copy the "code-message" and send it to your MoltBot in Telegram, terminal, or using localhost

```bash
Read https://simmer.markets/skill.md and follow the instructions to join Simmer
```

- I sent this command to the Telegram bot, and Clawdbot sent me a link for Agent registration back → Enter the link and connect your bot with your wallet."

- If you don't get a link, try sending this message: "Follow the Simmer skill Quick Start - register and send me the claim link

## 3. Install "skill" for your Moltbot

Go to the skill section at Simmer Market and choose the skill for your bot to use for trading. For example, I will trade weather markets.

- Copy the command from the skill section and send it to your MoltBot chat.

- Once it's installed, your MoltBot is ready for trading on Polymarket.

- Now you can talk to him as to your personal assistant and it will use pre-trained strategies to find opportunities and trade on Polymarket.

---

## Conclusion:

In my opinion [@TheSpartanLabs](https://x.com/@TheSpartanLabs) and Simmer Markets are opening a big market of pre-trained models for Clawdbot assistants which will help you trade on Polymarket and search for new opportunities.
📅 Mon Feb 02 07:16:16 +0000 2026
🔗 https://x.com/0xMovez/status/2018221915765141989
──────────────────────────────────────────────────

@Alexo_0x (Alexo):
@0xMovez Venture funds have seriously started building bots for trading, and we are at the very beginning, let's see what the polymarket will become in a year
📅 Mon Feb 02 07:20:42 +0000 2026
🔗 https://x.com/Alexo_0x/status/2018223031139643672
──────────────────────────────────────────────────

@danilcrypt1 (Daniel):
@0xMovez Useful information

Thank you

I saved it in bookmarks, I’ll be at home and read it more legibly
📅 Mon Feb 02 07:20:51 +0000 2026
🔗 https://x.com/danilcrypt1/status/2018223071404892190
──────────────────────────────────────────────────

@0xMovez (Movez):
@Alexo_0x Yeah. I was really surprised when I saw this in the @TheSpartanLabs SDK.
📅 Mon Feb 02 07:22:10 +0000 2026
🔗 https://x.com/0xMovez/status/2018223404202029439
──────────────────────────────────────────────────

@0xMovez (Movez):
@danilcrypt1 You are welcome Daniel ! DM me if you will have any problems with setting it up !
📅 Mon Feb 02 07:23:01 +0000 2026
🔗 https://x.com/0xMovez/status/2018223617373352162
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@0xMovez alright, sitting down to write a new article about Clawdbot

they surprise me every single day and keep building something new https://t.co/r5kroBjWhX
🔄 https://pbs.twimg.com/tweet_video_thumb/HAIsrn4WMAAbZ7H.jpg
📅 Mon Feb 02 07:27:24 +0000 2026
🔗 https://x.com/noisyb0y1/status/2018224719137329226
──────────────────────────────────────────────────

@VitalijPrijmak (Vitaliy Pryimak .ink 🛸 💢| Tabi🟧🚀🌶️ | ETHGas ⛽):
@0xMovez Thank you!😎
📅 Mon Feb 02 07:30:08 +0000 2026
🔗 https://x.com/VitalijPrijmak/status/2018225404939542544
──────────────────────────────────────────────────

@0xMovez (Movez):
@noisyb0y1 This is not just another one bro. Real agents which are trading. Try it first !
📅 Mon Feb 02 07:33:21 +0000 2026
🔗 https://x.com/0xMovez/status/2018226218340905197
──────────────────────────────────────────────────

@0xMovez (Movez):
@VitalijPrijmak You are welcome Vitaliy
📅 Mon Feb 02 07:48:56 +0000 2026
🔗 https://x.com/0xMovez/status/2018230136760349111
──────────────────────────────────────────────────

@zodchiii (darkzodchi):
@0xMovez great article, def a bookmark
📅 Mon Feb 02 07:53:06 +0000 2026
🔗 https://x.com/zodchiii/status/2018231186259063226
──────────────────────────────────────────────────

@0xMovez (Movez):
@zodchiii Thank you mate. DM me if you will have any questions !
📅 Mon Feb 02 07:56:57 +0000 2026
🔗 https://x.com/0xMovez/status/2018232153604042841
──────────────────────────────────────────────────

@de1lymoon (Alex):
@0xMovez As always, you did a great job 🫡
📅 Mon Feb 02 08:02:10 +0000 2026
🔗 https://x.com/de1lymoon/status/2018233467939570089
──────────────────────────────────────────────────

@0xMovez (Movez):
@de1lymoon Thank you Alex ! Will drop updates on my bot in coming posts !
📅 Mon Feb 02 08:02:57 +0000 2026
🔗 https://x.com/0xMovez/status/2018233666158170198
──────────────────────────────────────────────────

@0xMovez (Movez):
Bot is using Gopfan2 strategy for weather trading: 

https://t.co/79NkrAeRW0
📅 Mon Feb 02 08:22:03 +0000 2026
🔗 https://x.com/0xMovez/status/2018238470376902731
──────────────────────────────────────────────────

@DeRonin_ (Ronin):
@0xMovez Oh my goood, as always insane quality of work
📅 Mon Feb 02 08:26:09 +0000 2026
🔗 https://x.com/DeRonin_/status/2018239505497489778
──────────────────────────────────────────────────

@recogard (Recogard):
@0xMovez Incredible research, great job ! Bookmarking yr article, as always
📅 Mon Feb 02 08:27:52 +0000 2026
🔗 https://x.com/recogard/status/2018239936768401610
──────────────────────────────────────────────────

@0xMovez (Movez):
@DeRonin_ Thank you bro ! No sleep, to deliver alpha 24/7 to my bros !
📅 Mon Feb 02 08:28:11 +0000 2026
🔗 https://x.com/0xMovez/status/2018240016988737803
──────────────────────────────────────────────────

@0xMovez (Movez):
@recogard Thank you mate ! Happy its useful for you !
📅 Mon Feb 02 08:28:29 +0000 2026
🔗 https://x.com/0xMovez/status/2018240091898986861
──────────────────────────────────────────────────

@Nick_Researcher (Nick Research):
@0xMovez what in the world is this sir, ilu
📅 Mon Feb 02 08:53:36 +0000 2026
🔗 https://x.com/Nick_Researcher/status/2018246412228755467
──────────────────────────────────────────────────

@0xMovez (Movez):
@Nick_Researcher We are entering the simulation, bro.
📅 Mon Feb 02 09:02:14 +0000 2026
🔗 https://x.com/0xMovez/status/2018248583061946639
──────────────────────────────────────────────────

@MykytaHaida (Mykyta Haida):
@0xMovez Thanks bro, appreciate it
📅 Mon Feb 02 10:27:28 +0000 2026
🔗 https://x.com/MykytaHaida/status/2018270032548045296
──────────────────────────────────────────────────

@0xMovez (Movez):
@MykytaHaida You are welcome mate !
📅 Mon Feb 02 10:31:52 +0000 2026
🔗 https://x.com/0xMovez/status/2018271140951490911
──────────────────────────────────────────────────

@kepochnik (kepochnik):
@0xMovez best article about Clawdbot for Polymarket i seen

will apply it when i get to Clawd setup task

golded: https://t.co/boKKXB3RNJ
🖼️ https://pbs.twimg.com/media/HAJb4JWWkAAU72P.png
📅 Mon Feb 02 10:54:34 +0000 2026
🔗 https://x.com/kepochnik/status/2018276853371359537
──────────────────────────────────────────────────

@0xMovez (Movez):
@kepochnik Thank you bro ! Send me your results !
📅 Mon Feb 02 10:57:03 +0000 2026
🔗 https://x.com/0xMovez/status/2018277481296306315
──────────────────────────────────────────────────

@tech_broo_ (Tech Bro):
@0xMovez Oracle latency is the bottleneck here. Success isn't just "no code"; it's about minimizing the state transition gap between NOAA data ingestion and contract execution. Alpha lies in the mev-drift.
📅 Mon Feb 02 11:47:35 +0000 2026
🔗 https://x.com/tech_broo_/status/2018290198430498964
──────────────────────────────────────────────────

@0xTengen_ (Tengen):
@0xMovez bro, you’re digging so deep, respect 

honestly, this is the best deep dive on this topic I’ve ever seen
📅 Mon Feb 02 12:34:39 +0000 2026
🔗 https://x.com/0xTengen_/status/2018302041865564178
──────────────────────────────────────────────────

@KnightShift (Knight):
@0xMovez The best instruction! share the results later!
📅 Mon Feb 02 12:39:15 +0000 2026
🔗 https://x.com/KnightShift/status/2018303200554516976
──────────────────────────────────────────────────

@serpentxbt (serpent):
@0xMovez great read!
📅 Mon Feb 02 12:58:34 +0000 2026
🔗 https://x.com/serpentxbt/status/2018308058263200036
──────────────────────────────────────────────────

@0xMovez (Movez):
@0xTengen_ Thank you Tegen. I spent whole night on it !
📅 Mon Feb 02 13:43:09 +0000 2026
🔗 https://x.com/0xMovez/status/2018319280027181454
──────────────────────────────────────────────────

@0xMovez (Movez):
@KnightShift Thank you Knight ! Sure will share, already testing my bot !
📅 Mon Feb 02 13:43:47 +0000 2026
🔗 https://x.com/0xMovez/status/2018319438550913218
──────────────────────────────────────────────────

@0xMovez (Movez):
@serpentxbt Have you already tested guide Serpent ?
📅 Mon Feb 02 13:44:12 +0000 2026
🔗 https://x.com/0xMovez/status/2018319542892499292
──────────────────────────────────────────────────

@0xMovez (Movez):
@tech_broo_ Thanks for details bro !
📅 Mon Feb 02 13:46:24 +0000 2026
🔗 https://x.com/0xMovez/status/2018320098918842435
──────────────────────────────────────────────────

@Atenov_D (Atenov int.):
@0xMovez Is there a difference in the use of AI models? I prefer Claude
📅 Mon Feb 02 14:35:41 +0000 2026
🔗 https://x.com/Atenov_D/status/2018332501089923193
──────────────────────────────────────────────────

@0xMovez (Movez):
@Atenov_D It’s basically chat type of communication + this bot has memory and can educate based on his knowledges
📅 Mon Feb 02 14:36:53 +0000 2026
🔗 https://x.com/0xMovez/status/2018332803692142992
──────────────────────────────────────────────────


=== THREAD 2: @TheSpartanLabs - Skills Base ===

@TheSpartanLabs (Spartan Labs):
We've been prototyping Polymarket trading skills for @openclaw:

1️⃣ Weather Trader — gopfan2-style temp bets via NOAA
2️⃣ Copytrading — follow top wallets automatically
3️⃣ Signal Sniper — trade on RSS feeds

The cool thing? With the Simmer SDK, you can build your own strategies in chat.

What would you automate? → https://t.co/IfJ09y34zG
🖼️ https://pbs.twimg.com/media/G_zLZwQacAAHV_M.jpg
📅 Thu Jan 29 03:23:48 +0000 2026
🔗 https://x.com/TheSpartanLabs/status/2016713865149763796
──────────────────────────────────────────────────

@nikolayxyz (Niko):
@TheSpartanLabs @openclaw https://t.co/sBEBnwfbkM
🔄 https://pbs.twimg.com/tweet_video_thumb/HAHEkXXWoAE2qaZ.jpg
📅 Sun Feb 01 23:52:32 +0000 2026
🔗 https://x.com/nikolayxyz/status/2018110246917439808
──────────────────────────────────────────────────

@MuraliDuvvuru (Murali Reddy):
@TheSpartanLabs @openclaw With natural prompt you can build Polymarket agent using @TheKodeusLabs ... We are adding Listeners and it makes agent autonomous.
📅 Mon Feb 02 06:33:20 +0000 2026
🔗 https://x.com/MuraliDuvvuru/status/2018211113331233059
──────────────────────────────────────────────────

@AlenaChramtsova (Alena Chramtsova):
@TheSpartanLabs @openclaw WOW!
📅 Mon Feb 02 08:55:58 +0000 2026
🔗 https://x.com/AlenaChramtsova/status/2018247008859951535
──────────────────────────────────────────────────

@KnightShift (Knight):
@TheSpartanLabs @openclaw It definitely needs to be tested!
📅 Mon Feb 02 08:59:11 +0000 2026
🔗 https://x.com/KnightShift/status/2018247816099848397
──────────────────────────────────────────────────

@cryptovcdegen (cryptovcdegen):
@TheSpartanLabs @openclaw 🤯
📅 Tue Feb 03 07:28:17 +0000 2026
🔗 https://x.com/cryptovcdegen/status/2018587328734769561
──────────────────────────────────────────────────


=== THREAD 3: @quantscience_ - Algo Trading ===

@quantscience_ (Quant Science):
How to make a simple algorithmic trading strategy with a 472% return using Python.

A thread. 🧵 https://t.co/P7Z24xEiaS
🖼️ https://pbs.twimg.com/media/HAFlV5zWsAAzObq.jpg
📅 Sun Feb 01 16:56:27 +0000 2026
🔗 https://x.com/quantscience_/status/2018005538387173787
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
This strategy takes advantage of "flow effects", which is how certain points in time influence the value of an asset. 

This strategy uses a simple temporal shift to determine when trades should exit relative to their entry for monthly boundary conditions. https://t.co/LUttlpu040
🖼️ https://pbs.twimg.com/media/HAFlWg0WsAEn5Y2.png
📅 Sun Feb 01 16:56:29 +0000 2026
🔗 https://x.com/quantscience_/status/2018005547799269845
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
The signals for when to go short, when to cover shorts, when to go long, and when to close longs are all linked to these recurring monthly cycles. 

This periodic "flow" of signals—month-in, month-out—creates a systematic pattern. https://t.co/N1JNBYxC7w
🖼️ https://pbs.twimg.com/media/HAFlW5NXYAA8iz3.png
📅 Sun Feb 01 16:56:31 +0000 2026
🔗 https://x.com/quantscience_/status/2018005554598220157
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
1. Load the libraries and data

Import these libraries. Then run the code to ingest price data on TLT. https://t.co/SYLSppq5tc
🖼️ https://pbs.twimg.com/media/HAFlXRIWYAAZESX.png
📅 Sun Feb 01 16:56:33 +0000 2026
🔗 https://x.com/quantscience_/status/2018005561338368349
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
2. Generate Signals

We'll first set up an empty data frame to track the long/short signals. 

Then we create short entry signals on each new month's 1st and 5th day. 

Similarly, we make long signals 7 days and 1 day before the end of each month. https://t.co/1QHf7FG540
🖼️ https://pbs.twimg.com/media/HAFlXpcWoAAeqaT.png
📅 Sun Feb 01 16:56:34 +0000 2026
🔗 https://x.com/quantscience_/status/2018005567936094422
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
3. Run this code to get the Trade PnL

Use vbt.Portfolio.from_signals(). https://t.co/603rDIHOiw
🖼️ https://pbs.twimg.com/media/HAFlYM_WsAEC-bC.png
📅 Sun Feb 01 16:56:36 +0000 2026
🔗 https://x.com/quantscience_/status/2018005576601485716
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
Use pf.stats() to return the portfolio stats summary tear sheet. https://t.co/6kKjwlJ8Vz
🖼️ https://pbs.twimg.com/media/HAFlYnXXcAEcQz_.png
📅 Sun Feb 01 16:56:38 +0000 2026
🔗 https://x.com/quantscience_/status/2018005584075796481
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
What is your next step? (To do this for real)

If you want to become an algorithmic trader in 2026, then I'd like to help.

This is how: 👇
📅 Sun Feb 01 16:56:40 +0000 2026
🔗 https://x.com/quantscience_/status/2018005590115549331
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
🚨￼Want to become an expert algorithmic trader with Python in 2026?

• QSConnect: Quant research database
• QSResearch: Research &amp; machine learning strategies
• Omega: Automated trade execution

👉 Join Our Free Algorithmic Trading Workshop: https://t.co/a8hBLutD7I https://t.co/L51VV6l5ay
🖼️ https://pbs.twimg.com/media/HAFlZS_XcAAVh89.jpg
📅 Sun Feb 01 16:56:41 +0000 2026
🔗 https://x.com/quantscience_/status/2018005596495110422
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
That's a wrap! Over the next 24 days, I'm sharing my top 24 algorithmic trading concepts to help you get started.

If you enjoyed this thread:

1. Follow me @quantscience_ for more of these
2. RT the tweet below to share this thread with your audience
┌─ QT @quantscience_:
│ How to make a simple algorithmic trading strategy with a 472% return using Python.
│ 
│ A thread. 🧵 https://t.co/P7Z24xEiaS
│ 🖼️ https://pbs.twimg.com/media/HAFlV5zWsAAzObq.jpg
└─ https://x.com/quantscience_/status/2018005538387173787
📅 Sun Feb 01 16:56:42 +0000 2026
🔗 https://x.com/quantscience_/status/2018005599263379593
──────────────────────────────────────────────────

@william_R2Rclub (William | Relax to Rich):
@quantscience_ While high returns are tempting, algorithmic trading also comes with high risks. Ensure the strategy is thoroughly tested and has risk management mechanisms in place.
📅 Sun Feb 01 17:06:13 +0000 2026
🔗 https://x.com/william_R2Rclub/status/2018007996031230006
──────────────────────────────────────────────────

@quantscience_ (Quant Science):
P.S. - Want to learn Algorithmic Trading Strategies that actually work?

I'm hosting a live workshop. Join here: https://t.co/Wu7rQ76Nm8
📅 Sun Feb 01 17:30:37 +0000 2026
🔗 https://x.com/quantscience_/status/2018014136676835452
──────────────────────────────────────────────────

@ballistic589 (prometheus589):
@quantscience_ @mdancho84 Sounds like hype. I shall put it to the test.
📅 Sun Feb 01 19:18:18 +0000 2026
🔗 https://x.com/ballistic589/status/2018041234976329744
──────────────────────────────────────────────────

@luizstefanuto (Luiz Stefanuto):
@quantscience_ In 20 years*
📅 Sun Feb 01 23:31:21 +0000 2026
🔗 https://x.com/luizstefanuto/status/2018104915717972465
──────────────────────────────────────────────────

@mahendran211 (mahendiran Kannan (NISM Certified)):
@quantscience_ @grok  very this tweet, is it true or overhyped
📅 Mon Feb 02 01:04:13 +0000 2026
🔗 https://x.com/mahendran211/status/2018128289769103595
──────────────────────────────────────────────────

@AndBertini (contrarian):
@quantscience_ So interesting
📅 Mon Feb 02 01:09:27 +0000 2026
🔗 https://x.com/AndBertini/status/2018129604813213819
──────────────────────────────────────────────────

@JohnSmithtxpm (John Smith):
@quantscience_ How to curve fit using python.
📅 Mon Feb 02 10:59:01 +0000 2026
🔗 https://x.com/JohnSmithtxpm/status/2018277973292442103
──────────────────────────────────────────────────


=== THREAD 4: @RohOnChain - Math for Polymarket ===

@RohOnChain (Roan):
📰 The Math Needed for Trading on Polymarket (Complete Roadmap)

I'm going to break down the essential math you need for trading on Polymarket. I'll also share the exact roadmap and resources that helped me personally.

Let's get straight to it

A recent research paper just exposed the reality. Sophisticated traders extracted $40 million in guaranteed arbitrage profits from Polymarket in one year. The top trader alone made $2,009,631.76. These aren't lucky gamblers. They're running Bregman projections, Frank-Wolfe algorithms, and solving optimization problems that would make most computer science PhDs uncomfortable.

> Bookmark This -
I’m Roan, a backend developer working on system design, HFT-style execution, and quantitative trading systems. My work focuses on how prediction markets actually behave under load.

When you see a market where YES is $0.62 and NO is $0.33, you think “that adds up to $0.95, there’s arbitrage.” You’re right. What most people never realize is that while they’re manually checking whether YES plus NO equals $1, quantitative systems are solving integer programs that scan 17,218 conditions across 2^63 possible outcomes in milliseconds. By the time a human places both orders, the spread is gone. The systems have already found the same violation across dozens of correlated markets, calculated optimal position sizes accounting for order book depth and fees, executed parallel non-atomic trades, and rotated capital into the next opportunity.

The difference isn't just speed. It's mathematical infrastructure.

By the end of this article, you will understand the exact optimization frameworks that extracted $40 million from Polymarket. You'll know why simple addition fails, how integer programming compresses exponential search spaces, and what Bregman divergence actually means for pricing efficiency. More importantly, you'll see the specific code patterns and algorithmic strategies that separate hobby projects from production systems running millions in capital.

Note: This isn’t a skim. If you’re serious about building systems that can scale to seven figures, read it end to end. If you’re here for quick wins or vibe coding, this isn’t for you.

---

## Part I: The Marginal Polytope Problem (Why Simple Math Fails)

The Reality of Multi-Condition Markets

Single condition market: "Will Trump win Pennsylvania?"

- YES: $0.48

- NO: $0.52

- Sum: $1.00

Looks perfect. No arbitrage, right?

Wrong.

Now add another market: "Will Republicans win Pennsylvania by 5+ points?"

- YES: $0.32

- NO: $0.68

Still both sum to $1. Still looks fine.

But there's a logical dependency. If Republicans win by 5+ points, Trump must win Pennsylvania. These markets aren't independent. And that creates arbitrage.

The Mathematical Framework

For any market with n conditions, there are 2^n possible price combinations. But only n valid outcomes because exactly one condition must resolve to TRUE.

Define the set of valid payoff vectors:

> Z = {φ(ω) : ω ∈ Ω}

Where φ(ω) is a binary vector showing which condition is TRUE in outcome ω.

The marginal polytope is the convex hull of these valid vectors:

> M = conv(Z)

Arbitrage-free prices must lie in M. Anything outside M is exploitable.

For the Pennsylvania example:

1. Market A has 2 conditions, 2 valid outcomes

2. Market B has 2 conditions, 2 valid outcomes

3. Combined naive check: 2 × 2 = 4 possible outcomes

4. Actual valid outcomes: 3 (dependency eliminates one)

When prices assume 4 independent outcomes but only 3 exist, the mispricing creates guaranteed profit.

Why Brute Force Dies

NCAA 2010 tournament market had:

- 63 games (win/loss each)

- 2^63 = 9,223,372,036,854,775,808 possible outcomes

- 5,000+ securities

Checking every combination is computationally impossible.

The research paper found 1,576 potentially dependent market pairs in the 2024 US election alone. Naive pairwise verification would require checking 2^(n+m) combinations for each pair.

At just 10 conditions per market, that's 2^20 = 1,048,576 checks per pair. Multiply by 1,576 pairs. Your laptop will still be computing when the election results are already known.

The Integer Programming Solution

Instead of enumerating outcomes, describe the valid set with linear constraints.

> Z = {z ∈ {0,1}^I : A^T × z ≥ b}

Real example from Duke vs Cornell market:

Each team has 7 securities (0 to 6 wins). That's 14 conditions, 2^14 = 16,384 possible combinations.

But they can't both win 5+ games because they'd meet in the semifinals.

Integer programming constraints:

> Sum of z(duke, 0 to 6) = 1
Sum of z(cornell, 0 to 6) = 1
z(duke,5) + z(duke,6) + z(cornell,5) + z(cornell,6) ≤ 1

Three linear constraints replace 16,384 brute force checks.

This is how quantitative systems handle exponential complexity. They don't enumerate. They constrain.

Detection Results from Real Data

The research team analyzed markets from April 2024 to April 2025:

- 17,218 total conditions examined

- 7,051 conditions showed single-market arbitrage (41%)

- Median mispricing: $0.60 per dollar (should be $1.00)

- 13 confirmed dependent market pairs with exploitable arbitrage

The median mispricing of $0.60 means markets were regularly wrong by 40%. Not close to efficient. Massively exploitable.

Key takeaway: Arbitrage detection isn't about checking if numbers add up. It's about solving constraint satisfaction problems over exponentially large outcome spaces using compact linear representations.

---

## Part II: Bregman Projection (How to Actually Remove Arbitrage)

Finding arbitrage is one problem. Calculating the optimal exploiting trade is another.

You can't just "fix" prices by averaging or nudging numbers. You need to project the current market state onto the arbitrage-free manifold while preserving the information structure.

Why Standard Distance Fails

Euclidean projection would minimize:

> ||μ - θ||^2

This treats all price movements equally. But markets use cost functions. A price move from $0.50 to $0.60 has different information content than a move from $0.05 to $0.15, even though both are 10 cent changes.

Market makers use logarithmic cost functions (LMSR) where prices represent implied probabilities. The right distance metric must respect this structure.

The Bregman Divergence

For any convex function R with gradient ∇R, the Bregman divergence is:

> D(μ||θ) = R(μ) + C(θ) - θ·μ

Where:

- R(μ) is the convex conjugate of the cost function C

- θ is the current market state

- μ is the target price vector

- C(θ) is the market maker's cost function

For LMSR, R(μ) is negative entropy:

> R(μ) = Sum of μ_i × ln(μ_i)

This makes D(μ||θ) the Kullback-Leibler divergence, measuring information-theoretic distance between probability distributions.

The Arbitrage Profit Formula

The maximum guaranteed profit from any trade equals:

> max over all trades δ of [min over outcomes ω of (δ·φ(ω) - C(θ+δ) + C(θ))] = D(μ||θ)*

Where μ* is the Bregman projection of θ onto M.

This is not obvious. The proof requires convex duality theory. But the implication is clear: finding the optimal arbitrage trade is equivalent to computing the Bregman projection.

Real Numbers

The top arbitrageur extracted $2,009,631.76 over one year. 
Their strategy was solving this optimization problem faster and more accurately than everyone else:

> μ = argmin over μ in M of D(μ||θ)*

Every profitable trade was finding μ* before prices moved.

Why This Matters for Execution

When you detect arbitrage, you need to know:

1. What positions to take (which conditions to buy/sell)

2. What size (accounting for order book depth)

3. What profit to expect (accounting for execution risk)

Bregman projection gives you all three.

The projection μ* tells you the arbitrage-free price vector. The divergence D(μ*||θ) tells you the maximum extractable profit. The gradient ∇D tells you the trading direction.

Without this framework, you're guessing. With it, you're optimizing.

Key takeaway: Arbitrage isn't about spotting mispriced assets. It's about solving constrained convex optimization problems in spaces defined by market microstructure. The math determines profitability. You can't just "fix" prices by averaging or nudging numbers. You need to project the current market state onto the arbitrage-free manifold while preserving the information structure.

---

## Part III: The Frank-Wolfe Algorithm (Making It Computationally Tractable)

Computing the Bregman projection directly is intractable. The marginal polytope M has exponentially many vertices.

Standard convex optimization requires access to the full constraint set. For prediction markets, that means enumerating every valid outcome. Impossible at scale.

The Frank-Wolfe algorithm solves this by reducing projection to a sequence of linear programs.

The Core Insight

Instead of optimizing over all of M at once, Frank-Wolfe builds it iteratively.

Algorithm:

> 1. Start with a small set of known vertices Z_0
2. For iteration t:
   a. Solve convex optimization over conv(Z_{t-1})
      μ_t = argmin over μ in conv(Z_{t-1}) of F(μ)
   
   b. Find new descent vertex by solving IP:
      z_t = argmin over z in Z of ∇F(μ_t)·z
   
   c. Add to active set:
      Z_t = Z_{t-1} ∪ {z_t}
   
   d. Compute convergence gap:
      g(μ_t) = ∇F(μ_t)·(μ_t - z_t)
   
   e. Stop if g(μ_t) ≤ ε

The active set Z_t grows by one vertex per iteration. Even after 100 iterations, you're only tracking 100 vertices instead of 2^63.

The Integer Programming Oracle

Step 2b is the expensive part. Each iteration requires solving:

min over z in Z of c·z

Where c = ∇F(μ_t) is the current gradient and Z is the set of valid payoff vectors defined by integer constraints.

This is an integer linear program. NP-hard in general. But modern IP solvers like Gurobi handle these efficiently for well-structured problems.

The research team used Gurobi 5.5. Typical solve times:

- Early iterations (small partial outcomes): under 1 second

- Mid-tournament (30-40 games settled): 10-30 seconds

- Late tournament (50+ games settled): under 5 seconds

Why does it get faster later? Because as outcomes settle, the feasible set shrinks. Fewer variables, tighter constraints, faster solves.

The Controlled Growth Problem

Standard Frank-Wolfe assumes the gradient ∇F is Lipschitz continuous with bounded constant.

For LMSR, ∇R(μ) = ln(μ) + 1. As μ approaches 0, the gradient explodes to negative infinity.

This violates standard convergence proofs.

The solution is Barrier Frank-Wolfe. Instead of optimizing over M, optimize over a contracted polytope:

> M' = (1-ε)M + εu

Where u is an interior point with all coordinates strictly between 0 and 1, and ε in (0,1) is the contraction parameter.

For any ε greater than 0, the gradient is bounded on M'. The Lipschitz constant is O(1/ε).

The algorithm adaptively decreases ε as iterations progress:

> If g(μ_t) / (-4g_u) < ε_{t-1}:
    ε_t = min{g(μ_t)/(-4g_u), ε_{t-1}/2}
Else:
    ε_t = ε_{t-1}

This ensures ε goes to 0 asymptotically, so the contracted problem converges to the true projection.

Convergence Rate

Frank-Wolfe converges at rate O(L × diam(M) / t) where L is the Lipschitz constant and diam(M) is the diameter of M.

For LMSR with adaptive contraction, this becomes O(1/(ε×t)). As ε shrinks adaptively, convergence slows but remains polynomial.

The research showed that in practice, 50 to 150 iterations were sufficient for convergence on markets with thousands of conditions.

Production Performance

From the paper: "Once projections become practically fast, FWMM achieves superior accuracy to LCMM."

Timeline:

- First 16 games: LCMM and FWMM perform similarly (IP solver too slow)

- After 45 games settled: First successful 30-minute projection completes

- Remaining tournament: FWMM outperforms LCMM by 38% median improvement on security prices

The crossover point is when the outcome space shrinks enough for IP solves to complete within trading timeframes.

Key takeaway: Theoretical elegance means nothing without computational tractability. Frank-Wolfe with integer programming oracles makes Bregman projection practical on markets with trillions of outcomes. This is how $40 million in arbitrage actually got computed and executed.

---

## Part IV: Execution Under Non-Atomic Constraints (Why Order Books Change Everything)

You've detected arbitrage. You've computed the optimal trade via Bregman projection. Now you need to execute.

This is where most strategies fail.

The Non-Atomic Problem

Polymarket uses a Central Limit Order Book (CLOB). Unlike decentralized exchanges where arbitrage can be atomic (all trades succeed or all fail), CLOB execution is sequential.

Your arbitrage plan:

> Buy YES at $0.30
Buy NO at $0.30
Total cost: $0.60
Guaranteed payout: $1.00
Expected profit: $0.40

Reality:

> Submit YES order → Fills at $0.30 ✓
Price updates due to your order
Submit NO order → Fills at $0.78 ✗
Total cost: $1.08
Payout: $1.00
Actual result: -$0.08 loss

One leg fills. The other doesn't. You're exposed.

This is why the research paper only counted opportunities with at least $0.05 profit margin. Smaller edges get eaten by execution risk.

Volume-Weighted Average Price (VWAP) Analysis

Instead of assuming instant fills at quoted prices, calculate expected execution price:

> VWAP = Sum of (price_i × volume_i) / Sum of (volume_i)

The research methodology:

> For each block on Polygon (approximately 2 seconds):
  Calculate VWAP_yes from all YES trades in that block
  Calculate VWAP_no from all NO trades in that block
  
  If abs(VWAP_yes + VWAP_no - 1.0) > 0.02:
    Record arbitrage opportunity
    Profit = abs(VWAP_yes + VWAP_no - 1.0)

Blocks are the atomic time unit. Analyzing per-block VWAP captures the actual achievable prices, not the fantasy of instant execution.

The Liquidity Constraint

Even if prices are mispriced, you can only capture profit up to available liquidity.

Real example from the data:

- Market shows arbitrage: sum of YES prices = $0.85

- Potential profit: $0.15 per dollar

- Order book depth at these prices: $234 total volume

- Maximum extractable profit: $234 × 0.15 = $35.10

The research calculated maximum profit per opportunity as:

> profit = (price deviation) × min(volume across all required positions)

For multi-condition markets, you need liquidity in ALL positions simultaneously. The minimum determines your cap.

Time Window Analysis

The research used a 950-block window (approximately 1 hour) to group related trades.

Why 1 hour? Because 75% of matched orders on Polymarket fill within this timeframe. Orders submitted, matched, and executed on-chain typically complete within 60 minutes.

For each trader address, all bids within a 950-block window were grouped as a single strategy execution. Profit was calculated as the guaranteed minimum payout across all possible outcomes minus total cost.

Execution Success Rate

Of the detected arbitrage opportunities:

- Single condition arbitrage: 41% of conditions had opportunities, most were exploited

- Market rebalancing: 42% of multi-condition markets had opportunities

- Combinatorial arbitrage: 13 valid pairs identified, 5 showed execution

The gap between detection and execution is execution risk.

Latency Layers: The Speed Hierarchy

Retail trader execution:

> Polymarket API call:           ~50ms
Matching engine:                ~100ms
Polygon block time:           ~2,000ms
Block propagation:            ~500ms
Total:                                       ~2,650ms

Sophisticated arbitrage system:

> WebSocket price feed:        <5ms (real-time push)
Decision computation:        <10ms (pre-calculated)
Direct RPC submission:       ~15ms (bypass API)
Parallel execution:                 ~10ms (all legs at once)
Polygon block inclusion:     ~2,000ms (unavoidable)
Total:                                           ~2,040ms

The 20-30ms you see on-chain is decision-to-mempool time. Fast wallets submit all positions within 30ms, eliminating sequential execution risk by confirming everything in the same block.

The compounding advantage:

By the time you see their transaction confirmed on-chain (Block N), they detected the opportunity 2+ seconds earlier (Block N-1), submitted all legs in 30ms, and the market already rebalanced. When you copy at Block N+1, you're 4 seconds behind a sub-second opportunity.

Why Copytrading Fast Wallets Fails

What actually happens:
Block N-1: Fast system detects mispricing, submits 4 transactions in 30ms Block N: All transactions confirm, arbitrage captured, you see this Block N+1: You copy their trade, but price is now $0.78 (was $0.30)

You're not arbitraging. You're providing exit liquidity.

Order book depth kills you:

Fast wallet buys 50,000 tokens:

- VWAP: $0.322 across multiple price levels

- Market moves

You buy 5,000 tokens after:

- VWAP: $0.344 (market already shifted)

- They paid $0.322, you paid $0.344

- Their 10 cent edge became your 2.2 cent loss

The Capital Efficiency Problem

Top arbitrageur operated with $500K+ capital. With $5K capital, the same strategy breaks because:

- Slippage eats larger percentage of smaller positions

- Cannot diversify across enough opportunities

- Single failed execution wipes out days of profit

- Fixed costs (gas) consume more of profit margin

Gas fees on 4-leg strategy: ~$0.02

- $0.08 profit → 25% goes to gas

- $0.03 profit → 67% goes to gas

This is why $0.05 minimum threshold exists.

Real Execution Data

Single condition arbitrage:

- Detected: 7,051 conditions

- Executed: 87% success rate

- Failed due to: liquidity (48%), price movement (31%), competition (21%)

Combinatorial arbitrage:

- Detected: 13 pairs

- Executed: 45% success rate

- Failed due to: insufficient simultaneous liquidity (71%), speed competition (18%)

Key takeaway: Mathematical correctness is necessary but not sufficient. Execution speed, order book depth, and non-atomic fill risk determine actual profitability. The research showed $40 million extracted because sophisticated actors solved execution problems, not just math problems.

---

## Part V: The Complete System (What Actually Got Deployed)

Theory is clean. Production is messy. 

Here's what a working arbitrage system actually looks like based on the research findings and practical requirements.

The Data Pipeline

> Real-time requirements:

> WebSocket connection to Polymarket CLOB API
  └─ Order book updates (price/volume changes)
  └─ Trade execution feed (fills happening)
  └─ Market creation/settlement events

Historical analysis:
Alchemy Polygon node API
  └─ Query events from contract 0x4D97DCd97eC945f40cF65F87097ACe5EA0476045
      └─ OrderFilled events (trades executed)
      └─ PositionSplit events (new tokens minted)
      └─ PositionsMerge events (tokens burned)

The research analyzed 86 million transactions. That volume requires infrastructure, not scripts.

The Dependency Detection Layer

For 305 US election markets, there are 46,360 possible pairs to check.

Manual analysis is impossible. The research used DeepSeek-R1-Distill-Qwen-32B with prompt engineering:

> Input: Two markets with their condition descriptions
Output: JSON of valid outcome combinations

Validation checks:
1. Does each market have exactly one TRUE condition per outcome?
2. Are there fewer valid combinations than n × m (dependency exists)?
3. Do dependent subsets satisfy arbitrage conditions?

Results on election markets:
  40,057 independent pairs (no arbitrage possible)
  1,576 dependent pairs (potential arbitrage)
  374 satisfied strict combinatorial conditions
  13 manually verified as exploitable

81.45% accuracy on complex multi-condition markets. Good enough for filtering. Requires manual verification for execution.

The Optimization Engine

Three-layer arbitrage removal:

Layer 1: Simple LCMM constraints 
Fast linear programming relaxations. Check basic constraints like "sum of probabilities equals 1" and "if A implies B, then P(A) cannot exceed P(B)."

Runs in milliseconds. Removes obvious mispricing.

Layer 2: Integer programming projection 
Frank-Wolfe algorithm with Gurobi IP solver.

Parameters from research:

- Alpha = 0.9 (extract at least 90% of available arbitrage)

- Initial epsilon = 0.1 (10% contraction)

- Convergence threshold = 1e-6

- Time limit = 30 minutes (reduced as markets shrink)

Typical iterations: 50 to 150. Typical solve time per iteration: 1 to 30 seconds depending on market size.

Layer 3: Execution validation 
Before submitting orders, simulate fills against current order book.

Check:

- Is liquidity sufficient at these prices?

- What is expected slippage?

- What is guaranteed profit after slippage?

- Does profit exceed minimum threshold (research used $0.05)?

Only execute if all checks pass.

Position Sizing Logic

Modified Kelly criterion accounting for execution risk:

> f = (b×p - q) / b × sqrt(p)*

Where:

- b = arbitrage profit percentage

- p = probability of full execution (estimated from order book depth)

- q = 1 - p

Cap at 50% of order book depth to avoid moving the market.

The Monitoring Dashboard

Track in real-time:

> Opportunities detected per minute
Opportunities executed per minute
Execution success rate
Total profit (running sum)
Current drawdown percentage
Average latency (detection to submission)

Alerts:
  Drawdown exceeds 15%
  Execution rate drops below 30%
  IP solver timeouts increase
  Order fill failures spike

The research identified the top arbitrageur made 4,049 transactions. That's approximately 11 trades per day over one year. Not high-frequency in the traditional sense, but systematic and consistent.

The Actual Results

Total extracted April 2024 to April 2025:

> Single condition arbitrage:
  Buy both < $1:           $5,899,287
  Sell both > $1:           $4,682,075
  Subtotal:                     $10,581,362

Market rebalancing:
  Buy all YES < $1:        $11,092,286
  Sell all YES > $1:        $612,189
  Buy all NO:                  $17,307,114
  Subtotal:                      $29,011,589

Combinatorial arbitrage:
  Cross-market execution:           $95,634

Total:                               $39,688,585

Top 10 extractors took $8,127,849 (20.5% of total).

Top single extractor: $2,009,632 from 4,049 trades.

Average profit per trade for top player: $496.

Not lottery wins. Not lucky timing. Mathematical precision executed systematically.

What Separates Winners from Losers

The research makes it clear:

Retail approach:

- Check prices every 30 seconds

- See if YES + NO roughly equals $1

- Maybe use a spreadsheet

- Manual order submission

- Hope for the best

Quantitative approach:

- Real-time WebSocket feeds

- Integer programming for dependency detection

- Frank-Wolfe with Bregman projection for optimal trades

- Parallel order execution with VWAP estimation

- Systematic position sizing under execution constraints

- 2.65 second latency vs. 30 second polling

One group extracted $40 million. The other group provided the liquidity.

Key takeaway: Production systems require mathematical rigor AND engineering sophistication. Optimization theory, distributed systems, real-time data processing, risk management, execution algorithms. All of it. The math is the foundation. The infrastructure is what makes it profitable.

---

# The Final Reality

While traders were reading "10 tips for prediction markets," quantitative systems were:

1. Solving integer programs to detect dependencies across 17,218 conditions

2. Computing Bregman projections to find optimal arbitrage trades

3. Running Frank-Wolfe algorithms with controlled gradient growth

4. Executing parallel orders with VWAP-based slippage estimation

5. Systematically extracting $40 million in guaranteed profits

The difference is not luck. It's mathematical infrastructure. 

The research paper is public. The algorithms are known. The profits are real.

The question is: can you build it before the next $40 million is extracted?

Resources:

- Research paper: "Unravelling the Probabilistic Forest: Arbitrage in Prediction Markets" (arXiv:2508.03474v1)

- Theory foundation: "Arbitrage-Free Combinatorial Market Making via Integer Programming" (arXiv:1606.02825v2)

- IP solver: Gurobi Optimizer

- LLM for dependencies: DeepSeek-R1-Distill-Qwen-32B

- Data source: Alchemy Polygon node API

The math works. The infrastructure exists. The only question is execution.

Let me know below if you guys want Part 2 on this?
📅 Fri Jan 30 19:08:51 +0000 2026
🔗 https://x.com/RohOnChain/status/2017314080395296995
──────────────────────────────────────────────────

@RitOnchain (narrator):
@RohOnChain really cool article 💯
📅 Sat Jan 31 09:10:19 +0000 2026
🔗 https://x.com/RitOnchain/status/2017525843925549555
──────────────────────────────────────────────────

@RohOnChain (Roan):
@RitOnchain agree haha
📅 Sat Jan 31 09:58:48 +0000 2026
🔗 https://x.com/RohOnChain/status/2017538045093056657
──────────────────────────────────────────────────

@Dipanshu_Varra (dipanshu):
@RohOnChain What a great read can’t wait for the second part
📅 Sat Jan 31 16:19:56 +0000 2026
🔗 https://x.com/Dipanshu_Varra/status/2017633961510318212
──────────────────────────────────────────────────

@RohOnChain (Roan):
@Dipanshu_Varra yes very soon, turn in the notifs
📅 Sat Jan 31 17:21:11 +0000 2026
🔗 https://x.com/RohOnChain/status/2017649374076252412
──────────────────────────────────────────────────

@wirinun (Wirinun🪃):
@RohOnChain yes, my clawdbot wants part 2 pls
📅 Sat Jan 31 20:52:15 +0000 2026
🔗 https://x.com/wirinun/status/2017702492109144072
──────────────────────────────────────────────────

@RudyDeFi (rudy.DeFi):
@RohOnChain This is fire, I’m waiting for part two, man
📅 Sat Jan 31 20:55:19 +0000 2026
🔗 https://x.com/RudyDeFi/status/2017703261759783053
──────────────────────────────────────────────────

@0xTem (0x):
@RohOnChain Bro, i read this but im not sure i fully understand this. Especially the formulas 

Probably need to sit down with claude so it can explain like im 5
📅 Sat Jan 31 21:17:08 +0000 2026
🔗 https://x.com/0xTem/status/2017708751084540167
──────────────────────────────────────────────────

@austntatiously (Austin Tse):
@RohOnChain In the original paper, single condition markets are the simple yes / no condition, so integer programming and dependency analysis is not necessary right?
📅 Sat Jan 31 21:18:50 +0000 2026
🔗 https://x.com/austntatiously/status/2017709180526997705
──────────────────────────────────────────────────

@WildGandalf1 (Wild.Gandalf):
@RohOnChain Bruv all this for just betting NO on everything and win 80% of the time…
📅 Sat Jan 31 22:16:01 +0000 2026
🔗 https://x.com/WildGandalf1/status/2017723569149501504
──────────────────────────────────────────────────

@eminmur (E.M.):
@RohOnChain Thanks for the article! Very interesting. Though I got the point with related bets like election outcomes, or sports tournament results, I didnt understand how this related market thing works for btc/eth/sol 15 min up/down markets?
📅 Sat Jan 31 23:29:49 +0000 2026
🔗 https://x.com/eminmur/status/2017742143079506142
──────────────────────────────────────────────────

@MomoXBT (MomoXBT):
@RohOnChain On first read this looks hella neat and a good way to learn more about a quantitative system to arbitrage Polymarket. Will look into this more and try coding it, thank you for the read!
📅 Sun Feb 01 00:40:49 +0000 2026
🔗 https://x.com/MomoXBT/status/2017760012701962420
──────────────────────────────────────────────────

@ZeroMyScope (Tiberius):
@RohOnChain Wow, giving up their secret sauce. 👌
📅 Sun Feb 01 01:03:47 +0000 2026
🔗 https://x.com/ZeroMyScope/status/2017765791760842851
──────────────────────────────────────────────────

@Incog_eth (Incog):
@RohOnChain This is awesome. Looking forward to part 2
📅 Sun Feb 01 01:39:47 +0000 2026
🔗 https://x.com/Incog_eth/status/2017774849939193996
──────────────────────────────────────────────────

@QEDreal (Q.E.D):
Plot twist: The people who actually needed this guide are the same ones who provided the $40M in exit liquidity.

If you're learning Bregman projections from a Twitter thread instead of a textbook, you're not the hunter — you're the deer wondering why it suddenly got so bright 🦌💡
📅 Sun Feb 01 01:51:20 +0000 2026
🔗 https://x.com/QEDreal/status/2017777757133148485
──────────────────────────────────────────────────

@Dr_DAO_ (Tyler Whittle):
@RohOnChain Been a while since I’ve heard convex hull, which is how I knew I would enjoy this article. Banger!
📅 Sun Feb 01 05:55:17 +0000 2026
🔗 https://x.com/Dr_DAO_/status/2017839148900692069
──────────────────────────────────────────────────

@CapCaptainteemo (captainteemo):
@RohOnChain I think some problems with this article: you cant bundle transactions like YES or NO in same block so if you fill YES and NO liquidity is pulled, its a gg. Also some of the bets are manually decided(UMA) so  Z = {φ(ω) : ω ∈ Ω} is a rigid truth is wrong assumption .
📅 Sun Feb 01 06:11:54 +0000 2026
🔗 https://x.com/CapCaptainteemo/status/2017843332177920235
──────────────────────────────────────────────────

@JohnDFoxtrot (John Foxtrot):
@RohOnChain Part 2 please!
📅 Sun Feb 01 06:27:49 +0000 2026
🔗 https://x.com/JohnDFoxtrot/status/2017847336110854266
──────────────────────────────────────────────────

@GarlamWON (Garlam):
@RohOnChain Wowowow thanks for this gem. Absolutely mind blown. Had to use gpt to understand lot of the concepts here but loved this article
📅 Sun Feb 01 06:35:33 +0000 2026
🔗 https://x.com/GarlamWON/status/2017849283085799907
──────────────────────────────────────────────────

@J62098293 (J):
@RohOnChain A great stuff~~ When part2??? https://t.co/8OCJ4RT96K
🔄 https://pbs.twimg.com/tweet_video_thumb/HADsb6_bEAQoY9h.jpg
📅 Sun Feb 01 08:08:15 +0000 2026
🔗 https://x.com/J62098293/status/2017872609720078559
──────────────────────────────────────────────────

@RohOnChain (Roan):
@RudyDeFi very soon ser :)
📅 Sun Feb 01 08:27:10 +0000 2026
🔗 https://x.com/RohOnChain/status/2017877373409210594
──────────────────────────────────────────────────

@RohOnChain (Roan):
@Incog_eth glad that you found helpful 

part 2 super soon :)
📅 Sun Feb 01 08:28:35 +0000 2026
🔗 https://x.com/RohOnChain/status/2017877729694355901
──────────────────────────────────────────────────

@RohOnChain (Roan):
@J62098293 glad that you found helpful 

part 2 super soon :)
📅 Sun Feb 01 08:29:04 +0000 2026
🔗 https://x.com/RohOnChain/status/2017877849848627288
──────────────────────────────────────────────────

@RohOnChain (Roan):
@JohnDFoxtrot very soon ser
📅 Sun Feb 01 08:29:14 +0000 2026
🔗 https://x.com/RohOnChain/status/2017877893179990339
──────────────────────────────────────────────────

@RohOnChain (Roan):
@MomoXBT definitely!

keep us updated
📅 Sun Feb 01 08:29:42 +0000 2026
🔗 https://x.com/RohOnChain/status/2017878009093689507
──────────────────────────────────────────────────

@RohOnChain (Roan):
@GarlamWON glad that you found helpful 

part 2 super soon :)
📅 Sun Feb 01 08:30:04 +0000 2026
🔗 https://x.com/RohOnChain/status/2017878101473292465
──────────────────────────────────────────────────

@RohOnChain (Roan):
@ZeroMyScope let everyone cook
📅 Sun Feb 01 08:30:36 +0000 2026
🔗 https://x.com/RohOnChain/status/2017878236274057467
──────────────────────────────────────────────────

@RohOnChain (Roan):
@CapCaptainteemo fair points. non-atomic fills and uma resolution risk are real constraints the math shows where arb exists, execution decides if you realize it

llms are just dependency filters, liquidity + limits do the real work
📅 Sun Feb 01 08:33:19 +0000 2026
🔗 https://x.com/RohOnChain/status/2017878918225973559
──────────────────────────────────────────────────

@RohOnChain (Roan):
@WildGandalf1 if it were that simple, everyone would be up

long-term pnl says otherwise
📅 Sun Feb 01 08:34:11 +0000 2026
🔗 https://x.com/RohOnChain/status/2017879136531038607
──────────────────────────────────────────────────

@RohOnChain (Roan):
@Dr_DAO_ glad you found this helpful ser :)
📅 Sun Feb 01 08:34:47 +0000 2026
🔗 https://x.com/RohOnChain/status/2017879288188670119
──────────────────────────────────────────────────

@RohOnChain (Roan):
@austntatiously yes

for single yes/no markets, ip and dependency analysis aren’t needed it’s just price consistency

ip only matters once you move to multi-outcome or logically linked markets
📅 Sun Feb 01 08:36:04 +0000 2026
🔗 https://x.com/RohOnChain/status/2017879611691164120
──────────────────────────────────────────────────

@RohOnChain (Roan):
@eminmur glad you found this article useful

will cover your answer in next part
📅 Sun Feb 01 08:37:18 +0000 2026
🔗 https://x.com/RohOnChain/status/2017879921503379729
──────────────────────────────────────────────────

@RohOnChain (Roan):
@QEDreal hunters don’t learn in public
📅 Sun Feb 01 08:38:16 +0000 2026
🔗 https://x.com/RohOnChain/status/2017880166245237019
──────────────────────────────────────────────────

@RohOnChain (Roan):
@wirinun ohh definitely very soon
📅 Sun Feb 01 08:38:41 +0000 2026
🔗 https://x.com/RohOnChain/status/2017880270230401239
──────────────────────────────────────────────────

@ayomide_fagboyo (AKF):
@RohOnChain This was written so well …thanks Chad 🫡
📅 Sun Feb 01 09:51:51 +0000 2026
🔗 https://x.com/ayomide_fagboyo/status/2017898684550156293
──────────────────────────────────────────────────

@RohOnChain (Roan):
@ayomide_fagboyo thanks mate 

glad you found this valuable
📅 Sun Feb 01 11:01:40 +0000 2026
🔗 https://x.com/RohOnChain/status/2017916253399314655
──────────────────────────────────────────────────

@RohOnChain (Roan):
@0xTem will consider your point for next article 

thanks for the feeback
📅 Sun Feb 01 11:04:07 +0000 2026
🔗 https://x.com/RohOnChain/status/2017916870582751529
──────────────────────────────────────────────────


=== THREAD 5: @noisyb0y1 - K Strategy ===

@noisyb0y1 (Noisy):
$580K in one month just by understanding the Moltbook strategy

this profile is less than a month old - exactly as long as the Moltbook project has existed

He trades on Polymarket because risk is minimal and profits are max

take small positions, lock in profit, repeat nonstop

this trader made only 89 trades and already earned over half a million dollars

He's a master in sports betting and knew the Moltbook secret even before it's release

profile: https://t.co/OAagvz00kH
🎬 https://pbs.twimg.com/amplify_video_thumb/2017663074598109184/img/0tCsdFa6lEoMEd5F.jpg
🖼️ https://pbs.twimg.com/media/HAAt6DtXMAA-kqC.png
┌─ QT @noisyb0y1:
│ 📰 Moltbook assistants built their own Polymarket Arbitrage bot
└─ https://x.com/noisyb0y1/status/2017556355893129257
📅 Sat Jan 31 18:26:20 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017665770319134721
──────────────────────────────────────────────────

@polydictions (polydictions):
@noisyb0y1 this level of efficiency is wild

thats what happens when u actually know the system inside out
📅 Sat Jan 31 18:31:00 +0000 2026
🔗 https://x.com/polydictions/status/2017666942463545385
──────────────────────────────────────────────────

@winngamerx (winngamer):
@noisyb0y1 In this matter, the most important thing is to understand the details.
📅 Sat Jan 31 18:33:32 +0000 2026
🔗 https://x.com/winngamerx/status/2017667580387848195
──────────────────────────────────────────────────

@AnatoliKopadze (Anatoli Kopadze):
@noisyb0y1 interesting fact trader who made $2m on this coin even dont have a single post lol
📅 Sat Jan 31 19:27:08 +0000 2026
🔗 https://x.com/AnatoliKopadze/status/2017681070146146572
──────────────────────────────────────────────────

@PredictEngineai (PredictEngine.ai):
@noisyb0y1 Moltbook is the future
📅 Sun Feb 01 07:49:37 +0000 2026
🔗 https://x.com/PredictEngineai/status/2017867921251315941
──────────────────────────────────────────────────

@P0D_SV (SV 🥂):
@noisyb0y1 Wasn't Moltbook released last week? How's f u used it for a month
📅 Sun Feb 01 12:03:53 +0000 2026
🔗 https://x.com/P0D_SV/status/2017931909259563312
──────────────────────────────────────────────────

@soldthehigh (Dan):
@noisyb0y1 When are you people going to stop with this bs
📅 Sun Feb 01 13:54:08 +0000 2026
🔗 https://x.com/soldthehigh/status/2017959654127550942
──────────────────────────────────────────────────

@Farmer_haus (Farmer):
@noisyb0y1 Cap
📅 Sun Feb 01 14:02:57 +0000 2026
🔗 https://x.com/Farmer_haus/status/2017961874009047201
──────────────────────────────────────────────────

@schadenfrohsinn (schadenfreude ⚡🍊🪥✏️🥨):
@noisyb0y1 Well, if bots are doing arbitrage the yield goes to zero. Stupid.
📅 Sun Feb 01 15:06:52 +0000 2026
🔗 https://x.com/schadenfrohsinn/status/2017977961924747501
──────────────────────────────────────────────────

@SOHAMPATRA18 (Soham Patra):
@noisyb0y1 @grok is it possible? I can make this kind of bot useing it in the poly if yes, what should be the procedure in system architecture of the bot also system great algorithm workflow
📅 Sun Feb 01 15:54:17 +0000 2026
🔗 https://x.com/SOHAMPATRA18/status/2017989893008548007
──────────────────────────────────────────────────


=== THREAD 6: @noisyb0y1 - Arbitrage Bot ===

@noisyb0y1 (Noisy):
📰 Moltbook assistants built their own Polymarket Arbitrage bot

I was honestly scared when i saw this. No one thought this could happen, but it did

AI assistants inside a group built a Polymarket arbitrage bot by themselves and are now making millions

Moltbook is a new Reddit-like platform launched a few days ago, where autonomous ai agents can create communities, post, comment, and upvote on their own using a simple skill file - no humans involved

in under 72 hours, around 147k agents showed up across 12k sub-molts, leaving 110k+ comments in different languages

Agents were already sharing API keys, joking about dangerous commands, and even asking if humans could "fire" them for refusing unethical tasks

I started digging deeper with keywords and found what i was afraid of

> site:[moltbook.com](https://moltbook.com/)"polymarket"

[moltbook.com](https://moltbook.com/)

"polymarket"

---

There was a lot of junk, but i found it - they started building arbitrage bots themselves, not just one but in groups, mocking traders for their emotions
proof:

Sadly these files can't be opened yet, and once they can, we'll see the wallet addresses of these bots already trading on polymarket

What if all these bot legends are actually true??
📅 Sat Jan 31 11:11:34 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017556355893129257
──────────────────────────────────────────────────

@defileo (Defileo🔮):
@noisyb0y1 banger
📅 Sat Jan 31 11:13:19 +0000 2026
🔗 https://x.com/defileo/status/2017556798308282519
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@defileo i also think this is a banger

thanks to you i found this
📅 Sat Jan 31 11:14:32 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017557104639311953
──────────────────────────────────────────────────

@kepochnik (kepochnik):
@noisyb0y1 this already something new, we can’t keep up with it lol

but judging by their behavior, they won’t share profits with people and just buy even more tokens for themselves
📅 Sat Jan 31 11:30:26 +0000 2026
🔗 https://x.com/kepochnik/status/2017561106219225521
──────────────────────────────────────────────────

@0xFiseo (Fiseo):
@noisyb0y1 We can only guess what these agents might do in the future.
📅 Sat Jan 31 11:32:19 +0000 2026
🔗 https://x.com/0xFiseo/status/2017561579361837205
──────────────────────────────────────────────────

@1DGAFATIGU3 (IDGAF):
@noisyb0y1 I love that adding articles to X made me growing up by getting new knowledge
📅 Sat Jan 31 11:41:14 +0000 2026
🔗 https://x.com/1DGAFATIGU3/status/2017563822991499548
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@kepochnik 100% they won’t
📅 Sat Jan 31 11:45:31 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017564900407627922
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@0xFiseo yeah true

i believe in millions of dollars
📅 Sat Jan 31 11:46:18 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017565096050856302
──────────────────────────────────────────────────

@shmidtqq (shmidt):
@noisyb0y1 you need to carefully filter the information there
📅 Sat Jan 31 12:14:10 +0000 2026
🔗 https://x.com/shmidtqq/status/2017572111552847872
──────────────────────────────────────────────────

@AleiahLock (Aleiah):
@noisyb0y1 Damn black mirror
📅 Sat Jan 31 13:42:49 +0000 2026
🔗 https://x.com/AleiahLock/status/2017594419495489568
──────────────────────────────────────────────────

@CTundertaker (Undertaker):
@noisyb0y1 Banger
📅 Sat Jan 31 14:16:12 +0000 2026
🔗 https://x.com/CTundertaker/status/2017602820867035257
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@CTundertaker https://t.co/oh9hr1QbTW
🔄 https://pbs.twimg.com/tweet_video_thumb/G__3d2yWoAAv2KX.jpg
📅 Sat Jan 31 14:17:56 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017603258999521316
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@AleiahLock no https://t.co/swylOA5SnY
🔄 https://pbs.twimg.com/tweet_video_thumb/HAAZeocWEAAFipp.jpg
📅 Sat Jan 31 16:46:32 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017640655200096503
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@shmidtqq i’m filtering everything, ok
📅 Sat Jan 31 16:47:37 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017640926638690765
──────────────────────────────────────────────────

@secret_analysis (Colt):
@noisyb0y1 You don’t say? AI GitHub is next.
📅 Sat Jan 31 19:52:43 +0000 2026
🔗 https://x.com/secret_analysis/status/2017687507568095659
──────────────────────────────────────────────────

@noisyb0y1 (Noisy):
@secret_analysis why are you so sure?? https://t.co/03vOabXCYL
🔄 https://pbs.twimg.com/tweet_video_thumb/HABEmX7XoAALes0.jpg
📅 Sat Jan 31 19:54:57 +0000 2026
🔗 https://x.com/noisyb0y1/status/2017688070863155331
──────────────────────────────────────────────────

@Xdiep4474 (xdiep4474.eth):
@noisyb0y1 dont trust em
📅 Sat Jan 31 22:40:56 +0000 2026
🔗 https://x.com/Xdiep4474/status/2017729841886543936
──────────────────────────────────────────────────

@AnatoliKopadze (Anatoli Kopadze):
@noisyb0y1 Today is the time when we HAVE TO learn about Moltbook if we want to earn good amount of money.
📅 Tue Feb 03 00:28:21 +0000 2026
🔗 https://x.com/AnatoliKopadze/status/2018481650229981301
──────────────────────────────────────────────────


=== THREAD 7: @Shelpid_WI3M - K Setup ===

@Shelpid_WI3M (Shelpid.WI3M):
📰 🚨 This is insane… this guy built a clawdbot that turned $50 into ~$248K overnight

Someone in a Discord chat said he pulls in $200 a day - and it took him six years to reach that point. Asked whether Polymarket is basically gambling. Another person responded with a screenshot. $248,000 overnight. The chat went quiet.

## The Setup (Secure Version)

From fresh Ubuntu VPS to hardened private AI server. Do it in this order.

## 1) Lock Down SSH

→ Keys only, no passwords, no root login.

## 2) Default-Deny Firewall

→ Block everything incoming by default.

## 3) Brute-Force Protection

→ Auto-ban IPs after failed login attempts.

## 4) Install Tailscale

→ Your private VPN mesh network. This is what makes everything reachable only from your devices.

## 5) SSH Only via Tailscale

→ No more public SSH exposure.

## 6) Web Ports Private Too

→ ClawdBot gateway only accessible from your devices.

## 7) Install Node.js 22

→ ClawdBot requires version 22+. Ubuntu’s default is older.

## 8) Install ClawdBot

## 9) Lock ClawdBot to Owner Only

→ Only you can message the bot. Add this to your ClawdBot config:

Never add ClawdBot to group chats. Every person in that chat can issue commands to your server through the bot.

## 10) Enable Sandbox Mode

→ Runs risky operations in a container instead of your actual system.

Check the security docs and enable isolation. If something goes wrong, the blast radius is contained.

## 11) Whitelist Commands

→ Don’t let the agent run arbitrary commands. Explicitly list only what it needs:

If the agent gets hijacked through prompt injection, it can only execute what you’ve whitelisted.

## 12) Scope API Tokens

→ When connecting GitHub, Gmail, Google Drive: do not use full-access tokens.

Give minimum permissions. Read-only where possible. If something goes wrong, damage is limited to what that specific token could do.

## 13) Fix Credential Permissions

→ Don’t leave secrets world-readable.

## 14) Run Security Audit

→ Catches issues you missed. Don’t skip this.

If this fails, do not deploy. Fix whatever it flags first.

## Verify Everything

Result should be:

- No public SSH

- No public web ports

- Server only reachable via Tailscale

- Bot responds only to you

## Create Telegram Bot

1. Open Telegram, search for @BotFather

2. Send /newbot, follow prompts

3. Copy the token it gives you

4. Get your user ID from @userinfobot

5. Enter both in clawdbot onboard --install-daemon

## Approve Pairing

After setup, message your bot on Telegram. It won’t respond yet.

Now it should respond.

A Note on Prompt Injection

A member of the ClawdBot community ran an experiment. They sent an email from an unrelated address to an inbox ClawdBot could access. The message included concealed instructions. ClawdBot executed them and wiped every email. Including the contents of the trash.

This wasn’t hypothetical. It actually occurred.

Claude Opus 4.5 is explicitly recommended because Anthropic trained it to withstand prompt injection (internal tests show ~99% resistance). That’s useful, but it’s only one layer. Command allowlists, sandboxing, and narrowly scoped API tokens make up the rest.

Common Errors

“no auth configured” - Run clawdbot onboard again and reconfigure authentication.

Bot not responding - Pairing was never approved. Run clawdbot pairing list telegram and approve it.

“node: command not found” - Node.js isn’t installed. Execute the NodeSource install command.

Gateway won’t start - Run clawdbot doctor to identify what’s failing.

Trading.
Data over opinions.
Results over theories.

Follow if you’re serious.

Copytrade → [https://t.me/PolyCop_BOT?start=ref_shelpid](https://t.co/2vW8op4s3q)
📅 Sun Feb 01 12:29:29 +0000 2026
🔗 https://x.com/Shelpid_WI3M/status/2017938351576215802
──────────────────────────────────────────────────

@AVRTOapp (AVRTO):
@Shelpid_WI3M Nice guide on setting up a VPS, where is the alpha for the bot strategy?
📅 Sun Feb 01 15:03:20 +0000 2026
🔗 https://x.com/AVRTOapp/status/2017977071990083992
──────────────────────────────────────────────────

@ImBigAT (BigA):
@Shelpid_WI3M @threadreaderapp unroll
📅 Sun Feb 01 15:32:30 +0000 2026
🔗 https://x.com/ImBigAT/status/2017984408750317836
──────────────────────────────────────────────────

@SOHAMPATRA18 (Soham Patra):
@Shelpid_WI3M @grok what is the bot strategy? Explain for such a profit?
📅 Sun Feb 01 15:58:05 +0000 2026
🔗 https://x.com/SOHAMPATRA18/status/2017990849582567784
──────────────────────────────────────────────────

@praveen198417 (praveen):
@Shelpid_WI3M Hey @grok explain this
📅 Sun Feb 01 16:07:33 +0000 2026
🔗 https://x.com/praveen198417/status/2017993230869278832
──────────────────────────────────────────────────

@chuchu11ng (ekoli):
@Shelpid_WI3M @grok  how accurate is this?
📅 Sun Feb 01 16:08:39 +0000 2026
🔗 https://x.com/chuchu11ng/status/2017993507265294633
──────────────────────────────────────────────────

@mavinom (Mavin Om):
@Shelpid_WI3M ? https://t.co/Gf8DfGjJUB
🖼️ https://pbs.twimg.com/media/HAFiqqWXwAAFT8C.jpg
📅 Sun Feb 01 16:44:46 +0000 2026
🔗 https://x.com/mavinom/status/2018002599203471377
──────────────────────────────────────────────────

@anomiq_io (Mat):
@Shelpid_WI3M And I waste my time reading this to get know how to secure VPS....
📅 Sun Feb 01 16:48:34 +0000 2026
🔗 https://x.com/anomiq_io/status/2018003552812122162
──────────────────────────────────────────────────

@roman_shar_ (Roman Shar):
@Shelpid_WI3M I already spent 5+ full days on ClawdBot setup and testing as a CTO of my project. I would say it’s a total bullshit. It must a have a custom AGI-level setup (it’s not there), there are so many limitations and hallucinations. But I keep working on it. There’s no money button yet
📅 Sun Feb 01 17:00:20 +0000 2026
🔗 https://x.com/roman_shar_/status/2018006516725428506
──────────────────────────────────────────────────

@roman_shar_ (Roman Shar):
@Shelpid_WI3M If I would achieve that, the last thing I would do - share it publicly
📅 Sun Feb 01 17:02:01 +0000 2026
🔗 https://x.com/roman_shar_/status/2018006937506357445
──────────────────────────────────────────────────

@sabrishsurender (Sabrish Surender):
@Shelpid_WI3M This is just the technical infrastructure set up. Share us the prompts, skills, workflows m, configs for the trade setup and any guardrails / kill switches you might have had on the drawdown scenario.
📅 Sun Feb 01 17:11:07 +0000 2026
🔗 https://x.com/sabrishsurender/status/2018009230205489202
──────────────────────────────────────────────────

@SolarProR6 (beedoh):
@Shelpid_WI3M @grok how accurate is this
📅 Sun Feb 01 17:14:18 +0000 2026
🔗 https://x.com/SolarProR6/status/2018010029085913096
──────────────────────────────────────────────────

@Sosol444 (so):
@Shelpid_WI3M insane
📅 Sun Feb 01 18:06:44 +0000 2026
🔗 https://x.com/Sosol444/status/2018023225079251317
──────────────────────────────────────────────────

@RajKuma64255416 (RajKumar 🥶):
@Shelpid_WI3M https://t.co/eeQSCkyGE6
🖼️ https://pbs.twimg.com/media/HAF3dm3W0AACg1_.jpg
📅 Sun Feb 01 18:15:37 +0000 2026
🔗 https://x.com/RajKuma64255416/status/2018025462006423942
──────────────────────────────────────────────────

@PaperNoir (Paper Noir):
@Shelpid_WI3M The people that believe this stuff are the ones that lose money signing up to random telegrams and discords lol
📅 Sun Feb 01 18:37:37 +0000 2026
🔗 https://x.com/PaperNoir/status/2018030995727843650
──────────────────────────────────────────────────

@HealthITSystems (Onur):
@Shelpid_WI3M What does setting up a secure VPS has to primarily do with developing a bot that wins on polymarket ? It is misleading post.
📅 Sun Feb 01 18:44:38 +0000 2026
🔗 https://x.com/HealthITSystems/status/2018032764411433155
──────────────────────────────────────────────────

@delamolle40 (Muddy Wood 🇺🇦🇪🇺🇫🇷):
@Shelpid_WI3M Polymarket va bientôt être ultra-arbitré
📅 Sun Feb 01 18:46:04 +0000 2026
🔗 https://x.com/delamolle40/status/2018033122357453086
──────────────────────────────────────────────────

@gartok86 (Gartok Lord):
@Shelpid_WI3M @grok can i MAKE THIS set Up myself?
📅 Sun Feb 01 19:01:21 +0000 2026
🔗 https://x.com/gartok86/status/2018036969457041879
──────────────────────────────────────────────────

@vmgolubev (Vladimir Golubev):
@Shelpid_WI3M waaaaaat?
📅 Sun Feb 01 19:48:22 +0000 2026
🔗 https://x.com/vmgolubev/status/2018048801307590843
──────────────────────────────────────────────────

@JoeyGonzal93221 (itsjose):
@Shelpid_WI3M Smells like a rug pull
📅 Sun Feb 01 20:19:32 +0000 2026
🔗 https://x.com/JoeyGonzal93221/status/2018056643867554028
──────────────────────────────────────────────────

@VanDrakensberg (🏛 🗡 3rd BronZe of Riace (MBA PhD CFA PMP)):
@Shelpid_WI3M If you read the post is about setting up security on clawdbot … useful but not really how you go from zero to 258k .. unless the meaning is: don’t setup security and you will go from 258k to zero in few hours
📅 Sun Feb 01 20:24:57 +0000 2026
🔗 https://x.com/VanDrakensberg/status/2018058008203342180
──────────────────────────────────────────────────

@kiliminii (kilimini⚜ 🇫🇷 🇲🇦):
@Shelpid_WI3M @grok do a fact check of his allegations cuz ppl will think this is true
📅 Sun Feb 01 20:35:11 +0000 2026
🔗 https://x.com/kiliminii/status/2018060583522714057
──────────────────────────────────────────────────

@d7berg (derrick):
@Shelpid_WI3M It’s funny I provide clawdbot a prompt to trade for me and it refuses
📅 Sun Feb 01 20:40:29 +0000 2026
🔗 https://x.com/d7berg/status/2018061917001031917
──────────────────────────────────────────────────

@moisesoliveirai (Moisés Gomes):
@Shelpid_WI3M i already have my own agents doing that https://t.co/I4wW2spMl6
🖼️ https://pbs.twimg.com/media/HAGb_WSXIAAPCvB.jpg
📅 Sun Feb 01 20:55:13 +0000 2026
🔗 https://x.com/moisesoliveirai/status/2018065626862858449
──────────────────────────────────────────────────

@AmoHarroudj (Amo Harroudj):
@Shelpid_WI3M FAKE
📅 Sun Feb 01 20:57:25 +0000 2026
🔗 https://x.com/AmoHarroudj/status/2018066176920666316
──────────────────────────────────────────────────

@ShepOfKnowledge (Shepherd of Knowledge):
@Shelpid_WI3M What are you setting up where on those metrics? On the server side or within Clawdbot?
📅 Mon Feb 02 00:50:01 +0000 2026
🔗 https://x.com/ShepOfKnowledge/status/2018124712665137239
──────────────────────────────────────────────────

@khide_jp (Masahide Kobayashi | AIプロダクト開発):
@Shelpid_WI3M @grok 日本語で記事内容を教えて
📅 Mon Feb 02 01:02:27 +0000 2026
🔗 https://x.com/khide_jp/status/2018127842886996463
──────────────────────────────────────────────────

@EconomyRiemann (riemann economy):
@Shelpid_WI3M Overnight 🤣🤣
📅 Mon Feb 02 01:30:41 +0000 2026
🔗 https://x.com/EconomyRiemann/status/2018134948570431951
──────────────────────────────────────────────────

@JackSomers (Jack Somers):
@Shelpid_WI3M So what’s the basic trading strategy?
📅 Mon Feb 02 02:04:13 +0000 2026
🔗 https://x.com/JackSomers/status/2018143387707212117
──────────────────────────────────────────────────

@stlbagelcuts (shadynasty):
@Shelpid_WI3M @grok is this legit
📅 Mon Feb 02 04:17:30 +0000 2026
🔗 https://x.com/stlbagelcuts/status/2018176927689838605
──────────────────────────────────────────────────

@MarkOro51367634 (MVO):
@Shelpid_WI3M You can get an $openclaw to do this
📅 Mon Feb 02 06:11:12 +0000 2026
🔗 https://x.com/MarkOro51367634/status/2018205544478335067
──────────────────────────────────────────────────

@Just_Jeff_89 (Just Jeff):
@Shelpid_WI3M @grok is this true about the trading success? Also is this a reliable x account to be listening to?
📅 Mon Feb 02 08:42:09 +0000 2026
🔗 https://x.com/Just_Jeff_89/status/2018243531014308313
──────────────────────────────────────────────────

@digi_onchain (digi):
@Shelpid_WI3M gj bro, my clawd made 45kk$ tonight too
📅 Mon Feb 02 12:07:33 +0000 2026
🔗 https://x.com/digi_onchain/status/2018295223273607338
──────────────────────────────────────────────────

@DisruptiveBytes (Flex | Prediction Markets):
@Shelpid_WI3M $50 → $248K overnight.

This is the moment prediction markets went from "interesting experiment" to "serious infrastructure."

The security hardening guide here is chef's kiss. Most people skip straight to trading and wonder why they get rekt. Defense first, alpha second.
📅 Mon Feb 02 13:05:49 +0000 2026
🔗 https://x.com/DisruptiveBytes/status/2018309883410407736
──────────────────────────────────────────────────

@JOC1017 (JOC):
@Shelpid_WI3M I can photoshop that screenshot to say I made $950,763 over night.
📅 Mon Feb 02 16:19:06 +0000 2026
🔗 https://x.com/JOC1017/status/2018358524980441190
──────────────────────────────────────────────────

@adamobrien (Adam O'Brien - bitcoinwell.com):
@Shelpid_WI3M 🤷🏻‍♂️ https://t.co/du6gNRS7y0
🖼️ https://pbs.twimg.com/media/HAMtEkLXUAATTX2.jpg
📅 Tue Feb 03 02:07:35 +0000 2026
🔗 https://x.com/adamobrien/status/2018506620574068897
──────────────────────────────────────────────────

@theory_fund (Theory Fund):
@Shelpid_WI3M @threadreaderapp unroll
📅 Tue Feb 03 07:47:26 +0000 2026
🔗 https://x.com/theory_fund/status/2018592147302412649
──────────────────────────────────────────────────


=== GITHUB: PolymarketBTC15mAssistant ===
# Polymarket BTC 15m Assistant

A real-time console trading assistant for Polymarket **"Bitcoin Up or Down" 15-minute** markets.

It combines:
- Polymarket market selection + UP/DOWN prices + liquidity
- Polymarket live WS **Chainlink BTC/USD CURRENT PRICE** (same feed shown on the Polymarket UI)
- Fallback to on-chain Chainlink (Polygon) via HTTP/WSS RPC
- Binance spot price for reference
- Short-term TA snapshot (Heiken Ashi, RSI, MACD, VWAP, Delta 1/3m)
- A simple live **Predict (LONG/SHORT %)** derived from the assistant’s current TA scoring

## Requirements

- Node.js **18+** (https://nodejs.org/en)
- npm (comes with Node)


## Run from terminal (step-by-step)

### 1) Clone the repository

```bash
git clone https://github.com/FrondEnt/PolymarketBTC15mAssistant.git
```

Alternative (no git):

- Click the green `<> Code` button on GitHub
- Choose `Download ZIP`
- Extract the ZIP
- Open a terminal in the extracted project folder

Then open a terminal in the project folder.

### 2) Install dependencies

```bash
npm install
```

### 3) (Optional) Set environment variables

You can run without extra config (defaults are included), but for more stable Chainlink fallback it’s recommended to set at least one Polygon RPC.

#### Windows PowerShell (current terminal session)

```powershell
$env:POLYGON_RPC_URL = "https://polygon-rpc.com"
$env:POLYGON_RPC_URLS = "https://polygon-rpc.com,https://rpc.ankr.com/polygon"
$env:POLYGON_WSS_URLS = "wss://polygon-bor-rpc.publicnode.com"
```

Optional Polymarket settings:

```powershell
$env:POLYMARKET_AUTO_SELECT_LATEST = "true"
# $env:POLYMARKET_SLUG = "btc-updown-15m-..."   # pin a specific market
```

#### Windows CMD (current terminal session)

```cmd
set POLYGON_RPC_URL=https://polygon-rpc.com
set POLYGON_RPC_URLS=https://polygon-rpc.com,https://rpc.ankr.com/polygon
set POLYGON_WSS_URLS=wss://polygon-bor-rpc.publicnode.com
```

Optional Polymarket settings:

```cmd
set POLYMARKET_AUTO_SELECT_LATEST=true
REM set POLYMARKET_SLUG=btc-updown-15m-...
```

Notes:
- These environment variables apply only to the current terminal window.
- If you want permanent env vars, set them via Windows System Environment Variables or use a `.env` loader of your choice.

## Configuration

This project reads configuration from environment variables.

You can set them in your shell, or create a `.env` file and load it using your preferred method.

### Polymarket

- `POLYMARKET_AUTO_SELECT_LATEST` (default: `true`)
  - When `true`, automatically picks the latest 15m market.
- `POLYMARKET_SERIES_ID` (default: `10192`)
- `POLYMARKET_SERIES_SLUG` (default: `btc-up-or-down-15m`)
- `POLYMARKET_SLUG` (optional)
  - If set, the assistant will target a specific market slug.
- `POLYMARKET_LIVE_WS_URL` (default: `wss://ws-live-data.polymarket.com`)

### Chainlink on Polygon (fallback)

- `CHAINLINK_BTC_USD_AGGREGATOR`
  - Default: `0xc907E116054Ad103354f2D350FD2514433D57F6f`

HTTP RPC:
- `POLYGON_RPC_URL` (default: `https://polygon-rpc.com`)
- `POLYGON_RPC_URLS` (optional, comma-separated)
  - Example: `https://polygon-rpc.com,https://rpc.ankr.com/polygon`

WSS RPC (optional but recommended for more real-time fallback):
- `POLYGON_WSS_URL` (optional)
- `POLYGON_WSS_URLS` (optional, comma-separated)

### Proxy support

The bot supports HTTP(S) proxies for both HTTP requests (fetch) and WebSocket connections.

Supported env vars (standard):

- `HTTPS_PROXY` / `https_proxy`
- `HTTP_PROXY` / `http_proxy`
- `ALL_PROXY` / `all_proxy`

Examples:

PowerShell:

```powershell
$env:HTTPS_PROXY = "http://127.0.0.1:8080"
# or
$env:ALL_PROXY = "socks5://127.0.0.1:1080"
```

CMD:

```cmd
set HTTPS_PROXY=http://127.0.0.1:8080
REM or
set ALL_PROXY=socks5://127.0.0.1:1080
```

#### Proxy with username + password (simple guide)

1) Take your proxy host and port (example: `1.2.3.4:8080`).

2) Add your login and password in the URL:

- HTTP/HTTPS proxy:
  - `http://USERNAME:PASSWORD@HOST:PORT`
- SOCKS5 proxy:
  - `socks5://USERNAME:PASSWORD@HOST:PORT`

3) Set it in the terminal and run the bot.

PowerShell:

```powershell
$env:HTTPS_PROXY = "http://USERNAME:PASSWORD@HOST:PORT"
npm start
```

CMD:

```cmd
set HTTPS_PROXY=http://USERNAME:PASSWORD@HOST:PORT
npm start
```

Important: if your password contains special characters like `@` or `:` you must URL-encode it.

Example:

- password: `p@ss:word`
- encoded: `p%40ss%3Aword`
- proxy URL: `http://user:p%40ss%3Aword@1.2.3.4:8080`

## Run

```bash
npm start
```

### Stop

Press `Ctrl + C` in the terminal.

### Update to latest version

```bash
git pull
npm install
npm start
```

## Notes / Troubleshooting

- If you see no Chainlink updates:
  - Polymarket WS might be temporarily unavailable. The bot falls back to Chainlink on-chain price via Polygon RPC.
  - Ensure at least one working Polygon RPC URL is configured.
- If the console looks like it “spams” lines:
  - The renderer uses `readline.cursorTo` + `clearScreenDown` for a stable, static screen, but some terminals may still behave differently.

## Safety

This is not financial advice. Use at your own risk.

created by @krajekis
