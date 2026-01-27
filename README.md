# 🕹️ SideQuest

**Tracking the beautifully unhinged side-quests of your daily life.**

SideQuest is a lo-fi, playful alternative to traditional productivity trackers. Instead of logging tasks or habits, it's designed for the messy, silly, and human moments—the "side-quests" you didn't plan for, like every time you spill coffee, have a social "oops," or search for something truly bizarre on Google.


---

##  Key Features

###  The SideQuest Grid
A "GitHub-style" visualization of your entire year. Each day is a square that changes color and pattern based on the quests you log. 
- **Multi-Quest Days**: Squares use gradients or iconic patterns if you log multiple categories in one day.
- **Detailed Tooltips**: Hover over any day to see the exact count and notes.
- **Month Navigation**: Clear labels to keep you oriented across the seasons.

###  Custom Quest Engine
Don't let us define your life. Create your own categories on the fly!
- **Playful Icons**: Choose from a library of 15+ quirky icons (ghosts, bombs, hearts, etc.).
- **Vibrant Palettes**: Pick a "vibe" (color) that matches the energy of the event.
- **Notes & Timestamps**: Add context to your quests so you can remember exactly *why* you were Googling that.

###  Yearly Wrapped
Just like your favorite music app, get a personalized slide-show summary of your year's statistics:
- **Peak Silliness Hour**: Detect when your chaos is at its highest.
- **The "Normal" Streak**: Tracking your longest streak without a single logged quirk.
- **Signature Category**: Reveal your "personality brand" for the year.
- **Springy Animations**: Powered by Framer Motion for a premium, bouncy feel.

###  Private & Local
- **LocalStorage Data**: Your quirks stay in your browser. No accounts, no servers, no tracking.
- **Full Backups**: Export your entire history as a JSON file or import a previous backup in seconds.

---

##  Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Styling**: Vanilla CSS (Hand-crafted Lo-fi/Playful aesthetic)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

---

##  Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/yearly-quirks.git
   ```
2. Navigate to the project folder:
   ```bash
   cd yearly-quirks
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

##  Design Philosophy
This app rejects the "optimized life" aesthetic of modern SaaS. It uses **Fredoka** typography, thick borders, playful wiggle animations, and a "napkin-sketch" inspired color palette. It's built to be fun, not formal.

---

##  Roadmap
- [ ] **Snap & Share**: Export your grid as a PNG image for social media.
- [ ] **Heatmap Intensity**: Squares get darker/bolder as the number of events increases.
- [ ] **Custom Textures**: Napkin, graph paper, and craft paper background themes.
- [ ] **PWA Support**: Install it on your phone for quick logging.

##  License
MIT © dayniia
