class mapColorSchemes {
    constructor(wallColor, wallStrokeColor, blankColor, blankStrokeColor, waterColor1, waterColor2, exitColor1, exitColor2) {
        this.wallColor = wallColor;
        this.wallStrokeColor = wallStrokeColor;
        this.blankColor = blankColor;
        this.blankStrokeColor = blankStrokeColor;
        this.waterColor1 = waterColor1;
        this.waterColor2 = waterColor2;
        this.exitColor1 = exitColor1;
        this.exitColor2 = exitColor2;
    }
}
class mapObject {
    constructor(mapName, grid, colorScheme, playerXY, toyXY, switchXY) {
        this.mapName = mapName;
        this.grid = grid;
        this.colorScheme = colorScheme;
        this.playerXY = playerXY;
        this.toyXY = toyXY;
        this.switchXY = switchXY;
    }
}

class Entity {
    constructor({posX, posY, color} = {}) {
        this.posX = posX;
        this.posY = posY;
        this.color = color;
    }
    get x() { return this.posX; }  set x(v) { this.posX = v; }
    get y() { return this.posY; } set y(v) { this.posY = v; }
}

class Player extends Entity {
    constructor (props) {
        super(props);
    }
}

class Toy extends Entity {
    constructor (props) {
        super(props);
        this.color2 = "66d9ef";
        this.state = "Dormant";
    }
}

class Lever extends Entity {
    constructor(props) {
        super(props);
    }
}