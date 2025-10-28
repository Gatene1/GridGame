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
let fadeOnBlackCallback = null; // run once at full black
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
    { x: 3, y: 5 }, { x: 3, y: 1 }, BreathMode.BALANCED, { x: 3, y: 4},
    [ { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 }, { x:5, y:4 },{ x:4, y:4 },{ x:3, y:4 } ]);
const LEVEL_4 = new mapObject("Split Gate", MAP4, NORMAL_MAP_COLOR_SCHEME, {x:1,y:6}, {x:3,y:5},
    {x:3,y:1}, BreathMode.BALANCED, null, null );
const LEVEL_5 = new mapObject( "Lane Watch", MAP5, scheme2, {x:1,y:5}, {x:3,y:4},
    {x:3,y:1}, BreathMode.BALANCED, {x:3,y:3}, [{x:3,y:3},{x:4,y:3},{x:5,y:3}] );
const LEVEL_6 = new mapObject( "Switchback", MAP6, scheme2, {x:1,y:6}, {x:2,y:5},
    {x:3,y:1}, BreathMode.BALANCED, {x:3,y:3}, [ {x:3,y:3},{x:4,y:3},{x:5,y:3},
        {x:5,y:4},{x:4,y:4},{x:3,y:4} ] ); // end (3,4) is adjacent to start (3,3) → our loop check will wrap
const LEVEL_7 = new mapObject( "Two-Phase Bridge", MAP7, NORMAL_MAP_COLOR_SCHEME, {x:1,y:6}, {x:2,y:5},
    {x:3,y:1}, BreathMode.BALANCED, null, null );
const LEVEL_8 = new mapObject( "Tunnels", MAP8, NORMAL_MAP_COLOR_SCHEME, {x:1,y:6}, {x:2,y:4},
    {x:2,y:1}, BreathMode.BALANCED, null, null );
const LEVEL_9 = new mapObject( "Reset Lesson", MAP9, NORMAL_MAP_COLOR_SCHEME, {x:1,y:5}, {x:3,y:4},
    {x:5,y:3}, BreathMode.BALANCED, null, null );
const LEVEL_10 = new mapObject( "Final Watch", MAP10, scheme2, {x:1,y:6}, {x:2,y:5},
    {x:3,y:1}, BreathMode.BALANCED, {x:3,y:3},
    [
        // top sweep
        {x:3,y:3},{x:4,y:3},{x:5,y:3},
        // drop and return
        {x:5,y:4},{x:4,y:4},{x:3,y:4},
        // extend to lower corridor, brushing the player route
        {x:3,y:5},{x:4,y:5}
        // ends (3,5) and start (3,3) are NOT adjacent → you’ll get ping-pong unless you prefer loop:
        // To force loop here, either add {x:3,y:4} again as tail or set wrapOnAdjacency=true at spawn.
    ]
);

// Input
const keys = new Set;
window.addEventListener('keydown', e => {
    const k = e.key;
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'B', 'b'].includes(k)) e.preventDefault();
    keys.add(k);
    if (gamePhase === GamePhase.CREDITS && (k === "Enter" || k === "r" || k === "R")) {
        fadeOnBlackCallback = () => {
            // kill any stale next-level intent
            fadeNextIndex = null;
            // force the index you actually want
            currentMapIndex = 0;      // <-- important if you had a debug override
            // go where you want
            loadMap(0);
            // re-enable gameplay
            gamePhase = GamePhase.PLAYING;
            // optional: clear stuck inputs between screens
            if (keys?.clear) keys.clear();
        };
        fadeDir = 1; // fade to black now
        return;      // ensure we don't fall into other branches
    } else if (k === "r" || k === "R" || k === "Enter") {
        addMessage("Restarting…", 1.0, "#e5e7eb");
        // If we’re already fading, ignore; otherwise start a clean fade→reset:
        if (fadeDir === 0) {
            fadeOnBlackCallback = () => blackout();
            fadeDir = 1;
        }
    } else if (k === "Escape") {
        // optional: pause
        if (gamePhase === GamePhase.PLAYING) gamePhase = GamePhase.PAUSED;
        else if (gamePhase === GamePhase.PAUSED) gamePhase = GamePhase.PLAYING;
    }

});
window.addEventListener('keyup', e => { keys.delete(e.key); });


// Initial Variables
const mapArray = [ initialMap, rMap1, LEVEL_TOY_PATROL, LEVEL_4, LEVEL_5, LEVEL_6, LEVEL_7, LEVEL_8,
                               LEVEL_9, LEVEL_10 ];
let currentMap = mapArray[0];
let player = new Player({posX:currentMap.playerXY.x, posY:currentMap.playerXY.y, color:"#ff6b6b"});
let toy = new Toy({posX: currentMap.toyXY.x, posY:currentMap.toyXY.y, color:'#777'});
let lever = new Lever({posX:currentMap.switchXY.x, posY:currentMap.switchXY.y, color:'#6bb9c7'});
let bridgeActive = false;
let holdingB = false;
let breath = 100, maxBreath = 100, breathReleaseCooldown = 0;
let moveCooldown = 0;
let gameTime = 0;

// --- Messages (tiny, no overlay) ---
const messages = [];

// Breath variables setup
let breathDrainRate, breathRegenRate, breathReleaseCooldownBase;
let breathMode = currentMap.mode;

breathModeSelect();

if (currentMap.patrolXY && currentMap.patrolPath?.length) {
    patrolToy = new PatrolToy({posX: currentMap.patrolXY.x, posY:currentMap.patrolXY.y, color:'#777', color2:'#4B6F52', path: currentMap.patrolPath});
} else {
    patrolToy = null;
}

let gamePhase = GamePhase.PLAYING;
let gameOverReason = "";
let gameOverCooldown = 0; // seconds before input accepted

let creditY = 0;  // vertical position of first line
let creditSpeed = 40; // pixels per second
const credits = [
    "OUTBOX GAMES PRESENTS",
    "",
    "TOY PATH",
    "",
    "GAME DESIGN & PROGRAMMING .... DAVID RILEY",
    "AI SUPPORT & ART ...... SPRUCE (AI PARTNER)",
    "SPECIAL THANKS ... FRIENDS, OPENAI TOOLS",
    "",
    "DEVELOPED IN 12 DAYS",
    "",
    "©2025 OUTBOX GAMES",
    "",
    "PRESS ENTER TO RETURN"
];

// a timestamp that represents how many miliseconds has passed since the Webpage was loaded.
let lastFrameTimeStamp = 0;
function doEverything(timeSinceLoad) {
    const deltaTime = Math.min(0.033, (timeSinceLoad - lastFrameTimeStamp) / 1000 || 0);

        gameTime += deltaTime;
        lastFrameTimeStamp = timeSinceLoad;

    // 1) Advance fade + handle transitions
    if (fadeDir !== 0) {
        fade += fadeDir * FADE_SPEED * deltaTime;
        if (fadeDir === 1 && fade >= 1) {           // reached full black
            fade = 1;

            let ranCallback = false;

            if (fadeOnBlackCallback) {                // <-- NEW
                const cb = fadeOnBlackCallback;
                fadeOnBlackCallback = null;
                cb();                                   // do the reset / load while black
                ranCallback = true;
            }
            if (!ranCallback && fadeNextIndex != null) {              // your existing next-level logic
                loadMap(fadeNextIndex);
                fadeNextIndex = null;
            }
            fadeDir = -1;                             // start fading back in
        } else if (fadeDir === -1 && fade <= 0) {
            fade = 0;
            fadeDir = 0;
            // If we were in LEVELOVER due to death/reset, go back to PLAYING when visible:
            if (gamePhase === GamePhase.LEVELOVER || gamePhase === GamePhase.FADING) {
                gamePhase = GamePhase.PLAYING;
            }
            // If you kept CREDITS active until the keypress, it's already switched in the callback.
            // If you use FADING explicitly, you could set FADING during fadeDir!=0 and clear here.
        }
    }

        // 2) Draw world + update gameplay only when appropriate
        drawBoard();
        drawAllBars();

    if (gamePhase === GamePhase.PLAYING) {
        handlePlayer(deltaTime);
        updateToy(deltaTime);

        // Patrol update (smooth); purposely after updateToy(deltaTime).
        if (patrolToy) {
            patrolToy.followPath(deltaTime, 3); // or use updateStep() for chunky hops
            // basic collision with player (tile-precision)
            const dx = player.x - patrolToy.x;
            const dy = player.y - patrolToy.y;
            if (Math.hypot(dx, dy) < 0.35) {
                triggerLevelOver("Patrol caught you!");
            }
        }

    } else if (gamePhase === GamePhase.CREDITS) {
        updateCredits(deltaTime);
        drawCredits(ctx);
    }
    // else if (gamePhase === GamePhase.PAUSED) { /* draw paused notice, skip updates */ }
    // else if (gamePhase === GamePhase.GAMECLEAR) { /* later: credits, etc. */ }

    // 3) UI last: messages + fade
    updateMessages(deltaTime);
    drawMessages(ctx);
    drawFade(ctx, gameBoard.width, gameBoard.height);

    requestAnimationFrame(doEverything);
}

requestAnimationFrame(doEverything);

// Configure where your assets live
// --- Booklet assets (adjust paths to your files) ---
const BOOKLET = {
    covers: {
        boy:  "assets/manual/boy/cover.jpg",
        girl: "assets/manual/girl/cover.jpg",
        and:  "assets/manual/androgynous/cover.jpg"
    },
    // If your pages are page01.jpg..page10.jpg:
    pagesByChild: k => Array.from({length: 8}, (_,i) => `assets/manual/page${i+1}.jpg`)
};

// --- Flipbook state ---
let fbChild = 'girl';
let fbPages = [];     // array of page image URLs (no cover here)
let fbIndex = -1;     // -1 = cover; 0 = first spread (pages 1&2), etc.

const chooser = document.getElementById('booklet-chooser');
const fbSpread = document.getElementById('fbSpread');
const fbLabel  = document.getElementById('fbLabel');

function setChooserActive(k) {
    chooser.querySelectorAll('button.pill').forEach(b =>
        b.setAttribute('aria-selected', String(b.dataset.k === k))
    );
}

function renderSpread() {
    // cross-fade
    fbSpread.classList.add('fade');
    setTimeout(() => {
        fbSpread.innerHTML = '';

        if (fbIndex < 0) {
            // cover only (single page centered)
            const img = document.createElement('img');
            img.className = 'page';
            img.src = BOOKLET.covers[fbChild];
            img.alt = 'Instruction booklet cover';
            img.style.objectFit = 'contain';   // ensures scaling inside the box
            // single-column feel on small screens happens via media query;
            // here we span both grid columns to center it
            img.style.gridColumn = '1 / -1';
            img.style.width = '100%';
            img.style.height = '100%';
            fbSpread.appendChild(img);
            fbLabel.textContent = 'Cover';
        } else {
            const leftNum  = fbIndex * 2 + 1;   // human-friendly page numbers
            const rightNum = leftNum + 1;

            const leftImg = document.createElement('img');
            leftImg.className = 'page left';
            leftImg.src = fbPages[ leftNum - 1 ] || '';
            leftImg.alt = `Page ${leftNum}`;

            const rightImg = document.createElement('img');
            rightImg.className = 'page right';
            rightImg.src = fbPages[ rightNum - 1 ] || '';
            rightImg.alt = `Page ${rightNum}`;

            // determine if we’re on inner pages (2–7)
            const isInner = (n) => n >= 2 && n <= 7;

            leftImg.classList.toggle('tight',  isInner(leftNum));
            rightImg.classList.toggle('tight', isInner(rightNum));


            const rightExists = Boolean(fbPages[rightNum - 1]);
            rightImg.style.display = rightExists ? '' : 'none';


            fbSpread.appendChild(leftImg);
            fbSpread.appendChild(rightImg);

            fbLabel.textContent = `Pages ${leftNum}-${Math.min(rightNum, fbPages.length)}`;
        }

        fbSpread.classList.remove('fade');
    }, 110);
    updateControls();
}

function clampIndex(i) {
    const maxSpread = Math.ceil(fbPages.length / 2) - 1;
    return Math.max(-1, Math.min(i, maxSpread));
}

function nextSpread() { fbIndex = clampIndex(fbIndex + 1); renderSpread(); }
function prevSpread() { fbIndex = clampIndex(fbIndex - 1); renderSpread(); }

function startFlipbookFor(k) {
    fbChild = k;
    localStorage.setItem('toyPath_booklet', k);
    setChooserActive(k);
    fbPages = BOOKLET.pagesByChild(k);
    fbIndex = -1; // start at cover
    renderSpread();
    updateControls();
}

// events
document.getElementById('fbNext').addEventListener('click', nextSpread);
document.getElementById('fbPrev').addEventListener('click', prevSpread);
document.querySelector('.hotzone.left').addEventListener('click', prevSpread);
document.querySelector('.hotzone.right').addEventListener('click', nextSpread);
document.querySelector('.fb-viewport').style.maxHeight =
    `${window.innerHeight * 0.95}px`;



// chooser
chooser.addEventListener('click', (e) => {
    const btn = e.target.closest('button.pill');
    if (!btn) return;
    startFlipbookFor(btn.dataset.k);
});

// init
(() => {
    const last = localStorage.getItem('toyPath_booklet') || 'girl';
    startFlipbookFor(last);
})();