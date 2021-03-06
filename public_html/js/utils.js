/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var MineFieldCellType = {
	EMPTY: 0,
	BOMB: 1,
	BOMB_COUNTER: 2
};

var cellPrototype = {
	/*type: MineFieldCellType.EMPTY,
	bombsNearCounter: 0,
	isOpen: false,
	isChecked: false,
	index2d: null,
	index: null,*/
	isBomb: function() {
		return this.type === MineFieldCellType.BOMB;
	},
	isEmpty: function() {
		return this.type === MineFieldCellType.EMPTY;
	}
};
function Cell() {
	this.type = MineFieldCellType.EMPTY;
	this.bombsNearCounter = 0;
	this.isOpen = false;
	this.isChecked = false;
	this.index2d = null;
	this.index = null;
}
Cell.prototype = cellPrototype;

var MineFieldGeneratorProto = {
	settings: {},
	cells: [],
	initCells: function() {
		for(var i = 0; i < this.nodesNum; i++) {
			this.cells.push(new Cell());
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