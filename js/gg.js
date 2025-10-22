// Board-Specific Variables
const TILE_WIDTH = 64;
const TILE_STROKE_WIDTH = 2;
const TILE_WIDTH_WITH_STROKE = TILE_WIDTH - TILE_STROKE_WIDTH;
const GRID_W = 10, GRID_H = 8;
const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

// Toy-Specific Variables
let toyPath = [];
let toyPathIndex = 0;
let toyCooldown = 0; // Time until the toy may take the next step.
let bHoldTime = 0; // How long 'B' has been held down continuously.
let prevHoldingB = false;
let bJustPressed = false;
const TOY_STEP_DELAY = 0.20; // Seconds per step.
const TOY_HOLD_THRESHOLD =0.08; // Must hold 'B' tis long before the first step is made.


// Initializing Map class objects.
const NORMAL_MAP_COLOR_SCHEME = new mapColorSchemes("#333333ff", "#222222ff",
    "#1b1b1bff", "#333333", '#6b8f23', '#204a6b', '#444',
    '#ffd54a');

const STROKE_COLOR = "#333333";

const initialMap = new mapObject("IT'S ALIVE!!!", MAP0, NORMAL_MAP_COLOR_SCHEME, {x:1, y:1},
    {x:2, y:5}, {x:6, y:5});
const rMap1 = new mapObject("Over Yonder", MAP1, NORMAL_MAP_COLOR_SCHEME, {x:1, y:1},
    {x:1, y:6}, {x:7, y:3});

// Input
const keys = new Set;
window.addEventListener('keydown', e => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'B', 'b'].includes(e.key)) e.preventDefault();
    keys.add(e.key);
});
window.addEventListener('keyup', e => { keys.delete(e.key); });


// Initial Variables
const mapArray = [ initialMap, rMap1 ];
let currentMap = mapArray[1];
let player = new Player({posX:currentMap.playerXY.x, posY:currentMap.playerXY.y, color:"#ff6b6b"});
let toy = new Toy({posX: currentMap.toyXY.x, posY:currentMap.toyXY.y, color:'#777'});
let lever = new Lever({posX:currentMap.switchXY.x, posY:currentMap.switchXY.y, color:'#c7a76b'});
let bridgeActive = false;
let holdingB = false;
let breath = 100, maxBreath = 100, breathReleaseCooldown = 0;
let moveCooldown = 0;

// a timestamp that represents how many miliseconds has passed since the Webpage was loaded.
let lastFrameTimeStamp = 0;
function doEverything(timeSinceLoad) {
    const deltaTime = Math.min(0.033, (timeSinceLoad - lastFrameTimeStamp) / 1000 || 0);
    lastFrameTimeStamp = timeSinceLoad;
    drawBoard();
    drawAllBars();
    handlePlayer(deltaTime);
    updateToy(deltaTime);
    requestAnimationFrame(doEverything);
}

requestAnimationFrame(doEverything);