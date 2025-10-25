function isWalkable(x, y) {
    if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) return false;

    const tile = currentMap.grid[y][x];
    if (tile == 1) return false;
    if (tile == 2 && !bridgeActive) return false;
    return true;
}

function blackout() {
    // Brief Reset.
    player.posX = currentMap.playerXY.x;
    player.posY = currentMap.playerXY.y;
    toy.posX = currentMap.toyXY.x;
    toy.posY = currentMap.toyXY.y;
    toy.state = ToyState.DORMANT;
    bridgeActive = false;
    breath = maxBreath;
    breathReleaseCooldown = breathReleaseCooldownBase; // Prevent immediate rehold.
}

function handlePlayer(deltaTime) {
    const nowHoldingB = keys.has('b') || keys.has('B');

    bJustPressed = nowHoldingB && !prevHoldingB;
    holdingB = nowHoldingB;

    if (holdingB && breath > 0 && breathReleaseCooldown <= 0) {
        //drawText(true, false, "50px", 'Arial', '#ffff00', 'B', 200, 200);
        bHoldTime += deltaTime;
        breath -= breathDrainRate * deltaTime;
        if (bJustPressed) {
            const toyPos = {x: toy.posX, y: toy.posY};
            const leverPos = {x: lever.posX, y: lever.posY};
            const path = bfs(toyPos, leverPos);

            if (path && path.length > 0) {
                toyPath = path.slice(1); // Skip current tile.
                toyPathIndex = 0;
                toyCooldown = 0;
                if (toy.state === ToyState.DORMANT) toy.state = ToyState.AWAKE;
            } else {
                // Optional: feedback
                // setPrompt("No route for the toy!");
                toyPath = [];
                toyPathIndex = 0;
            }
        }
        if (breath <= 0) { breath = 0; blackout(); }
    } else {
        bHoldTime = 0; // Reset when released, or on cooldown.

        // If just let go of 'B', start breathReleaseCooldown.
        if (!holdingB && prevHoldingB) {
            if (breathReleaseCooldown <= 0) breathReleaseCooldown = breathReleaseCooldownBase;
            breath = Math.min(maxBreath, breath + breathRegenRate * deltaTime);
        } else if (!holdingB) {
            breath = Math.min(maxBreath, breath + breathRegenRate * deltaTime);
            if (breathReleaseCooldown > 0) breathReleaseCooldown -= deltaTime;
        }
        // If 'B' isn't held, the toy ragdolls.
        toyPath = [];
        toyPathIndex = 0;
        if (toy.state !== ToyState.DORMANT) toy.state = ToyState.DORMANT;
    }

    let x = player.posX, y = player.posY;
    let dx = 0, dy = 0;

    moveCooldown -= deltaTime;
    if (moveCooldown > 0) return;

    if (keys.has('ArrowUp')) { dy = -1; } //keys.delete('ArrowUp'); }
    else if (keys.has('ArrowDown')) { dy = 1; } //keys.delete('ArrowDown'); }
    else if (keys.has('ArrowLeft')) { dx = -1; } //keys.delete('ArrowLeft'); }
    else if (keys.has('ArrowRight')) { dx = 1; } //keys.delete('ArrowRight'); }

    if (dx || dy) {
        if (isWalkable(x + dx, y + dy)) {
            player.posX += dx;
            player.posY += dy;
            moveCooldown = 0.17;

            // NEW: step-on-exit → advance level
            if (isExit(player.posX, player.posY)) {
                goToNextMap();
                return; // stop processing this frame
            }
        }
    }
    // Moved this line down here so I can rin the line of code that governs when player just lets go of 'B'.
    prevHoldingB = nowHoldingB;
}

function updateToy(deltaTime) {
    // TICK POPUP TIMER FIRST — always runs
    if (clickMsgTimer > 0) {
        clickMsgTimer -= deltaTime;
        if (clickMsgTimer < 0) clickMsgTimer = 0;
    }

    if (holdingB && breath > 0 && breathReleaseCooldown <= 0) {
        if (toy.state === ToyState.DORMANT) {
            toy.state = ToyState.AWAKE;
        }
    }

    if (!holdingB) {
        if (toy.state !== ToyState.DORMANT) {
            toy.state = ToyState.DORMANT;
        }
        if (bridgeActive) {
            deactivateBridge();
            if (!isWalkable(player.posX, player.posY)) blackout();
        }
        return;
    }

    if (toy.state === ToyState.AWAKE && toyPath && toyCooldown < toyPath.length) {
        toyCooldown -= deltaTime;
        if (toyCooldown > 0) return;

        const next = toyPath[toyPathIndex]; // {x, y}
        const dx = Math.sign(next.x - toy.posX);
        const dy = Math.sign(next.y - toy.posY);

        const nx = toy.posX + dx;
        const ny = toy.posY + dy;
        if (isWalkable(nx, ny)) {
            toy.posX = nx;
            toy.posY = ny;
            toyCooldown = TOY_STEP_DELAY;

            // Reached this node?
            if (toy.posX === next.x && toy.posY === next.y) {
                toyPathIndex++;
            }
        } else {
            // Path blocked unexpetedly -- abort this route.
            toyPath = [];
            toyPathIndex = 0;
        }
    }

    // At lever? Perform the task once.
    if (toy.posX === lever.posX && toy.posY === lever.posY && !bridgeActive && breathReleaseCooldown <= 0) {
        toy.state = ToyState.DOING_TASK;

        activateBridge()

        // bridgeActive just toggled
        clickMsgTimer = 1.0; // show popup for 2 seconds
        clickMsgColorIndex = (clickMsgColorIndex + 1) % CLICK_MSG_COLORS.length;


        toyPath = [];
        toyPathIndex = 0;
        toy.state = ToyState.DORMANT;
    }

}