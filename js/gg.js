// Board-Specific Variables
const TILE_WIDTH = 64;
const TILE_STROKE_WIDTH = 2;
const TILE_WIDTH_WITH_STROKE = TILE_WIDTH - TILE_STROKE_WIDTH;
const GRID_W = 10, GRID_H = 8;
const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

// === Level flow additions ===
const EXIT_TILE = 3;   // <-- set this to whatever your exit tile value is in the grid data.
let currentMapIndex = 0;

// Toy-Specific Variables
let toyPath = [];
let toyPathIndex = 0;
let toyCooldown = 0; // Time until the toy may take the next step.
let bHoldTime = 0; // How long 'B' has been held down continuously.
let prevHoldingB = false;
let bJustPressed = false;
const TOY_STEP_DELAY = 0.20; // Seconds per step.
const TOY_HOLD_THRESHOLD =0.08; // Must hold 'B' tis long before the first step is made.

// === Lever click popup state ===
let clickMsgTimer = 0; // seconds remaining to show the popup
let clickMsgColorIndex = 0;
const CLICK_MSG_TEXT = '*Click*';
const CLICK_MSG_COLORS = [
    '#00FFFF', // cyan
    '#FFFF00', // yellow
    '#FFFFFF', // white
    '#C19A6B'  // light brown (tan)
];

// --- Fade state ---
let fade = 0;            // 0 = clear, 1 = black
let fadeDir = 0;         // 0 = idle, 1 = fading out, -1 = fading in
let fadeNextIndex = null;
const FADE_SPEED = 2.0;  // seconds to cross from 0→1 is ~0.5s per step (tweak to taste)


// Initializing Map class objects.
const NORMAL_MAP_COLOR_SCHEME = new mapColorSchemes("#333333ff", "#222222ff",
    "#1b1b1bff", "#333333", '#6b8f23', '#204a6b', '#444',
    '#ffd54a');
const scheme2 = new mapColorSchemes('#6b7280', '#111827', '#e5e7eb',
    '#9ca3af', '#2563eb', '#10b981', '#f59e0b', '#fbbf24');


const STROKE_COLOR = "#333333";


const initialMap = new mapObject("IT'S ALIVE!!!", MAP0, NORMAL_MAP_COLOR_SCHEME, {x:1, y:1},
    {x:2, y:5}, {x:6, y:5}, BreathMode.RELAXED);
const rMap1 = new mapObject("Over Yonder", MAP1, NORMAL_MAP_COLOR_SCHEME, {x:1, y:1},
    {x:1, y:6}, {x:7, y:3}, BreathMode.RELAXED);
const LEVEL_TOY_PATROL = new mapObject("Toy Patrol Zone", MAP2, scheme2, { x: 1, y: 5 },
    { x: 3, y: 4 }, { x: 3, y: 1 }, BreathMode.BALANCED, { x: 3, y: 4},
    [ { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 } ]);


// Input
const keys = new Set;
window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'B', 'b'].includes(e.key)) e.preventDefault();
    keys.add(e.key);
});
window.addEventListener('keyup', e => { keys.delete(e.key); });


// Initial Variables
const mapArray = [ initialMap, rMap1, LEVEL_TOY_PATROL ];
let currentMap = mapArray[2];
let player = new Player({posX:currentMap.playerXY.x, posY:currentMap.playerXY.y, color:"#ff6b6b"});
let toy = new Toy({posX: currentMap.toyXY.x, posY:currentMap.toyXY.y, color:'#777'});
let patrolToy = new PatrolToy({posX: currentMap.patrolXY.x, posY:currentMap.patrolXY.y, color:'#777', path: currentMap.patrolPath});
let lever = new Lever({posX:currentMap.switchXY.x, posY:currentMap.switchXY.y, color:'#6bb9c7'});
let bridgeActive = false;
let holdingB = false;
let breath = 100, maxBreath = 100, breathReleaseCooldown = 0;
let moveCooldown = 0;
let gameTime = 0;
let patrolToy = null;

// Breath variables setup
let breathDrainRate, breathRegenRate, breathReleaseCooldownBase;
let breathMode = currentMap.mode;

breathModeSelect();

// a timestamp that represents how many miliseconds has passed since the Webpage was loaded.
let lastFrameTimeStamp = 0;
function doEverything(timeSinceLoad) {
    const deltaTime = Math.min(0.033, (timeSinceLoad - lastFrameTimeStamp) / 1000 || 0);
    gameTime += deltaTime;
    lastFrameTimeStamp = timeSinceLoad;

    // Advance fade
    if (fadeDir !== 0) {
        fade += fadeDir * FADE_SPEED * deltaTime;
        if (fadeDir === 1 && fade >= 1) {           // reached full black
            fade = 1;
            if (fadeNextIndex != null) {
                loadMap(fadeNextIndex);                 // your existing loader
                fadeNextIndex = null;
            }
            fadeDir = -1;                             // start fading back in
        } else if (fadeDir === -1 && fade <= 0) {
            fade = 0; fadeDir = 0;                    // done
        }
    }

    drawBoard();
    drawAllBars();
    handlePlayer(deltaTime);
    updateToy(deltaTime);
    requestAnimationFrame(doEverything);
}

requestAnimationFrame(doEverything);