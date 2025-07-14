// export {};

import {
	Node,
	Coords,
	Graph,
	sleep,
	drawSearchingAnimation,
	CELLS_BORDER_COLOR,
	GRID_BG_COLOR,
	SEARCHING_BG_COLOR,
	PATH_CELLS_BG_COLOR,
	START_CELL_BG_COLOR,
	END_CELL_BG_COLOR,
	BLOCKED_CELLS_BG_COLOR,
	Algorithm,
} from "./utils.js"

import { dfsSearch, bfsSearch, dijkstraSearch, bellmanFordSearch } from "./algorithms.js"

let firstTimeVisualization = true

const GRID_NUM_ROWS = 25
const GRID_NUM_COLUMNS = 50

let algorithm: Algorithm = Algorithm.None
let graph = new Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS)

let isStartNodeSelected = false //is the start node selected? we know it?
let isEndNodeSelected = false

let startNodeCoords: Coords = null
let endNodeCoords: Coords = null

const table = document.querySelector("table")

//build the grid
const buildGrid = () => {
	table.innerHTML = ""
	table.style.backgroundColor = GRID_BG_COLOR

	for (let i = 0; i < graph.numberOfRows; i++) {
		const tr = document.createElement("tr")
		for (let j = 0; j < graph.numberOfColumns; j++) {
			tr.innerHTML += `<td id="${i},${j}" style="border-color:${CELLS_BORDER_COLOR};"></td>`
		}
		table.append(tr)
	}
}

buildGrid()

graph.initGraph()

//normal/initial width and heights for each grid cell(td element)
const width = (document.getElementById("0,0") as HTMLElement).style.width
const height = (document.getElementById("0,0") as HTMLElement).style.height

const btnSelectStart = document.getElementById("btn-select-start")
const btnSelectEnd = document.getElementById("btn-select-end")
const btnSelectBlocked = document.getElementById("btn-select-blocked")
const btnVisualize = document.getElementById("btn-visualize")
const btnSeePathOnly = document.getElementById("btn-see-path-only")
const btnClearGrid = document.getElementById("btn-clear-grid")

const updateAlgoName = (algoName: string) => {
	chosenAlgorithm.textContent = algoName
}
const chosenAlgorithm = document.getElementById("chosen-algorithm")

const btnSelectDijkstra = document.getElementById("btn-select-dijkstra")
const btnSelectBfs = document.getElementById("btn-select-bfs")
const btnSelectDfs = document.getElementById("btn-select-dfs")
const btnSelectBellmanFord = document.getElementById("btn-select-bellman-ford")

btnSelectDijkstra.addEventListener("click", (e) => {
	algorithm = Algorithm.Dijkstra
	updateAlgoName(algorithm)
})

btnSelectBfs.addEventListener("click", (e) => {
	algorithm = Algorithm.Bfs
	updateAlgoName(algorithm)
})

btnSelectDfs.addEventListener("click", (e) => {
	algorithm = Algorithm.Dfs
	updateAlgoName(algorithm)
})

btnSelectBellmanFord.addEventListener("click", (e) => {
	algorithm = Algorithm.BellmanFord
	updateAlgoName(algorithm)
})

let isBtnSelectStartSelected = false
let isBtnSelectEndSelected = false
let isBtnSelectBlockedSelected = false

btnSelectStart.addEventListener("click", (e) => {
	
	isBtnSelectStartSelected = true
	isBtnSelectEndSelected = false
	isBtnSelectBlockedSelected = false
})

btnSelectEnd.addEventListener("click", (e) => {
	isBtnSelectEndSelected = true
	isBtnSelectStartSelected = false
	isBtnSelectBlockedSelected = false
})

btnSelectBlocked.addEventListener("click", (e) => {
	isBtnSelectBlockedSelected = true
	isBtnSelectEndSelected = false
	isBtnSelectStartSelected = false
})

const warningMessag = document.getElementById("warning-message")

const launchBootsrapModal = (message: string) => {
	warningMessag.textContent = message
	;($('#exampleModal') as any).modal("show")
}

const visualize = async (withAnimation = true) => {
	
	if (algorithm === Algorithm.None) {
		
		launchBootsrapModal("you did not choose any algorithm!")
	} else if (!isStartNodeSelected || !isEndNodeSelected) {
		
		if (!isStartNodeSelected && !isEndNodeSelected) {
			launchBootsrapModal("you did not select start and end nodes! both!")
		} else if (!isStartNodeSelected) {
			launchBootsrapModal("you did not select the start node")
		} else {
			launchBootsrapModal("you did not select the end node")
		}
	} else {
		

		if (!firstTimeVisualization) {
			for (let i = 0; i < graph.numberOfRows; i++) {
				for (let j = 0; j < graph.numberOfColumns; j++) {
					const htmlNode = document.getElementById(`${i},${j}`) as HTMLElement
					if (htmlNode.style.backgroundColor === PATH_CELLS_BG_COLOR) htmlNode.style.backgroundColor = GRID_BG_COLOR
					if (htmlNode.style.backgroundColor === SEARCHING_BG_COLOR) htmlNode.style.backgroundColor = GRID_BG_COLOR
				}
			}
		}

		let path: Coords[] = null

		if (algorithm === Algorithm.Dijkstra) {
			path = await dijkstraSearch(startNodeCoords, endNodeCoords, graph, withAnimation)
		} else if (algorithm === Algorithm.BellmanFord) {
			path = await bellmanFordSearch(startNodeCoords, endNodeCoords, graph, withAnimation)
		} else if (algorithm === Algorithm.Bfs) {
			path = await bfsSearch(startNodeCoords, endNodeCoords, graph, withAnimation)
		} else if (algorithm === Algorithm.Dfs) {
			path = await dfsSearch(startNodeCoords, endNodeCoords, graph, withAnimation)
		}

		

		if (path.length === 0) {
			
			alert("cannot go to dest, no path")
		} else {
			const sleepTime = withAnimation ? 50 : 0
			for (let coords of path) {
				const node = document.getElementById(Coords.getStrFromCoords(coords)) as HTMLElement

				node.style.backgroundColor = PATH_CELLS_BG_COLOR
				await sleep(sleepTime)
			}
		}
		

		firstTimeVisualization = false
		graph.initGraph()
		graph.blockedNodesCoords.forEach((coords) => (graph.nodes[coords.i][coords.j].isBlocked = true))
	}
}

btnVisualize.addEventListener("click", async (e) => {
	await visualize()
})

btnSeePathOnly.addEventListener("click", async (e) => {
	await visualize(false)
})

btnClearGrid.addEventListener("click", (e) => {
	firstTimeVisualization = true

	algorithm = ""
	updateAlgoName(algorithm)

	graph = new Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS)

	buildGrid()
	graph.initGraph()

	isStartNodeSelected = false
	isEndNodeSelected = false
	startNodeCoords = null
	endNodeCoords = null

	isBtnSelectStartSelected = false
	isBtnSelectEndSelected = false
	isBtnSelectBlockedSelected = false

	selectingBlocked = false
})

let selectingBlocked = false //is the process of selecting blocked nodes running?

table.addEventListener("click", (e: MouseEvent) => {
	const target = e.target as HTMLElement

	if (isBtnSelectStartSelected) {
		if (!isStartNodeSelected) {
			target.style.backgroundColor = START_CELL_BG_COLOR
			target.innerHTML = `
				<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`
			isStartNodeSelected = true
			startNodeCoords = Coords.getCoordsFromStr(target.id)
		} else {
			//if we clicked on a image
			if (target.tagName === "IMG") {
				const imgParent = target.parentElement //td
				// if it is the start node img
				if (Coords.areEquals(Coords.getCoordsFromStr(imgParent.id), startNodeCoords)) {
					imgParent.innerHTML = ""
					imgParent.style.backgroundColor = GRID_BG_COLOR

					isStartNodeSelected = false
					startNodeCoords = null
				}
			} else {
				//we clicked on the start node cell => remove it
				if (Coords.areEquals(Coords.getCoordsFromStr(target.id), startNodeCoords)) {
					target.innerHTML = ""
					target.style.backgroundColor = GRID_BG_COLOR
					isStartNodeSelected = false
					startNodeCoords = null
				} else {
					//put the start node on the clicked option only if the latter is not the end node cell
					if (!isEndNodeSelected || (isEndNodeSelected && !Coords.areEquals(endNodeCoords, Coords.getCoordsFromStr(target.id)))) {
						const oldStartNode = document.getElementById(Coords.getStrFromCoords(startNodeCoords)) as HTMLElement
						oldStartNode.style.backgroundColor = GRID_BG_COLOR
						oldStartNode.innerHTML = ""

						target.style.backgroundColor = START_CELL_BG_COLOR
						target.innerHTML = `
							<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`
						startNodeCoords = Coords.getCoordsFromStr(target.id)
					}
				}
			}
		}
		isBtnSelectStartSelected = false

		target.style.padding = "0px"
		target.style.width = width
		target.style.height = height
	} else if (isBtnSelectEndSelected) {
		if (!isEndNodeSelected) {
			target.style.backgroundColor = END_CELL_BG_COLOR
			target.innerHTML = `
				<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`
			isEndNodeSelected = true
			endNodeCoords = Coords.getCoordsFromStr(target.id)
		} else {
			//if we clicked on a image
			if (target.tagName === "IMG") {
				const imgParent = target.parentElement //td
				// if it is the end node img
				if (Coords.areEquals(Coords.getCoordsFromStr(imgParent.id), endNodeCoords)) {
					imgParent.innerHTML = ""
					imgParent.style.backgroundColor = GRID_BG_COLOR
					isEndNodeSelected = false
					endNodeCoords = null
				}
			} else {
				if (Coords.areEquals(Coords.getCoordsFromStr(target.id), endNodeCoords)) {
					target.innerHTML = ""
					target.style.backgroundColor = GRID_BG_COLOR
					isEndNodeSelected = false
					endNodeCoords = null
				} else {
					//put the end node in the selected target only if the latter is not a start cell
					if (!isStartNodeSelected || (isStartNodeSelected && !Coords.areEquals(startNodeCoords, Coords.getCoordsFromStr(target.id)))) {
						const oldEndNode = document.getElementById(Coords.getStrFromCoords(endNodeCoords)) as HTMLElement
						oldEndNode.style.backgroundColor = GRID_BG_COLOR
						oldEndNode.innerHTML = ""

						target.style.backgroundColor = END_CELL_BG_COLOR
						target.innerHTML = `
							<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`
						endNodeCoords = Coords.getCoordsFromStr(target.id)
					}
				}
			}
		}
		isBtnSelectEndSelected = false

		target.style.padding = "0px"
		target.style.width = width
		target.style.height = height
	} else if (isBtnSelectBlockedSelected) {
		selectingBlocked = !selectingBlocked

		if (!selectingBlocked) {
			isBtnSelectBlockedSelected = false
		}
	} else {
		
	}
})

table.addEventListener("mouseover", (e) => {
	const target = e.target as HTMLElement

	if (selectingBlocked) {
		

		if (
			target.tagName !== "IMG" &&
			target.tagName !== "TABLE" &&
			(!isStartNodeSelected || (isStartNodeSelected && !Coords.areEquals(Coords.getCoordsFromStr(target.id), startNodeCoords))) &&
			(!isEndNodeSelected || (isEndNodeSelected && !Coords.areEquals(Coords.getCoordsFromStr(target.id), endNodeCoords)))
		) {
			const coords = Coords.getCoordsFromStr(target.id)

			if (target.style.backgroundColor === GRID_BG_COLOR || target.style.backgroundColor.length === 0) {
				target.style.backgroundColor = BLOCKED_CELLS_BG_COLOR

				graph.nodes[coords.i][coords.j].isBlocked = true
				graph.blockedNodesCoords.push(Coords.getCoordsFromStr(target.id))
			} else if (target.style.backgroundColor === BLOCKED_CELLS_BG_COLOR) {
				target.style.backgroundColor = GRID_BG_COLOR

				//this node was red and now its white =>
				//mark it as unblocked in the graph
				graph.nodes[coords.i][coords.j].isBlocked = false

				//and remove it from graph.blockedNodesCoords array
				const index = graph.blockedNodesCoords.findIndex((c) => Coords.areEquals(c, coords))
				graph.blockedNodesCoords.splice(index, 1)
			}
		}
	}
})

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
	const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = `<i class="fas fa-${newTheme === 'light' ? 'moon' : 'sun'}"></i>`;
});