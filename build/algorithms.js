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
