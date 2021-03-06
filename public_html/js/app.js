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
				if(nb[j].isBomb()) {
					continue;
				}
				
				neighborhoodGraph[i].push(nb[j].index);
			}
		}
	}
	
		
	function initNeighbors() {
		for(var i = 0; i < nodes; i++) {
			var nb = getNeighbors(cellList[i]);
			//var nbLen = nb.length;

			cellList[i].nb = nb;
			/*cellList[i].nb = [];
			for(var j = 0; j < nbLen; j++) {
				cellList[i].nb.push(nb[j].index);
			}*/
		}
	}
	
	function initBombCounters() {
		for(var i = 0; i < nodes; i++) {
			if(cellList[i].isBomb()) {
				initBombCountersAround(cellList[i]);
			}
		}
	}
	
	function initBombCountersAround(bombCellData) {
		var nb = getNeighbors(bombCellData);
		var len = nb.length;
		
		for(var i = 0; i < len; i++) {
			var curNb = nb[i];
			
			if(curNb.isBomb()) {
				continue;
			}
			
			if(curNb.type === MineFieldCellType.BOMB_COUNTER) {
				curNb.bombsNearCounter += 1;
			} else if(curNb.isEmpty()) {
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
		var curCell;
		var to;
		var q = [];	//queue
		var visited = [];
		var opened = [];
		
		q.push(cell.index);
		visited[cell.index] = true;
		
		while (q.length > 0) {
			var v = q.pop();

			for (var i = 0; i < cellList[v].nb.length; i++) {
				to = cellList[v].nb[i].index;
				if (!visited[to]) {
					curCell = cellList[to];

					visited[to] = true;
					if(curCell.isBomb() || curCell.isChecked) {
						continue;
					}

					if(!curCell.isOpen) {
						opened.push(curCell);
					}
					curCell.isOpen = true;

					/*
					 * We don't add BOMB_COUNTER cell to queue because we don't need
					 * to visit its neighbors.
					 */
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
	   	if(cell.isChecked) {
			return opened;
		}

		cell.isOpen = true;
		if(cell.isEmpty()) {
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