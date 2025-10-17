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
            } else if (currentMap.grid[tileOnY][tileOnX] === 3) {
                alert ("DRAWING WATER");
                drawSquare(tileStartingX, tileStartingY, TILE_WIDTH,
                    bridgeActive ? currentMap.colorScheme.waterColor1 : currentMap.colorScheme.waterColor2,
                    true, STROKE_COLOR);
            }
        }
    }
    drawSquare(player.playerX * TILE_WIDTH + 12, player.playerY * TILE_WIDTH + 12, TILE_WIDTH - 24, player.colorRep, false);

}