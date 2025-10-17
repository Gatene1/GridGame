// Board-Specific Variables
const TILE_WIDTH = 64;
const TILE_STROKE_WIDTH = 2;
const TILE_WIDTH_WITH_STROKE = TILE_WIDTH - TILE_STROKE_WIDTH;
const GRID_W = 10, GRID_H = 8;
const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

// Initializing Map class objects.
const NORMAL_MAP_COLOR_SCHEME = new mapColorSchemes("#333333ff", "#222222ff",
    "#1b1b1bff", "#333333", '#6b8f23', '#204a6b' );

const STROKE_COLOR = "#333333";

const initialMap = new mapObject("IT'S ALIVE!!!", MAP0, NORMAL_MAP_COLOR_SCHEME, 1, 1);
const rMap1 = new mapObject("Over Yonder", MAP1, NORMAL_MAP_COLOR_SCHEME, 1, 1);



// Initial Variables
const mapArray = [ initialMap, rMap1 ];
let currentMap = mapArray[0];
let player = new playerChar(currentMap.playerX, currentMap.playerY, '#ff6b6b');
let bridgeActive = false;

function drawAll() {
    drawBoard();
}

requestAnimationFrame(drawAll);