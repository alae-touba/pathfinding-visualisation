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
	reconstructPath,
	validateCoords
} from './utils.js';

export const dfsSearch = async (src: Coords, dest: Coords, graph: Graph, withAnimation = true): Promise<Coords[]> => {
	
	validateCoords(src, graph.numberOfRows, graph.numberOfColumns)
	validateCoords(dest, graph.numberOfRows, graph.numberOfColumns)

	let path: Coords[] = []

	const dfsRec = async (current: Coords) => {
		let currentNode = graph.nodes[current.i][current.j]

		if (currentNode && !currentNode.isVisited && !currentNode.isBlocked) {
			currentNode.isVisited = true

			if (!Coords.areEquals(current, src) && !Coords.areEquals(current, dest) && withAnimation) {
				await drawSearchingAnimation(currentNode.coords)
			}

			if (Coords.areEquals(current, dest)) {
				return reconstructPath(graph.nodes[dest.i][dest.j])
			} else {
				for (let neighbor of currentNode.neighbors) {
					if (!neighbor.isVisited && !neighbor.isBlocked) {
						neighbor.parent = currentNode
					}

					await dfsRec(neighbor.coords)
				}
			}
		}
	}

	await dfsRec(src)
	return path
}

export const bfsSearch = async (src: Coords, dest: Coords, graph: Graph, withAnimation = true): Promise<Coords[]> => {
	

	validateCoords(src, graph.numberOfRows, graph.numberOfColumns)
	validateCoords(dest, graph.numberOfRows, graph.numberOfColumns)

	const queue: Node[] = []
	const startNode = graph.nodes[src.i][src.j]

	queue.push(startNode)

	let path: Coords[] = []

	while (queue.length) {
		const currentNode = queue.shift()
		if (!currentNode.isVisited && !currentNode.isBlocked) {
			currentNode.isVisited = true

			if (Coords.areEquals(currentNode.coords, dest)) {
				return reconstructPath(currentNode)
			} else {
				//process node
				if (!Coords.areEquals(currentNode.coords, src) && withAnimation) {
					await drawSearchingAnimation(currentNode.coords)
				}
				for (let i = 0; i < currentNode.neighbors.length; i++) {
					const neighbor = currentNode.neighbors[i]

					if (!neighbor.isVisited && !neighbor.isBlocked) {
						neighbor.parent = currentNode
					}
					queue.push(neighbor)
				}
			}
		}
	}

	return path
}

export const dijkstraSearch = async (src: Coords, dest: Coords, graph: Graph, withAnimation = true): Promise<Coords[]> => {
	

	validateCoords(src, graph.numberOfRows, graph.numberOfColumns)
	validateCoords(dest, graph.numberOfRows, graph.numberOfColumns)

	let isPathExists = false

	//set distance from start node to start node to 0
	let startNode = graph.nodes[src.i][src.j]
	startNode.distanceFromStart = 0

	//set distance from start node for all nodes (except start node) to Infitinty
	// nodes.filter((n) => !Coords.areEquals(n.coords, src)).forEach((node) => (node.distanceFromStart = Infinity))
	for (let i = 0; i < graph.numberOfRows; i++) {
		for (let j = 0; j < graph.numberOfColumns; j++) {
			if (!Coords.areEquals(src, graph.nodes[i][j].coords)) graph.nodes[i][j].distanceFromStart = Infinity
		}
	}

	let numberOfBlockedNodes = graph.blockedNodesCoords.length
	let numberOfUnvisitedNodes = graph.numberOfRows * graph.numberOfColumns - numberOfBlockedNodes

	while (numberOfUnvisitedNodes) {
		//select unvisited node with smallest path to start
		const unvisitedNodes: Node[] = []
		for (let i = 0; i < graph.numberOfRows; i++) {
			for (let j = 0; j < graph.numberOfColumns; j++) {
				if (!graph.nodes[i][j].isVisited && !graph.nodes[i][j].isBlocked) unvisitedNodes.push(graph.nodes[i][j])
			}
		}
		unvisitedNodes.sort((n1, n2) => n1.distanceFromStart - n2.distanceFromStart)
		const currentNode = unvisitedNodes[0]

		if (currentNode.distanceFromStart === Infinity) break //no path

		for (let neighbor of currentNode.neighbors) {
			if (!neighbor.isVisited && !neighbor.isBlocked) {
				//calculate new distance from start node to this neighbor node, if it is small than the old dist, update
				//new distance = (from currNode to neighbor) + (from currNode to start)
				const newDistFromStart = 1 + currentNode.distanceFromStart
				if (newDistFromStart < neighbor.distanceFromStart) {
					neighbor.distanceFromStart = newDistFromStart
					neighbor.parent = currentNode
				}
			}
		}

		currentNode.isVisited = true
		numberOfUnvisitedNodes--

		if (!Coords.areEquals(currentNode.coords, src) && !Coords.areEquals(currentNode.coords, dest) && withAnimation) {
			await drawSearchingAnimation(currentNode.coords)
		}

		if (Coords.areEquals(currentNode.coords, dest)) {
			isPathExists = true
			break
		}
	}

	let path: Coords[] = []

	if (isPathExists) {
		return reconstructPath(graph.nodes[dest.i][dest.j])
	}
	return []
}

export const bellmanFordSearch = async (src: Coords, dest: Coords, graph: Graph, withAnimation = true): Promise<Coords[]> => {
	

	validateCoords(src, graph.numberOfRows, graph.numberOfColumns)
	validateCoords(dest, graph.numberOfRows, graph.numberOfColumns)

	const startNode = graph.nodes[src.i][src.j]
	startNode.distanceFromStart = 0

	for (let i = 0; i < graph.numberOfRows; i++) {
		for (let j = 0; j < graph.numberOfColumns; j++) {
			if (!Coords.areEquals(src, graph.nodes[i][j].coords)) graph.nodes[i][j].distanceFromStart = Infinity
		}
	}

	//we will repeat the process (numberOfNodes - 1) times
	for (let k = 0; k < graph.numberOfRows * graph.numberOfColumns - graph.blockedNodesCoords.length - 1; k++) {
		for (let i = 0; i < graph.numberOfRows; i++) {
			for (let j = 0; j < graph.numberOfColumns; j++) {
				const currentNode = graph.nodes[i][j]

				if (!currentNode.isBlocked) {
					//We will not draw the animation until tha last iteration of process of the algorithm
					if (
						k === graph.numberOfRows * graph.numberOfColumns - graph.blockedNodesCoords.length - 1 - 1 &&
						!Coords.areEquals(currentNode.coords, src) &&
						!Coords.areEquals(currentNode.coords, dest) &&
						withAnimation
					) {
						await drawSearchingAnimation(currentNode.coords)
					}
					for (let neighbor of currentNode.neighbors) {
						if (!neighbor.isBlocked) {
							const newDistanceFromStart = 1 + currentNode.distanceFromStart
							if (newDistanceFromStart < neighbor.distanceFromStart) {
								neighbor.distanceFromStart = newDistanceFromStart
								neighbor.parent = currentNode
							}
						}
					}
				}
			}
		}
	}


	const path = reconstructPath(graph.nodes[dest.i][dest.j])

	if (!Coords.areEquals(path[0], src) || !Coords.areEquals(path[path.length - 1], dest)) path = [] //no path

	return path
}
