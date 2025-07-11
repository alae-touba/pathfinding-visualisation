//html td elements border color
export const CELLS_BORDER_COLOR = "rgb(162, 182, 180)" //#a2b6b4
export const GRID_BG_COLOR = "rgb(233, 236, 239)" //"#e9ecef"
export const SEARCHING_BG_COLOR = "rgb(9, 40, 71)" //#092847
export const PATH_CELLS_BG_COLOR = "orange"
export const START_CELL_BG_COLOR = "blue"
export const END_CELL_BG_COLOR = "green"
export const BLOCKED_CELLS_BG_COLOR = "red"

export class Coords {
	i: number
	j: number

	constructor(i: number, j: number) {
		this.i = i
		this.j = j
	}

	static areEquals(coord1: Coords, coord2: Coords) {
		return coord1.i === coord2.i && coord1.j === coord2.j
	}

	static getCoordsFromStr(coords: string): Coords {
		const arr = coords.split(",") //0,1
		return new Coords(parseInt(arr[0]), parseInt(arr[1]))
	}

	static getStrFromCoords(coords: Coords) {
		return `${coords.i},${coords.j}`
	}

	static isCoordsInGrid(coords: Coords, gridNumRows: number, gridNumColumns: number) {
		return coords.i >= 0 && coords.i < gridNumRows && coords.j >= 0 && coords.j < gridNumColumns
	}
}

export class Node {
	coords: Coords
	neighbors: Node[]
	parent: Node
	isVisited: boolean
	isBlocked: boolean
	distanceFromStart: number //im gonna use it in dijsktart(and others) to know the distance from the src node to all accessible nodes

	constructor(i: number, j: number) {
		// this.coords = { i, j };
		this.coords = new Coords(i, j)
		this.neighbors = []
		this.parent = null
		this.isVisited = false
		this.isBlocked = false
	}
}

export class Graph {
	private static directions = [
		[-1, 0],
		[0, 1],
		[1, 0],
		[0, -1],
	]

	numberOfRows: number = null
	numberOfColumns: number = null
	nodes: Node[][] = null
	blockedNodesCoords: Coords[] = null

	constructor(numberOfRows: number, numberOfColumns: number) {
		this.numberOfRows = numberOfRows
		this.numberOfColumns = numberOfColumns
		this.nodes = new Array(numberOfRows).fill(null).map(() => new Array(numberOfColumns).fill(null))
		this.blockedNodesCoords = []
	}

	initGraph() {
		for (let i = 0; i < this.numberOfRows; i++) {
			for (let j = 0; j < this.numberOfColumns; j++) {
				// nodes.push(new Node(i, j))
				this.nodes[i][j] = new Node(i, j)
			}
		}

		this.populateNeighbors()
	}

	private populateNeighbors() {
		//populating the neighbors of each node
		for (let i = 0; i < this.numberOfRows; i++) {
			for (let j = 0; j < this.numberOfColumns; j++) {
				let currentNode = this.nodes[i][j]

				Graph.directions.forEach((direct) => {
					let newI = currentNode.coords.i + direct[0]
					let newJ = currentNode.coords.j + direct[1]

					if (newI >= 0 && newI < this.numberOfRows && newJ >= 0 && newJ < this.numberOfColumns) {
						let neighbor = this.nodes[newI][newJ]
						currentNode.neighbors.push(neighbor)
					}
				})
			}
		}
	}
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export const drawSearchingAnimation = async (coords: Coords) => {
	const cell = document.getElementById(Coords.getStrFromCoords(coords)) as HTMLElement
	cell.style.backgroundColor = SEARCHING_BG_COLOR
	await sleep(30)
}

/**
 * Throws an error if the given coordinates are outside the grid boundaries.
 */
export const validateCoords = (coords: Coords, gridNumRows: number, gridNumColumns: number) => {
    if (!Coords.isCoordsInGrid(coords, gridNumRows, gridNumColumns)) {
        throw new Error("Coordinates are not in the grid");
    }
}