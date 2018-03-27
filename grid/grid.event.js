var aa = new function() {
	this.prevColumn;
	this.colSel = function() {
		$grid.gridHeader.find("th.column").click(function(e){
			if( e.target.nodeName === 'SPAN' || (e.target.nodeName === 'DIV' && $(e.target).attr('class').indexOf('title') !== -1) ) {
				console.log('[fn] column');

				$(".colsel").removeClass("colsel");
				$(".tdsel").removeClass("tdsel");
				if ($(this).attr("data-name")) {
					$(this).addClass("colsel");
					var name = $(this).attr("data-name");
					if($(this).closest(".grid-moving").length > 0){
						$headerRight.find("col").each(function(){
							if ($(this).attr("data-name") === name) {
								idx = $(this).index() + leftField.length;
							}
						});
					}else{
						$headerLeft.find("col").each(function(){
							if ($(this).attr("data-name") === name) {
								idx = $(this).index();
							}
						});
					}

					if(!isWidget) {
						var dataIdx = $(this).attr('data-idx')-3;

						grid.eventConfig.stBoxX = idx;
						grid.eventConfig.stBoxY = 0;
						grid.eventConfig.enBoxX = idx;
						grid.eventConfig.enBoxY = dataCount-1;

						if(e.target !== $('.ui-resizable-handle')[dataIdx]) {
							resetGrid(true, true, true, false);

							for(var i=0; i<dataCount; i++) {
								arrCell[i][idx].selected = true;
								grid.eventConfig.prevObj[i] = arrCell[i][idx];
							}
						}
						aa.prevColumn = idx;
						scrollbar.reDraw();
					}
				}
			}
		});
	}
};
// var resizetimer;
var resize = false;
var wArr = [];
grid.prototype.dragdrop = function() {
	console.log('[fn] grid.dragdrop');
	$grid.gridHeader.find("th.resize").resizable({
		handles: "e",
		minWidth: 60,
		start: function(e,ui){
			var idx = parseInt($(this).attr('data-idx'));
			var wLen = leftField.length + rightField.length;

			if($(this).parents(".grid-moving").length > 0) {
				var t = document.getElementById('grid-moving');
				$headerTarget = $grid.gridHeader.find(".grid-moving");
			}else{
				var t = document.getElementById('grid-fixed');
				$headerTarget = $grid.gridHeader.find(".grid-fixed");
			}
			// sThW = ui.size.width;
			sThW = arrCell[0][idx].width;
			sTableW = parseInt(t.getElementsByTagName('table')[0].style.width);
			selName = $(this).attr("data-name");
			$headerTarget.find("col").each(function(){
				if($(this).attr("data-name") === selName){
					$headerCol = $(this);
				}
			});

			wArr = [];
			if( dataCount !== 0 ) {
				for(var i=rowStart; i<rowEnd; i++) {
					for(var j=idx+1; j<wLen; j++) {
						if(!arrCell[i][j].hide) {
							wArr[j] = arrCell[i][j].x-arrCell[i][idx].width;
						}
					}

				}
			}
		},
		resize: function(e,ui){
			var idx = parseInt($(this).attr('data-idx'));
			$(this).css("width",ui.size.width);
			$headerCol.css("width",ui.size.width);
			$headerTarget.find(".grid-table").css("width", sTableW + (ui.size.width - sThW));
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			var wLen = leftField.length + rightField.length;
			if( dataCount !== 0 ) {
				for(var i=rowStart; i<rowEnd; i++) {
					arrCell[i][idx].width = ui.size.width;
					for(var j=idx+1; j<wLen; j++) {
						if(!arrCell[i][j].hide) {
							arrCell[i][j].x = wArr[j] + ui.size.width;
						}
					}
				}

				var l = 0,
					r = 0;
				for(var i=0; i<leftField.length; i++) {
					if(!arrCell[0][i].hide) {
						l += arrCell[0][i].width;
					}
				}
				for(var i=0; i<rightField.length; i++) {
					if(!arrCell[0][i].hide) {
						r += arrCell[0][i].width;
					}
				}

				leftwidth = l;
				rightwidth = r;

				if( idx < leftField.length) {
					$headerRight.css('left', l + 'px');
					scrollbar.MS_X = l + scrollbar.BTN_WH;
					ctxLeft = 0;
				}
				// grid.dataDraw();
				// scrollbar.init();
				scrollbar.reDraw();
			}
		},
		stop: function(){
			var leftwidth = 0,
				rightwidth = 0;
			$grid.gridHeader.find(".grid-fixed col").each(function(){
				leftwidth = leftwidth + $(this).width();
			});
			$grid.gridHeader.find(".grid-moving col").each(function(){
				rightwidth = rightwidth + $(this).width();
			});
			var name = $(this).attr('data-name');
			var width = $(this).css('width').replace('px','');
			$(".filter-group .filterList").each(function(){
				if($(this).attr('data-name') == name){
					$(this).attr('data-width',width);
				}
			});
			$headerLeft.find(".grid-table").css("width", leftwidth);
			$headerRight.find(".grid-table").css("width", rightwidth);

			if( $(this).attr('data-idx') < leftField.length ) scrollbar.MS_X = leftwidth + scrollbar.BTN_WH;

			resize = true;
			grid.resizeTable();

		}
	});

	$grid.gridHeader.find("tr.sortable th:not('.group-title')").draggable({
		// cancel: "th.fixed, th[data-name='account_name'], th[data-name='contact_name'], th[data-name='owner'], th[data-name='account_id']",
		cancel: "th.fixed, th.fixeded",
		handle: "div.title",
		appendTo: 'body',
		helper: function(e){
			helper = $("<div style='z-index:600; padding:0 10px; width:auto; height:32px; line-height:30px; border:2px #218dcb solid; background:#fff;'>" + e.target.innerText + "</div>");
			return helper;
		},
		start: function(e,ui){
			var $target = e.target;
			var dataName = $($target).attr('data-name');

			inputCancel();
			dragX = ui.position.left;
			if($(this).parents(".grid-fixed").length > 0){
				$headerTarget = $headerLeft;
			}else{
				$headerTarget = $headerRight;
			}
			col_from = 0;
			$dragdrop_from = $(this);
		},
		drag: function(event, ui) {
			if(ui.position.left - dragX > 0) {
				$grid.gridHeader.addClass("right");
				$grid.gridHeader.removeClass("left");
			}else{
				$grid.gridHeader.addClass("left");
				$grid.gridHeader.removeClass("right");
			}
		},
		stop: function(){
			resize = true;
			$grid.gridHeader.removeClass("left");

			var header = document.getElementById('grid-moving');
			header.style.left = leftwidth + ctxLeft + 'px';

			if( ctxLeft === 0 ) scrollbar.MS_X = leftwidth + scrollbar.BTN_WH;

			scrollbar.init();
		},
		cursor: "crosshair",
		cursorAt: { left: 60 }
	});

	$grid.gridHeader.find("tr.sortable th.group-title").draggable({
		cancel: "th.fixed",
		handle: "div.title",
		axis: "x",
		helper: function(e){
			helper = $("<div style='z-index:600; padding:0 10px; width:100px; height:32px; line-height:30px; border:2px #218dcb solid; background:#fff;'>" + e.target.innerText + "</div>");
			return helper;
		},
		start: function(e,ui){
			inputCancel();
			dragX = ui.position.left;
			if($(this).parents(".grid-fixed").length > 0){
				$headerTarget = $headerLeft;
			}else{
				$headerTarget = $headerRight;
			}
			col_from = 0;
			$dragdrop_from = $(this);
		},
		drag: function(event, ui) {
			resize = true;
			if(ui.position.left - dragX > 0) {
				$grid.gridHeader.addClass("right");
				$grid.gridHeader.removeClass("left");
			}else{
				$grid.gridHeader.addClass("left");
				$grid.gridHeader.removeClass("right");
			}
		},
		cursor: "crosshair",
		cursorAt: { left: 60 }
	});

	$grid.gridHeader.find("tr.sortable th:not(.fixed, .fixeded)").droppable({
		accept: "th",
		drop: function() {
			$dragdrop_to = $(this);
			var a;
			var b;

			if($dragdrop_from.hasClass('group-title')){
				a = $dragdrop_from.find('.title span').text();
				$('.filterGroup').each(function(){
					b = $(this).find('.title .label span').text();
					if(a === b){
						$from_target = $(this).closest('.filterOpt');
					}
				});
			}else{
				a = $dragdrop_from.attr('data-name');
				$('.filterList').each(function(){
					b = $(this).attr('data-name');
					if(a === b){
						$from_target = $(this);
					}
				});
			}

			if($(this).closest(".grid-header").hasClass("right")) {
				// -------->
				if($dragdrop_to.hasClass('group-title')){
					a = $dragdrop_to.find('.title span').text();
					$('.filterGroup').each(function(){
						b = $(this).find('.title .label span').text();
						if(a === b){
							$(this).closest('.filterOpt').after($from_target);
						}
					});
				}else{
					a = $dragdrop_to.attr('data-name');
					$('.filterList').each(function(){
						b = $(this).attr('data-name');
						if(a === b){
							$(this).after($from_target);
						}
					});
				}
			}else{
				if($dragdrop_to.hasClass('group-title')){
					a = $dragdrop_to.find('.title span').text();
					console.log('1'+a);
					$('.filterGroup').each(function(){
						b = $(this).find('.title .label span').text();
						if(a === b){
							$(this).closest('.filterOpt').before($from_target);
						}
					});
				}else{
					a = $dragdrop_to.attr('data-name');
					$('.filterList').each(function(){
						b = $(this).attr('data-name');
						if(a === b){
							$(this).before($from_target);
						}
					});
				}
			}
			filter.groupCheck();
		}
	});
};
grid.prototype.selectAction = function(){
	grid.selRow = [];
	for(var i=0; i<arrCell.length; i++) {
		if(arrCell[i][0].checked){
			grid.selRow.push(_this.SQLdata[i]['id']);
		};
	}

	// this.selRowLength(grid.selRow.length);
	// logMsg('checkbox');
};

grid.prototype.selRowLength = function(n) {
	$('.resultCont .checkCount').show();

	if(grid.selRow.length > 0) {
		$('.resultCont .checkCount').show();
		$('.resultCont .sltData').html(grid.selRow.length);
	}else {
		$('.resultCont .checkCount').hide();
	}
}


var isAllChecked = false;
grid.prototype.selectAll = function() {
	console.log('[fn] grid.selectAll');

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<grid.eventConfig.prevObj.length; i++) {
		grid.eventConfig.prevObj[i].selected = false;
	}

	for(var i=0; i<dataCount; i++) {
		for(var j=0; j<wLen; j++) {
			if(!isAllChecked) {
				arrCell[i][j].checked = true;
				grid.eventConfig.prevObj.push(arrCell[i][j]);
			}else {
				arrCell[i][j].checked = false;
				grid.eventConfig.prevObj = [];
			}
		}
		// grid.selRow.push(_this.SQLdata[i]['db_id']);
	}
	if(!isAllChecked) {
		isAllChecked = true;
	}else {
		isAllChecked = false;
		grid.eventConfig.isAllCountChecked = false;
		grid.selRow = [];
		rememberCheck = [];
	}
	grid.selectAction();
	scrollbar.reDraw();

	grid.selRowLength();
	logMsg('checkbox');
};
grid.prototype.dragSelect = function() {
	this.selRowLength(grid.selRow.length);
	logMsg('checkbox');
}

grid.prototype.favorite = function(checked,no,type){
	console.log('[fn] grid.favorite');

	var xhttp 	= new XMLHttpRequest();
	var url 	= 'db/favorite';
	var params 	= 'section=' + section + '&type=' + checked + '&no=' + no +'&fno=1';
	xhttp.open('POST', url, true);
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {

		};
	};
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send(params);
}
grid.prototype.favoriteHead = function(){
	console.log('[fn] grid.favoriteHead');

	if(document.getElementById('favoriteView').checked === true){
		_this.favoriteView = true;
	}else{
		_this.favoriteView = false;
	}

	grid.eventConfig.initialize();
	_this.filterling();
}

function autoCellSize() {
	var o = document.getElementsByClassName('ui-resizable-handle');
	var filterList = document.getElementsByClassName('filterList');

	for(var i=0; i<o.length; i++) {
		o[i].addEventListener('dblclick', function(e) {
			var obj = this.parentElement;
			var idx = obj.getAttribute('data-idx');
			var target = $(obj.parentElement.parentElement.parentElement.parentElement);
			var name = $(obj).attr('data-name');
			var leftwidth = 0,
				rightwidth = 0;

			if( target.attr('id') === 'grid-fixed') {
				$grid.gridHeader.find(".grid-fixed col").eq(idx).css('width', maxWidth[idx] + 'px');
				$grid.gridHeader.find(".grid-fixed col").each(function(){
					leftwidth = leftwidth + $(this).width();
				});
				$grid.gridHeader.find(".grid-fixed table").css('width', leftwidth);
			}else {
				$grid.gridHeader.find(".grid-moving col").eq(idx-leftField.length).css('width', maxWidth[idx] + 'px');
				$grid.gridHeader.find(".grid-moving col").each(function(){
					rightwidth = rightwidth + $(this).width();
				});
				$grid.gridHeader.find(".grid-moving table").css('width', rightwidth);
			}

			obj.style.width = maxWidth[idx] + 'px';

			$(".filter-group .filterList").each(function(){
				if($(this).attr('data-name') == name){
					$(this).attr('data-width', maxWidth[idx]);
				}
			});

			// if( idx < leftField.length ) MS_X = leftwidth + BTN_WH;

			resize =true;
			_this.resizeTable();
		});
	}
}

// canvas
var imageData;
var lastDownTarget;
var stx, sty, _dPrev;
grid.prototype.eventConfig = {
	isClick: false,
	isXScroll: false,
	isYScroll: false,
	isSelected: false,
	isChecked: false,
	isAllCountChecked: false,
	isCopyArea: false,
	isHistory: false,
	dragStartX:0,
	dragStartY:0,
	prevObj:[],
	_prevCheck: [],
	stBoxX:null,
	stBoxY:null,
	enBoxX:null,
	enBoxY:null,
	arrHistory: [],
	arrDragDataType: ['contact'], 			// 드래그 복사 막기
	init: function() {
		cvs.addEventListener('click', this.click);
		cvs.addEventListener('mousedown', this.mousedown);
		cvs.addEventListener('dblclick', this.dblclick);
		cvs.addEventListener('mouseout', this.mouseout);
		cvs.addEventListener('mousemove', this.cvsmousemove);

		document.addEventListener('mousemove', this.mousemove);
		document.addEventListener('mouseup', this.mouseup);
		document.addEventListener('mousedown', function(e) {
			lastDownTarget = e.target;
		});

		autoCellSize();
	},
	click: function(e) {
		e.preventDefault();
		var x = e.offsetX,
			y = e.offsetY,
			yNum = getY(y),
			xNum = getX(x);
		var downX = getX(grid.eventConfig.dragStartX),
			downY = getY(grid.eventConfig.dragStartY)

		if(xNum == downX && yNum == downY) {
			if( dataCount <= dataLen && y < dataCount*tdHeight || dataCount > dataLen) {
				// history
				if( isWidget || x > 30 && x < 60 ) {
					widget.show('',arrCell[yNum][0].account_id, yNum);
					resetGrid(true, true, true, true);
					grid.eventConfig.arrHistory = [];
					for(var i=0; i<wLen; i++) {
						arrCell[yNum][i].history = true;
						grid.eventConfig.arrHistory.push(arrCell[yNum][i]);
					}

					// grid.selRowLength(0);
					// widget.accSelector();
				}
				// favorite
				if( x > arrCell[yNum][2].x && x < arrCell[yNum][2].x+arrCell[yNum][2].width ) {
					var checked = (arrCell[yNum][2].favorite) ? false : true;

					for(var i=0; i<wLen; i++) {
						arrCell[yNum][i].favorite = checked;
					}
					grid.favorite(checked, arrCell[yNum][2].id, 1);
					scrollbar.reDraw();
				}

				// 회사명 link
				if( !isWidget && arrCell[yNum][xNum].fieldName === 'account_name' ) {
					if( x > arrCell[yNum][xNum].x+6 && x < arrCell[yNum][xNum].x+6+ctx.measureText(arrCell[yNum][xNum].text).width ) {
						// location.href = '?sec=account/detail&accid=' + arrCell[yNum][xNum].account_id;
					}
				}

				// 연락처 이름 link
				if( arrCell[yNum][xNum].fieldName === 'contact_name' ) {
					if( x > arrCell[yNum][xNum].x+6 && x < arrCell[yNum][xNum].x+6+ctx.measureText(arrCell[yNum][xNum].text).width ) {
						// location.href = '?sec=contact/detail&accid=' + arrCell[yNum][xNum].account_id + '&userid=' + arrCell[yNum][xNum].contact_id;
					}
				}

			}
		}
	},
	dblclick: function(e) {
		var x = e.offsetX,
			y = e.offsetY,
			xNum = getX(x),
			yNum = getY(y);
		var yarea = (sc_vertical) ? scrollbar.BTN_WH : 0,
			xarea = (sc_horizontal) ? scrollbar.BTN_WH : 0;
		var blank = (dataCount < dataLen) ? dataCount * tdHeight : canvas.height-yarea;
		// e.preventDefault();

		if(isWidget) {
			grid.eventConfig.prevObj[0] = arrCell[yNum][xNum];
		}

		if(x < canvas.width-xarea && y < blank) {
			if(xNum > 2) {
				copyCancel();
				if( section !== 'history' || arrCell[yNum][xNum].fieldName !== 'description') {
					inputModify();
				}
			}
		}
	},
	mousedown: function(e) {
		e.preventDefault();
		var x = e.offsetX,
			y = e.offsetY,
			xNum = getX(x),
			yNum = getY(y),
			thisCell = arrCell[yNum][xNum],
			wLen = leftField.length+rightField.length,
			xx = (xNum < leftField.length) ? 0 : ctxLeft;

		grid.eventConfig.dragStartX = x;
		grid.eventConfig.dragStartY = y;

		if(key.isModify) {
			// inputCancel();
			// inputModify();
			dataModify();
		}

		if( e.which == 1) {
			if( dataCount < dataLen && y < dataCount*tdHeight || dataCount > dataLen) {
				grid.eventConfig.isClick = true;
			}
		}

		if( dataCount !== 0 && e.which == 1 && !isWidget && !key.isCtrl) {
			// selected
			var yarea = (sc_vertical) ? scrollbar.BTN_WH : 0,
				xarea = (sc_horizontal) ? scrollbar.BTN_WH : 0;
			var blank = (dataCount < dataLen) ? dataCount * tdHeight : canvas.height-yarea;

			if( x < canvas.width-xarea && y < blank) {
				// grid.selectAction();

				for(var i=0; i<grid.eventConfig.prevObj.length; i++) {
					grid.eventConfig.prevObj[i].selected = false;
					// grid.eventConfig.prevObj[i].copy = false;
					if( x > 90 ) {
						grid.selRow = [];
						grid.eventConfig.prevObj[i].checked = false;	// 체크박스 해제
						isAllChecked = false;
						grid.selRowLength();
						$('#selectAll').prop('checked', false);
						rememberCheck = [];
					}
				}

				if( x > 90 && grid.eventConfig.isAllCountChecked) {
					arrCell = [];
					grid.eventConfig.isAllCountChecked = false;
					isAllChecked = false;
					grid.createData();
				}

				if(aa.prevColumn !== undefined && x > 30) {
					for(var i=0; i<dataCount; i++) {
						$(".colsel").removeClass("colsel");
						$(".tdsel").removeClass("tdsel");
					}
				}

				if( x > 90 && xNum !== 0) {
					if(key.isShift) {
						// console.log(grid.eventConfig.prevObj[0].xn, grid.eventConfig.prevObj[0].yn, xNum, yNum);
						dragSelected(grid.eventConfig.prevObj[0].xn, grid.eventConfig.prevObj[0].yn, xNum, yNum);
						return;
					}

					thisCell.selected = true;
					grid.eventConfig.prevObj = [];
					grid.eventConfig.prevObj[0] = thisCell;

					grid.eventConfig.stBoxX = xNum;
					grid.eventConfig.stBoxY = yNum;
					grid.eventConfig.enBoxX = xNum;
					grid.eventConfig.enBoxY = yNum;
					stx = xNum;
					sty = yNum;
				}

				if( x > thisCell.x+thisCell.width-8+xx && x < thisCell.x+thisCell.width+8+xx && y > thisCell.y+thisCell.height-8+ctxTop && y < thisCell.y+thisCell.height+8+ctxTop) {
					if(thisCell.editable && !arrCheck(grid.eventConfig.arrDragDataType, thisCell.dataType)) {
						grid.eventConfig.isCopyArea = true;
					}
				}
			}

			// checkbox
			if( x > 0 && x < 30) {
				if(key.isShift) {	// shift key
					if( prevN < yNum) {
						for(var i=prevN; i<yNum+1; i++) fncCheckbox(i);
					}else {
						for(var i=prevN; i>yNum-1; i--) fncCheckbox(i);
					}
					fncCheckbox(prevN);
				}else {
					fncCheckbox(yNum);
				}
				grid.eventConfig.isChecked = true;
				prevN = yNum;
			}else {
				key.isShift = false;
			}

			// history
			if( section === 'history' ) {
				historyLayerClose();
				if(thisCell.fieldName === 'description') {
					var html = '',
						top = thisCell.y + ctxTop + $('canvas').offset().top-50;
					html += '<div class="historyLayer"><div class="desc"><h2>' + _this.SQLdata[yNum].account_name + '</h2><div>' + thisCell.text + '</div></div><div class="btn"><button class="modify">수정</button></div></div>'
					$('.area-body').append(html);
					grid.eventConfig.isHistory = true;
					// $('.historyLayer').css({
					// 	top: top + tdHeight + 18,
					// 	left: thisCell.x + 20
					// });

					// if( $('#grid').height()-top < $('.historyLayer').height()) {
					// 	$('.historyLayer').addClass('bottom');
					// 	$('.historyLayer').css({
					// 		top: top - $('.historyLayer').height() - 18
					// 	});
					// }

					$('.historyLayer .btn button').click(function(e) {
						if($(this).attr('class') == 'modify') {
							arrModifyText = $('.historyLayer .desc textarea').val() || $('.historyLayer .desc div').text();

							dataUpdate(thisCell);
						}
						historyLayerClose();
					});
					$('.historyLayer .desc div').click(function() {
						var text = $(this).text();
						// console.log(text);
						$(this).parent().append('<textarea style="width:' + $(this).width() + 'px; height:' + $(this).height() + 'px;">' + text + '</textarea>');
						$(this).hide();

					});
				}
			}
			scrollbar.reDraw();
		}
	},
	cvsmousemove: function(e) {
		var x = e.offsetX,
			y = e.offsetY,
			yNum = getY(y);

		// mouseover
		if(msover != yNum) {
			for(var j=rowStart; j<rowEnd; j++) {
				for(var i=0; i<wLen; i++) {
					if( j == yNum) {
						arrCell[yNum][i].background = '#dcdcdc';
					}else {
						arrCell[j][i].background = (j%2 === 0) ? '#efefef' : '#f8f8f8';
					}
				}
			}

			msover = yNum;
			scrollbar.reDraw();

		}

		msover = yNum;

	},
	mousemove: function(e) {
		var x = e.offsetX,
			y = (e.clientY-grid.canvasTop < 0) ? 0 : e.clientY-grid.canvasTop;
			xNum = getX(x),
			yNum = getY(y);
		var scv = (sc_vertical) ? scrollbar.BTN_WH : 0;
		var sch = (sc_horizontal) ? scrollbar.BTN_WH : 0;
		var xx = (xNum < leftField.length) ? 0 : ctxLeft;
		yNum = ( yNum > dataCount-1 ) ? dataCount-1 : yNum;

		// cursor
		var w = parseInt($('#grid-moving').css('left')) + $('#grid-moving').width();
		cvs.style.cursor = 'default';
		if(arrCell.length !== 0 && y < dataCount * tdHeight &&  w > x) {
			var o = ( dataCount != 0 ) ? arrCell[yNum][xNum] : '';

			if( o.fieldName === 'account_name' ) {
				ctx.font = '12px Lato';
				var textWidth = ctx.measureText(o.text).width;

				if( x > o.x+6 && x < o.x+6+textWidth ) {
					cvs.style.cursor = 'pointer';
				}
			}

			if(o.selected && o.editable && o.fieldName !== 'account_name') {
				if(!arrCheck(grid.eventConfig.arrDragDataType, o.dataType)) {
					if( x > o.x+o.width-8+xx && x < o.x+o.width+8+xx && y > o.y+o.height-20+ctxTop && y < o.y+o.height+5+ctxTop) {
						cvs.style.cursor = 'crosshair';
					}
				}
			}
		}

		if(isWidget) return;

		// drag checkbox
		if(grid.eventConfig.isChecked) {
			if( _dPrev !== yNum ) {
				console.log('drag check');
				for(var i=0, len=grid.eventConfig._prevCheck.length; i<len; i++) {
					grid.eventConfig._prevCheck[i].checked = false;
				}
				grid.eventConfig._prevCheck= [];

				var a = (prevN >= yNum) ? yNum : prevN;
				var b = (prevN >= yNum) ? prevN+1 : yNum+1;
				for(var i=a; i<b; i++) {
					for(var j=0; j<wLen; j++) {
						arrCell[i][j].checked = true;
						grid.eventConfig._prevCheck.push(arrCell[i][j]);
					}
				}
				// grid.selectAction();
				// grid.dragSelect();
				_dPrev = yNum;
				scrollbar.reDraw();
			}

			grid.eventConfig.reset();
			ctx.beginPath();
			ctx.strokeStyle = '#000';
			ctx.setLineDash([1, 2]);
			ctx.strokeRect(grid.eventConfig.dragStartX-.5, grid.eventConfig.dragStartY-.5, x-grid.eventConfig.dragStartX, y-grid.eventConfig.dragStartY);
			ctx.closePath();
		}

		// drag select
		var stXNum = getX(grid.eventConfig.dragStartX);
		var stYNum = getY(grid.eventConfig.dragStartY);
		
		if(!key.isShift && grid.eventConfig.isClick && !grid.eventConfig.isCopyArea && !grid.eventConfig.isChecked && !grid.eventConfig.isXScroll && !grid.eventConfig.isYScroll && x > 90 && x < canvas.width-scv && y < canvas.height - sch ) {
			if(xNum !== 0) dragSelected(stXNum, stYNum, xNum, yNum);
		}

		if(grid.eventConfig.isCopyArea) {
			if( yNum >= 0 && yNum < dataCount ) {
				dragSelected(stXNum, sty, stXNum, yNum, 'copy');
			}

			if( y > cvs.height-tdHeight ) {
				if(yNum > dataCount-2 ) {
					ctxTop = -(dataCount * tdHeight - cvs.height);
					ctxTop = (sc_horizontal) ? ctxTop - scrollbar.BTN_WH : ctxTop;
				}else {
					ctxTop -= tdHeight;
				}
				MS_Y = scrollbar.setMsY(ctxTop);
				scrollbar.reDraw();
			}else if( y < 1) {
				ctxTop = ( yNum < 1) ? 0 : ctxTop + tdHeight;
				MS_Y = scrollbar.setMsY(ctxTop);
				scrollbar.reDraw();
			}

		}

	},
	mouseout:function(e) {
		for(var j=rowStart; j<rowEnd; j++) {
			for(var i=0; i<leftField.length+rightField.length; i++) {
				arrCell[j][i].background = (j%2 === 0) ? '#efefef' : '#f8f8f8';
			}
		}
		scrollbar.reDraw();
	},
	mouseup: function(e) {
		e.preventDefault();

		if(grid.eventConfig.isChecked) {
			scrollbar.reDraw();

			for(var i=0, len=grid.eventConfig._prevCheck.length; i<len; i++) {
				grid.eventConfig.prevObj.push(grid.eventConfig._prevCheck[i]);
			}

			for(var i=0; i<dataCount; i++) {
				var ac = arrCheck(grid.selRow, arrCell[i][0].id);
				if(arrCell[i][0].checked && !ac) {
					grid.selRow.push(arrCell[i][0].id);
				}else if(!arrCell[i][0].checked  && ac) {
					var no = grid.selRow.indexOf(arrCell[i][0].id);
					grid.selRow.splice(no, 1);
				}
			}

			// console.log(grid.selRow);
			grid.selRowLength();
			logMsg('checkbox');

			grid.eventConfig._prevCheck = [];
		}

		if(grid.eventConfig.isCopyArea) {	// 드래그 복사/붙여넣기
			if(grid.eventConfig.stBoxY == sty) {
				var prevObj = grid.eventConfig.prevObj[0];

				arrModifyText = prevObj.text;
				ownerId = prevObj.owner_id;
			}else {
				var prevObj = grid.eventConfig.prevObj[grid.eventConfig.prevObj.length-1];
				
				arrModifyText = prevObj.text;
				ownerId = prevObj.owner_id;
			}
			dataUpdates();
		}

		grid.eventConfig.isYScroll = false;
		grid.eventConfig.isXScroll = false;
		grid.eventConfig.isClick = false;
		grid.eventConfig.isChecked = false;
		grid.eventConfig.isSelected = false;
		grid.eventConfig.isCopyArea = false;

		if(!isPipeline) imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	},
	reset: function(n) {
		if(imageData != null) {
			ctx.putImageData(imageData, 0, 0);
		}
	},
	initialize: function() {
		var header = document.getElementById('grid-moving');

		header.style.left = leftwidth + 'px';
		ctxTop = 0;
		ctxLeft = 0;
		rowStart = 0;
		scrollbar.MS_Y = scrollbar.BTN_WH;
		scrollbar.MS_X = leftwidth + scrollbar.BTN_WH;

	}
}
function getX(x) {
	var getx = 0;
	var xx = Math.abs(ctxLeft) + x;

	if( arrCell.length !== 0 ) {
		if( dataCount !== 0) {
			for(var i=3; i<wLen; i++) {
				if(x < leftwidth) {
					if(x > arrCell[0][i].x && x <= arrCell[0][i].x+arrCell[0][i].width) {
						getx = i;
					}
				}else {
					if(xx > arrCell[0][i].x && xx <= arrCell[0][i].x+arrCell[0][i].width) {
						getx = i;
					}
				}
			}
		}
	}

	if( getx > leftField.length+rightField.length) {
		return leftField.length+rightField.length-1;
	}else {
		return getx;
	}
}

function getY(y) {
	var gety = Math.floor((Math.abs(ctxTop) + y)/tdHeight);

	if(gety > dataCount) {
		return dataCount-1;
	}else {
		return gety;
	}
}

function fncCheckbox(y) {
	var cell = arrCell[y];

	for(var i=0; i<wLen; i++) {
		if(!cell[i].checked) {
			cell[i].checked = true;
			grid.eventConfig.prevObj.push(cell[i]);
		}else {
			var id = _this.SQLdata[y]['id'];
			var rmNo = grid.selRow.indexOf(id);
			var rm_rmNo = rememberCheck.indexOf(id);
			cell[i].checked = false;

			$('#selectAll').prop('checked', false);
			grid.eventConfig.isAllCountChecked = false;
			isAllChecked = false;
		}
	}

	if(cell[0].checked) {
		grid.selRow.push(_this.SQLdata[y]['id']);
	}else {
		if(rmNo != -1) grid.selRow.splice(rmNo, 1);
		if(rm_rmNo != -1) rememberCheck.splice(rm_rmNo, 1);

	}
	// grid.selRowLength();

	var header = document.getElementById('header');
	var checkbox = header.getElementsByClassName('selectAll');

	checkbox[0].setAttribute('data-checked', '');
	isAllChecked = false;
	// logMsg('checkbox')
}

function pointCheck(e, x, y, w, h) {
	var mx = e.offsetX,
		my = e.offsetY;

	if( mx > x && mx < x+w && my > y && my < y+h) {
		return true;
	}else {
		return false;
	}
}

var prevN;
var prevN_;
function dragSelected(stXNum, stYNum, xNum, yNum, copy) {
	// console.log(stXNum, stYNum, xNum, yNum, copy);
	var cell = arrCell[yNum][xNum];
	var n = 0, sum = 0, average=0, len=0;

	grid.selRow = [];
	grid.eventConfig.isSelected = true;
	for(var i=0; i<grid.eventConfig.prevObj.length; i++) {
		grid.eventConfig.prevObj[i].selected = false;
		grid.eventConfig.prevObj[i].checked = false;

		if(!isNaN(grid.eventConfig.prevObj[i].text) && grid.eventConfig.prevObj[i].text !== '') {
			sum += parseInt(grid.eventConfig.prevObj[i].text);
			len++;
		}
	}
	average = sum/len;

	// console.log('total : ' + sum + ', average : ' + average + ', length : ' + len);

	stXNum = ( stXNum == 0 ) ? 3 : stXNum;
	var stY = (stYNum < yNum) ? stYNum : yNum;
	var enY = (stYNum < yNum) ? yNum : stYNum;
	var stX = (stXNum < xNum) ? stXNum : xNum;
	var enX = (stXNum < xNum) ? xNum : stXNum;

	grid.eventConfig.prevObj = [];
	for(var i=stY; i<enY+1; i++) {
		for(var j=stX; j<enX+1; j++) {
			arrCell[i][j].selected = (copy === 'copy') ? 'copy' :  true;
			grid.eventConfig.prevObj[n] = arrCell[i][j];
			n++;
		}
	}

	grid.eventConfig.stBoxY = stY;
	grid.eventConfig.stBoxX = stX;
	grid.eventConfig.enBoxY = enY;
	grid.eventConfig.enBoxX = enX;

	scrollbar.reDraw();

	prevN = xNum;
	prevN_ = yNum;
	// console.log(grid.eventConfig.prevObj);
}

var massUpdate = function(){
	var arr=[];
	$.ajax({
		type: "POST",
		url: 'section/common/mass_update',
		success: function(msg){
			$('body').append(msg);
			$("select").each(function(){
				selectbox.reload($(this));
			});
			$('#dataCt').html($('.dataCt').html());
			$('#dataSlt').html(grid.selRow.length);
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
};

function resetGrid(selected, checked, copy, history) {
	var i;
	for(i=0; i<grid.eventConfig.prevObj.length; i++) {
		if(selected) grid.eventConfig.prevObj[i].selected = false;
		if(checked) grid.eventConfig.prevObj[i].checked = false;
		if(copy) grid.eventConfig.prevObj[i].copy = false;
	}

	if(history) {
		for(i=0; i<grid.eventConfig.arrHistory.length; i++) {
			grid.eventConfig.arrHistory[i].history = false;
		}
	}
}

function historyLayerClose() {
	$('.historyLayer').remove();
	grid.eventConfig.isHistory = false;
}

$(function() {
	if(typeof cvs !== 'undefined') cvs.addEventListener('wheel', historyLayerClose);
});


function logMsg(type, txt) {
	var msg, w, text
		o = grid.eventConfig.prevObj[0];

	$('.logMsg').remove();
	switch(type) {
		case 'modify':
			text = ( o.text === '' ) ? '<strong>삭제</strong> 되었습니다.' : '<strong>' +  o.text + '</strong>로 수정되었습니다.';
			// text = '<strong>' +  o.text + '</strong>로 수정되었습니다.';
			if( grid.eventConfig.prevObj.length > 1) {
				msg = _this.SQLdata[o.yn].account_name + ' 외 <strong>' + grid.eventConfig.prevObj.length + '개</strong>의 ' + getHeaderInfo(o.fieldName, 'title') + '가(이) ' + text;
			}else {
				msg = _this.SQLdata[o.yn].account_name + '-' + getHeaderInfo(o.fieldName, 'title') + '가(이) ' + text;
			}
			break;
		case 'checkbox':
			if(grid.selRow.length == 0) {
				// msg = '데이터가 전부 해제되었습니다.';
				return;
			}else {
				msg = '현재 페이지에 표시된 <strong>' + grid.selRow.length + '</strong>개의 데이터를 선택하였습니다. 전체 데이터 <strong>' + totalCount + '</strong>를 선택하시려면 <a href="#">전체데이터 선택</a>을 클릭하십시오.';
				if( $('.sltData').text() == totalCount ) {
					return;
				}
			}
			break;
		default:
			msg = txt;
			break;
	}

	$('body').append('<div class="logMsg">' + msg + '</div>');
	w = $('.logMsg').width();
	$('.logMsg').css({
		marginLeft: -(w/2)
	}).animate({
		opacity: 1
	}).delay(2000).animate({opacity: 0}, 1000);


	$('.logMsg a').click(function() {
		grid.eventConfig.isAllCountChecked = true;
		$('.resultCont .sltData').html(totalCount);

		$.ajax({
			type: "POST",
			data: "type=all_ids",
			url: "db/common",
			success: function(data){
				grid.selRow = data.trim().split(',');
				$('#selectAll').prop('checked', true);
				grid.createData();
				logMsg('checkbox');
			}
		});
	});
}
