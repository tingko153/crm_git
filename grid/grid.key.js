function KEY() {
	this.isModify = false;
	this.isShift = false;
	this.isCtrl = false;
	// this.isCopy = false;
	this.xn = null;
	this.yn = null;
	this.stXNum = 0;
	this.stYNum = 0;
	this.localStorageCnt = 0;

	this.init();

	gridk_this = this;

	return gridk_this;
}
var arrCopy = [];
var txtClipboardData;

KEY.prototype = {
	init: function() {
		document.addEventListener('keydown', this.keydown);
		document.addEventListener('copy', this.fncCopy);
		document.addEventListener('paste', this.fncPaste);
		document.addEventListener('keyup', this.keyup);
	},
	keydown: function(e) {
		// console.log(lastDownTarget)
		if( lastDownTarget === cvs ) {
			var n = (grid.eventConfig.prevObj.length-1 < 0 ) ? 0 : grid.eventConfig.prevObj.length - 1;
			// console.log('keydown: ' + e.keyCode);
			if( !key.isShift && grid.eventConfig.prevObj.length !== 0) {
				key.xn = grid.eventConfig.prevObj[n].xn;
				key.yn = grid.eventConfig.prevObj[n].yn;
			}

			switch(e.keyCode) {
				case 16: 	// shift
					if( grid.eventConfig.prevObj.length === 1 && !grid.eventConfig.isSelected) {
						key.stXNum = key.xn;
						key.stYNum = key.yn;
					}
					break;
				case 32: 	// spacebar
					if(isOpenMultiSelect) {
						selectMultiModify(gd_data.getElementsByTagName('select')[0]);
					}
					break;
				case 46: 	// delete
					key.dataDelete();
					break;
			}

			key.dataModify(e);	// modify
			if(!isWidget) {
				if(e.keyCode == 90 && e.ctrlKey) key.undo(); 	// undo
				if(e.keyCode == 89 && e.ctrlKey) key.redo(); 	// redo
				key.pageFlip(e);	// pageup/pagedown
				if(!key.isModify) key.selectMove(e);	// selected
				if(e.shiftKey) { key.isShift = true; }
				if(e.ctrlKey) { key.isCtrl = true; }
			}else {		// widget key
				var yn = grid.eventConfig.arrHistory[n].yn;

				if(e.keyCode == 38) {
					if(yn > 0) 	yn--;
					if( arrCell[yn][0].y < Math.abs(ctxTop)) {
						if( Math.abs(ctxTop) < tdHeight ) {
							ctxTop = 0;
						}else {
							ctxTop += tdHeight;
						}
					}
				}else if(e.keyCode == 40) {
					if(yn < dataCount-1) yn++;

					if( ctxTop > -(scrollbar.MAX_AREA_HEIGHT - canvas.height) && arrCell[yn][0].y > canvas.height + Math.abs(ctxTop) - tdHeight) {
						ctxTop -= tdHeight;
					}
				}

				widget.show('',arrCell[yn][0].account_id, yn);
				resetGrid(true, true, true, true);
				grid.eventConfig.arrHistory = [];
				for(var i=0; i<wLen; i++) {
					arrCell[yn][i].history = true;
					grid.eventConfig.arrHistory.push(arrCell[yn][i]);
				}
				MS_Y = scrollbar.setMsY(ctxTop);
				MS_X = scrollbar.setMsX(ctxLeft);
				scrollbar.reDraw();
				// widget.accSelector();
			}

			if(grid.eventConfig.isHistory) {		//이력
				var yn = grid.eventConfig.prevObj[n].yn;
				var xn = grid.eventConfig.prevObj[n].xn;
				if (arrCell[yn][xn].fieldName == 'description') {
					$('.historyLayer h2').html(_this.SQLdata[yn].account_name);
					$('.historyLayer .desc div').html(arrCell[yn][xn].text);
				}else {
					historyLayerClose();
				}
			}
		}
	},
	selectMove: function(e) {
		var header = document.getElementById('grid-moving');

		if(!e.shiftKey) {
			if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
				// console.log(grid.eventConfig.prevObj);
				for(var i=0; i<grid.eventConfig.prevObj.length; i++) {
					grid.eventConfig.prevObj[i].selected = false;
					grid.eventConfig.prevObj[i].copy = false;
				}
				grid.eventConfig.prevObj = [];
				arrCell[key.stYNum][key.stXNum].selected = false;
			}
		}

		switch(e.keyCode) {
			case 37: 	// left
				if(e.ctrlKey) {
					key.xn = 3;
					ctxLeft = 0;
					header.style.left = leftwidth + 'px';
				}else {
					if( key.xn < 4) {
						key.xn = 3;
						ctxLeft = 0;
					}else {
						key.xn--;
						while(arrCell[key.yn][key.xn].hide){
							key.xn--;
						}

						if( Math.abs(ctxLeft) !== 0 && arrCell[key.yn][key.xn].x < Math.abs(ctxLeft)+leftwidth) {
							ctxLeft = -arrCell[key.yn][key.xn].x+leftwidth;
						}
					}
				}
				break;
			case 38: 	// up
				if(e.ctrlKey) {
					key.yn = 0;
					ctxTop=0;
				}else {
					key.yn = ( key.yn < 1 ) ? 0 : key.yn-1;
					if( arrCell[key.yn][key.xn].y < Math.abs(ctxTop)) {
						if( Math.abs(ctxTop) < tdHeight ) {
							ctxTop = 0;
							key.yn = 0;
						}else {
							ctxTop += tdHeight;
						}
					}
				}
				break;
			case 39: 	// right
				if(e.ctrlKey) {
					key.xn = wLen-1;
					ctxLeft = -(scrollbar.MAX_AREA_WIDTH - (canvas.width - leftwidth));
					header.style.left = leftwidth + ctxLeft + 'px';
				}else {
					if( key.xn > wLen-2) {
						key.xn = wLen-1;
						ctxLeft = -(scrollbar.MAX_AREA_WIDTH - (canvas.width - leftwidth));
						header.style.left = leftwidth + ctxLeft + 'px';
					}else {
						key.xn++;
						while(arrCell[key.yn][key.xn].hide){
							key.xn++;
						}

						if(canvas.width < arrCell[key.yn][key.xn].x + arrCell[key.yn][key.xn].width) {
							ctxLeft = -(arrCell[key.yn][key.xn].x + arrCell[key.yn][key.xn].width - canvas.width + scrollbar.BTN_WH);
						}
					}
				}
				break;
			case 40: 	// down
				if(e.ctrlKey) {
					key.yn = dataCount-1;
					ctxTop = -(scrollbar.MAX_AREA_HEIGHT - canvas.height);
				}else {
					key.yn = ( key.yn > dataCount-2 ) ? dataCount-1 : key.yn+1;

					if( ctxTop > -(scrollbar.MAX_AREA_HEIGHT - canvas.height) && arrCell[key.yn][key.xn].y > canvas.height + Math.abs(ctxTop) - tdHeight) {
						ctxTop -= tdHeight;
					}
				}
				break;
		}

		if(e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 ) {
			grid.eventConfig.enBoxX = key.xn,
			grid.eventConfig.enBoxY = key.yn;

			if(e.shiftKey) {
				dragSelected(key.stXNum, key.stYNum, key.xn, key.yn);
			}else {
				grid.eventConfig.stBoxX = key.xn,
				grid.eventConfig.stBoxY = key.yn,

				arrCell[key.yn][key.xn].selected = true;
			}

			MS_Y = scrollbar.setMsY(ctxTop);
			MS_X = scrollbar.setMsX(ctxLeft);
			var n = (grid.eventConfig.prevObj.length-1 < 0 ) ? 0 : grid.eventConfig.prevObj.length-1;
			grid.eventConfig.prevObj[n] = arrCell[key.yn][key.xn];
			scrollbar.reDraw();
		}

	},
	pageFlip: function(e) {
		if(!key.isModify) {
			if(sc_vertical && e.keyCode === 33 || e.keyCode === 34) {
				var y;
				var o = grid.eventConfig.prevObj[0];
				o.selected = false;

				switch(e.keyCode) {
					case 33: 	// pageup
						ctxTop = ( ctxTop + canvas.height < 0 ) ? ctxTop + canvas.height : 0;
						y = ( o.yn - Math.floor(canvas.height/tdHeight) < 0 ) ? o.yn : o.yn - Math.floor(canvas.height/tdHeight);
						break;
					case 34: 	// pagedown
						ctxTop = ( ctxTop <= -(scrollbar.MAX_AREA_HEIGHT - canvas.height)) ? -(scrollbar.MAX_AREA_HEIGHT - canvas.height) : ctxTop - canvas.height;
						y = ( o.yn + Math.floor(canvas.height/tdHeight) > dataCount ) ? o.yn : o.yn + Math.floor(canvas.height/tdHeight);
						break;
				}

				MS_Y = scrollbar.setMsY(ctxTop);
				grid.eventConfig.prevObj[0] = arrCell[y][key.xn];
				grid.eventConfig.prevObj[0].selected = true;

				scrollbar.reDraw();
			}
		}
	},
	dataModify: function(e) {
		switch(e.keyCode) {
			case 13: 	// enter
				if(isWidget) {
					if($dataArea.find('.modifyBox').length > 0) dataModify();
				}else {
					inputModify();
				}
				break;
			case 27: 	// esc
				arrCopy = [];
				copyCancel();
				scrollbar.reDraw();
				inputCancel();
				break;
		}
	},
	fncCopy: function(e) {
		if( lastDownTarget === cvs && !key.isModify && grid.eventConfig.prevObj.length !== 0) {
			// console.log(grid.eventConfig.stBoxX, grid.eventConfig.stBoxY, grid.eventConfig.enBoxX, grid.eventConfig.enBoxY);
			e.preventDefault();
			var copy = '<table data-name="' + grid.eventConfig.prevObj[0].fieldName + '">';

			copyCancel();
			arrCopy = [];
			for(var i=grid.eventConfig.stBoxY; i<grid.eventConfig.enBoxY+1; i++) {
				copy += '<tr>';
				for(var j=grid.eventConfig.stBoxX; j<grid.eventConfig.enBoxX+1; j++) {
					if(!arrCell[i][j].hide) {
						var text = (arrCell[i][j].dataType === 'currency') ? format._currency(arrCell[i][j].text, 'symbol')+format._currency(arrCell[i][j].text, 'value') : arrCell[i][j].text;

						copy += '<td>' + text + '</td>';
						arrCell[i][j].copy = true;
						arrCopy.push(arrCell[i][j]);
					}
				}
				copy += '</tr>';
			}
			copy += '</table>';

			e.clipboardData.setData('text', copy);
			txtClipboardData = copy;
			scrollbar.reDraw();
		}
	},
	fncPaste: function(e) {
		console.log('[fn] paste');
		// console.log(txtClipboardData);
		if( arrCopy.length > 0) {
			var txt = (e === undefined) ? txtClipboardData : e.clipboardData.getData('text');
			var fieldName = txt.indexOf('data-name');
			fieldName = txt.substring(fieldName+11, txt.indexOf('">'));
			var s = txt.indexOf('<td>');
			var e = txt.indexOf('</td>');

			// console.log(grid.eventConfig.prevObj.length, arrCopy[0].text);

			if(arrCopy[0].fieldName == grid.eventConfig.prevObj[0].fieldName) {
				copyCancel();

				if(arrCopy.length > 1) {
					if(arrCopy[0].dataType != 'step') {
						for(var i=0; i<arrCopy.length; i++) {
							arrModifyText[i] = arrCopy[i].text;
						}
						// console.log(arrModifyText);
						dataUpdates('massupdate');
					}
				}else {
					var arr = arrCopy[0];
					arrModifyText = arr.text;
					dataUpdates();
				}
			}else {
				grid.eventConfig.prevObj[0].background = 'rgba(255, 0, 0, 1)';
				notCopy();
				copyCancel();
				scrollbar.reDraw();
			}
		}
	},
	undo: function(e) {
		if(gridk_this.localStorageCnt > 0) {
			gridk_this.localStorageCnt--;
			console.log('undo ::  ' + 'key'+(gridk_this.localStorageCnt));

			dataSave = false;
			grid.eventConfig.prevObj[0].selected = false;
			restoreData();


			if(gridk_this.localStorageCnt == 0) {
				$('.bts button:eq(0)').css('opacity', .2);
				gridk_this.localStorageCnt = 0;
				console.log('끗~☆');
			}
		}
		if(gridk_this.localStorageCnt < localStorage.length) {
			$('.bts button:eq(1)').css('opacity', 1);
		}
	},
	redo: function(e) {
		if(gridk_this.localStorageCnt < localStorage.length) {
			console.log('redo ::  ' + 'key'+(gridk_this.localStorageCnt));
			dataSave = false;
			grid.eventConfig.prevObj[0].selected = false;

			restoreData();
			gridk_this.localStorageCnt++;

			if( gridk_this.localStorageCnt == localStorage.length ) {
				gridk_this.localStorageCnt = localStorage.length;
				$('.bts button:eq(1)').css('opacity', .2);
				console.log('끗~☆');
			}else {
				$('.bts button:eq(0)').css('opacity', 1);
			}
		}
	},
	// findReplace:function(e) {
	// 	var findBox = document.getElementById('findSearch');
	// 	e.returnValue = false;

	// 	if(findBox === null) {
	// 		var html = document.createElement('div');
	// 		html.setAttribute('id', 'findSearch');
	// 		html.innerHTML = '찾&#160;&#160;&#160;기 : ' + '<input type="text" name="findTxt" onkeyup="searchReset();" /><br />';
	// 		html.innerHTML += '바꾸기 : ' + '<input type="text" name="replaceTxt" />';
	// 		html.innerHTML += '<div><button type="button" class="bt" onclick="search()">찾기</button> <button type="button" class="bt" onclick="replace()">바꾸기</button></div>';
	// 		html.innerHTML += '<a href="javascript:closeFindBox();" class="close">X</a>';

	// 		gd_data.appendChild(html);
	// 	}else {
	// 		findBox.style.display = 'block';
	// 	}

	// 	var findBox = document.getElementById('findSearch');
	// 	var findTxt = findBox.getElementsByTagName('input').findTxt;

	// 	findTxt.focus();
	// },
	keyup: function(e) {
		// console.log(e.keyCode);
		if(e.keyCode === 16) {
			grid.eventConfig.isSelected = false;
		}
		gridk_this.isShift = false;
		gridk_this.isCtrl = false;
	},
	dataDelete: function() {
		// console.log(grid.eventConfig.prevObj);
		arrModifyText = '';
		if(grid.eventConfig.prevObj.length > 1) {
			dataUpdates();
		}else {
			dataUpdate();
		}
	}
}

function restoreData() {
	var o = JSON.parse(localStorage.getItem('key'+gridk_this.localStorageCnt));

	if(o.length > 1) {
		for(var i=0; i<o.length; i++) {
			grid.eventConfig.prevObj[i] = arrCell[o[i].yn][o[i].xn];
			arrModifyText[i] = o[i].text;
		}
		dataUpdates('undo');
	}else {
		arrModifyText = o.text;
		dataUpdate(arrCell[o.yn][o.xn]);
		arrCell[o.yn][o.xn].selected = true;
		grid.eventConfig.prevObj[0] = arrCell[o.yn][o.xn];
	}

}

var _notCopy=1;
var notCopyClear;
function notCopy() {
	if(_notCopy > 0) {
		ctx.putImageData(imageData, 0, 0);
		grid.eventConfig.prevObj[0].background = 'rgba(255, 0, 0, ' + _notCopy + ')';
		notCopyClear = setTimeout(notCopy, 10);
		_notCopy -= .1;
	}else {
		var o = grid.eventConfig.prevObj[0];
		o.background = setBgColor(false, false, o.xn, o.yn);
		clearTimeout(notCopyClear);
		_notCopy = 1;
	}

	scrollbar.reDraw();

}

function inputCancel() {
	// console.log('[fn] cancel');
	arrModifyText = [];
	if( $dataArea.find('.modifyBox').length > 0) {
		key.isModify = false;
		isOpenSelect = false;
		isOpenMultiSelect = false;
		$dataArea.find('.modifyBox').remove();
		lastDownTarget = cvs;
	}
}

var isOpenSelect = false;
var isOpenMultiSelect = false;
function inputModify() {
	console.log('[fn] modify');
	var o = grid.eventConfig.prevObj[0];
	var ctxleft = ( leftField.length < o.xn ) ? ctxLeft : 0;

	// if(arrCopy.length > 0) {
	// 	key.fncPaste();
	// 	return;
	// }

	if(o.editable) {
		// console.log();
		if(key.isModify) {
			dataModify();
			// if(!isOpenSelect && !isOpenMultiSelect) { 		// input
			// 	arrModifyText[0] = $dataArea.find('.modifyBox').val();

			// 	dataUpdate(o);
			// }else if(isOpenSelect) {  			// single select
			// 	var t = gd_data.getElementsByTagName('select')[0];

			// 	selectModify(t);
			// }else if(isOpenMultiSelect) {		// multi select
			// 	dataUpdate(o);
			// }
		}else {
			reset();
			if( $dataArea.find('.modifyBox').length === 0) {
				key.isModify = true;

				validation.edit(o);
			}
		}
	}else {
		lockAlpha=1;
		lockImage();
	}

	$('.modifyBox').click(function(e) {
		e.stopPropagation();
	});
}
function dataModify() {
	var o = grid.eventConfig.prevObj[0];
	if(!isOpenSelect && !isOpenMultiSelect) { 		// input
		arrModifyText[0] = $dataArea.find('.modifyBox').val();

		dataUpdate(o);
	}else if(isOpenSelect) {  			// single select
		var t = gd_data.getElementsByTagName('select')[0];

		selectModify(t);
	}else if(isOpenMultiSelect) {		// multi select
		dataUpdate(o);
	}

}

var lockAlpha=1;
var lockClear;
function lockImage() {
	var o = grid.eventConfig.prevObj[0];

	if( lockAlpha > 0) {
		ctx.putImageData(imageData, 0, 0);
		ctx.save();
		ctx.globalAlpha = lockAlpha;
		ctx.drawImage(lock, o.x+o.width-20+ctxLeft, o.y+10+ctxTop);
		ctx.restore();

		lockClear=setTimeout(lockImage, 50);
		lockAlpha -= .1;
	}else {
		clearTimeout(lockClear);
		lockAlpha=1;
	}

}

var dataSave = true;
function _localstorage(o) {
	if(dataSave) {
		console.log('[_localstorage]key'+gridk_this.localStorageCnt);
		if( grid.eventConfig.prevObj.length == 1) {
			localStorage.setItem('key'+gridk_this.localStorageCnt, JSON.stringify(grid.eventConfig.prevObj[0]));
		}else {
			localStorage.setItem('key'+gridk_this.localStorageCnt, JSON.stringify(grid.eventConfig.prevObj));
		}

		gridk_this.localStorageCnt++;
	}else {
		if( grid.eventConfig.prevObj.length == 1) {
			localStorage.setItem('key'+gridk_this.localStorageCnt, JSON.stringify(o));
		}else {
			localStorage.setItem('key'+gridk_this.localStorageCnt, JSON.stringify(grid.eventConfig.prevObj));
		}
		// console.log(gridk_this.localStorageCnt);
		// console.log(o);
	}

	if(gridk_this.localStorageCnt == 0) {
		// $('.bts button:eq(0)').css('opacity', .2);
	}else {
		$('.bts button:eq(0)').css('opacity', 1);
	}
}

function dataUpdate(o) {
	console.log('update');
	if( o === undefined) var o = grid.eventConfig.prevObj[0];
	var name = encodeURIComponent(o.fieldName);
	var modifyText = encodeURIComponent(arrModifyText);
	var prevTxt;

	if(o.dataType == 'datetime') {
		modifyText = encodeURIComponent(arrModifyText[0].replace('T', ' '));
	}

	console.log('type=data_update&id=' + o.id + '&target=' + section + '&data=' + name + '=' + modifyText + '&fieldtype=' + o.dataType);
	if(arrCopy.length > 0) {
		$.each(arrCopy, function(idx, val) {
			// console.log(val.fieldName);
			if( val.dataType === 'user' || val.dataType === 'owner') {
				modifyText = val.owner_id;
			}else if( val.dataType === 'contact_name') {
				modifyText = val.contact_id;
			}
		});
	}
	prevTxt = decodeURIComponent(modifyText);

	_localstorage(o);
	$.ajax({
		type: "POST",
		data: 'type=data_update&id=' + o.id + '&target=' + section + '&data=' + name + '=' + modifyText + '&fieldtype=' + o.dataType,
		url: 'db/common',
		async: false,
		success: function(txt){
			// console.log(name, o)
			console.log(txt);

			o.text = txt.trim();
			// o.owner_id = modifyText;
			// o.uppid = modifyText;
			updateArrCell(o, o.dataType, modifyText);

			inputCancel();
			reset();
			dataSave = true;
			// console.log(prevTxt, decodeURIComponent(modifyText))

			if(prevTxt !== decodeURIComponent(modifyText)) logMsg('modify');
		}
	});
}

function updateArrCell(o, type, update) {
	if( type == 'step') {
		o.uppid = update;
	}else if(type == 'user' || type == 'owner') {
		o.owner_id = update;
	}else if(type === 'contact_name') {
		o.contact_id = update;
	}
}

function dataUpdates(t) {
	console.log('updates');
	var updatesText = '';
	var id =[];
	var arrCopyLen = arrCopy.length;

	_localstorage();

	// console.log(grid.eventConfig.prevObj);
	// console.log(arrCopy, arrCopy.length);
	// console.log(arrModifyText, arrModifyText.length);
	if( t == 'massupdate') {
		var currentYn = grid.eventConfig.prevObj[0].yn;
		var currentXn = grid.eventConfig.prevObj[0].xn;
		console.log("mass");

		for(var i=0; i<arrModifyText.length; i++) {
			id[i] = ( grid.selRow.length > 0 ) ? grid.selRow[i] : arrCell[currentYn+i][currentXn].id;
			updatesText += '&field[]=' + encodeURIComponent(arrCopy[i].fieldName);
			updatesText += '&id[]=' + id[i] + '&fieldtype[]=' + arrCopy[i].dataType;

			if(arrCopy[i].dataType === 'user' || arrCopy[i].dataType === 'owner') {
				updatesText += '&value[]=' + arrCopy[i].owner_id;
			}else {
				updatesText += '&value[]=' + encodeURIComponent(arrModifyText[i]);
			}

			arrCell[currentYn+i][currentXn].text = arrModifyText[i];
		}
	}else {
		var prev = grid.eventConfig.prevObj;
		var len = prev.length;
		for(var i=0; i<len; i++) {
			updatesText += '&field[]=' + encodeURIComponent(prev[i].fieldName);
			updatesText += '&id[]=' + prev[i].id + '&fieldtype[]=' + prev[i].dataType;
			// console.log(grid.eventConfig.prevObj[i].fieldName, grid.eventConfig.prevObj[i].id);
			if( t === 'undo') {
				updatesText += '&value[]=' + encodeURIComponent(arrModifyText[i]);
				prev[i].text = arrModifyText[i];
			}else {
				if(prev[i].dataType === 'user' || prev[i].dataType === 'owner' ) {
					if(arrCopy.length > 0) {
						updatesText += '&value[]=' + arrCopy[0].owner_id;
					}else {
						// updatesText += '&value[]=' + grid.eventConfig.prevObj[i].owner_id;
						updatesText += '&value[]=' + ownerId;
					}
				}else if(prev[i].dataType === 'step') {
					var uppid = (arrCopy.length > 0) ? arrCopy[0].uppid : prev[0].uppid
					updatesText += '&value[]=' + uppid;
					updateArrCell(prev[i], prev[i].dataType, uppid);
				}else {
					updatesText += '&value[]=' + encodeURIComponent(arrModifyText);
				}
				prev[i].text = arrModifyText;
			}
		}
	}

	console.log(updatesText);
	// console.log('type=data_updates&target='+ section + updatesText);
	$.ajax({
		type: 'POST',
		data: 'type=data_updates&target='+ section + updatesText,
		url: 'db/common',
		success: function(x){
			inputCancel();
			// reset();
			dataSave = true;
			if( t === 'undo') {
				reset();
				grid.eventConfig.prevObj[0].selected = true;
				scrollbar.reDraw();
			}else {
				
				dragSelected(getX(grid.eventConfig.dragStartX), sty, getX(grid.eventConfig.dragStartX), yNum);
			}
			arrModifyText = [];

			logMsg('modify');
		}
	});
}

function selectModify(t) {				// single select
	var o = grid.eventConfig.prevObj[0];
	if(t.selectedIndex !== -1) {
		if( t.options[t.selectedIndex].value !== undefined ) {
			arrModifyText[0] = t.options[t.selectedIndex].value;
		}else {
			arrModifyText[0] = t.options[t.selectedIndex].text;
		}
		dataUpdate(o);
	}else {
		inputCancel();
	}
	isOpenSelect = false;
}

var arrModifyText = [];
	ownerId = '';
function selectMultiModify(t) {						// multi select
	event.stopPropagation();

	arrModifyText = [];
	var opt = t.getElementsByTagName('option');
	var idx = t.selectedIndex;
	var p = document.getElementsByClassName('modifyBox')[0].getElementsByTagName('p')[0];

	if( opt[idx].getAttribute('selected') === null ) {
		opt[idx].setAttribute('selected', 'selected');
	}else {
		opt[idx].removeAttribute('selected');
		var rmNo = arrModifyText.indexOf(opt[idx].text);
	}

	for(i=0; i<opt.length; i++){
		if(opt[i].getAttribute('selected') === 'selected'){
			arrModifyText.push(opt[i].text);
		}
	}

	p.innerHTML = arrModifyText;

	lastDownTarget = cvs;
}

function reset() {
	// isOpenSelect = false;
	for(var i=0; i<grid.eventConfig.prevObj.length; i++) {
		if( i !== 0) {
			grid.eventConfig.prevObj[i].selected = false;
		}
		grid.eventConfig.prevObj[i].copy = false;
	}
	grid.eventConfig.prevObj.splice(1, grid.eventConfig.prevObj.length-1);

	scrollbar.reDraw();
}

// function closeFindBox() {
// 	var findBox = document.getElementById('findSearch');
// 	var findTxt = findBox.getElementsByTagName('input').findTxt;
// 	var replaceTxt = findBox.getElementsByTagName('input').replaceTxt;

// 	findBox.style.display = 'none';
// 	findTxt.value = '';
// 	replaceTxt.value = '';
// }

// var findTxts = [],
// 	replaceTxts = [];
// var findCount = 0;
// function search() {
// 	var findBox = document.getElementById('findSearch');
// 	var findTxt = findBox.getElementsByTagName('input').findTxt;

// 	if(findCount == 0) {
// 		for(var i=0; i<dataCount; i++) {
// 			for(var j=3; j<leftField.length+rightField.length; j++) {
// 				if(!arrCell[i][j].hide ) {
// 					if( arrCell[i][j].text.indexOf(findTxt.value) !== -1 ) {
// 						findTxts.push(arrCell[i][j]);
// 					}
// 				}
// 			}
// 		}
// 	}

// 	if(findTxts.length == 0) {
// 		alert('일치하는 데이터가 없습니다.');
// 	}else {
// 		searchNext();
// 		findCount++;
// 	}
// }
// function searchNext() {
// 	// console.log(findCount, findTxts.length);

// 	grid.eventConfig.prevObj[0].selected = false;
// 	findTxts[findCount].selected = true;
// 	grid.eventConfig.prevObj[0] = findTxts[findCount];

// 	// console.log(rowStart, rowStart+Math.floor(cvs.height/tdHeight), findTxts[findCount].yn);
// 	if( findTxts[findCount].yn < rowStart || findTxts[findCount].yn > (rowStart+Math.ceil(cvs.height/tdHeight)-2)) {
// 		ctxTop = -findTxts[findCount].yn * tdHeight;
// 	}
// 	scrollbar.reDraw();
// }
// function replace() {
// 	var currentTxt = document.getElementById('currentTxt');
// 	var replaceTxt = document.getElementById('replaceTxt');
// 	var st = ($("#muRdo1").is(':checked')) ? 0 : grid.eventConfig.prevObj[0].yn;
// 	var len = ($("#muRdo1").is(':checked')) ? dataCount : st + grid.selRow.length;
// 	var field = $('#checkField option:selected').val();
// 	var idx;

// 	$('#header table th').each(function() {
// 		if($(this).attr('data-name') == field) {
// 			idx = $(this).attr('data-idx');
// 		}
// 	});

// 	$.ajax({
// 		type: 'POST',
// 		data: 'type=field_db&sec=' + grid.SQL['section'] + '&where=' + grid.SQLwhere + '&field=' + field,
// 		url: 'db/common',
// 		success: function(data){
// 			var arr_index = JSON.parse(data);
// 			console.log(arr_index);

// 			if($("#muRdo1").is(':checked')) {
// 				$.each(arr_index, function(k, val) {
// 					if(val) {
// 						grid.selRow.push(k);
// 						arrModifyText.push(val.replace(currentTxt.value, replaceTxt.value));
// 					}
// 				});
// 			}else {
// 				for(var i=0; i<grid.selRow.length; i++) {
// 					var t = arr_index[grid.selRow[i]];
// 					arrModifyText.push(t.replace(currentTxt.value, replaceTxt.value));
// 				}
// 			}

// 			if(arrModifyText.length == 0) {
// 				alert('일치하는 데이터가 없습니다.');
// 				return;
// 			}

// 			grid.eventConfig.prevObj = [];
// 			for(var i=st; i<len; i++) {
// 				grid.eventConfig.prevObj.push(arrCell[i][idx]);
// 			}

// 			if(confirm('총 ' + arrModifyText.length + '개의 데이터를 수정하시겠습니까?')) {
// 				dataUpdates('massupdate');
// 			}else {
// 				arrModifyText = [];
// 				grid.eventConfig.prevObj = [];
// 				return;
// 			}

// 		}
// 	});
// }
function searchReset() {
	findTxts = [];
	replaceTxts = [];
	findCount = 0;
	replaceCount = 0;
}

function copyCancel() {
	// arrCopy = [];
	for(var i=0; i<arrCopy.length; i++) {
		arrCopy[i].copy = false;
	}
}

function inputSize() {
	var input = document.getElementsByClassName('modifyBox')[0];
	var txt = input.value;
	ctx.font = '13px NotoSansKR';
	var w = ctx.measureText(txt).width;

	if(w+14 > grid.eventConfig.prevObj[0].width) {
		input.style.width = (w+14) + 'px';
	}else {
		input.style.width = grid.eventConfig.prevObj[0].width + 'px';
	}
	console.log(w);
}

var keytime = function(target) {
	console.log('[fn] keytime');

	this.keytimeout = setTimeout(function(){ grid.filterKeyword(target); }, 600);
};

var keytimeClear = function(){
	console.log('[fn] keytimeClear');

	clearTimeout(this.keytimeout);
};

