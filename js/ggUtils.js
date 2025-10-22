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
    printPath(path);
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