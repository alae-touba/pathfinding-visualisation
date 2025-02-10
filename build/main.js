// export {};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Coords, Graph, sleep, CELLS_BORDER_COLOR, GRID_BG_COLOR, SEARCHING_BG_COLOR, PATH_CELLS_BG_COLOR, START_CELL_BG_COLOR, END_CELL_BG_COLOR, BLOCKED_CELLS_BG_COLOR, } from "./utils.js";
import { dfsSearch, bfsSearch, dijkstartSearch, bellmanFordSearch } from "./algorithms.js";
let firstTimeVisualization = true;
const GRID_NUM_ROWS = 25;
const GRID_NUM_COLUMNS = 50;
let algorithm = "";
let graph = new Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS);
let isStartNodeSelected = false; //is the start node selected? we know it?
let isEndNodeSelected = false;
let startNodeCoords = null;
let endNodeCoords = null;
const table = document.querySelector("table");
//build the grid
const buildGrid = () => {
    table.innerHTML = "";
    table.style.backgroundColor = GRID_BG_COLOR;
    for (let i = 0; i < graph.numberOfRows; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < graph.numberOfColumns; j++) {
            tr.innerHTML += `<td id="${i},${j}" style="border-color:${CELLS_BORDER_COLOR};"></td>`;
        }
        table.append(tr);
    }
};
buildGrid();
graph.initGraph();
//normal/initial width and heights for each grid cell(td element)
const width = document.getElementById("0,0").style.width;
const height = document.getElementById("0,0").style.height;
const btnSelectStart = document.getElementById("btn-select-start");
const btnSelectEnd = document.getElementById("btn-select-end");
const btnSelectBlocked = document.getElementById("btn-select-blocked");
const btnVisualize = document.getElementById("btn-visualize");
const btnSeePathOnly = document.getElementById("btn-see-path-only");
const btnClearGrid = document.getElementById("btn-clear-grid");
const updateAlgoName = (algoName) => {
    chosenAlgorithm.textContent = algoName;
};
const chosenAlgorithm = document.getElementById("chosen-algorithm");
const btnSelectDijkstrat = document.getElementById("btn-select-dijkstrat");
const btnSelectBfs = document.getElementById("btn-select-bfs");
const btnSelectDfs = document.getElementById("btn-select-dfs");
const btnSelectBellmanFord = document.getElementById("btn-select-bellman-ford");
btnSelectDijkstrat.addEventListener("click", (e) => {
    algorithm = "dijkstrat";
    updateAlgoName(algorithm);
});
btnSelectBfs.addEventListener("click", (e) => {
    algorithm = "bfs";
    updateAlgoName(algorithm);
});
btnSelectDfs.addEventListener("click", (e) => {
    algorithm = "dfs";
    updateAlgoName(algorithm);
});
btnSelectBellmanFord.addEventListener("click", (e) => {
    algorithm = "bellman-ford";
    updateAlgoName(algorithm);
});
let isBtnSelectStartSelected = false;
let isBtnSelectEndSelected = false;
let isBtnSelectBlockedSelected = false;
btnSelectStart.addEventListener("click", (e) => {
    isBtnSelectStartSelected = true;
    isBtnSelectEndSelected = false;
    isBtnSelectBlockedSelected = false;
});
btnSelectEnd.addEventListener("click", (e) => {
    isBtnSelectEndSelected = true;
    isBtnSelectStartSelected = false;
    isBtnSelectBlockedSelected = false;
});
btnSelectBlocked.addEventListener("click", (e) => {
    isBtnSelectBlockedSelected = true;
    isBtnSelectEndSelected = false;
    isBtnSelectStartSelected = false;
});
const warningMessag = document.getElementById("warning-message");
const launchBootsrapModal = (message) => {
    warningMessag.textContent = message;
    $("#exampleModal").modal("show");
};
const visualize = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (withAnimation = true) {
    if (algorithm === "") {
        console.log("you did not choose any algorithme");
        launchBootsrapModal("you did not choose any algorithm!");
    }
    else if (!isStartNodeSelected || !isEndNodeSelected) {
        console.log("youd did not choose start/end nodes");
        if (!isStartNodeSelected && !isEndNodeSelected) {
            launchBootsrapModal("you did not select start and end nodes! both!");
        }
        else if (!isStartNodeSelected) {
            launchBootsrapModal("you did not select the start node");
        }
        else {
            launchBootsrapModal("you did not select the end node");
        }
    }
    else {
        console.log("before");
        if (!firstTimeVisualization) {
            for (let i = 0; i < graph.numberOfRows; i++) {
                for (let j = 0; j < graph.numberOfColumns; j++) {
                    const htmlNode = document.getElementById(`${i},${j}`);
                    if (htmlNode.style.backgroundColor === PATH_CELLS_BG_COLOR)
                        htmlNode.style.backgroundColor = GRID_BG_COLOR;
                    if (htmlNode.style.backgroundColor === SEARCHING_BG_COLOR)
                        htmlNode.style.backgroundColor = GRID_BG_COLOR;
                }
            }
        }
        let path = null;
        if (algorithm === "dijkstrat") {
            path = yield dijkstartSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        else if (algorithm === "bellman-ford") {
            path = yield bellmanFordSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        else if (algorithm === "bfs") {
            path = yield bfsSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        else if (algorithm === "dfs") {
            path = yield dfsSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        console.log("after");
        if (path.length === 0) {
            console.log("cannot go to destination, no path");
            alert("cannot go to dest, no path");
        }
        else {
            const sleepTime = withAnimation ? 50 : 0;
            for (let coords of path) {
                const node = document.getElementById(Coords.getStrFromCoords(coords));
                node.style.backgroundColor = PATH_CELLS_BG_COLOR;
                yield sleep(sleepTime);
            }
        }
        console.log("> path", path);
        firstTimeVisualization = false;
        graph.initGraph();
        graph.blockedNodesCoords.forEach((coords) => (graph.nodes[coords.i][coords.j].isBlocked = true));
    }
});
btnVisualize.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    yield visualize();
}));
btnSeePathOnly.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
    yield visualize(false);
}));
btnClearGrid.addEventListener("click", (e) => {
    firstTimeVisualization = true;
    algorithm = "";
    updateAlgoName(algorithm);
    graph = new Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS);
    buildGrid();
    graph.initGraph();
    isStartNodeSelected = false;
    isEndNodeSelected = false;
    startNodeCoords = null;
    endNodeCoords = null;
    isBtnSelectStartSelected = false;
    isBtnSelectEndSelected = false;
    isBtnSelectBlockedSelected = false;
    selectingBlocked = false;
});
let selectingBlocked = false; //is the process of selecting blocked nodes running?
table.addEventListener("click", (e) => {
    const target = e.target;
    if (isBtnSelectStartSelected) {
        if (!isStartNodeSelected) {
            target.style.backgroundColor = START_CELL_BG_COLOR;
            target.innerHTML = `
				<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`;
            isStartNodeSelected = true;
            startNodeCoords = Coords.getCoordsFromStr(target.id);
        }
        else {
            //if we clicked on a image
            if (target.tagName === "IMG") {
                const imgParent = target.parentElement; //td
                // if it is the start node img
                if (Coords.areEquals(Coords.getCoordsFromStr(imgParent.id), startNodeCoords)) {
                    imgParent.innerHTML = "";
                    imgParent.style.backgroundColor = GRID_BG_COLOR;
                    isStartNodeSelected = false;
                    startNodeCoords = null;
                }
            }
            else {
                //we clicked on the start node cell => remove it
                if (Coords.areEquals(Coords.getCoordsFromStr(target.id), startNodeCoords)) {
                    target.innerHTML = "";
                    target.style.backgroundColor = GRID_BG_COLOR;
                    isStartNodeSelected = false;
                    startNodeCoords = null;
                }
                else {
                    //put the start node on the clicked option only if the latter is not the end node cell
                    if (!isEndNodeSelected || (isEndNodeSelected && !Coords.areEquals(endNodeCoords, Coords.getCoordsFromStr(target.id)))) {
                        const oldStartNode = document.getElementById(Coords.getStrFromCoords(startNodeCoords));
                        oldStartNode.style.backgroundColor = GRID_BG_COLOR;
                        oldStartNode.innerHTML = "";
                        target.style.backgroundColor = START_CELL_BG_COLOR;
                        target.innerHTML = `
							<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`;
                        startNodeCoords = Coords.getCoordsFromStr(target.id);
                    }
                }
            }
        }
        isBtnSelectStartSelected = false;
        target.style.padding = "0px";
        target.style.width = width;
        target.style.height = height;
    }
    else if (isBtnSelectEndSelected) {
        if (!isEndNodeSelected) {
            target.style.backgroundColor = END_CELL_BG_COLOR;
            target.innerHTML = `
				<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`;
            isEndNodeSelected = true;
            endNodeCoords = Coords.getCoordsFromStr(target.id);
        }
        else {
            //if we clicked on a image
            if (target.tagName === "IMG") {
                const imgParent = target.parentElement; //td
                // if it is the end node img
                if (Coords.areEquals(Coords.getCoordsFromStr(imgParent.id), endNodeCoords)) {
                    imgParent.innerHTML = "";
                    imgParent.style.backgroundColor = GRID_BG_COLOR;
                    isEndNodeSelected = false;
                    endNodeCoords = null;
                }
            }
            else {
                if (Coords.areEquals(Coords.getCoordsFromStr(target.id), endNodeCoords)) {
                    target.innerHTML = "";
                    target.style.backgroundColor = GRID_BG_COLOR;
                    isEndNodeSelected = false;
                    endNodeCoords = null;
                }
                else {
                    //put the end node in the selected target only if the latter is not a start cell
                    if (!isStartNodeSelected || (isStartNodeSelected && !Coords.areEquals(startNodeCoords, Coords.getCoordsFromStr(target.id)))) {
                        const oldEndNode = document.getElementById(Coords.getStrFromCoords(endNodeCoords));
                        oldEndNode.style.backgroundColor = GRID_BG_COLOR;
                        oldEndNode.innerHTML = "";
                        target.style.backgroundColor = END_CELL_BG_COLOR;
                        target.innerHTML = `
							<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`;
                        endNodeCoords = Coords.getCoordsFromStr(target.id);
                    }
                }
            }
        }
        isBtnSelectEndSelected = false;
        target.style.padding = "0px";
        target.style.width = width;
        target.style.height = height;
    }
    else if (isBtnSelectBlockedSelected) {
        selectingBlocked = !selectingBlocked;
        if (!selectingBlocked) {
            isBtnSelectBlockedSelected = false;
        }
    }
    else {
        console.log("rak mamselectioni walo");
    }
});
table.addEventListener("mouseover", (e) => {
    const target = e.target;
    if (selectingBlocked) {
        console.log(target.tagName);
        if (target.tagName !== "IMG" &&
            target.tagName !== "TABLE" &&
            (!isStartNodeSelected || (isStartNodeSelected && !Coords.areEquals(Coords.getCoordsFromStr(target.id), startNodeCoords))) &&
            (!isEndNodeSelected || (isEndNodeSelected && !Coords.areEquals(Coords.getCoordsFromStr(target.id), endNodeCoords)))) {
            const coords = Coords.getCoordsFromStr(target.id);
            if (target.style.backgroundColor === GRID_BG_COLOR || target.style.backgroundColor.length === 0) {
                target.style.backgroundColor = BLOCKED_CELLS_BG_COLOR;
                graph.nodes[coords.i][coords.j].isBlocked = true;
                graph.blockedNodesCoords.push(Coords.getCoordsFromStr(target.id));
            }
            else if (target.style.backgroundColor === BLOCKED_CELLS_BG_COLOR) {
                target.style.backgroundColor = GRID_BG_COLOR;
                //this node was red and now its white =>
                //mark it as unblocked in the graph
                graph.nodes[coords.i][coords.j].isBlocked = false;
                //and remove it from graph.blockedNodesCoords array
                const index = graph.blockedNodesCoords.findIndex((c) => Coords.areEquals(c, coords));
                graph.blockedNodesCoords.splice(index, 1);
            }
        }
    }
});
