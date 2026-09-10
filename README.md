# Tic-Tac-Toe

A responsive browser-based Tic-Tac-Toe game with local multiplayer, computer opponents, move history, and persistent statistics.

![Main Gameplay Preview](./assets/main-preview.png)
![Detailed View](./assets/gameplay-snapshot.png)


## 🌐 Live Demo
Experience the game here: **[Live Demo](https://Balaji-R-05.github.io/tic-tac-toe/)**


## ✨ Features

- **Multiple Game Modes**: Play against a friend locally or challenge the computer.
- **Computer Opponent**: Choose from Easy, Medium, and Hard difficulty levels.
- **Persistent Stats**: Your win/loss records are saved to `localStorage`, so your progress is never lost.
- **Move History**: Track every move made during the game in a side-by-side (desktop) or bottom (mobile) scrollable list.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **Visual Feedback**: High-contrast winning highlights and celebratory fireworks animations.


## How to Play

1. Open the game in a browser.
2. Choose a mode:
	- **Local two-player mode**: Player X and Player O take turns on the same device.
	- **AI mode**: Player X plays against the computer as Player O.
3. Select a difficulty when AI mode is enabled.
4. Select an empty square to place the current player's mark.
5. The first player to complete a row, column, or diagonal wins. If all nine squares are filled without a winner, the game is a draw.

Use **Reset Game** to start a new round. Use **Clear Stats** to permanently remove the saved win totals after confirming the prompt.

### AI Difficulty

- **Easy** chooses a random empty square.
- **Medium** randomly alternates between a random move and a Minimax move.
- **Hard** uses Minimax for every move and plays optimally.

Player X always starts, including after resetting the board or changing modes.


## Data and Persistence

Win totals are stored in the browser's `localStorage` under the key `tic-tac-toe-scores`. The scores remain available when the page is reopened in the same browser and origin. Clearing browser storage or selecting **Clear Stats** removes them. The board, current round, and move history are reset when a new round starts; they are not persisted.


## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (ES6+)
- **Animations**: [Confetti-JS](https://github.com/MathuSumuti/confetti-js) for victory celebrations.
- **Typography**: Arial, with the browser's default sans-serif fallback.

The Confetti-JS library is loaded from jsDelivr at runtime. An internet connection is required for the victory confetti unless the dependency is self-hosted.


## Project Structure

| File or directory | Purpose |
| --- | --- |
| `index.html` | Page structure, game controls, board cells, and external script loading. |
| `styles.css` | Layout, responsive styles, player colors, win highlights, and animations. |
| `script.js` | Game state, turn handling, win detection, scoring, move history, and AI logic. |
| `assets/` | Static images and the favicon used by the page. |


## Implementation Notes

- The board is represented by an array of nine values, indexed from left to right and top to bottom.
- Winning patterns are defined in `winningCombos` and shared by normal play and Minimax evaluation.
- Move history displays one-based row and column numbers for each move.
- The game is a static frontend and does not require a build step, server, database, or package installation.


## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Balaji-R-05/tic-tac-toe.git
cd tic-tac-toe
```

### 2. Run the application
Simply open `index.html` in your favorite web browser. No compilation or installation is required.


## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request