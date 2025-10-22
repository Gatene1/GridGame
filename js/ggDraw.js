function drawSquare(x, y, d, color, stroke, strokeColor = '#333333') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, d, d);
    if (stroke) {
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(x * TILE_WIDTH, y * TILE_WIDTH, d, d);
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
                drawSquare(tileStartingX + 4, tileStartingY + 6, TILE_WIDTH - 14,
                    currentMap.colorScheme.exitColor1, true, STROKE_COLOR);
                drawSquare(tileStartingX + 16, tileStartingY + 18, TILE_WIDTH - 38,
                    currentMap.colorScheme.exitColor2, true, STROKE_COLOR);
            }
        }
    }
    drawSquare(toy.x * TILE_WIDTH + 12, toy.y * TILE_WIDTH + 12, TILE_WIDTH - 24, toy.state===ToyState.DORMANT ? toy.color : toy.color2, false);
    drawSquare(lever.x * TILE_WIDTH + 12, lever.y * TILE_WIDTH + 12, TILE_WIDTH - 24, lever.color, false);
    drawSquare(player.x * TILE_WIDTH + 12, player.y * TILE_WIDTH + 12, TILE_WIDTH - 24, player.color, false);
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
    drawBar(220, gameBoard.height - 18, 100, 8, Math.max(0, breathReleaseCooldown / 0.6), '#ff9800', 'Cooldown');
}