(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bellmanFordSearch = exports.dijkstartSearch = exports.bfsSearch = exports.dfsSearch = void 0;
const utils_1 = require("./utils");
exports.dfsSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    let path = [];
    const dfsRec = (current) => __awaiter(void 0, void 0, void 0, function* () {
        let currentNode = graph.nodes[current.i][current.j];
        if (currentNode && !currentNode.isVisited && !currentNode.isBlocked) {
            currentNode.isVisited = true;
            if (!utils_1.Coords.areEquals(current, src) && !utils_1.Coords.areEquals(current, dest) && withAnimation) {
                yield utils_1.drawSearchingAnimation(currentNode.coords);
            }
            if (utils_1.Coords.areEquals(current, dest)) {
                const destNode = graph.nodes[dest.i][dest.j];
                let tmp = destNode;
                while (tmp != null) {
                    path.unshift(tmp.coords);
                    tmp = tmp.parent;
                }
                return;
            }
            else {
                for (let neighbor of currentNode.neighbors) {
                    if (!neighbor.isVisited && !neighbor.isBlocked) {
                        neighbor.parent = currentNode;
                    }
                    yield dfsRec(neighbor.coords);
                }
            }
        }
    });
    yield dfsRec(src);
    return path;
});
exports.bfsSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("debug>> bfs");
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    const queue = [];
    const startNode = graph.nodes[src.i][src.j];
    queue.push(startNode);
    let path = [];
    while (queue.length) {
        const currentNode = queue.shift();
        if (!currentNode.isVisited && !currentNode.isBlocked) {
            currentNode.isVisited = true;
            if (utils_1.Coords.areEquals(currentNode.coords, dest)) {
                let tmp = currentNode;
                while (tmp) {
                    path.unshift(tmp.coords);
                    tmp = tmp.parent;
                }
                return path;
            }
            else {
                //process node
                if (!utils_1.Coords.areEquals(currentNode.coords, src) && withAnimation) {
                    yield utils_1.drawSearchingAnimation(currentNode.coords);
                }
                for (let i = 0; i < currentNode.neighbors.length; i++) {
                    const neighbor = currentNode.neighbors[i];
                    if (!neighbor.isVisited && !neighbor.isBlocked) {
                        neighbor.parent = currentNode;
                    }
                    queue.push(neighbor);
                }
            }
        }
    }
    return path;
});
exports.dijkstartSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(">>Debug: dikstrta");
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    let isPathExists = false;
    //set distance from start node to start node to 0
    let startNode = graph.nodes[src.i][src.j];
    startNode.distanceFromStart = 0;
    //set distance from start node for all nodes (except start node) to Infitinty
    // nodes.filter((n) => !Coords.areEquals(n.coords, src)).forEach((node) => (node.distanceFromStart = Infinity))
    for (let i = 0; i < graph.numberOfRows; i++) {
        for (let j = 0; j < graph.numberOfColumns; j++) {
            if (!utils_1.Coords.areEquals(src, graph.nodes[i][j].coords))
                graph.nodes[i][j].distanceFromStart = Infinity;
        }
    }
    let numberOfBlockedNodes = graph.blockedNodesCoords.length;
    let numberOfUnvisitedNodes = graph.numberOfRows * graph.numberOfColumns - numberOfBlockedNodes;
    while (numberOfUnvisitedNodes) {
        //select unvisited node with smallest path to start
        const unvisitedNodes = [];
        for (let i = 0; i < graph.numberOfRows; i++) {
            for (let j = 0; j < graph.numberOfColumns; j++) {
                if (!graph.nodes[i][j].isVisited && !graph.nodes[i][j].isBlocked)
                    unvisitedNodes.push(graph.nodes[i][j]);
            }
        }
        unvisitedNodes.sort((n1, n2) => n1.distanceFromStart - n2.distanceFromStart);
        const currentNode = unvisitedNodes[0];
        if (currentNode.distanceFromStart === Infinity)
            break; //no path
        for (let neighbor of currentNode.neighbors) {
            if (!neighbor.isVisited && !neighbor.isBlocked) {
                //calculate new distance from start node to this neighbor node, if it is small than the old dist, update
                //new distance = (from currNode to neighbor) + (from currNode to start)
                const newDistFromStart = 1 + currentNode.distanceFromStart;
                if (newDistFromStart < neighbor.distanceFromStart) {
                    neighbor.distanceFromStart = newDistFromStart;
                    neighbor.parent = currentNode;
                }
            }
        }
        currentNode.isVisited = true;
        numberOfUnvisitedNodes--;
        if (!utils_1.Coords.areEquals(currentNode.coords, src) && !utils_1.Coords.areEquals(currentNode.coords, dest) && withAnimation) {
            yield utils_1.drawSearchingAnimation(currentNode.coords);
        }
        if (utils_1.Coords.areEquals(currentNode.coords, dest)) {
            isPathExists = true;
            break;
        }
    }
    let path = [];
    if (isPathExists) {
        const endNode = graph.nodes[dest.i][dest.j];
        let tmp = endNode;
        while (tmp) {
            path.unshift(tmp.coords);
            tmp = tmp.parent;
        }
    }
    return path;
});
exports.bellmanFordSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(">>debug: bellman ford");
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    const startNode = graph.nodes[src.i][src.j];
    startNode.distanceFromStart = 0;
    for (let i = 0; i < graph.numberOfRows; i++) {
        for (let j = 0; j < graph.numberOfColumns; j++) {
            if (!utils_1.Coords.areEquals(src, graph.nodes[i][j].coords))
                graph.nodes[i][j].distanceFromStart = Infinity;
        }
    }
    //we will repeat the process (numberOfNodes - 1) times
    for (let k = 0; k < graph.numberOfRows * graph.numberOfColumns - graph.blockedNodesCoords.length - 1; k++) {
        for (let i = 0; i < graph.numberOfRows; i++) {
            for (let j = 0; j < graph.numberOfColumns; j++) {
                const currentNode = graph.nodes[i][j];
                if (!currentNode.isBlocked) {
                    //We will not draw the animation until tha last iteration of process of the algorithm
                    if (k === graph.numberOfRows * graph.numberOfColumns - graph.blockedNodesCoords.length - 1 - 1 &&
                        !utils_1.Coords.areEquals(currentNode.coords, src) &&
                        !utils_1.Coords.areEquals(currentNode.coords, dest) &&
                        withAnimation) {
                        yield utils_1.drawSearchingAnimation(currentNode.coords);
                    }
                    for (let neighbor of currentNode.neighbors) {
                        if (!neighbor.isBlocked) {
                            const newDistanceFromStart = 1 + currentNode.distanceFromStart;
                            if (newDistanceFromStart < neighbor.distanceFromStart) {
                                neighbor.distanceFromStart = newDistanceFromStart;
                                neighbor.parent = currentNode;
                            }
                        }
                    }
                }
            }
        }
    }
    const endNode = graph.nodes[dest.i][dest.j];
    let path = [];
    let tmp = endNode;
    while (tmp) {
        path.unshift(tmp.coords);
        tmp = tmp.parent;
    }
    if (!utils_1.Coords.areEquals(path[0], src) || !utils_1.Coords.areEquals(path[path.length - 1], dest))
        path = []; //no path
    return path;
});

},{"./utils":3}],2:[function(require,module,exports){
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bellmanFordSearch = exports.dijkstartSearch = exports.bfsSearch = exports.dfsSearch = void 0;
const utils_1 = require("./utils");
exports.dfsSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    let path = [];
    const dfsRec = (current) => __awaiter(void 0, void 0, void 0, function* () {
        let currentNode = graph.nodes[current.i][current.j];
        if (currentNode && !currentNode.isVisited && !currentNode.isBlocked) {
            currentNode.isVisited = true;
            if (!utils_1.Coords.areEquals(current, src) && !utils_1.Coords.areEquals(current, dest) && withAnimation) {
                yield utils_1.drawSearchingAnimation(currentNode.coords);
            }
            if (utils_1.Coords.areEquals(current, dest)) {
                const destNode = graph.nodes[dest.i][dest.j];
                let tmp = destNode;
                while (tmp != null) {
                    path.unshift(tmp.coords);
                    tmp = tmp.parent;
                }
                return;
            }
            else {
                for (let neighbor of currentNode.neighbors) {
                    if (!neighbor.isVisited && !neighbor.isBlocked) {
                        neighbor.parent = currentNode;
                    }
                    yield dfsRec(neighbor.coords);
                }
            }
        }
    });
    yield dfsRec(src);
    return path;
});
exports.bfsSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("debug>> bfs");
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    const queue = [];
    const startNode = graph.nodes[src.i][src.j];
    queue.push(startNode);
    let path = [];
    while (queue.length) {
        const currentNode = queue.shift();
        if (!currentNode.isVisited && !currentNode.isBlocked) {
            currentNode.isVisited = true;
            if (utils_1.Coords.areEquals(currentNode.coords, dest)) {
                let tmp = currentNode;
                while (tmp) {
                    path.unshift(tmp.coords);
                    tmp = tmp.parent;
                }
                return path;
            }
            else {
                //process node
                if (!utils_1.Coords.areEquals(currentNode.coords, src) && withAnimation) {
                    yield utils_1.drawSearchingAnimation(currentNode.coords);
                }
                for (let i = 0; i < currentNode.neighbors.length; i++) {
                    const neighbor = currentNode.neighbors[i];
                    if (!neighbor.isVisited && !neighbor.isBlocked) {
                        neighbor.parent = currentNode;
                    }
                    queue.push(neighbor);
                }
            }
        }
    }
    return path;
});
exports.dijkstartSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(">>Debug: dikstrta");
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    let isPathExists = false;
    //set distance from start node to start node to 0
    let startNode = graph.nodes[src.i][src.j];
    startNode.distanceFromStart = 0;
    //set distance from start node for all nodes (except start node) to Infitinty
    // nodes.filter((n) => !Coords.areEquals(n.coords, src)).forEach((node) => (node.distanceFromStart = Infinity))
    for (let i = 0; i < graph.numberOfRows; i++) {
        for (let j = 0; j < graph.numberOfColumns; j++) {
            if (!utils_1.Coords.areEquals(src, graph.nodes[i][j].coords))
                graph.nodes[i][j].distanceFromStart = Infinity;
        }
    }
    let numberOfBlockedNodes = graph.blockedNodesCoords.length;
    let numberOfUnvisitedNodes = graph.numberOfRows * graph.numberOfColumns - numberOfBlockedNodes;
    while (numberOfUnvisitedNodes) {
        //select unvisited node with smallest path to start
        const unvisitedNodes = [];
        for (let i = 0; i < graph.numberOfRows; i++) {
            for (let j = 0; j < graph.numberOfColumns; j++) {
                if (!graph.nodes[i][j].isVisited && !graph.nodes[i][j].isBlocked)
                    unvisitedNodes.push(graph.nodes[i][j]);
            }
        }
        unvisitedNodes.sort((n1, n2) => n1.distanceFromStart - n2.distanceFromStart);
        const currentNode = unvisitedNodes[0];
        if (currentNode.distanceFromStart === Infinity)
            break; //no path
        for (let neighbor of currentNode.neighbors) {
            if (!neighbor.isVisited && !neighbor.isBlocked) {
                //calculate new distance from start node to this neighbor node, if it is small than the old dist, update
                //new distance = (from currNode to neighbor) + (from currNode to start)
                const newDistFromStart = 1 + currentNode.distanceFromStart;
                if (newDistFromStart < neighbor.distanceFromStart) {
                    neighbor.distanceFromStart = newDistFromStart;
                    neighbor.parent = currentNode;
                }
            }
        }
        currentNode.isVisited = true;
        numberOfUnvisitedNodes--;
        if (!utils_1.Coords.areEquals(currentNode.coords, src) && !utils_1.Coords.areEquals(currentNode.coords, dest) && withAnimation) {
            yield utils_1.drawSearchingAnimation(currentNode.coords);
        }
        if (utils_1.Coords.areEquals(currentNode.coords, dest)) {
            isPathExists = true;
            break;
        }
    }
    let path = [];
    if (isPathExists) {
        const endNode = graph.nodes[dest.i][dest.j];
        let tmp = endNode;
        while (tmp) {
            path.unshift(tmp.coords);
            tmp = tmp.parent;
        }
    }
    return path;
});
exports.bellmanFordSearch = (src, dest, graph, withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(">>debug: bellman ford");
    if (!utils_1.Coords.isCoordsInGrid(src, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("source coordinates are not in the grid");
    }
    if (!utils_1.Coords.isCoordsInGrid(dest, graph.numberOfRows, graph.numberOfColumns)) {
        throw new Error("destination coordinates are not in the grid");
    }
    const startNode = graph.nodes[src.i][src.j];
    startNode.distanceFromStart = 0;
    for (let i = 0; i < graph.numberOfRows; i++) {
        for (let j = 0; j < graph.numberOfColumns; j++) {
            if (!utils_1.Coords.areEquals(src, graph.nodes[i][j].coords))
                graph.nodes[i][j].distanceFromStart = Infinity;
        }
    }
    //we will repeat the process (numberOfNodes - 1) times
    for (let k = 0; k < graph.numberOfRows * graph.numberOfColumns - graph.blockedNodesCoords.length - 1; k++) {
        for (let i = 0; i < graph.numberOfRows; i++) {
            for (let j = 0; j < graph.numberOfColumns; j++) {
                const currentNode = graph.nodes[i][j];
                if (!currentNode.isBlocked) {
                    //We will not draw the animation until tha last iteration of process of the algorithm
                    if (k === graph.numberOfRows * graph.numberOfColumns - graph.blockedNodesCoords.length - 1 - 1 &&
                        !utils_1.Coords.areEquals(currentNode.coords, src) &&
                        !utils_1.Coords.areEquals(currentNode.coords, dest) &&
                        withAnimation) {
                        yield utils_1.drawSearchingAnimation(currentNode.coords);
                    }
                    for (let neighbor of currentNode.neighbors) {
                        if (!neighbor.isBlocked) {
                            const newDistanceFromStart = 1 + currentNode.distanceFromStart;
                            if (newDistanceFromStart < neighbor.distanceFromStart) {
                                neighbor.distanceFromStart = newDistanceFromStart;
                                neighbor.parent = currentNode;
                            }
                        }
                    }
                }
            }
        }
    }
    const endNode = graph.nodes[dest.i][dest.j];
    let path = [];
    let tmp = endNode;
    while (tmp) {
        path.unshift(tmp.coords);
        tmp = tmp.parent;
    }
    if (!utils_1.Coords.areEquals(path[0], src) || !utils_1.Coords.areEquals(path[path.length - 1], dest))
        path = []; //no path
    return path;
});

},{"./utils":3}],2:[function(require,module,exports){
"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const algorithms_1 = require("./algorithms");
let firstTimeVisualization = true;
const GRID_NUM_ROWS = 25;
const GRID_NUM_COLUMNS = 50;
let algorithm = "";
let graph = new utils_1.Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS);
let isStartNodeSelected = false; //is the start node selected? we know it?
let isEndNodeSelected = false;
let startNodeCoords = null;
let endNodeCoords = null;
const table = document.querySelector("table");
//build the grid
const buildGrid = () => {
    table.innerHTML = "";
    table.style.backgroundColor = utils_1.GRID_BG_COLOR;
    for (let i = 0; i < graph.numberOfRows; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < graph.numberOfColumns; j++) {
            tr.innerHTML += `<td id="${i},${j}" style="border-color:${utils_1.CELLS_BORDER_COLOR};"></td>`;
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
const visualize = (withAnimation = true) => __awaiter(void 0, void 0, void 0, function* () {
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
                    if (htmlNode.style.backgroundColor === utils_1.PATH_CELLS_BG_COLOR)
                        htmlNode.style.backgroundColor = utils_1.GRID_BG_COLOR;
                    if (htmlNode.style.backgroundColor === utils_1.SEARCHING_BG_COLOR)
                        htmlNode.style.backgroundColor = utils_1.GRID_BG_COLOR;
                }
            }
        }
        let path = null;
        if (algorithm === "dijkstrat") {
            path = yield algorithms_1.dijkstartSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        else if (algorithm === "bellman-ford") {
            path = yield algorithms_1.bellmanFordSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        else if (algorithm === "bfs") {
            path = yield algorithms_1.bfsSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        else if (algorithm === "dfs") {
            path = yield algorithms_1.dfsSearch(startNodeCoords, endNodeCoords, graph, withAnimation);
        }
        console.log("after");
        if (path.length === 0) {
            console.log("cannot go to destination, no path");
            alert("cannot go to dest, no path");
        }
        else {
            const sleepTime = withAnimation ? 50 : 0;
            for (let coords of path) {
                const node = document.getElementById(utils_1.Coords.getStrFromCoords(coords));
                node.style.backgroundColor = utils_1.PATH_CELLS_BG_COLOR;
                yield utils_1.sleep(sleepTime);
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
    graph = new utils_1.Graph(GRID_NUM_ROWS, GRID_NUM_COLUMNS);
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
            target.style.backgroundColor = utils_1.START_CELL_BG_COLOR;
            target.innerHTML = `
				<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`;
            isStartNodeSelected = true;
            startNodeCoords = utils_1.Coords.getCoordsFromStr(target.id);
        }
        else {
            //if we clicked on a image
            if (target.tagName === "IMG") {
                const imgParent = target.parentElement; //td
                // if it is the start node img
                if (utils_1.Coords.areEquals(utils_1.Coords.getCoordsFromStr(imgParent.id), startNodeCoords)) {
                    imgParent.innerHTML = "";
                    imgParent.style.backgroundColor = utils_1.GRID_BG_COLOR;
                    isStartNodeSelected = false;
                    startNodeCoords = null;
                }
            }
            else {
                //we clicked on the start node cell => remove it
                if (utils_1.Coords.areEquals(utils_1.Coords.getCoordsFromStr(target.id), startNodeCoords)) {
                    target.innerHTML = "";
                    target.style.backgroundColor = utils_1.GRID_BG_COLOR;
                    isStartNodeSelected = false;
                    startNodeCoords = null;
                }
                else {
                    //put the start node on the clicked option only if the latter is not the end node cell
                    if (!isEndNodeSelected || (isEndNodeSelected && !utils_1.Coords.areEquals(endNodeCoords, utils_1.Coords.getCoordsFromStr(target.id)))) {
                        const oldStartNode = document.getElementById(utils_1.Coords.getStrFromCoords(startNodeCoords));
                        oldStartNode.style.backgroundColor = utils_1.GRID_BG_COLOR;
                        oldStartNode.innerHTML = "";
                        target.style.backgroundColor = utils_1.START_CELL_BG_COLOR;
                        target.innerHTML = `
							<img src="static/images/start-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`;
                        startNodeCoords = utils_1.Coords.getCoordsFromStr(target.id);
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
            target.style.backgroundColor = utils_1.END_CELL_BG_COLOR;
            target.innerHTML = `
				<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
			`;
            isEndNodeSelected = true;
            endNodeCoords = utils_1.Coords.getCoordsFromStr(target.id);
        }
        else {
            //if we clicked on a image
            if (target.tagName === "IMG") {
                const imgParent = target.parentElement; //td
                // if it is the end node img
                if (utils_1.Coords.areEquals(utils_1.Coords.getCoordsFromStr(imgParent.id), endNodeCoords)) {
                    imgParent.innerHTML = "";
                    imgParent.style.backgroundColor = utils_1.GRID_BG_COLOR;
                    isEndNodeSelected = false;
                    endNodeCoords = null;
                }
            }
            else {
                if (utils_1.Coords.areEquals(utils_1.Coords.getCoordsFromStr(target.id), endNodeCoords)) {
                    target.innerHTML = "";
                    target.style.backgroundColor = utils_1.GRID_BG_COLOR;
                    isEndNodeSelected = false;
                    endNodeCoords = null;
                }
                else {
                    //put the end node in the selected target only if the latter is not a start cell
                    if (!isStartNodeSelected || (isStartNodeSelected && !utils_1.Coords.areEquals(startNodeCoords, utils_1.Coords.getCoordsFromStr(target.id)))) {
                        const oldEndNode = document.getElementById(utils_1.Coords.getStrFromCoords(endNodeCoords));
                        oldEndNode.style.backgroundColor = utils_1.GRID_BG_COLOR;
                        oldEndNode.innerHTML = "";
                        target.style.backgroundColor = utils_1.END_CELL_BG_COLOR;
                        target.innerHTML = `
							<img src="static/images/finish-16.png" style="display:block; margin-left: auto; margin-right: auto; margin-top: 3px;"></img>
							`;
                        endNodeCoords = utils_1.Coords.getCoordsFromStr(target.id);
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
            (!isStartNodeSelected || (isStartNodeSelected && !utils_1.Coords.areEquals(utils_1.Coords.getCoordsFromStr(target.id), startNodeCoords))) &&
            (!isEndNodeSelected || (isEndNodeSelected && !utils_1.Coords.areEquals(utils_1.Coords.getCoordsFromStr(target.id), endNodeCoords)))) {
            const coords = utils_1.Coords.getCoordsFromStr(target.id);
            if (target.style.backgroundColor === utils_1.GRID_BG_COLOR || target.style.backgroundColor.length === 0) {
                target.style.backgroundColor = utils_1.BLOCKED_CELLS_BG_COLOR;
                graph.nodes[coords.i][coords.j].isBlocked = true;
                graph.blockedNodesCoords.push(utils_1.Coords.getCoordsFromStr(target.id));
            }
            else if (target.style.backgroundColor === utils_1.BLOCKED_CELLS_BG_COLOR) {
                target.style.backgroundColor = utils_1.GRID_BG_COLOR;
                //this node was red and now its white =>
                //mark it as unblocked in the graph
                graph.nodes[coords.i][coords.j].isBlocked = false;
                //and remove it from graph.blockedNodesCoords array
                const index = graph.blockedNodesCoords.findIndex((c) => utils_1.Coords.areEquals(c, coords));
                graph.blockedNodesCoords.splice(index, 1);
            }
        }
    }
});

},{"./algorithms":1,"./utils":3}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSearchingAnimation = exports.sleep = exports.Graph = exports.Node = exports.Coords = exports.BLOCKED_CELLS_BG_COLOR = exports.END_CELL_BG_COLOR = exports.START_CELL_BG_COLOR = exports.PATH_CELLS_BG_COLOR = exports.SEARCHING_BG_COLOR = exports.GRID_BG_COLOR = exports.CELLS_BORDER_COLOR = void 0;
//html td elements border color
exports.CELLS_BORDER_COLOR = "rgb(162, 182, 180)"; //#a2b6b4
exports.GRID_BG_COLOR = "rgb(233, 236, 239)"; //"#e9ecef"
exports.SEARCHING_BG_COLOR = "rgb(9, 40, 71)"; //#092847
exports.PATH_CELLS_BG_COLOR = "orange";
exports.START_CELL_BG_COLOR = "blue";
exports.END_CELL_BG_COLOR = "green";
exports.BLOCKED_CELLS_BG_COLOR = "red";
class Coords {
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
exports.Coords = Coords;
class Node {
    constructor(i, j) {
        // this.coords = { i, j };
        this.coords = new Coords(i, j);
        this.neighbors = [];
        this.parent = null;
        this.isVisited = false;
        this.isBlocked = false;
    }
}
exports.Node = Node;
class Graph {
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
exports.Graph = Graph;
Graph.directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
];
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
exports.drawSearchingAnimation = (coords) => __awaiter(void 0, void 0, void 0, function* () {
    const cell = document.getElementById(Coords.getStrFromCoords(coords));
    cell.style.backgroundColor = exports.SEARCHING_BG_COLOR;
    yield sleep(30);
});

},{}]},{},[2]);

},{"./algorithms":1,"./utils":3}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawSearchingAnimation = exports.sleep = exports.Graph = exports.Node = exports.Coords = exports.BLOCKED_CELLS_BG_COLOR = exports.END_CELL_BG_COLOR = exports.START_CELL_BG_COLOR = exports.PATH_CELLS_BG_COLOR = exports.SEARCHING_BG_COLOR = exports.GRID_BG_COLOR = exports.CELLS_BORDER_COLOR = void 0;
//html td elements border color
exports.CELLS_BORDER_COLOR = "rgb(162, 182, 180)"; //#a2b6b4
exports.GRID_BG_COLOR = "rgb(233, 236, 239)"; //"#e9ecef"
exports.SEARCHING_BG_COLOR = "rgb(9, 40, 71)"; //#092847
exports.PATH_CELLS_BG_COLOR = "orange";
exports.START_CELL_BG_COLOR = "blue";
exports.END_CELL_BG_COLOR = "green";
exports.BLOCKED_CELLS_BG_COLOR = "red";
class Coords {
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
exports.Coords = Coords;
class Node {
    constructor(i, j) {
        // this.coords = { i, j };
        this.coords = new Coords(i, j);
        this.neighbors = [];
        this.parent = null;
        this.isVisited = false;
        this.isBlocked = false;
    }
}
exports.Node = Node;
class Graph {
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
exports.Graph = Graph;
Graph.directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
];
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.sleep = sleep;
exports.drawSearchingAnimation = (coords) => __awaiter(void 0, void 0, void 0, function* () {
    const cell = document.getElementById(Coords.getStrFromCoords(coords));
    cell.style.backgroundColor = exports.SEARCHING_BG_COLOR;
    yield sleep(30);
});

},{}]},{},[2]);
