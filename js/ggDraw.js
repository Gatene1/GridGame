function drawSquare(x, y, d, color, stroke, strokeColor = '#333333') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, d, d);
    if (stroke) {
        ctx.strokeStyle = strokeColor;
        ctx.strokeRect(x * TILE_WIDTH, y * TILE_WIDTH, d, d);
    }
}

function drawBoard() {
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
    drawSquare(player.x * TILE_WIDTH + 12, player.y * TILE_WIDTH + 12, TILE_WIDTH - 24, player.color, false);
    drawSquare(toy.x * TILE_WIDTH + 12, toy.y * TILE_WIDTH + 12, TILE_WIDTH - 24, toy.state=="Dormant" ? toy.color : toy.color2, false);
    drawSquare(lever.x * TILE_WIDTH + 12, lever.y * TILE_WIDTH + 12, TILE_WIDTH - 24, lever.color, false);

}