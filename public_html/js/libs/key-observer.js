/**
 * Created with JetBrains PhpStorm.
 * User: Eugene
 * E-mail: yevgen_grytsay@mail.ru
 * Date: 03.05.13
 * Time: 14:55
 * To change this template use File | Settings | File Templates.
 */

(function() {
	var codes = {
		CTRL: 17,
		ENTER: 13,
		SHIFT: 16
	};

	var keyDownPool = [];

	function addToPool(code) {
		if($.inArray(code, keyDownPool) === -1) {
			keyDownPool.push(code);
		}
	}

	function removeFromPool(code) {
		var index = $.inArray(code, keyDownPool);

		if(index === -1) {
			return false;
		}

		var arrLeft = keyDownPool.slice(0, index);
		var arrRight = keyDownPool.slice(index + 1);

		keyDownPool = arrLeft.concat(arrRight);
	}

	$(document.body).keydown(function(event) {
		addToPool(event.keyCode);
		//console.log(keyDownPool);
	});

	$(document.body).keyup(function(event) {
		removeFromPool(event.keyCode);
		//console.log(keyDownPool);
	});

	function isDown(code) {
		return $.inArray(code, keyDownPool) !== -1;
	}

	window.keyObserver = {
		codes: codes,
		isDown: isDown
	};
})();