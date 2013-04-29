function AchtungMinenGame(settings) {
	var rows = settings.rows;
	var cols = settings.cols;
	var nodes = rows*cols;
	var bombs = settings.bombs;
	
	var cellList = [];
	var neighborhoodGraph = [];			//Neighborhood graph. Neighbors are free from bombs cells.
	
	generateField();
	initNeighbors();
	initBombCounters();
	initNeighborhoodGraph();
	
	function generateField() {
		var generator = new MineFieldGenerator();
		cellList = generator.generate({
			bombNum: bombs,
			rows: rows,
			cols: cols
		});
	}
	
	function initNeighborhoodGraph() {
		for(var i = 0; i < nodes; i++) {
			var nb = cellList[i].nb;
			var nbLen = nb.length;
			neighborhoodGraph[i] = [];
			
			for(var j = 0; j < nbLen; j++) {
				if(nb[j].type === MineFieldCellType.BOMB) {
					continue;
				}
				
				neighborhoodGraph[i].push(nb[j].index);
			}
		}
	}
	
		
	function initNeighbors() {
		for(var i = 0; i < nodes; i++) {
			var nb = getNeighbors(cellList[i]);
			var nbLen = nb.length;
			
			cellList[i].nb = [];
			for(var j = 0; j < nbLen; j++) {
				cellList[i].nb.push(nb[j].index);
			}
		}
	}
	
	function initBombCounters() {
		for(var i = 0; i < nodes; i++) {
			if(cellList[i].type === MineFieldCellType.BOMB)
				initBombCountersAround(cellList[i]);
		}
	}
	
	function initBombCountersAround(bombCellData) {
		var nb = getNeighbors(bombCellData);
		var len = nb.length;
		
		for(var i = 0; i < len; i++) {
			var curNb = nb[i];
			
			if(curNb.type === MineFieldCellType.BOMB) {
				continue;
			}
			
			if(curNb.type === MineFieldCellType.BOMB_COUNTER) {
				curNb.bombsNearCounter += 1;
			} else if(curNb.type === MineFieldCellType.EMPTY) {
				curNb.type = MineFieldCellType.BOMB_COUNTER;
				curNb.bombsNearCounter = 1;
			}
		}
	}
	
	function getNeighbors(cell) {
		var row = cell.index2d.row;
		var col = cell.index2d.col;
		
		var minRowIndex = Math.max(0, row-1);
		var maxRowIndex = Math.min(rows-1, row+1);
		
		var minColIndex = Math.max(0, col-1);
		var maxColIndex = Math.min(cols-1, col+1);
		
		var res = [];
		
		for(var i = minRowIndex; i <= maxRowIndex; i++) {
			for(var j = minColIndex; j <= maxColIndex; j++) {
				var index = getFlatIndex(i, j, cols);
				
				if(cellList[index] !== cell)
					res.push(cellList[index]);
			}
		}
		
		return res;
	}
	
	function haveCommonEdges(cellA, cellB) {
		//Vertical neighborhood
		var indexAbsDiff = Math.abs(cellA.index - cellB.index);
		
		//Vertical neighborhood
		if(indexAbsDiff === cols) {
			return true;
		}
		
		//Horizontal neighborhood
		if(indexAbsDiff === 1 && cellA.index2d.row === cellB.index2d.row) {
			return true;
		}
		
		return false;
	}
	
	/*
	 * Uses breadth-first search
	 */
	function openFreeAreaAroundCell(cell) {
		var q = [];	//queue
		var visited = [];
		var opened = [];
		
		q.push(cell.index);
		visited[cell.index] = true;
		
		while (q.length > 0) {
			var v = q.pop();
			
			//for (var i = 0; i < neighborhoodGraph[v].length; i++) {
			for (var i = 0; i < cellList[v].nb.length; i++) {
				//var to = neighborhoodGraph[v][i];
				var to = cellList[v].nb[i];
				if (!visited[to]) {
					var curCell = cellList[to];
					
					/*if(curCell.type === MineFieldCellType.EMPTY) {
						if(!haveCommonEdges(cellList[v], curCell)) {
							continue;
						}
					}*/
					
					visited[to] = true;
					if(curCell.type === MineFieldCellType.BOMB) {
						continue;
					}
					
					/*
					 * Avoid counting already open cells
					 */
					if(curCell.isOpen !== true) {
						opened.push(curCell);
					}
					curCell.isOpen = true;
					
					if(curCell.type === MineFieldCellType.BOMB_COUNTER) {
						continue;
					}
					q.push(to);
				}
			}
		}
		
		return opened;
	}
   
   function tryOpenCell(cell) {
		var opened = [];
		cell.isOpen = true;
		
		if(cell.type === MineFieldCellType.EMPTY) {
			opened = openFreeAreaAroundCell(cell);
		}
		
		opened.push(cell);
		return opened;
	}
   
   return {
	   getMineField: function(){return cellList;},
	   tryOpenCell: tryOpenCell
   };
}