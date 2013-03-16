/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var MineFieldGeneratorProto = {
	settings: {},
	cells: [],
	initCells: function() {
		for(var i = 0; i < this.nodesNum; i++) {
			var cellData = {
				type: MineFieldCellType.EMPTY,
				bombsNearCounter: 0,
				isOpen: false,
				index2d: null,
				index: null
			};
			this.cells.push(cellData);
		}
	},
	
	addBombs: function() {
		for(var i = 0; i < this.bombNum; i++) {
			this.cells[i].type = MineFieldCellType.BOMB;
		}
		this.cells = shuffleArray(this.cells);
	},
			
	shuffle: function() {
		this.cells = shuffleArray(this.cells);
	},
	
	setIndexes: function() {
		for(var i = 0; i < this.nodesNum; i++) {
			this.cells[i].index2d =  to2dIndex(i, this.cols);
			this.cells[i].index = i;
		}
	},
	
	generate: function(settings) {
		this.rows = settings.rows;
		this.cols = settings.cols;
		this.nodesNum = settings.rows * settings.cols;
		this.bombNum = settings.bombNum;
		this.bombNum = Math.min(this.bombNum, this.nodesNum);
		
		this.initCells();
		this.shuffle();
		this.addBombs();
		this.setIndexes();
		
		return this.cells;
	}
};

function MineFieldGenerator() {}
MineFieldGenerator.prototype = MineFieldGeneratorProto;

var MineFieldCellType = {
	EMPTY: 0,
	BOMB: 1,
	BOMB_COUNTER: 2
};

/*
 * Helpers
 */
function getFlatIndex(row, col, cols) {
	return row*cols + col;
}

function to2dIndex(flatIndex, cols) {
	var row = Math.floor(flatIndex/cols);
	var col = flatIndex - row*cols;
	//return [row, col];
	return {row: row, col: col};
}

function shuffleArray(arr) {
	var len = arr.length;
	var temp, dest;

	for(var i = 0; i < len; i++) {
		dest = Math.floor(Math.random() * (len - 1));
		temp = arr[i];
		arr[i] = arr[dest];
		arr[dest] = temp;
	}
	return arr;
}

/*
MineFieldCellType.BOMB = 0;
MineFieldCellType.BOMB_COUNTER = 1;
MineFieldCellType.EMPTY = 2;
 */


/*
function getIndex() {
	if(arguments.length == 1) {
		return faltIndex;
	}
	else if (arguments.length == 2) {
		return index2d;
	}
}

Or this way:

var cell = {
	type: ...,
	index: ...,
	index2d: ...
}


*/