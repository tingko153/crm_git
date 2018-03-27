grid.prototype.createData = function(){
	console.log('[fn] grid.createData');
	localStorage.clear();

	// var mainCanvas = new canvasLoad('canvas', gd_data.offsetWidth, gd_data.offsetHeight, _this.SQLdata);
	var mainCanvas = new canvasLoad('canvas', $('.resultCont').width(), gd_data.offsetHeight, _this.SQLdata);

	MainFilter.layout.draw();

	grid.cellSet(0, dataCount);
	grid.dataDraw();

	$('#grid-moving').css('left', $('#grid-fixed').width());
	scrollbar = new SCROLLBARS('canvas', 16, 17, '#b9b9b9', '#f0f0f0');
	key = new KEY();

	if(!resize) grid.eventConfig.init();

	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

function canvasLoad(id, w, h, data) {
	var cvs = document.getElementById(id);

	cvs.width = ( w < 890 ) ? 890 : w;
	cvs.height = h;

	if( w < 890) {
		$('.widgetWrap').removeAttr('style').css('width', 560)
	}

	rowEnd = rowStart + dataLen;
	wLen = 0;
	sc_vertical = (dataCount * tdHeight > canvas.height) ? true : false;
	sc_horizontal = (leftwidth+rightwidth > canvas.width) ? true : false;
}

grid.prototype.deleteData = function(){
	if(confirm('선택된 데이터를 조직에서 삭제하시겠습니까?')){
		grid.selRow = [];
		for(var i=0; i<arrCell.length; i++) {
			if(arrCell[i][0].checked){
				grid.selRow.push(_this.SQLdata[i]['id']);
			};
		}

		$.ajax({
			type: "POST",
			url: 'db/common',
			data: 'type=data_delete&ids=' + grid.selRow.join(','),
			success: function(data){
				grid.sqlCall();
				grid.selRow = [];
				grid.selRowLength(0);
			}
		});

	}
}

grid.prototype.cellSet = function(s, e) {
	console.log('[fn] grid.cellSet');

	var leftLen = leftField.length;
	var cellWidth, cellPosition, fieldName, sql, txt;
	var filterBox = document.getElementById('filter-box');
	var filterlist = filterBox.getElementsByClassName('filterList');
	var head = grid.gridHead[now].columns;

	// console.log('s, e    ' + s, e);

	wLen = leftField.length + rightField.length;

	for(var i=s; i<e; i++) {
		arrCell[i] = arrCell[i] || [];
		sql = _this.SQLdata[i];

		for(var j=0; j<wLen; j++) {
			if(j < leftLen) {
				cellWidth = parseInt(leftField[j].width);
				fieldName = leftField[j].field;
				dataType = leftField[j].type;
				cellPosition = leftField[j].position;
			}else {
				cellWidth = parseInt(rightField[j-leftLen].width);
				fieldName = rightField[j-leftLen].field;
				dataType = rightField[j-leftLen].type;
				cellPosition = rightField[j-leftLen].position+leftwidth;
			}

			var hide = false;
			if( j > 2 ) {
				var swt = filterlist[j-3].getElementsByTagName('input')[0];

				if(!swt.checked) {
					hide = true;
					cellPosition = -10000;
					y = -10000;
				}else {
					cellPosition = setCellPosition(j);
				}
			}else {
				cellPosition = leftField[j].position;
			}

			txt = (sql[fieldName] === undefined) ? '' : sql[fieldName];

			arrCell[i][j] = arrCell[i][j] || {
				text: txt,
				x: cellPosition,
				y: i*tdHeight-2,
				width: cellWidth,
				height: tdHeight,
				account_id: sql.account_id,
				contact_id: sql.contact_id,
				db_id: sql.db_id,
				id: sql.id,
				owner_id: sql.owner_id,
				textColor: '#000',
				background: (i%2 === 0) ? '#efefef' : '#f8f8f8',
				xn: j,
				yn: i,
				hide: hide,	// 숨겨진 열
				selected: false,	// 셀 선택
				// checked: (grid.eventConfig.isAllCountChecked) ? true : false,	// 체크박스
				// checked: rememberCheckFnc(sql.id),
				copy: false,	// 복사하기
				history: false,	// 이력
				favorite: (sql.fno !== '') ? true : false,
				dataType: dataType,
				fieldName: fieldName,
				editable: _editable(fieldName),
				uppid: sql.uppid
			};
			// 고정 값
			arrCell[i][j].x = cellPosition;
			arrCell[i][j].width = cellWidth;
			arrCell[i][j].checked = rememberCheckFnc(sql.id);

		}
	}
	arrCopy = [];
	copyCancel();

}

function rememberCheckFnc(id) {
	var bool = false;
	if(grid.eventConfig.isAllCountChecked || grid.selRow.indexOf(id) !== -1 ) {
		bool = true;
		isAllChecked = true;
	}
	return bool;
}

function _editable(f) {
	var head = grid.gridHead[now].columns;
	var e;

	head.forEach(function(d) {
		if(d.field === f) e = d.editable;

		if( d.field === undefined && d.columns.length > 0) {
			e = d.columns[0].editable;
		}
	});

	return e;
}

var lock = new Image();
grid.prototype.dataDraw = function() {
	// console.log('[fn] grid.dataDraw');

	ctx.clearRect(0, 0, cvs.width, cvs.height);
	clearTimeout(clearCopy);

	lock.src = 'img/lock.png';

	var leftLen = leftField.length;
	rowEnd = ( rowEnd > dataCount ) ? dataCount : rowEnd;

	ctx.save();
	// right data
	for(var i=rowStart; i<rowEnd; i++) {
		for(var j=leftLen; j<wLen; j++) {
			ctx.setTransform(1, 0, 0, 1, ctxLeft, ctxTop);

			draw(i, j, 'r');
		}
	}

	// left data
	var img = new Image();
	for(var i=rowStart; i<rowEnd; i++) {
		for(var j=0; j<leftLen; j++) {
			ctx.setTransform(1, 0, 0, 1, 0, ctxTop);

			draw(i, j, 'l');

			if(j === 0) {	//checkbox
				drawCheckbox(ctx, arrCell[i][j].checked, arrCell[i][j].x, arrCell[i][j].y, tdHeight);
			}else if(j === 1) {	//history
				img.src = 'img/icon-pack.png';
				ctx.drawImage(img, 206, 86, 40, 40, 38, i*tdHeight + 12, 20, 20);
			}else if(j === 2) {	//favorite
				img.src = 'img/icon-pack.png';
				if(arrCell[i][j].favorite) {
					ctx.drawImage(img, 645, 2, 40, 40, 68, i*tdHeight + 11, 20, 20);
				}else {
					ctx.drawImage(img, 565, 2, 40, 40, 68, i*tdHeight + 11, 20, 20);
				}
			}
		}
	}

    if(arrCopy.length !== 0) {
    	drawCopy();
    }
	// inputCancel();

	// 가로 스크롤 경계 라인
	// ctx.beginPath();
	// ctx.setLineDash([]);
	// ctx.strokeStyle = '#000';
	// ctx.lineWidth = '1';
	// ctx.moveTo(leftwidth+.5, 0);
	// ctx.lineTo(leftwidth+.5, canvas.height);
	// ctx.stroke();

	ctx.beginPath();
	ctx.strokeSTyle = 'rgba(0,0,0,.1)';
	ctx.lineWidth = 1;
	ctx.setLineDash([]);
	ctx.moveTo(leftwidth+rightwidth+.5, 0);
	ctx.lineTo(leftwidth+rightwidth+.5, tdHeight * dataCount);
	ctx.stroke();

	ctx.restore();
};

grid.prototype.accountCombine = function() {
	$.ajax({
		type: "POST",
		url: 'section/grid/data-combine',
		data: 'ids=' + grid.selRow.join(','),
		success: function(data){
			arr = [];
			arr['html'] = data;
			popup.create(arr);
		}
	});
}

function draw(y, x, dir) {
	var o = arrCell[y][x];
	// var txt = ( x > 2) ? '[' + o.xn + '] ' + o.text : '';	// test
	var txt = o.text;

	if( x === leftField.length) {	// 여백 그리기
	    ctx.beginPath();
		ctx.setLineDash([]);
	    // ctx.fillStyle = 'red';
	    ctx.fillStyle = setBgColor(o, o.background, true);
	    ctx.rect(0, o.y+1, cvs.width, tdHeight);
		ctx.fill();

		ctx.beginPath();	// 가로
		ctx.setLineDash([]);
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = '1';
		ctx.moveTo(.5, o.y+1.5);
		ctx.lineTo(cvs.width, o.y+1.5);
		ctx.stroke();
	}
	ctx.save();

    ctx.beginPath();
	ctx.setLineDash([]);
    ctx.fillStyle = setBgColor(o, o.background);
    ctx.rect(o.x, o.y+1, o.width, o.height);
    ctx.fill();

    ctx.clip();

	if(!o.editable && x > 3) { 		// editable false
		ctx.beginPath();
		ctx.lineWidth = 1;
		// ctx.strokeStyle = '#ececec';
		ctx.strokeStyle = 'rgba(182,182,182,.3)';
		for(var i=4; i<o.width+35; i+=4) {
			ctx.moveTo(o.x+i, o.y+2);
			ctx.lineTo(o.x, o.y+2+i);
		}
		ctx.stroke();
	}

    ctx.beginPath();
    // ctx.fillStyle = ( o.fieldName === 'account_name' || o.fieldName === 'contact_name' ) ? '#0a6ba3' : setTextColor(o, o.textColor);	// link color
    ctx.fillStyle = setTextColor(o, o.textColor);	// link color
	ctx.font = '12px dotum';
	ctx.textBaseline = 'middle';

	var metrics = ctx.measureText(o.text);
	if(o.fieldName === 'account_name' || o.fieldName === 'contact_name' ) { 	// link underline
		ctx.beginPath();
		ctx.strokeStyle = '#0a6ba3';
		ctx.lineWidth = .5;
		ctx.moveTo(o.x+6, o.y + 28.5);
		ctx.lineTo(o.x+6+metrics.width, o.y + 28.5);
		ctx.stroke();
	}

	if(o.dataType === 'currency') {
		ctx.textAlign = 'right';
		ctx.fillText(format._currency(o.text, 'value'), o.x+o.width-6, o.y+(tdHeight/2)+2);
		ctx.textAlign = 'left';
		ctx.fillStyle = '#bfbfbf';
		ctx.fillText(format._currency(o.text, 'symbol'), o.x+6, o.y+(tdHeight/2)+2);
	}else {
		ctx.fillText(txt, o.x + 6, o.y+ (tdHeight/2)+2);
	}

	if( maxWidth[x] < metrics.width+12 ) {
		maxWidth[x] = metrics.width+12;
	}

	ctx.restore();

	ctx.beginPath();	// 가로
	ctx.setLineDash([]);
	ctx.strokeStyle = '#fff';
	ctx.lineWidth = '1';
	// ctx.strokeRect(o.x+.5, o.y+1.5, o.width, o.height);
	ctx.moveTo(o.x+.5, o.y+1.5);
	ctx.lineTo(o.x+.5+o.width, o.y+1.5);
	ctx.stroke();

	ctx.beginPath();	// 세로
	ctx.strokeStyle = 'rgba(0,0,0,.1)';
	ctx.moveTo(o.x+.5, o.y);
	ctx.lineTo(o.x+.5, o.y+tdHeight);
	ctx.stroke();

    if(o.selected || o.selected == 'copy') drawSelected(y, x);
}

var offset = 0;
var sltO;
function drawSelected(y, x) {
	var leftLen = leftField.length;
	var o = arrCell[y][x];
	var arrDragDataType = ['contact'];

	if(grid.eventConfig.prevObj.length === 1) {
		ctx.beginPath();
		ctx.setLineDash([]);
		ctx.strokeStyle = '#000';
		ctx.lineWidth = '2';
		ctx.strokeRect(o.x+1, o.y+3, o.width-2, tdHeight-3);

		// 끝자락 점
		if(o.editable  && o.fieldName !== 'account_name') {
			if(!arrCheck(arrDragDataType, o.dataType)) {
				ctx.beginPath();
				ctx.strokeStyle = '#fff';
				ctx.fillStyle = '#000';
				ctx.strokeRect(o.x+o.width-6, o.y+o.height-5, 6, 6);
				ctx.fillRect(o.x+o.width-6, o.y+o.height-5, 6, 6);
			}
		}
	}else {	// 드래그 선택
		var _x = grid.eventConfig.stBoxX;
		var _y = grid.eventConfig.stBoxY;
		var x_ = grid.eventConfig.enBoxX;
		var y_ = grid.eventConfig.enBoxY;

		ctx.beginPath();
		ctx.strokeStyle = '#000';
		ctx.lineWidth = '2';
		(o.selected === 'copy') ? ctx.setLineDash([1, 1]) :	ctx.setLineDash([]);

		if( _x === x) {			// 좌측 세로
			ctx.moveTo(o.x+1, o.y+1);
			ctx.lineTo(o.x+1, o.y+o.height+1);
		}
		if( _y === y) {			// 상단 가로
			ctx.moveTo(o.x, o.y+3);
			ctx.lineTo(o.x+o.width, o.y+3);
		}

		if( x_ === x) {			// 우측 세로
			ctx.moveTo(o.x+o.width-1, o.y+1);
			ctx.lineTo(o.x+o.width-1, o.y+o.height+1);
		}

		if( y_ === y) {			// 하단 가로
			ctx.moveTo(o.x, o.y+o.height);
			ctx.lineTo(o.x+o.width, o.y+o.height);
		}
		ctx.stroke();

		// if(o.selected === 'copy') {
		// 	// ctx.beginPath();
		// 	// // ctx.setLineDash([]);
		// 	// ctx.strokeStyle = '#000';
		// 	// if(_y === sty) {
		// 	// 	ctx.moveTo(arrCell[sty][stx].x, arrCell[sty][stx].y+tdHeight);
		// 	// 	ctx.lineTo(arrCell[sty][stx].x+arrCell[sty][stx].width, arrCell[sty][stx].y+tdHeight);
		// 	// }else {
		// 	// 	ctx.moveTo(arrCell[sty][stx].x, arrCell[sty][stx].y);
		// 	// 	ctx.lineTo(arrCell[sty][stx].x+arrCell[sty][stx].width, arrCell[sty][stx].y);
		// 	// }
		// 	ctx.moveTo(10, 100)
		// 	ctx.lineTo(10, 1000)
		// 	ctx.stroke();

		// }
	}

}

function drawCopy() {
	ctx.beginPath();
	ctx.setLineDash([8, 4]);
	ctx.strokeStyle = '#3c79ba';
	ctx.lineDashOffset = -offset;
	ctx.lineWidth = '2';

	var sto = arrCopy[0];
	var endo = (arrCopy.length == 1) ? sto : arrCopy[arrCopy.length-1];
	var w;
	var xx;
	var boxWidth = endo.x+endo.width-sto.x;

	if(sto.xn > leftField.length-1) {
		if(sto.x == leftwidth) {
			w = ( endo.x-sto.x+endo.width+ctxLeft < 0) ? 0 : endo.x-sto.x+endo.width+ctxLeft;
			ctx.strokeRect(sto.x, sto.y+1, w, endo.y-sto.y+endo.height);
		}else {
			xx = ( sto.x+ctxLeft < leftwidth ) ? leftwidth : sto.x+ctxLeft;
			if( boxWidth+(ctxLeft + sto.x-leftwidth) < 0) {
				w = 0;
			}else {
				w = ( sto.x+ctxLeft < leftwidth) ? boxWidth+(ctxLeft + sto.x-leftwidth) : boxWidth;
			}
			ctx.strokeRect(xx, sto.y+1, w, endo.y-sto.y+endo.height);
		}
	}else {
		if(endo.xn > leftField.length-1) {
			w = (endo.x-sto.x+endo.width+ctxLeft < leftwidth-sto.x) ? leftwidth-sto.x : endo.x-sto.x+endo.width+ctxLeft;
			ctx.strokeRect(sto.x, sto.y+1, w, endo.y-sto.y+endo.height);
		}else {
			ctx.strokeRect(sto.x, sto.y+1, endo.x-sto.x+endo.width, endo.y-sto.y+endo.height);
		}
	}

	offset += 2;
	if(offset > 20) {
		offset = 0;
	}
	clearCopy = setTimeout(function() {
		scrollbar.reDraw();
	}, 20);

}
var clearCopy;
var offset=0;

function setCellPosition(x) {
	var cellPosition = ( x < leftField.length) ? leftField[x].position : rightField[x-leftField.length].position+leftwidth;

	return cellPosition;
}

function drawCheckbox(ctx, checked, x, y, h) {
	// var o = arrCell[y][x];

	// ctx.clearRect(10.5, y*tdHeight + 16.5, 13, 13);
	if(checked) {
		ctx.beginPath();
		ctx.strokeStyle = '#0086cc';
		ctx.lineWidth = '1';
		ctx.strokeRect(10.5, y + 12.5, 13, 13);

		ctx.fillStyle = '#009de2';
		ctx.fillRect(10.5, y + 12.5, 13, 13);
		ctx.fill();

		ctx.beginPath();
		ctx.strokeStyle = '#fff';
		ctx.moveTo(14, y+19.5);
		ctx.lineTo(16, y+22.5);
		ctx.lineTo(21, y+17.5);
		ctx.stroke();

		ctx.beginPath();
		ctx.fillStyle = '#5fbea6';
		ctx.fillRect(x, y+1, 3, h);
		ctx.fill();
	}else {
		ctx.beginPath();
		ctx.strokeStyle = '#9e9e9e';
		ctx.lineWidth = '1';
		ctx.strokeRect(10.5, y + 12.5, 13, 13);

		ctx.fillStyle = '#fff';
		ctx.fillRect(10.5, y + 12.5, 13, 13);
		ctx.fill();
	}
	// 갯수확인 - 지울것 test

	// ctx.beginPath();
	// ctx.font = '10px dotum';
	// ctx.fillStyle = '#000';
	// ctx.fillText(Math.ceil(y/tdHeight), 2, y+15);

}

var msover;
function setBgColor(o, bgColor, blank) {
	// var color = (o.yn % 2 == 0) ? '#f5f5f5' : '#fafafa';
	var color = bgColor;

	if(o.checked) {
		if( msover == o.yn) {
			color = '#bce3df';
		}else {
			color = '#d3e7e5';
		}
	}
	if(!blank) {
		if(o.selected === 'copy') {
			color = color;
		}else if(o.selected && grid.eventConfig.prevObj.length > 1) {
			if( msover == o.yn) {
				color = '#e9bebe';
			}else {
				color = '#eecfcf';
			}
		}
	}
	if(o.history) {
		color = '#373e4e';
	}
	// console.log(aaa);

	return color;
}

function setTextColor(o, textColor) {
	if ( o.fieldName === 'account_name' || o.fieldName === 'contact_name' ) {
		textColor = '#0a6ba3';
	}
	if (o.selected || o.selected == 'copy') {
		// if(grid.eventConfig.prevObj.length != 1) textColor = '#fff';
	}
	if(o.history) {
		textColor = '#e0e1e4';
	}

	return textColor;
}
