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
    constructor(mapName, grid, colorScheme, playerXY, toyXY, switchXY, mode, patrolXY = null, patrolPath = null) {
        this.mapName = mapName;
        this.grid = grid;
        this.colorScheme = colorScheme;
        this.playerXY = playerXY;
        this.toyXY = toyXY;
        this.switchXY = switchXY;
        this.mode = mode;
        this.patrolXY = patrolXY;
        this.patrolPath = patrolPath;
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

const ToyState = Object.freeze({
    DORMANT: 0,
    AWAKE: 1,
    DOING_TASK: 2
});

class Toy extends Entity {
    constructor (props) {
        super(props);
        this.color2 = '#66d9ef'
        this.state = ToyState.DORMANT;
    }
}

class PatrolToy extends Toy {
    constructor (props) {
        super(props);
        this.color2 = '#00c900'
        this.state = ToyState.AWAKE;
        this.path = props.path || [];
        this.pathIndex = 0;
        this.direction = 1;
    }

    // Grid-step version (1 tile per "tick")
    updateStep() {
        if (!this.path || this.path.length === 0) return;

        this.pathIndex += this.direction;

        // bounce at ends
        if (this.pathIndex >= this.path.length) {
            this.pathIndex = this.path.length - 2;
            this.direction = -1;
        } else if (this.pathIndex < 0) {
            this.pathIndex = 1;
            this.direction = 1;
        }

        const next = this.path[this.pathIndex];
        this.posX  = next.x;
        this.posY  = next.y;
    }

    // Smooth follow (moves toward the next node at a set speed, using dt)
    followPath(dt, speedTilesPerSec = 3) {
        if (!this.path || this.path.length === 0) return;

        const targetIdx = this.pathIndex + this.direction;
        // handle end bounces like updateStep
        let idx = targetIdx;
        if (idx >= this.path.length) { idx = this.path.length - 2; this.direction = -1; }
        else if (idx < 0)           { idx = 1;                     this.direction =  1; }

        const target = this.path[idx];
        if (!target) return;

        const dx = target.x - this.posX;
        const dy = target.y - this.posY;

        // If we’re basically on the node, snap and advance index
        const eps = 0.001;
        if (Math.abs(dx) < eps && Math.abs(dy) < eps) {
            this.pathIndex = idx; // we reached it; next frame will pick the next node
            return;
        }

        // Move toward target at constant speed (tiles/sec)
        const dist = Math.hypot(dx, dy);
        const maxStep = speedTilesPerSec * dt;
        if (dist <= maxStep) {
            // arrive this frame
            this.posX = target.x;
            this.posY = target.y;
            this.pathIndex = idx;
        } else {
            // move fractionally toward target
            const nx = dx / dist, ny = dy / dist;
            this.posX += nx * maxStep;
            this.posY += ny * maxStep;
        }
    }
}

class Lever extends Entity {
    constructor(props) {
        super(props);
    }
}

// --- Breath system tuning ---
const BreathMode = Object.freeze({
    SURVIVAL: 0,
    BALANCED: 1,
    RELAXED: 2
});