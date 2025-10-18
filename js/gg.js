// Board-Specific Variables
const TILE_WIDTH = 64;
const TILE_STROKE_WIDTH = 2;
const TILE_WIDTH_WITH_STROKE = TILE_WIDTH - TILE_STROKE_WIDTH;
const GRID_W = 10, GRID_H = 8;
const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

// Initializing Map class objects.
const NORMAL_MAP_COLOR_SCHEME = new mapColorSchemes("#333333ff", "#222222ff",
    "#1b1b1bff", "#333333", '#6b8f23', '#204a6b', '#444',
    '#ffd54a');

const STROKE_COLOR = "#333333";

const initialMap = new mapObject("IT'S ALIVE!!!", MAP0, NORMAL_MAP_COLOR_SCHEME, {x:1, y:1},
    {x:2, y:5}, {x:6, y:5});
const rMap1 = new mapObject("Over Yonder", MAP1, NORMAL_MAP_COLOR_SCHEME, {x:1, y:1},
    {x:2, y:5}, {x:6, y:5});



// Initial Variables
const mapArray = [ initialMap, rMap1 ];
let currentMap = mapArray[0];
let player = new Player({posX:currentMap.playerXY.x, posY:currentMap.playerXY.y, color:"#ff6b6b"});
let toy = new Toy({posX: currentMap.toyXY.x, posY:currentMap.toyXY.y, color:'#777'});
let lever = new Lever({posX:currentMap.switchXY.x, posY:currentMap.switchXY.y, color:'#c7a76b'});
let bridgeActive = false;

function drawAll() {
    drawBoard();
}

requestAnimationFrame(drawAll);