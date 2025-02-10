var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//html td elements border color
export const CELLS_BORDER_COLOR = "rgb(162, 182, 180)"; //#a2b6b4
export const GRID_BG_COLOR = "rgb(233, 236, 239)"; //"#e9ecef"
export const SEARCHING_BG_COLOR = "rgb(9, 40, 71)"; //#092847
export const PATH_CELLS_BG_COLOR = "orange";
export const START_CELL_BG_COLOR = "blue";
export const END_CELL_BG_COLOR = "green";
export const BLOCKED_CELLS_BG_COLOR = "red";
export class Coords {
    constructor(i, j) {
        this.i = i;
        this.j = j;
    }
    static areEquals(coord1, coord2) {
        return coord1.i === coord2.i && coord1.j === coord2.j;
    }
    static getCoordsFromStr(coords) {
        const arr = coords.split(","); //0,1
        return new Coords(parseInt(arr[0]), parseInt(arr[1]));
    }
    static getStrFromCoords(coords) {
        return `${coords.i},${coords.j}`;
    }
    static isCoordsInGrid(coords, gridNumRows, gridNumColumns) {
        return coords.i >= 0 && coords.i < gridNumRows && coords.j >= 0 && coords.j < gridNumColumns;
    }
}
export class Node {
    constructor(i, j) {
        // this.coords = { i, j };
        this.coords = new Coords(i, j);
        this.neighbors = [];
        this.parent = null;
        this.isVisited = false;
        this.isBlocked = false;
    }
}
export class Graph {
    constructor(numberOfRows, numberOfColumns) {
        this.numberOfRows = null;
        this.numberOfColumns = null;
        this.nodes = null;
        this.blockedNodesCoords = null;
        this.numberOfRows = numberOfRows;
        this.numberOfColumns = numberOfColumns;
        this.nodes = new Array(numberOfRows).fill(null).map(() => new Array(numberOfColumns).fill(null));
        this.blockedNodesCoords = [];
    }
    initGraph() {
        for (let i = 0; i < this.numberOfRows; i++) {
            for (let j = 0; j < this.numberOfColumns; j++) {
                // nodes.push(new Node(i, j))
                this.nodes[i][j] = new Node(i, j);
            }
        }
        this.populateNeighbors();
    }
    populateNeighbors() {
        //populating the neighbors of each node
        for (let i = 0; i < this.numberOfRows; i++) {
            for (let j = 0; j < this.numberOfColumns; j++) {
                let currentNode = this.nodes[i][j];
                Graph.directions.forEach((direct) => {
                    let newI = currentNode.coords.i + direct[0];
                    let newJ = currentNode.coords.j + direct[1];
                    if (newI >= 0 && newI < this.numberOfRows && newJ >= 0 && newJ < this.numberOfColumns) {
                        let neighbor = this.nodes[newI][newJ];
                        currentNode.neighbors.push(neighbor);
                    }
                });
            }
        }
    }
}
Graph.directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
];
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
export const drawSearchingAnimation = (coords) => __awaiter(void 0, void 0, void 0, function* () {
    const cell = document.getElementById(Coords.getStrFromCoords(coords));
    cell.style.backgroundColor = SEARCHING_BG_COLOR;
    yield sleep(30);
});
