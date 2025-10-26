function drawSquare(x, y, d, color, stroke, strokeColor = '#333333') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, d, d);
    if (stroke) {
        ctx.strokeStyle = strokeColor;
        -    ctx.strokeRect(x * TILE_WIDTH, y * TILE_WIDTH, d, d);
        +    ctx.strokeRect(x, y, d, d);
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

    let tileOnY, tileOnX;
    let tileStartingX = 0;
    let tileStartingY = 0;
    for (tileOnY = 0; tileOnY < currentMap.grid.length; tileOnY++) {
        tileStartingY = tileOnY * TILE_WIDTH;
        for (tileOnX = 0; tileOnX < currentMap.grid[tileOnY].length; tileOnX++) {
            tileStartingX = tileOnX * TILE_WIDTH;
            // if the current tile on the map is a wall
            if (currentMap.grid[tileOnY][tileOnX] === 0) {
                ctx.fillStyle = currentMap.colorScheme.blankColor;
                ctx.fillRect(tileStartingX, tileStartingY, TILE_WIDTH - TILE_STROKE_WIDTH, TILE_WIDTH - TILE_STROKE_WIDTH);
                ctx.strokeStyle = currentMap.colorScheme.blankStrokeColor;
                ctx.strokeRect(tileStartingX, tileStartingY, TILE_WIDTH, TILE_WIDTH);
            } else if (currentMap.grid[tileOnY][tileOnX] === 1) {
                ctx.fillStyle = currentMap.colorScheme.wallColor;
                ctx.fillRect(tileStartingX, tileStartingY, TILE_WIDTH - TILE_STROKE_WIDTH, TILE_WIDTH - TILE_STROKE_WIDTH);
                ctx.strokeStyle = currentMap.colorScheme.wallStrokeColor;
                ctx.strokeRect(tileStartingX, tileStartingY, TILE_WIDTH, TILE_WIDTH);
            } else if (currentMap.grid[tileOnY][tileOnX] === 2) {
                drawSquare(tileStartingX, tileStartingY, TILE_WIDTH - 6,
                    bridgeActive ? currentMap.colorScheme.waterColor1 : currentMap.colorScheme.waterColor2,
                    true, STROKE_COLOR);
            } else if (currentMap.grid[tileOnY][tileOnX] === 3) {
                // Outer (parent) square
                const outerX = tileStartingX + 4;
                const outerY = tileStartingY + 6;
                const outerD = TILE_WIDTH - 14;
                drawSquare(outerX, outerY, outerD, currentMap.colorScheme.exitColor1, true, STROKE_COLOR);

                // Inner: pulse only while toy stands on lever; else draw static inner
                if (toy.x === lever.x && toy.y === lever.y) {
                    const baseInner = TILE_WIDTH - 38;
                    const s = 0.55 + 0.35 * Math.sin(gameTime * 6.0); // 0.20..0.90
                    const w = baseInner * s;

                    // center within the *outer* rect
                    const x = outerX + (outerD - w) / 2;
                    const y = outerY + (outerD - w) / 2;

                    drawSquare(x, y, w, currentMap.colorScheme.exitColor2, false);
                } else {
                    drawSquare(tileStartingX + 16, tileStartingY + 18, TILE_WIDTH - 38,
                        currentMap.colorScheme.exitColor2, true, STROKE_COLOR);
                }
            }
        }
    }

    // Level name header
    {
        const prevAlign = ctx.textAlign, prevBase = ctx.textBaseline;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        drawText(
            true, false, "24px", "system-ui", "#dfdfdf",
            "Level " + (currentMapIndex + 1) + ":  " + currentMap.mapName,
            gameBoard.width / 2, 4, true
        );
        ctx.textAlign = prevAlign; ctx.textBaseline = prevBase;
    }


    drawSquare(toy.x * TILE_WIDTH + 12, toy.y * TILE_WIDTH + 12, TILE_WIDTH - 24, toy.state===ToyState.DORMANT ? toy.color : toy.color2, false);
    drawSquare(lever.x * TILE_WIDTH + 12, lever.y * TILE_WIDTH + 12, TILE_WIDTH - 24, lever.color, false);
    drawSquare(player.x * TILE_WIDTH + 12, player.y * TILE_WIDTH + 12, TILE_WIDTH - 24, player.color, false);

    if (patrolToy) {
        drawSquare( patrolToy.x * TILE_WIDTH + 12, patrolToy.y * TILE_WIDTH + 12,
            TILE_WIDTH - 24, patrolToy.color2, false );
    }


    // --- Lever "Click" popup ---
    if (clickMsgTimer > 0) {
        const color = CLICK_MSG_COLORS[clickMsgColorIndex];

        // Centered above toy and lever (small offset up)
        const toyCenterX   = toy.x   * TILE_WIDTH + (TILE_WIDTH / 2);
        const toyCenterY   = toy.y   * TILE_WIDTH - 6;
        const leverCenterX = lever.x * TILE_WIDTH + (TILE_WIDTH / 2);
        const leverCenterY = lever.y * TILE_WIDTH - 6;

        // Temporarily center text without changing your drawText signature
        const prevAlign = ctx.textAlign;
        ctx.textAlign = 'center';

        drawText(true, false, "18px", "system-ui", color, CLICK_MSG_TEXT, toyCenterX,   toyCenterY,   true);
        drawText(true, false, "18px", "system-ui", color, CLICK_MSG_TEXT, leverCenterX, leverCenterY, true);

        ctx.textAlign = prevAlign;
    }

    // Fade overlay
    if (fade > 0) {
        ctx.fillStyle = `rgba(0,0,0,${fade})`;
        ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);
    }




}

function drawText(bold = false, italics = false, size, font, color, what, x, y, shadow = false) {
    let embolden = bold ? "bold " : "", italicize = italics ? "italic " : "", emboss = shadow ? "#0008" : "transparent";
    ctx.fillStyle = color;
    ctx.font = embolden + italicize + size.toString() + " " + font.toString();
    ctx.shadowColor = emboss;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 2;
    ctx.fillText(what, x, y);
    ctx.shadowColor = "transparent";
}

function drawBar(x, y, w, h, val, color, label) {
    drawText(true, true, "15px", "system-ui", '#40c8c8', label, x, y - 10, true);
    ctx.fillStyle = "#333"; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color; ctx.fillRect(x, y, Math.max(0, Math.min(1, val)) * w, h);
    ctx.strokeStyle = '#000', ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

function drawAllBars() {
    drawBar(10, gameBoard.height - 18, 200, 8, breath/maxBreath, '#8bc34a', 'Breath');
    drawBar(220, gameBoard.height - 18, 100, 8, Math.max(0, breathReleaseCooldown / breathReleaseCooldownBase), '#ff9800', 'Cooldown');
}

function drawEverything(reasonText = "") {
    // ... your normal board, toys, player, etc.

    if (gamePhase === GamePhase.GAMEOVER) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, gameBoard.width, gameBoard.height);

        ctx.fillStyle = "#fff";
        ctx.font = "bold 32px sans-serif";
        const title = "GAME OVER";
        const tw = ctx.measureText(title).width;
        ctx.fillText(title, (gameBoard.width - tw)/2, gameBoard.height*0.4);

        ctx.font = "20px sans-serif";
        const sub = reasonText || " ";
        const sw = ctx.measureText(sub).width;
        ctx.fillText(sub, (gameBoard.width - sw)/2, gameBoard.height*0.4 + 36);

        const hint = "Press Space/Enter to retry";
        const hw = ctx.measureText(hint).width;
        ctx.fillText(hint, (gameBoard.width - hw)/2, gameBoard.height*0.4 + 72);
    }
}