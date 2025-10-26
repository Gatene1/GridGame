function key(pos) {
    return pos.x + "," + pos.y;
}

function same(a, b) {
    return a.x === b.x && a.y === b.y;
}

function getNeighbors(pos) {
    let dirs = [
        {x: 1, y: 0},
        {x: -1, y: 0},
        {x: 0, y: 1},
        {x: 0, y: -1}
    ];
    let result = [];

    for (let d of dirs) {
        let nx = pos.x + d.x;
        let ny = pos.y + d.y;
        if (nx > 0 && ny > 0 && nx < GRID_W && ny < GRID_H) {
            result.push({x: nx, y: ny});
        }
    }
    return result;
}

function printPath(path) {
    const divPrint = document.getElementById("instruct");
    divPrint.innerText = "";
    for (let tile of path) {
        divPrint.innerText = divPrint.innerText + key(tile) + "<br>";
    }
}

function reconstructPath(parent, start, goal) {
    // If goal was never reached, parent won't contain its key; return empty.
    let k = key(goal);
    if (!parent[k] && !same(start, goal)) return [];

    const path = [goal];
    // Walk backwards until we hit start.
    while (!same(path[path.length - 1], start)) {
        const last = path[path.length - 1];
        const pk = key(last);
        const p = parent[pk];
        if (!p) break; // Safety; unreachable case if start == goal mentioned above.
        path.push(p);
    }
    path.reverse(); // Now start -> goal.
    //printPath(path); // This will print the path in the instructions div.
    return path;
}

function bfs(start, goal) {
    let queue = [start];
    let visited = new Set([key(start)]);
    let parent = {};

    while (queue.length > 0) {
        let current = queue.shift(); // remove first.
        if (same(current, goal)) break; // found the target.

        for (let neighbor of getNeighbors(current)) {
            if (!visited.has(key(neighbor)) && isWalkable(neighbor.x, neighbor.y)) {
                visited.add(key(neighbor));
                parent[key(neighbor)] = current;
                queue.push(neighbor)
            }
        }
    }
    return reconstructPath(parent, start, goal);
}

function activateBridge() {
    bridgeActive = true;
}
function deactivateBridge() {
    bridgeActive = false;
}

// --- Level / scene helpers ---

function isExit(x, y) {
    // Primary: tile-based exit
    const t = currentMap.grid[y][x];
    if (typeof EXIT_TILE !== 'undefined' && t === EXIT_TILE) return true;

    // Fallback: coordinate-based exit if you ever add it to the map object
    if (currentMap.exitXY && x === currentMap.exitXY.x && y === currentMap.exitXY.y) return true;

    return false;
}
function breathModeSelect() {
    switch (breathMode) {
        case BreathMode.SURVIVAL:
            breathDrainRate = 40;
            breathRegenRate = 20;
            breathReleaseCooldownBase = 0.6;
            break;
        case BreathMode.BALANCED:
            breathDrainRate = 30;
            breathRegenRate = 27;
            breathReleaseCooldownBase = 0.5;
            break;
        case BreathMode.RELAXED:
            breathDrainRate = 25;
            breathRegenRate = 35;
            breathReleaseCooldownBase = 0.4;
            break;
    }
}

function loadMap(i) {
    currentMapIndex = i;
    currentMap = mapArray[i];
    breathMode = currentMap.mode;

    // Reset main entities
    player.posX = currentMap.playerXY.x; player.posY = currentMap.playerXY.y;
    toy.posX    = currentMap.toyXY.x;    toy.posY    = currentMap.toyXY.y;
    lever.posX  = currentMap.switchXY.x; lever.posY  = currentMap.switchXY.y;

    // (NEW) Spawn / clear patrol toy per map
    patrolToy = null;
    if (currentMap.patrolXY && currentMap.patrolPath && currentMap.patrolPath.length) {
        patrolToy = new PatrolToy({
            posX: currentMap.patrolXY.x,
            posY: currentMap.patrolXY.y,
            color: '#777',
            path: currentMap.patrolPath
        });
    }

    // Reset run-state
    toyPath = []; toyPathIndex = 0; toyCooldown = 0;
    toy.state = ToyState.DORMANT;
    bridgeActive = false;

    holdingB = false; prevHoldingB = false; bJustPressed = false; bHoldTime = 0;
    breath = maxBreath; breathReleaseCooldown = 0;
    moveCooldown = 0;

    if (typeof keys?.clear === 'function') keys.clear();
    breathModeSelect();
}


function goToNextMap() {
    const next = currentMapIndex + 1;
    if (next < mapArray.length) {
        fadeNextIndex = next;
        fadeDir = 1;        // start fade-out; load happens at peak black
    } else {
        // end-of-demo behavior (optional): fade out and reload 0
        //fadeNextIndex = 0; fadeDir = 1;
        //fade = 1;
        //gamePhase = GamePhase.GAMEOVER;
    }
}

function gameOver() {
    if (fade > 0) {
        ctx.fillStyle = `rgba(199,199,199,${fade})`;
        ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    }
    drawText(true, false, "60px", "Arial", '#0e0e0e', "Thank You For", 100, 200);
    drawText(true,false,"60px", "Arial", '#0e0e0e', "Playing", 210, 260);

}

function mdist(a, b) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }

function triggerGameOver(reason = "GAME OVER") {
    gamePhase = GamePhase.GAMEOVER;
    gameOverReason = reason;
    gameOverCooldown = 0.6; // brief pause before retry input
}

function resetLevel() {
    loadMap(currentMapIndex);
    gamePhase = GamePhase.PLAYING;
    gameOverReason = "";
}