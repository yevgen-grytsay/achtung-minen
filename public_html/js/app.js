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
	printTable2();
	
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
			//var nb = getNeighbors(cellList[i]);
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
	
	function getNeighbors(cellData) {
		var row = cellData.index[0];
		var col = cellData.index[1];
		
		var minRowIndex = Math.max(0, row-1);
		var maxRowIndex = Math.min(rows-1, row+1);
		
		var minColIndex = Math.max(0, col-1);
		var maxColIndex = Math.min(cols-1, col+1);
		
		var res = [];
		
		for(var i = minRowIndex; i <= maxRowIndex; i++) {
			for(var j = minColIndex; j <= maxColIndex; j++) {
				var index = getFlatIndex(i, j);
				
				if(cellList[index] !== cellData)
					res.push(cellList[index]);
			}
		}
		
		return res;
	}
	/*
	function printTable() {
		var html = '<table border="1">';
		
		for(var i = 0; i < rows; i++) {
			html += '<tr>';
			for(var j = 0; j < cols; j++) {
				var index = getFlatIndex(i, j);
				
				html += '<td>';
				html += getHtmlForCell(cellList[index]);
				html += '</td>';
				//if(cellList[i].type == CELL_TYPE_BOMB)
				//initBombCountersAround(cellList[i]);
			}
			html += '</tr>';
		}
		html += '</table>';
		
		document.write(html);
	}
	
	function printTable2() {
		var table = document.createElement('TABLE');
		var tBody = document.createElement('TBODY');
		var tr, td, index;
		
		table.border = 1;
		
		for(var i = 0; i < rows; i++) {
			tr = document.createElement('TR');
			for(var j = 0; j < cols; j++) {
				index = getFlatIndex(i, j);
				td = document.createElement('TD');
				//td.innerHTML = getHtmlForCell(cellList[index]);
				cellList[index].content = getHtmlForCell(cellList[index]);
				td.innerHTML = '&nbsp;';
				
				//td.innerHTML = cellList[index].content;
				
				initCellHandlers(td, cellList[index]);
				tr.appendChild(td);
			}
			tBody.appendChild(tr);
		}
		table.appendChild(tBody);
		
		container.appendChild(table);
	}
	
	function initCellHandlers(cell, cellData) {
		cell.data = cellData;
		cell.data.htmlObj = cell;
		cell.onclick = function() {
			tryOpenCell(this);
		};
	}
	*/
	
	
	
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
			
			for (var i = 0; i < neighborhoodGraph[v].length; i++) {
				var to = neighborhoodGraph[v][i];
				if (!visited[to]) {
					visited[to] = true;
					
					var cellData = cellList[to];
					
					if(cellData.type === MineFieldCellType.BOMB) {
						continue;
					}
					
					cellData.isOpen = true;
					opened.push(cellData);
					q.push(to);
				}
			}
		}
		
		return opened;
	}
	/*
	function getHtmlForCell(cellData) {
		var html = '';
		
		switch(cellData.type) {
			case CELL_TYPE_BOMB:
				html = 'X';
				break;
			case CELL_TYPE_CLEAR:
				html = '&nbsp;';
				break;
			case CELL_TYPE_BOMB_COUNTER:
				html = cellData.bombsNearCounter;
				break;
			default:
				html = '';
				break;
		}
		
		return html;
	}
	*/
   
   function tryOpenCell(cell) {
		var opened = [];
		cell.isOpen = true;
		
		if(cell.type === MineFieldCellType.EMPTY) {
			opened = openFreeArea(cell);
		}
		
		opened.push(cell);
		return opened;
	}
   
   return {
	   getMineField: function(){return cellList;},
	   tryOpenCell: tryOpenCell
   };
}