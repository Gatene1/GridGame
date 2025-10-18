\# Toy Path  

\*A Glean Mini Game by David Riley (Outbox Games)\*  



---



\## 🎮 Overview

\*\*Toy Path\*\* is a small HTML5 puzzle prototype demonstrating \*\*pathfinding\*\* and \*\*time-pressure\*\* patterns.  

The player controls their movement and breath while a toy automatically finds and activates a lever that raises a bridge to reach the exit.



---



\## 🧩 Core Concepts

\- \*\*Breadth-First Search (BFS)\*\* pathfinding for the toy’s AI.  

\- \*\*Entity System\*\*: shared base class for Player, Toy, Lever, and future interactables.  

\- \*\*Tweened Movement\*\*: smooth tile-to-tile transitions instead of instant jumps.  

\- \*\*Hold-to-Walk Mechanic\*\*: holding the \*B\* key controls the toy’s state and bridge activation.  



---



\## 🗂️ File Structure

ToyPath/

├── .git  # System Data

├── .idea # System Data

├── assets/ # (optional) images / sfx

├── css/

│ └── gg.css # Canvas styling, HUD, pixel filter

├── js/

│ ├── gg.js # Main loop, input, and rendering

│ ├── ggDraw.js # Drawing Functions

│ ├── ggMaps.js # Level arrays (MAP0, MAP1, etc.)

│ ├── ggObject.js # Class definitions (Entity, Player, Toy, Lever)

│ ├── utils.js # Helpers like BFS and math functions

├── .gitattributes # System Data

├── .gitignore # System Data

├── CHANGELOG.md # A log of all changes by date

├── gridGame.html # Entry point

├── README.md # This file

└── TODO.md # Worklog and feature notes





---



\## 🧠 How to Run

1\. Open `gridGame.html` directly in a browser, or  

2\. Run a lightweight local server (e.g., VS Code → “Live Server”, or `python -m http.server`).  

3\. Use the \*\*arrow keys\*\* to move and hold \*\*B\*\* to activate the toy.



---



\## 🧱 Controls

| Key | Action |

|-----|---------|

| \*\*Arrow Keys\*\* | Move player |

| \*\*B\*\* | Hold breath / awaken toy |

| \*\*Esc\*\* | Reset (if implemented) |



---



\## 🔍 Requirements

\- Modern browser supporting ES6+ (Chrome, Firefox, Edge, Safari)  

\- JavaScript enabled  

\- Canvas 2D context  



---



\## 🧭 Development Notes

This build was created as part of the \*\*Glean Series\*\*, exploring core game-design patterns through small playable experiments.  

Future expansions will introduce multiple toys, chained levers, and weighted bridge logic.



---



\## 🧩 Credits

Created by \*\*David Riley\*\*  

AI Assistance: \*Spruce\* (GPT-5 Collaboration)  

© 2025 Outbox Games. All rights reserved.



---



\## 🕒 Version History

| Version  |    Date    |                            Notes                              |

|----------|------------|---------------------------------------------------------------|

| \*\*v0.1\*\* | 2025-10-17 | Initial prototype: player + toy + lever + bridge logic.       |

| \*\*v0.2\*\* |     —      | Added tweened movement, BFS refinements, and visual polish.   |

| \*\*v0.3\*\* |     —      | Ready for SpruceHandoff packaging and documentation.          |





