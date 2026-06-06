# 🚃 Trolley Problem Simulator

An interactive ethical dilemma simulator that explores moral philosophy through the lens of the classic trolley problem and its many variants. Discover whether you lean **utilitarian** or **deontological** in your moral reasoning.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)

## ✨ Features

### Core Experience
- **8 Core + 4 Extended Dilemmas** - From the classic trolley problem to modern scenarios like AI judges and genetic engineering
- **Extended Mode** - Toggle on for 12 total dilemmas including vaccine allocation, AI sentencing, memory manipulation, and designer babies
- **Two Philosophical Frameworks** - Every choice maps to either utilitarian (outcome-focused) or deontological (duty-based) ethics
- **Animated Visualizations** - Watch the trolley scenario play out with SVG animations, including impact effects
- **Comprehensive Results** - Get a detailed ethical profile with statistics, analysis, and philosopher commentary

### Interactive Elements
- **Timed Mode** - Optional pressure with customizable timer (10-120 seconds)
- **Confirmation Phase** - "Is this your final answer?" prompt with half-timer for second thoughts
- **Auto-Skip** - Questions are skipped (not randomly answered) when timer expires
- **Mind Change Tracking** - Records when you switch answers and analyzes the pattern

### Results & Insights
- **Dominant Philosophy** - See if you lean utilitarian, deontological, or balanced
- **Consistency Score** - How aligned are your choices with a single framework?
- **"What Would Philosophers Say?"** - Commentary from thinkers like Kant, Bentham, and Singer on each of your choices
- **Scenario Variants** - "Food for thought" twists after each answer (e.g., "What if it was your child?")
- **Hesitation Analysis** - Response time tracking reveals which dilemmas conflicted you most
- **Real-Time Choice Comparisons** - Compares your decisions against seeded global stats right after you answer (e.g., "73% of people also chose 'Pull the Lever'")
- **Canvas Share Card** - Generates a 1200×630px HTML5 Canvas image showcasing your ethical profile, stats panels, and your most conflicted dilemma
- **Mobile-First Sharing** - Uses the Web Share API to send the PNG card directly to other apps, with automatic desktop download fallbacks
- **Scholarly Learn Page** - Educational guide on Utilitarianism, Deontology, and Virtue Ethics, featuring academic citations (Foot, Thomson) and curated reading links


## 🎭 The Dilemmas

### Core Scenarios (8)
| # | Scenario | Category | Difficulty |
|---|----------|----------|------------|
| 1 | The Classic Trolley Problem | Transportation | Warm-Up |
| 2 | The Footbridge Dilemma | Transportation | Hard |
| 3 | The Surgeon's Dilemma | Medical Ethics | Gut-Wrenching |
| 4 | The Self-Driving Car | Technology | Hard |
| 5 | The Lifeboat Crisis | Survival | Gut-Wrenching |
| 6 | The Time Traveler's Burden | Sci-Fi Ethics | Soul-Crushing |
| 7 | The Surveillance State | Privacy & Security | Hard |
| 8 | The Whistleblower's Choice | Corporate Ethics | Soul-Crushing |

### Extended Scenarios (+4)
| # | Scenario | Category | Difficulty |
|---|----------|----------|------------|
| 9 | The Vaccine Lottery | Public Health | Hard |
| 10 | The AI Judge | Justice & Technology | Soul-Crushing |
| 11 | The Memory Wipe | Personal Identity | Gut-Wrenching |
| 12 | The Genetic Editor | Bioethics | Soul-Crushing |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bedigambar/Trolley-Problem-Simulator
cd trolley-problem-simulator

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
app/
├── page.tsx              # Home page with CTA, timer, and extended mode settings
├── test/page.tsx         # Main quiz flow
├── result/page.tsx       # Results display
├── learn/page.tsx        # Philosophy education page
├── scenarios.ts          # All 12 dilemma definitions (8 core + 4 extended)
├── types.ts              # TypeScript interfaces
├── globals.css           # Tailwind imports and CSS variables
├── layout.tsx            # Root layout with fonts
├── api/
│   └── trolley/route.ts  # API for aggregate statistics
└── components/
    ├── ScenarioCard.tsx       # Main dilemma card with timer logic
    ├── TrolleyVisualizer.tsx  # Animated SVG visualization
    └── ResultsDashboard.tsx   # Comprehensive results display
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Fonts**: Geist Sans & Geist Mono
- **State**: React useState/useRef (no external state library)
- **Storage**: localStorage for user choices, in-memory for aggregate stats


## 📊 API Endpoints

### `POST /api/trolley`
Record a user's choice for aggregate statistics.

```json
{
  "scenarioId": "classic",
  "choice": "A",
  "philosophy": "utilitarian",
  "responseTimeMs": 4500
}
```

### `GET /api/trolley`
Retrieve aggregate statistics across all users.

```json
{
  "totalResponses": 1234,
  "overallUtilitarian": 678,
  "overallDeontological": 556,
  "scenarioStats": {
    "classic": {
      "totalResponses": 200,
      "optionA": 156,
      "optionB": 44,
      "avgResponseTimeMs": 5200
    }
  }
}
```

## 🧠 Philosophy Background

### Utilitarianism
> "The greatest good for the greatest number." - Jeremy Bentham

Actions are judged by their consequences. If pulling the lever saves five lives at the cost of one, pull it - the math is clear.

### Deontological Ethics
> "Act only according to that maxim whereby you can will that it should become a universal law." - Immanuel Kant

Some actions are inherently wrong regardless of outcomes. Using a person as a means to an end violates their dignity.

## 📝 License & Attribution

Trolley Problem Simulator is released under the [MIT License](https://github.com/bedigambar/Trolley-Problem-Simulator/blob/main/LICENSE) - &copy; 2026 bedigambar.

You're welcome to use, modify, and build on this code, but you must keep the copyright notice and license intact (i.e. give credit). If you ship something based on Trolley Problem Simulator, a shout-out and a link back to [this repo](https://github.com/bedigambar/Trolley-Problem-Simulator) is hugely appreciated. &nbsp;🙏

## 🙏 Acknowledgments

- **Philippa Foot** - Created the original trolley problem (1967)
- **Judith Jarvis Thomson** - Introduced the footbridge variant (1985)
- **MIT Moral Machine** - Inspiration for the self-driving car scenario
- The countless philosophers whose ideas inform these dilemmas

---

<p align="center">
  <i>What would <b>you</b> do?</i>
</p>
