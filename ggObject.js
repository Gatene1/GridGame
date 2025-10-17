class mapColorSchemes {
    constructor(wallColor, wallStrokeColor, blankColor, blankStrokeColor, waterColor1, waterColor2) {
        this.wallColor = wallColor;
        this.wallStrokeColor = wallStrokeColor;
        this.blankColor = blankColor;
        this.blankStrokeColor = blankStrokeColor;
        this.waterColor1 = waterColor1;
        this.waterColor2 = waterColor2;
    }
}
class mapObject {
    constructor(mapName, grid, colorScheme, playerX, playerY) {
        this.mapName = mapName;
        this.grid = grid;
        this.colorScheme = colorScheme;
        this.playerX = playerX;
        this.playerY = playerY;
    }
}

class playerChar {
    constructor(playerX, playerY, colorRep) {
        this.playerX = playerX;
        this.playerY = playerY;
        this.colorRep = colorRep;
    }
}