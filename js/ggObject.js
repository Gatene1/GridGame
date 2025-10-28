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
        this.color2 = '#4B6F52  ' // original is 00c900.
        this.state = ToyState.AWAKE;
        this.path = props.path || [];
        this.pathIndex = 0;
        this.direction = 1;

        if (this.path && this.path.length) {
            let best = 0, dmin = Infinity;
            for (let i = 0; i < this.path.length; i++) {
                const dx = this.posX - this.path[i].x, dy = this.posY - this.path[i].y;
                const d = dx*dx + dy*dy;
                if (d < dmin) { dmin = d; best = i; }
            }
            this.pathIndex = best;
            this.posX = this.path[best].x; this.posY = this.path[best].y;
        }
    }

    // Grid-step version (1 tile per "tick")
    updateStep(dt) {
        if (!this.path.length) return;
        this._stepTimer -= dt;
        if (this._stepTimer > 0) return;
        this._stepTimer = this._stepInterval;

        const last = this.path.length - 1;
        let next = this.pathIndex + this.direction;

        if (next > last) {
            // at end going forward: loop if ends touch, else bounce
            if (mdist(this.path[0], this.path[last]) === 1) {
                next = 0;           // wrap to start
                this.direction = 1; // keep going forward
            } else {
                next = last - 1;    // bounce one back
                this.direction = -1;
            }
        } else if (next < 0) {
            // at start going backward: loop if ends touch, else bounce
            if (mdist(this.path[0], this.path[last]) === 1) {
                next = last;        // wrap to end
                this.direction = 1; // normalize forward direction
            } else {
                next = 1;           // bounce one forward
                this.direction = 1;
            }
        }

        this.pathIndex = next;
        const n = this.path[this.pathIndex];
        this.posX = n.x; this.posY = n.y;
    }

    // Smooth follow (moves toward the next node at a set speed, using dt)
    followPath(dt, speedTilesPerSec = 3) {
        if (!this.path.length) return;

        const last = this.path.length - 1;
        let nextIdx = this.pathIndex + this.direction;

        if (nextIdx > last) {
            if (mdist(this.path[0], this.path[last]) === 1) {
                nextIdx = 0;        // wrap
                this.direction = 1;
            } else {
                nextIdx = last - 1; // bounce
                this.direction = -1;
            }
        } else if (nextIdx < 0) {
            if (mdist(this.path[0], this.path[last]) === 1) {
                nextIdx = last;     // wrap
                this.direction = 1;
            } else {
                nextIdx = 1;        // bounce
                this.direction = 1;
            }
        }

        const t = this.path[nextIdx];
        const dx = t.x - this.posX, dy = t.y - this.posY;
        const dist = Math.hypot(dx, dy), step = speedTilesPerSec * dt;

        if (dist <= step) {
            this.posX = t.x; this.posY = t.y; this.pathIndex = nextIdx;
        } else {
            this.posX += (dx / dist) * step;
            this.posY += (dy / dist) * step;
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

const GamePhase = Object.freeze({
    PLAYING: 0,
    LEVELOVER: 1,
    GAMECLEAR: 2,
    FADING: 3,
    PAUSED: 4,
    CREDITS: 5
});