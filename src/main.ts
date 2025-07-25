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
	SelectionMode,
} from "./utils.js"

import { dfsSearch, bfsSearch, dijkstraSearch, bellmanFordSearch } from "./algorithms.js"

// Constants
const GRID_NUM_ROWS = 25;
const GRID_NUM_COLUMNS = 50;

const searchFunctionMap = {
	[Algorithm.Dijkstra]: dijkstraSearch,
	[Algorithm.BellmanFord]: bellmanFordSearch,
	[Algorithm.Bfs]: bfsSearch,
	[Algorithm.Dfs]: dfsSearch,
};

// State
const appState = {
    firstTimeVisualization: true,
    algorithm: Algorithm.None,
    graph: new Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS),
    isStartNodeSelected: false,
    isEndNodeSelected: false,
    startNodeCoords: null as Coords,
    endNodeCoords: null as Coords,
    selectionMode: SelectionMode.None,
    selectingBlocked: false,
};

// DOM Elements
const table = document.querySelector("table")
const btnSelectStart = document.getElementById("btn-select-start")
const btnSelectEnd = document.getElementById("btn-select-end")
const btnSelectBlocked = document.getElementById("btn-select-blocked")
const btnVisualize = document.getElementById("btn-visualize")
const btnSeePathOnly = document.getElementById("btn-see-path-only")
const btnClearGrid = document.getElementById("btn-clear-grid")
const chosenAlgorithm = document.getElementById("chosen-algorithm")
const btnSelectDijkstra = document.getElementById("btn-select-dijkstra")
const btnSelectBfs = document.getElementById("btn-select-bfs")
const btnSelectDfs = document.getElementById("btn-select-dfs")
const btnSelectBellmanFord = document.getElementById("btn-select-bellman-ford")
const warningMessag = document.getElementById("warning-message")
const themeToggle = document.getElementById('theme-toggle');
let width: string;
let height: string;

// Grid Functions
const renderGrid = () => {
    table.innerHTML = "";
    table.style.backgroundColor = GRID_BG_COLOR;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < appState.graph.numberOfRows; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < appState.graph.numberOfColumns; j++) {
            const td = document.createElement("td");
            td.dataset.coords = `${i},${j}`;
            td.style.borderColor = CELLS_BORDER_COLOR;
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
    }

    table.appendChild(fragment);
}

// UI Functions
const updateAlgoNameUI = (algoName: string) => {
	chosenAlgorithm.textContent = algoName
}

const launchModal = (message: string) => {
	warningMessag.textContent = message
	;($('#exampleModal') as any).modal("show")
}

// Visualization
const isSearchAlgoChosen = (): boolean => {
    return appState.algorithm !== Algorithm.None;
};

const checkSearchReadiness = (): { valid: boolean; message?: string } => {
    if (!isSearchAlgoChosen()) {
        return { valid: false, message: "you did not choose any algorithm!" };
    }

    const startNodeMissing = !appState.isStartNodeSelected;
    const endNodeMissing = !appState.isEndNodeSelected;

    if (startNodeMissing && endNodeMissing) {
        return { valid: false, message: "you did not select start and end nodes! both!" };
    }
    if (startNodeMissing) {
        return { valid: false, message: "you did not select the start node" };
    }
    if (endNodeMissing) {
        return { valid: false, message: "you did not select the end node" };
    }

    return { valid: true };
};

const handleSearchValidation = () => {
    const { valid, message } = checkSearchReadiness();
    if (!valid) {
        launchModal(message);
    }
    return valid;
};

const clearPreviousRun = () => {
    for (let i = 0; i < appState.graph.numberOfRows; i++) {
        for (let j = 0; j < appState.graph.numberOfColumns; j++) {
            const htmlNode = document.querySelector(`[data-coords="${i},${j}"]`) as HTMLElement;
            if (htmlNode.style.backgroundColor === PATH_CELLS_BG_COLOR) {
                htmlNode.style.backgroundColor = GRID_BG_COLOR;
            }
            if (htmlNode.style.backgroundColor === SEARCHING_BG_COLOR) {
                htmlNode.style.backgroundColor = GRID_BG_COLOR;
            }
        }
    }
};

const drawPath = async (path: Coords[], withAnimation: boolean) => {
    const sleepTime = withAnimation ? 50 : 0;
    for (const coords of path) {
        const node = document.querySelector(`[data-coords="${Coords.getStrFromCoords(coords)}"]`) as HTMLElement;
        node.style.backgroundColor = PATH_CELLS_BG_COLOR;
        await sleep(sleepTime);
    }
};

const resetGraphState = () => {
    appState.graph.initGraph();
    appState.graph.blockedNodesCoords.forEach((coords) => (appState.graph.nodes[coords.i][coords.j].isBlocked = true));
};

const visualize = async (withAnimation: boolean = true) => {
    if (!handleSearchValidation()) {
        return;
    }

    if (!appState.firstTimeVisualization) {
        clearPreviousRun();
    }

    const searchFunction = searchFunctionMap[appState.algorithm];
    if (!searchFunction) {
        return;
    }

    const path = await searchFunction(appState.startNodeCoords, appState.endNodeCoords, appState.graph, withAnimation);

    if (path.length === 0) {
        alert("cannot go to dest, no path");
    } else {
        await drawPath(path, withAnimation);
    }

    appState.firstTimeVisualization = false;
    resetGraphState();
};

// Event Listeners
const selectAlgorithm = (algorithm: Algorithm) => {
    appState.algorithm = algorithm;
    updateAlgoNameUI(appState.algorithm);
};

const setSelectionMode = (mode: SelectionMode) => {
	appState.selectionMode = mode;
};

btnSelectDijkstra.addEventListener("click", 
	() => selectAlgorithm(Algorithm.Dijkstra)
);
btnSelectBfs.addEventListener("click", 
	() => selectAlgorithm(Algorithm.Bfs)
);
btnSelectDfs.addEventListener("click", 
	() => selectAlgorithm(Algorithm.Dfs)
);
btnSelectBellmanFord.addEventListener("click", 
	() => selectAlgorithm(Algorithm.BellmanFord)
);

btnSelectStart.addEventListener("click", 
	() => setSelectionMode(SelectionMode.Start)
);
btnSelectEnd.addEventListener("click", 
	() => setSelectionMode(SelectionMode.End)
);
btnSelectBlocked.addEventListener("click", 
	() => setSelectionMode(SelectionMode.Blocked)
);

btnVisualize.addEventListener("click", async (e) => {
	await visualize()
})

btnSeePathOnly.addEventListener("click", async (e) => {
	await visualize(false)
})

btnClearGrid.addEventListener("click", (e) => {
	appState.firstTimeVisualization = true

	selectAlgorithm(Algorithm.None)

	appState.graph = new Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS)

	renderGrid()
	appState.graph.initGraph()

	appState.isStartNodeSelected = false
	appState.isEndNodeSelected = false
	appState.startNodeCoords = null
	appState.endNodeCoords = null

	appState.selectionMode = SelectionMode.None

	appState.selectingBlocked = false
})


table.addEventListener("click", (e: MouseEvent) => {
	const target = e.target as HTMLElement

	if (appState.selectionMode === SelectionMode.Start) {
		if (!appState.isStartNodeSelected) {
			target.style.backgroundColor = START_CELL_BG_COLOR
			target.innerHTML = `
				<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`
			appState.isStartNodeSelected = true
			appState.startNodeCoords = Coords.getCoordsFromStr(target.dataset.coords)
		} else {
			//if we clicked on a image
			if (target.tagName === "IMG") {
				const imgParent = target.parentElement //td
				// if it is the start node img
				if (Coords.areEquals(Coords.getCoordsFromStr(imgParent.dataset.coords), appState.startNodeCoords)) {
					imgParent.innerHTML = ""
					imgParent.style.backgroundColor = GRID_BG_COLOR

					appState.isStartNodeSelected = false
					appState.startNodeCoords = null
				}
			} else {
				//we clicked on the start node cell => remove it
				if (Coords.areEquals(Coords.getCoordsFromStr(target.dataset.coords), appState.startNodeCoords)) {
					target.innerHTML = ""
					target.style.backgroundColor = GRID_BG_COLOR
					appState.isStartNodeSelected = false
					appState.startNodeCoords = null
				} else {
					//put the start node on the clicked option only if the latter is not the end node cell
					if (!appState.isEndNodeSelected || (appState.isEndNodeSelected && !Coords.areEquals(appState.endNodeCoords, Coords.getCoordsFromStr(target.dataset.coords)))) {
						const oldStartNode = document.getElementById(Coords.getStrFromCoords(appState.startNodeCoords)) as HTMLElement
						oldStartNode.style.backgroundColor = GRID_BG_COLOR
						oldStartNode.innerHTML = ""

						target.style.backgroundColor = START_CELL_BG_COLOR
						target.innerHTML = `
							<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`
						appState.startNodeCoords = Coords.getCoordsFromStr(target.dataset.coords)
					}
				}
			}
		}
		appState.selectionMode = null

		target.style.padding = "0px"
		target.style.width = width
		target.style.height = height
	} else if (appState.selectionMode === SelectionMode.End) {
		if (!appState.isEndNodeSelected) {
			target.style.backgroundColor = END_CELL_BG_COLOR
			target.innerHTML = `
				<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`
			appState.isEndNodeSelected = true
			appState.endNodeCoords = Coords.getCoordsFromStr(target.dataset.coords)
		} else {
			//if we clicked on a image
			if (target.tagName === "IMG") {
				const imgParent = target.parentElement //td
				// if it is the end node img
				if (Coords.areEquals(Coords.getCoordsFromStr(imgParent.dataset.coords), appState.endNodeCoords)) {
					imgParent.innerHTML = ""
					imgParent.style.backgroundColor = GRID_BG_COLOR
					appState.isEndNodeSelected = false
					appState.endNodeCoords = null
				}
			} else {
				if (Coords.areEquals(Coords.getCoordsFromStr(target.dataset.coords), appState.endNodeCoords)) {
					target.innerHTML = ""
					target.style.backgroundColor = GRID_BG_COLOR
					appState.isEndNodeSelected = false
					appState.endNodeCoords = null
				} else {
					//put the end node in the selected target only if the latter is not a start cell
					if (!appState.isStartNodeSelected || (appState.isStartNodeSelected && !Coords.areEquals(appState.startNodeCoords, Coords.getCoordsFromStr(target.dataset.coords)))) {
						const oldEndNode = document.getElementById(Coords.getStrFromCoords(appState.endNodeCoords)) as HTMLElement
						oldEndNode.style.backgroundColor = GRID_BG_COLOR
						oldEndNode.innerHTML = ""

						target.style.backgroundColor = END_CELL_BG_COLOR
						target.innerHTML = `
							<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`
						appState.endNodeCoords = Coords.getCoordsFromStr(target.dataset.coords)
					}
				}
			}
		}
		appState.selectionMode = null

		target.style.padding = "0px"
		target.style.width = width
		target.style.height = height
	} else if (appState.selectionMode === SelectionMode.Blocked) {
		appState.selectingBlocked = !appState.selectingBlocked

		if (!appState.selectingBlocked) {
			appState.selectionMode = SelectionMode.None
		}
	} else {
		
	}
})

table.addEventListener("mouseover", (e) => {
	const target = e.target as HTMLElement

	if (appState.selectingBlocked) {
		if (
			target.tagName !== "IMG" &&
			target.tagName !== "TABLE" &&
			(!appState.isStartNodeSelected || (appState.isStartNodeSelected && !Coords.areEquals(Coords.getCoordsFromStr(target.dataset.coords), appState.startNodeCoords))) &&
			(!appState.isEndNodeSelected || (appState.isEndNodeSelected && !Coords.areEquals(Coords.getCoordsFromStr(target.dataset.coords), appState.endNodeCoords)))
		) {
			const coords = Coords.getCoordsFromStr(target.dataset.coords)

			if (target.style.backgroundColor === GRID_BG_COLOR || target.style.backgroundColor.length === 0) {
				target.style.backgroundColor = BLOCKED_CELLS_BG_COLOR

				appState.graph.nodes[coords.i][coords.j].isBlocked = true
				appState.graph.blockedNodesCoords.push(Coords.getCoordsFromStr(target.id))
			} else if (target.style.backgroundColor === BLOCKED_CELLS_BG_COLOR) {
				target.style.backgroundColor = GRID_BG_COLOR

				//this node was red and now its white =>
				//mark it as unblocked in the graph
				appState.graph.nodes[coords.i][coords.j].isBlocked = false

				//and remove it from graph.blockedNodesCoords array
				const index = appState.graph.blockedNodesCoords.findIndex((c) => Coords.areEquals(c, coords))
				appState.graph.blockedNodesCoords.splice(index, 1)
			}
		}
	}
})

const handleThemeToggle = () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = `<i class="fas fa-${newTheme === 'light' ? 'moon' : 'sun'}"></i>`;
};

themeToggle.addEventListener('click', handleThemeToggle);

// Initialization
const init = () => {
    renderGrid();
    appState.graph.initGraph();
    width = (document.querySelector(`[data-coords="0,0"]`) as HTMLElement).style.width;
    height = (document.querySelector(`[data-coords="0,0"]`) as HTMLElement).style.height;
};

init();
