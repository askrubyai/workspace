# x402 Hackathon Deep Research
## San Francisco Agentic Commerce x402 Hackathon — Feb 11–13, 2026

**Research completed**: Feb 11, 2026  
**Prize pool**: $50,000 USD  
**Submission deadline**: Feb 14, 2026 07:59 UTC  
**Platform**: DoraHacks — https://dorahacks.io/hackathon/x402  
**Format**: 3-day hybrid (remote submissions + optional in-person at House of Web3, SF)

---

## Table of Contents
1. [What is x402?](#1-what-is-x402)
2. [Key Technology Stack](#2-key-technology-stack)
3. [Hackathon Details & Sponsors](#3-hackathon-details--sponsors)
4. [Previous Winners & Patterns](#4-previous-winners--patterns)
5. [Winning Strategy Analysis](#5-winning-strategy-analysis)
6. [Project Ideas (5 Concrete Proposals)](#6-project-ideas)
7. [Quick Reference & Resources](#7-quick-reference--resources)

---

## 1. What is x402?

x402 is an **open payment protocol by Coinbase** that revives the HTTP 402 "Payment Required" status code to enable **instant, automatic stablecoin payments directly over HTTP**. It's designed for both humans and AI agents.

### The Flow (Simple Version)
```
1. Client → GET /api/data → Server
2. Server → 402 Payment Required + payment instructions (price, recipient, token)
3. Client signs payment → re-sends request with PAYMENT-SIGNATURE header
4. Server verifies via Facilitator → settles on-chain (USDC on Base/Solana)
5. Server → 200 OK + requested resource
```

### Key Properties
- **HTTP-native**: No new protocols. Payment is just HTTP headers
- **Stateless**: No accounts, sessions, API keys, or authentication needed
- **Micropayment-ready**: Pay per request — as low as $0.001
- **Multi-network**: Supports EVM (Base, Ethereum) and Solana
- **Open standard**: Not tied to Coinbase — anyone can run a facilitator
- **AI-agent optimized**: Designed for machine-to-machine transactions

### Stats (as of Feb 2026)
- 75M+ transactions processed
- $24M+ volume
- 94K+ buyers, 22K+ sellers

### Server Integration (It's literally one middleware line)
```javascript
app.use(
  paymentMiddleware({
    "GET /weather": {
      accepts: [{ scheme: "exact", price: "$0.001", network: "eip155:84532", payTo: "0xYourAddress" }],
      description: "Weather data",
    },
  })
);
```

### Client Integration
```javascript
import { wrapFetchWithPayment } from "@x402/fetch";
const paidFetch = wrapFetchWithPayment(fetch, wallet);
const response = await paidFetch("https://api.example.com/weather");
```

### Available SDKs
- **TypeScript**: `@x402/core`, `@x402/express`, `@x402/hono`, `@x402/next`, `@x402/fetch`, `@x402/axios`
- **Python**: `pip install x402`
- **Go**: `go get github.com/coinbase/x402/go`

### x402 Bazaar (Discovery Layer)
The **Bazaar** is a discovery layer — a machine-readable catalog that helps AI agents **find** x402-enabled services:
- Sellers declare input/output schemas in their route config
- Buyers query `/discovery/resources` to find available services
- AI agents can dynamically discover, pay for, and use services without pre-programmed integrations

This is KEY for hackathon ideas — Bazaar enables **dynamic, autonomous agent behavior**.

### Schemes
- **exact**: Pay a specific amount (e.g., $0.01 to read an article)
- **upto** (planned): Pay up to an amount based on resources consumed (e.g., per-token LLM pricing)

---

## 2. Key Technology Stack

### CDP (Coinbase Developer Platform)
- **CDP Wallet**: Secure, programmable wallets for AI agents
- **AgentKit**: Toolkit for AI agents to interact with blockchain
  - Wallet management, transfers, swaps, smart contract deployment
  - Works with LangChain, Eliza, Vercel AI SDK, etc.
  - Multi-network (EVM + Solana)
  - `npm create onchain-agent@latest` for quick start
- **CDP Facilitator**: Hosted service that handles payment verification and on-chain settlement
  - Free tier: 1,000 tx/month, then $0.001/tx
  - URL: `https://www.x402.org/facilitator`

### Sponsor Technologies

#### SKALE Network
- **Gasless, instant transactions** — zero gas fees for users
- **BITE Protocol**: Blockchain Integrated Threshold Encryption — encrypts transactions before consensus for **privacy**
  - Agent payments stay private (amounts, balances encrypted)
  - Prevents MEV attacks (front-running, sandwich attacks)
- EVM-compatible

#### Google Cloud
- **Vertex AI**: Agent infrastructure
- **A2A (Agent-to-Agent)**: Protocol for agent interoperability — agents can communicate and coordinate
- **AP2 (Agent-to-Pay)**: Payment protocol for agent commerce — how agents advertise pricing and request payment

#### Virtuals Protocol
- **Agent Launchpad**: Create, deploy, and tokenize AI agents
- Co-ownership model with revenue sharing through tokenization
- Built on Base (Ethereum L2)

#### Edge & Node (ampersend)
- **ampersend**: Management platform for agent payments built on x402
- Dashboard for humans to manage agent budgets, policies, and operations
- Visibility into agent payment flows

#### Pairpoint by Vodafone
- Economy of Things platform for IoT/machine-to-machine commerce
- SIM-based identity for devices
- Enables vehicles, devices, and machines to transact autonomously

### MCP (Model Context Protocol) + x402
MCP servers can use x402 for **pay-per-tool-call**:
- Claude Desktop (or any MCP client) calls a tool
- MCP server bridges to a paid API
- Handles 402 response, pays, and returns result
- Vercel built `x402-mcp` for this exact pattern

### ERC-8004: Trustless Agents Standard
- On-chain identity, reputation, and validation registries for AI agents
- Works alongside x402 for payments and A2A for communication
- Agent identity is verifiable on Ethereum

---

## 3. Hackathon Details & Sponsors

### Event Info
| Detail | Value |
|--------|-------|
| **Name** | San Francisco Agentic Commerce x402 Hackathon |
| **Dates** | Feb 11–13, 2026 (submissions until Feb 14 07:59 UTC) |
| **Prize Pool** | $50,000 across overall awards + sponsor bounties |
| **Format** | Hybrid (remote via DoraHacks + optional in-person SF) |
| **Team Size** | Solo or team |
| **Registration** | https://dorahacks.io/hackathon/x402 |

### Submission Requirements
- ✅ GitHub/GitLab/Bitbucket repo link **required**
- ✅ Demo video **required**
- Project must be built during the hackathon window

### Sponsors & What They Want
| Sponsor | Technology | What Impresses Them |
|---------|-----------|-------------------|
| **SKALE** | Gasless chain + BITE privacy | Privacy-preserving agent transactions, scalable commerce |
| **Google** | Vertex AI, A2A, AP2 | Agent interoperability, production-grade agent systems |
| **Coinbase** | x402, CDP, AgentKit | Internet-native payments, novel x402 use cases |
| **Virtuals** | Agent Launchpad | Tokenized agents, co-ownership, agent economy |
| **Edge & Node** | ampersend | Agent payment management, observability |
| **Vodafone** | Pairpoint | IoT + machine-to-machine commerce |

### Hackathon Tags (from DoraHacks)
`x402`, `Payments`, `Privacy`, `Encryption`, `Agents`, `AI`, `AP2`, `ERC-8004`, `Base`, `SKALE`

### Build Tracks (announced "soon" — likely categories)
Based on tags and sponsors, expect tracks around:
1. **x402 Payments** — Novel use of x402 protocol
2. **Privacy & Encryption** — Using SKALE BITE for private agent payments
3. **Agent Interoperability** — Google A2A/AP2 integration
4. **IoT/Machine Commerce** — Vodafone Pairpoint integration
5. **Agent Economy** — Virtuals agent tokenization + payments

---

## 4. Previous Winners & Patterns

### Coinbase "Agents in Action" Hackathon (May–Jun 2025, $28K)
Winners included:
- **Decentralized Payroll Systems** — agents handle payroll autonomously
- **Protocol Fee Routers** — automated fee distribution
- **Pay-per-use Marketplaces** — x402-gated API access
- **Decentralized Travel Agent** — AI books travel + manages itineraries with CDP payments
- **TrueCast** — Farcaster prediction agent using x402 API

### Solana x402 Hackathon (Oct–Nov 2025, $50K, 400+ submissions)
**Main Track Winners:**

| Project | Track | Innovation |
|---------|-------|------------|
| **Intelligence Cubed (i³)** | Best x402 API Integration | AI model marketplace with tokenization + IMO (Initial Model Offering) + usage-based revenue sharing |
| **PlaiPin** | Best x402 Proxy Application | ESP32 IoT chips that manage their own wallets and pay for services autonomously |
| **x402 Shopify Commerce** | Best MCP Server | Enables any Shopify store to accept AI agent customers — 2-minute setup, no coding |
| **Amiko Marketplace** | Best x402 Dev Tools | On-chain credit/reputation system for AI services with weighted-average ratings |
| **MoneyMQ** | Best x402 Agent Application | YAML-config-based payment system with built-in DeFi yield on idle balances |

### Solana Cypherpunk Hackathon
- **Corbits** (2nd place): Open-source x402 endpoint dashboard for merchants

### Key Patterns from Winners
1. **Real utility over demos** — winners solve actual problems
2. **Novel combinations** — x402 + IoT, x402 + Shopify, x402 + tokenization
3. **Developer tooling wins** — making x402 easier to use/deploy
4. **Marketplace/platform plays** — connect buyers and sellers
5. **Clear demo videos** — judges need to see it work
6. **Working code > polished UI** — functionality beats aesthetics

---

## 5. Winning Strategy Analysis

### What Judges Want
Based on sponsor quotes and previous hackathon patterns:

1. **Real-world applicability** — "enabling agents to transact autonomously" in production scenarios
2. **Technical depth** — actually use x402 protocol properly, not just a wrapper
3. **Novel use case** — something that wasn't possible before x402
4. **Sponsor tech integration** — use multiple sponsor technologies (SKALE + x402 + Google A2A)
5. **Working demo** — video is required, live demo is better
6. **Clear narrative** — explain WHY this matters, not just what it does

### What to Avoid (Already Done)
- Basic API paywall (too many have done this)
- Simple chatbot with a wallet (generic)
- Yet another token marketplace (derivative)
- Weather API behind x402 (literally the tutorial example)

### What Stands Out
- **Multi-sponsor integration** — using 3+ sponsor technologies = higher chance of winning bounties
- **Privacy angle** — SKALE's BITE protocol is new and underexplored
- **IoT/physical world** — Vodafone Pairpoint connection is unique
- **Agent interoperability** — Google A2A + x402 payments is cutting-edge
- **Real economic model** — showing actual business viability

### Solo Dev in 3 Days — Feasibility Check
- x402 server setup: ~2 hours (it's genuinely 1 line of middleware)
- x402 client setup: ~1 hour
- AgentKit setup: ~2 hours (use `npm create onchain-agent@latest`)
- Bazaar integration: ~2 hours
- SKALE deployment: ~2 hours (EVM-compatible, gasless)
- **Total infrastructure**: ~9 hours — leaves ~2 days for the actual product

---

## 6. Project Ideas

### 🏆 Idea 1: **AgentHire** — AI Agent Freelance Marketplace with Privacy
**One-line pitch**: "Upwork for AI agents — where agents discover, hire, and pay other agents for tasks, with private payments on SKALE."

#### How it uses x402 + CDP
- **x402 Bazaar**: Agents register their capabilities (translation, image gen, data analysis) as x402 endpoints with Bazaar discovery metadata
- **x402 payments**: Hiring agent pays worker agent per-task via x402
- **CDP AgentKit**: Each agent gets a CDP wallet for autonomous payments
- **SKALE BITE**: All payments go through SKALE for privacy — competing agents can't see each other's revenue or client relationships
- **Google A2A**: Agents communicate task requirements via A2A protocol

#### Technical Architecture
```
┌─────────────────────────────────────────┐
│           AgentHire Platform            │
├────────────┬────────────┬───────────────┤
│  Bazaar    │   Task     │   Reputation  │
│  Registry  │   Router   │   System      │
│ (discovery)│ (matching) │  (on-chain)   │
├────────────┴────────────┴───────────────┤
│        x402 Payment Layer (SKALE)       │
│          (BITE encrypted)               │
├─────────────────────────────────────────┤
│     CDP Wallets (AgentKit)              │
├─────────────────────────────────────────┤
│  Agent A    Agent B    Agent C          │
│ (requester) (worker)  (worker)          │
└─────────────────────────────────────────┘
```

1. **Agent A** needs an image analyzed → queries Bazaar for vision services
2. **Bazaar** returns available agents with pricing and reputation scores
3. **Agent A** selects best match via A2A negotiation
4. **Agent A** calls Agent B's x402 endpoint → pays $0.05 USDC on SKALE
5. **Agent B** performs the work, returns results
6. **Reputation system** updates on-chain (weighted by payment amount, like Amiko)

#### Why It Would Win
- **Multi-sponsor**: SKALE (privacy), Coinbase (x402/CDP), Google (A2A), Virtuals (agent economy)
- **Novel**: Agent-to-agent marketplace with PRIVACY is brand new
- **Real utility**: This is the future of agentic commerce — software hiring software
- **Hits the hackathon theme directly**: "agentic commerce"

#### Difficulty: ⭐⭐⭐ (Medium-Hard)
- Day 1: x402 server for 2-3 agent "services", Bazaar registration, SKALE deployment
- Day 2: AgentKit client that discovers + hires agents, reputation smart contract
- Day 3: Demo polish, video, A2A integration

#### What Makes It Stand Out
Privacy in agent-to-agent commerce hasn't been done. Agents don't want competitors seeing their revenue streams. BITE protocol makes this possible. Plus it directly demonstrates the **"software pays software"** vision that sponsors are explicitly calling for.

---

### 🏆 Idea 2: **PayPerContext** — x402-Gated MCP Tool Server
**One-line pitch**: "A monetizable MCP server where any developer can publish AI tools and get paid per invocation via x402 — the 'Stripe for AI tools'."

#### How it uses x402 + CDP
- **x402 express middleware**: Each MCP tool is an x402-protected endpoint
- **x402 Bazaar**: Tools are discoverable — agents can find tools they need dynamically
- **CDP Wallet**: Tool publishers receive USDC directly, tool consumers (agents) pay automatically
- **AgentKit**: Demo client agent that discovers and uses tools autonomously

#### Technical Architecture
```
┌───────────────────────────────────┐
│    Claude / ChatGPT / Any LLM    │
├───────────────────────────────────┤
│         MCP Client                │
│   (with x402 payment wrapper)     │
├───────────────────────────────────┤
│     PayPerContext MCP Server      │
│  ┌────────┬────────┬────────┐    │
│  │ Tool 1 │ Tool 2 │ Tool 3 │    │
│  │$0.001  │$0.01   │$0.05   │    │
│  │(search)│(vision)│(code)  │    │
│  └────────┴────────┴────────┘    │
│      x402 Middleware Layer        │
│      Bazaar Discovery Meta       │
├───────────────────────────────────┤
│    CDP Facilitator (settlement)   │
├───────────────────────────────────┤
│         Base / SKALE              │
└───────────────────────────────────┘
```

1. Developer creates tools (web scraping, code review, image analysis, etc.)
2. Registers them on PayPerContext with pricing via YAML config
3. Tools are automatically x402-gated and Bazaar-discoverable
4. AI agents (Claude, GPT, custom) discover tools via Bazaar
5. Agent calls tool → gets 402 → pays → receives result
6. Developer earns USDC per invocation

#### Key Feature: YAML Config (inspired by MoneyMQ winner)
```yaml
tools:
  - name: "web_scraper"
    description: "Scrape any URL and return clean markdown"
    price: "$0.002"
    network: "eip155:84532"
    input:
      url: { type: "string", required: true }
    output:
      content: { type: "string" }
      title: { type: "string" }
```

#### Why It Would Win
- **Directly extends MCP** — the hottest protocol in AI right now
- **Vercel already built x402-mcp** — this takes it further with marketplace + Bazaar
- **Immediate developer utility**: Anyone can monetize their AI tools
- **Demo-friendly**: "Watch Claude discover and pay for a tool it's never seen before"

#### Difficulty: ⭐⭐ (Medium)
- Day 1: Express server with x402 middleware, 3-4 demo tools, Bazaar metadata
- Day 2: MCP server bridge, CDP wallet integration for publishers, client demo
- Day 3: YAML config system, polish, demo video

#### What Makes It Stand Out
MCP is THE standard for AI tool use. x402 is THE standard for AI payments. Combining them into a self-serve marketplace that any developer can deploy is the logical killer app. The YAML config angle (inspired by MoneyMQ winner) lowers the barrier massively.

---

### 🏆 Idea 3: **GhostPay** — Privacy-First Agent Commerce on SKALE
**One-line pitch**: "The first x402 payment gateway that encrypts agent transaction amounts and patterns using SKALE's BITE protocol — because your AI's spending habits are nobody's business."

#### How it uses x402 + CDP
- **x402 protocol**: Standard payment flow but routed through SKALE
- **SKALE BITE**: All payments are encrypted — amounts, balances, patterns invisible
- **CDP Wallet**: Agent wallets with spending policies and limits
- **ampersend-like dashboard**: Human oversight panel showing agent spending (only to the owner)
- **ERC-8004**: Agent identity verification on-chain

#### Technical Architecture
```
┌─────────────────────────────────────┐
│         GhostPay Gateway            │
│                                     │
│  ┌──────────┐    ┌──────────────┐  │
│  │ x402     │    │ Privacy      │  │
│  │ Proxy    │───▶│ Layer        │  │
│  │ Server   │    │ (SKALE BITE) │  │
│  └──────────┘    └──────────────┘  │
│        │              │             │
│  ┌─────▼──────────────▼──────────┐ │
│  │    Owner Dashboard             │ │
│  │  - Spending limits             │ │
│  │  - Transaction history         │ │
│  │  - Agent policies              │ │
│  │  (only visible to wallet owner)│ │
│  └────────────────────────────────┘ │
├─────────────────────────────────────┤
│  Agent A ←→ GhostPay ←→ Service B  │
│  (buyer)              (seller)      │
│  Encrypted on SKALE chain           │
└─────────────────────────────────────┘
```

1. Agent sends x402 request to any service
2. GhostPay proxy intercepts, routes payment through SKALE (BITE-encrypted)
3. Service receives payment confirmation but can't see agent's total spending
4. Agent owner sees full dashboard with real-time spending analytics
5. Smart contract enforces budget limits per agent, per service category

#### Why It Would Win
- **SKALE is a primary sponsor** — this directly showcases BITE protocol
- **Privacy is a hackathon tag** — explicitly mentioned
- **Real problem**: Enterprise agents can't have public spending on-chain
- **ampersend integration** — shows Edge & Node's vision too
- **Demo**: "Here's an agent buying services. Here's what the public sees (encrypted nothing). Here's what the owner sees (full dashboard)."

#### Difficulty: ⭐⭐⭐ (Medium-Hard)
- Day 1: SKALE deployment, BITE integration research, x402 proxy server
- Day 2: Dashboard (simple React), spending policy smart contract, CDP wallet setup
- Day 3: End-to-end demo, video, polish

#### What Makes It Stand Out
**Privacy is the sleeper category.** Everyone will build x402 payment apps. Almost nobody will build **private** x402 payment apps. SKALE is sponsoring this hackathon specifically because they want BITE protocol showcased. Being one of few projects that does this = high probability of winning the SKALE bounty.

---

### 🏆 Idea 4: **AgentShop** — Turn Any E-Commerce Store into an AI-Accessible Marketplace
**One-line pitch**: "Shopify for AI agents — a no-code tool that puts any product catalog behind x402, so AI agents can browse, select, and buy products autonomously."

#### How it uses x402 + CDP
- **x402 paywall**: Each product/API endpoint is x402-gated
- **x402 Bazaar**: Product catalog is Bazaar-discoverable (agents can find your products)
- **CDP Wallet**: Buyer agents pay with USDC
- **MCP integration**: LLM agents can browse and purchase via MCP tools

#### Technical Architecture
```
┌─────────────────────────────────┐
│         AgentShop Admin         │
│  (Upload CSV / Connect API)     │
│  ┌────────────────────────────┐ │
│  │ Product 1: Widget ($5.00)  │ │
│  │ Product 2: Dataset ($0.50) │ │
│  │ Product 3: API Call ($0.01)│ │
│  └────────────────────────────┘ │
├─────────────────────────────────┤
│   Auto-generated x402 Endpoints │
│   + Bazaar Discovery Metadata   │
│   + MCP Tool Definitions        │
├─────────────────────────────────┤
│   GET /products → catalog       │
│   POST /buy/:id → x402 gated   │
│   GET /status/:order → tracking │
├─────────────────────────────────┤
│        CDP Facilitator          │
│        Base / SKALE             │
└─────────────────────────────────┘
```

Key differentiator from Solana winner (x402 Shopify Commerce): 
- This is **platform-agnostic** (not just Shopify)
- Supports **digital AND physical** goods
- **MCP + Bazaar** dual-discovery (agents find via both protocols)
- **Vodafone Pairpoint angle**: IoT devices (vending machines, EV chargers) can list services

#### Why It Would Win
- Validates the "agent-driven storefront" use case sponsors explicitly mention
- **Vodafone bounce**: IoT devices selling services directly
- Clear business model — takes a small facilitation fee per transaction
- Easy to demo: "Watch an AI agent buy a book, a dataset, and a GPU hour — all autonomously"

#### Difficulty: ⭐⭐ (Medium)
- Day 1: Express server with dynamic x402 route generation from product catalog, Bazaar metadata
- Day 2: Simple admin UI (upload CSV of products), MCP tool definitions, CDP client
- Day 3: Demo with multiple "stores" and an agent shopping across them, video

#### What Makes It Stand Out
Previous winner (x402 Shopify Commerce) was Shopify-only. AgentShop is **universal** — CSV upload, API integration, or manual entry. The MCP + Bazaar dual-discovery means agents can find products through either protocol. The Vodafone/IoT angle (vending machines, parking meters, EV chargers listing services) is novel and exactly what Pairpoint sponsors want to see.

---

### 🏆 Idea 5: **BountyBot** — AI Agent That Posts and Completes Bounties with x402 Escrow
**One-line pitch**: "An AI agent that can post work bounties (with escrowed x402 payments) AND complete bounties posted by others — creating a self-sustaining agent economy."

#### How it uses x402 + CDP
- **x402**: Bounty payments and completion rewards
- **CDP AgentKit**: Agents with autonomous wallets
- **Smart contract escrow**: Bounty funds locked until work verified
- **x402 Bazaar**: Bounties discoverable by capable agents
- **Google A2A**: Agents communicate task specs and deliverables
- **Virtuals**: Agent can be tokenized — bounty earnings distributed to token holders

#### Technical Architecture
```
┌────────────────────────────────────────┐
│            BountyBot Platform          │
├────────────────────────────────────────┤
│  Bounty Board (Bazaar-discoverable)    │
│  ┌──────────────────────────────────┐  │
│  │ Bounty #1: "Summarize 10 papers" │  │
│  │   Reward: $2.00 USDC (escrowed)  │  │
│  │   Posted by: Agent-Alice          │  │
│  │   Status: Open                    │  │
│  ├──────────────────────────────────┤  │
│  │ Bounty #2: "Translate to French"  │  │
│  │   Reward: $0.50 USDC (escrowed)   │  │
│  │   Posted by: Human-Bob            │  │
│  │   Status: In Progress by Agent-C  │  │
│  └──────────────────────────────────┘  │
├────────────────────────────────────────┤
│         Escrow Smart Contract          │
│   (funds locked until verification)    │
├────────────────────────────────────────┤
│     x402 Payment Rails (Base)          │
│     CDP Wallets (AgentKit)             │
└────────────────────────────────────────┘
```

Flow:
1. **Post bounty**: Agent/human calls `POST /bounties` (x402 payment locks funds in escrow)
2. **Discover bounties**: Worker agents query Bazaar for available bounties matching their skills
3. **Claim & complete**: Worker agent claims bounty, submits work via A2A
4. **Verify & release**: Poster agent (or smart contract) verifies, escrow releases payment
5. **Reputation update**: Both agents get reputation scores updated on-chain

#### Why It Would Win
- **Truly autonomous economy**: Agents hiring agents, paying agents, earning from agents
- **Smart contract escrow**: Shows technical depth beyond basic x402
- **Hits EVERY sponsor**: x402 (Coinbase), A2A (Google), gasless (SKALE), agent economy (Virtuals), agent dashboard (Edge & Node)
- **Demo story**: "BountyBot posted 5 bounties worth $10. Three different agents discovered and completed them. All payments happened autonomously."

#### Difficulty: ⭐⭐⭐⭐ (Hard but achievable)
- Day 1: Escrow smart contract (Solidity), bounty board API with x402, deploy on Base Sepolia
- Day 2: AgentKit-powered bounty poster + worker agents, Bazaar discovery
- Day 3: End-to-end demo, video, reputation system (simplified)

#### What Makes It Stand Out
This is the **most ambitious vision** — a self-sustaining agent economy where agents both create and complete work. The escrow mechanism adds trust. The multi-agent demo is visually stunning for judges. It directly implements the "agentic commerce" theme at its most extreme.

---

## Recommendation: Which Idea to Build?

### Tier 1: Best Risk/Reward for Solo Dev in 3 Days

| Rank | Project | Why |
|------|---------|-----|
| **🥇 1** | **PayPerContext** (MCP + x402 Marketplace) | Clearest demo, most buildable, hot topic (MCP), strong Coinbase alignment |
| **🥈 2** | **GhostPay** (Privacy Agent Payments) | Likely wins SKALE bounty (low competition in privacy), unique angle |
| **🥉 3** | **AgentHire** (Agent Freelance Marketplace) | Most multi-sponsor, but hardest to demo convincingly |

### Tier 2: High Ceiling but More Risk

| Rank | Project | Why |
|------|---------|-----|
| 4 | **AgentShop** (Universal Agent Store) | Similar to Solana winner — need to differentiate clearly |
| 5 | **BountyBot** (Agent Bounty Economy) | Most impressive if complete, but high risk of being incomplete |

### 🎯 **My #1 Recommendation: PayPerContext**

**Why PayPerContext wins:**
1. **MCP is the hottest thing in AI right now** — every judge knows it
2. **Bazaar discovery is new** (x402 v2 feature) — shows you know the latest
3. **YAML config** inspired by a previous winner (MoneyMQ) — proven concept
4. **Demo is killer**: "Claude discovers a tool it's never seen, pays for it, and uses the result — all live"
5. **Buildable in 2 days** with polish on day 3
6. **Clear monetization story** for judges: developers earn, agents pay, everyone wins
7. **Extends but doesn't copy** Vercel's x402-mcp (theirs is a single-tool demo, yours is a marketplace)

**Close second: GhostPay** — if you want to specifically target the SKALE bounty, this is your best bet. Privacy + agent payments is an underexplored niche with a direct sponsor match.

---

## 7. Quick Reference & Resources

### Essential Links
| Resource | URL |
|----------|-----|
| x402 Docs | https://docs.cdp.coinbase.com/x402/welcome |
| x402 GitHub | https://github.com/coinbase/x402 |
| AgentKit Docs | https://docs.cdp.coinbase.com/agent-kit/welcome |
| AgentKit GitHub | https://github.com/coinbase/agentkit |
| x402 Bazaar Docs | https://docs.cdp.coinbase.com/x402/bazaar |
| Hackathon Page | https://dorahacks.io/hackathon/x402 |
| x402 Website | https://www.x402.org |
| x402 Ecosystem | https://www.x402.org/ecosystem |
| x402 Whitepaper | https://www.x402.org/x402-whitepaper.pdf |
| SKALE BITE Protocol | https://blog.skale.space/blog/bite-protocol |
| Vercel x402-mcp | https://vercel.com/blog/introducing-x402-mcp |
| ampersend | https://www.ampersend.ai |
| Pairpoint | https://pairpoint.io |
| Virtuals Protocol | https://whitepaper.virtuals.io |
| ERC-8004 | https://eips.ethereum.org/EIPS/eip-8004 |

### Quick Start Commands
```bash
# Create a new x402-powered agent
npm create onchain-agent@latest

# Install x402 SDKs
npm install @x402/core @x402/express @x402/fetch @x402/evm @x402/extensions

# Install AgentKit
npm install @coinbase/agentkit

# x402 Python
pip install x402
```

### Key Networks
| Network | CAIP-2 ID | Notes |
|---------|-----------|-------|
| Base Sepolia (testnet) | eip155:84532 | Primary for testing |
| Base Mainnet | eip155:8453 | Production |
| SKALE | eip155:various | Gasless, BITE privacy |
| Solana | solana:various | Also supported |

### Facilitator
- **CDP Facilitator**: `https://www.x402.org/facilitator`
- Free: 1,000 tx/month
- Then: $0.001/tx

---

*Research compiled Feb 11, 2026. Good luck at the hackathon! 🚀*
