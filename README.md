# VN Card Score 🃏

A bilingual (Vietnamese / English) score calculator for the Vietnamese card game **Tiến Lên** (and other trick-taking / shedding card games). Built with Next.js and Chakra UI.

---

## Features

- **Multi-player sessions** – Set up a game with 2–4 players and enter each player's name before starting.
- **Round-by-round scoring** – Add, edit, or delete individual rounds; scores are validated so the sum of all players' scores equals zero each round.
- **Running totals** – A live score table shows cumulative scores across all rounds.
- **Animated final standings** – Finish the session to see a podium-style ranking screen complete with confetti and flower-petal animations.
- **Bilingual UI** – Toggle between Vietnamese 🇻🇳 and English 🇬🇧 at any time.
- **Dark / Light theme** – Full dark-mode support powered by Chakra UI's color-mode system.
- **Persistent state** – Player names and round data are saved to `localStorage` so the session survives a page refresh.
- **Mobile-friendly** – Responsive layout that works on phones, tablets, and desktops.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js](https://nextjs.org/) |
| UI components | [Chakra UI](https://chakra-ui.com/) (component library & theming) |
| Animations | [Framer Motion](https://www.framer-motion.com/) |
| Utility CSS | [Tailwind CSS](https://tailwindcss.com/) (utility classes) |
| Icons | [React Icons](https://react-icons.github.io/react-icons/) |
| Analytics | [Vercel Analytics](https://vercel.com/analytics) |

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/lambertse-hcmus/VN-card-score.git
cd VN-card-score

# Install dependencies
npm install
```

### Running locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Code formatting

```bash
npm run prettier
```

---

## How to Play

1. **Start** – Click *Bắt đầu nào!* / *Let's start!* on the home screen.
2. **Create a session** – Enter the names of all players (duplicates are not allowed) and click *Bắt đầu!* / *Start Game!*.
3. **Add rounds** – After each hand, click *+ Thêm ván* / *+ Add Round*, enter each player's score (must sum to 0), and confirm.
4. **Edit or delete rounds** – Tap any existing round row to edit its scores, or use the delete option to remove it.
5. **Reset** – Use the reset button to clear all data and start over with a new session.
6. **Finish** – Click *Kết thúc* / *Finish* to lock in the scores and view the final animated standings.

---

## Project Structure

```
├── components/        # Reusable UI components (modals, score table, navbar, …)
├── lib/               # i18n context, theme config, translations
├── pages/             # Next.js pages (_app.js, index.js, start.js)
├── public/            # Static assets
└── package.json
```

---

## License

[MIT](LICENSE)

---

> Developed with ❤️ by [@lambertse-hcmus](https://github.com/lambertse-hcmus)

