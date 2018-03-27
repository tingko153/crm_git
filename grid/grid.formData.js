var CPLIST, CPNAME;
function addData(sec) {
	$.ajax({
		type: "POST",
		data: 'sec=' + sec,
		url: 'section/common/add_data_simple',
		success: function(msg){
			$('.simpleLayer').remove();
			$('body').append(msg);
			$("select").each(function(){
				selectbox.reload($(this));
			});
			addDataEvent();
			widget.accSelector();

		    simpleLayerDrag();
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});

	widget.loadCPlist();
}

function addDataEvent() {
	$('.cpname').focusout(function() {
		CPNAME = $(this).val().replace(/[\.\s]/g,'');
		var top = $(this).offset().top - $('.addDataWrap').offset().top + $(this).outerHeight() + 40;
		$('.simpleLayer .bgLayer').css('top',top);
		if( CPNAME !== '') {
			var name = $(this).attr('name');
			companyListLoad(name);
		}
	});
}

function splClose() {
	$('.simpleLayer').remove();
}

function companyListLoad(name) {
	if(name !== undefined){
		var txt = document.getElementsByName(name)[0].value;
	}
	else{
		var txt = $('input.cpname.upper').val();
	}

	var html;

	if(!txt){
		html = '<ul><li>검색값을 입력해주십시오.</li></ul><div class="btnWrap"><button class="bt_pop" onclick="companyListClose();">닫기</button><button class="bt_pop blue" onclick="cpSelect(\'' + name + '\')">선택</button>';
		$('.bgLayer, .cpSearchList').show();
		$('.cpSearchList ul, .cpSearchList .btnWrap').remove();
		$('.cpSearchList').append(html);
		$('.cpSearchList input[type="text"]').eq(0).focus();
	}else{
		var sort = [];
		var addr;

		CPNAME = txt.replace(/[\.\s]/g,'');

		html = '<ul>';
		html += '<li><input type="radio" id="r" name="r" checked><label for="r">새로운 회사 등록</label></li>';
		$('.cpname2').val(CPNAME);

		for(var i=0; i<CPLIST.length; i++) {
			if( CPLIST[i].account_name.indexOf(CPNAME) !== -1) {
				addr = ( CPLIST[i].address === '' ) ? '' : '<br /><em>' + CPLIST[i].address + '</em>';
				sort.push([CPLIST[i].account_name, addr, CPLIST[i].id]);
			}
		}

		if(sort.length > 0) {
			sort.sort();
			for(var i=0; i<sort.length; i++) {
				html += '<li><input type="radio" id="r' + i + '" name="r" data-value="' + sort[i][2] + '"><label for="r' + i + '"><span>' + sort[i][0] + '</span>' + sort[i][1] + '</label></li>';
			}
			html += '</ul><div class="btnWrap"><button class="bt_pop" onclick="companyListClose();">닫기</button><button class="bt_pop blue" onclick="cpSelect(\'' + name + '\')">선택</button></div>';
			$('.bgLayer, .cpSearchList').show();
			$('.cpSearchList ul, .cpSearchList .btnWrap').remove();
			$('.cpSearchList').append(html);
			$('.cpSearchList input[type="text"]').eq(0).focus();
		}else{
			$('.cpSearchList ul, .cpSearchList .btnWrap').remove();
			$('.cpSearchList').append(html);
			$("input[name='" + name + "']").parent().find('.msg').remove();
			if(name === 'account_name'){
				$("input[name='" + name + "']").after('<div class="msg" style="color:#008bf8; padding:5px 0;">새로운 데이터를 등록합니다.</div>');
			}
		}
	}

	var top = $('.bgLayer').css('top');
}

function cpSelect(name) {
	var v = $('.cpSearchList ul li input:checked').attr('data-value');
	var t = $('.cpSearchList ul li input:checked + label span').text();

	if(section === 'account'){
		if(!t){
			t = $('input[name=search_account]').val();
			$('.simpleLayer .sql_save').html('새로등록');
		}else{
			$('.simpleLayer .sql_save').html('수정하기');

		}
	}

	$('input[name=' + name + ']').val(t);
	$('input[name=' + name + ']').closest('tr').find('.id').val(v);
	$("input[name='" + name + "']").parent().find('.msg').remove();
	if(name === 'account_name'){
		if(v){
			if(section === 'account'){
				$("input[name='" + name + "']").after('<div class="msg" style="color:#008bf8; padding:5px 0;">기존 데이터를 수정후 등록합니다.</div>');
			}
			$.ajax({
				type: 'POST',
				url: 'db/common',
				data: 'type=account_db&id=' + v,
				success: function(data){
					arr = JSON.parse(data);

					$('.addDataWrap input').each(function(){
						var name = $(this).attr('name');
						if(arr[name]){
							$(this).val(arr[name]);
						}
					});

					$('.addDataWrap textarea').each(function(){
						var name = $(this).attr('name');;
						if(arr[name]){
							$(this).val(arr[name]);
						}
					});

					$('.addDataWrap select').each(function(){
						var name = $(this).attr('name');
						if(arr[name]){
							$(this).val(arr[name]);
						}
					});
				},
				error: function(request, status, error) {
					alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
				}
			});

			if(section === 'potential'){
				$.ajax({
					type: 'POST',
					url: 'db/common',
					data: 'type=account_contact_db&accid=' + v,
					success: function(data){
						var opt = '<option></option>';
						arr = JSON.parse(data);
						arr.forEach(function(elem){
							opt += '<option value="' + elem.id + '">' + elem.name + '</option>';
						});
						$('select[name=contact_id]').html(opt);
						$('select[name=contact_id]').next('.select-element').remove();
						selectbox.reload($('select[name=contact_id]'));
					}
				});
			}
		}else{
			$("input[name='" + name + "']").after('<div class="msg" style="color:#008bf8; padding:5px 0;">새로운 데이터를 등록합니다.</div>');
		}
	}else if(name === 'search_account'){
		if(v){
			$("input[name='account_id']").val(v);
			$("input[name='account_name']").val(t);
		}
	}
	companyListClose();
}

function companyListClose() {
	$('.bgLayer, .cpSearchList').hide();
}

function splSave(next,section){
	var frm = $('#frm');
	var pass = validation.check(frm);

	if(section === 'account' && $("input[name='account_id']").val() !== ''){
		var frmdata = 'type=edit_data&' + validation.complete($('#frm'));
	}else{
		var frmdata = 'type=add_data&' + validation.complete($('#frm'));
	};

	if(pass === 0){
		$.ajax({
			type: "POST",
			data: frmdata + '&section=' + section,
			url: 'db/insert',
			success: function(msg){
				console.log(msg);
				splClose();
				lClose();
				scrollbar.reDraw();
				if(next) addData(section);
				var yn =  $('.widgetWrap').attr('data-yn');
				if(yn) widget.show('',arrCell[yn][0].account_id, yn);
				grid.sqlCall();
			},
			error: function(request, status, error) {
				alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
			}
		});
	};
}

var next;
function splEdit(section){
	var frm = $('#frm');
	var pass = validation.check(frm);
	if(validation.check($('#frm')) === 0){
		var frmdata = validation.complete($('#frm'));
	};
	if(pass === 0){
		$.ajax({
			type: "POST",
			data: frmdata + '&section=' + section,
			url: 'db/update',
			success: function(msg){
				splClose();
				lClose();
				scrollbar.reDraw();
				if(next) addData(section);
				var yn =  $('.widgetWrap').attr('data-yn');
				if(yn) widget.show('',arrCell[yn][0].account_id, yn);
				grid.sqlCall();
			},
			error: function(request, status, error) {
				alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
			}
		});
	};
}

function accountSearch(e) {
	$this = $(e.target);
	if (e.keyCode == 13) {
		CPNAME = $this.val().replace(/[\.\s]/g,'');
		var top = $this.offset().top - $('.addDataWrap').offset().top + $this.outerHeight() + 40;
		// $('.cpSearchList').css('top',top);
		$('.simpleLayer .bgLayer').css('top',top);
		if( CPNAME !== '') {
			var name = $this.attr('name');
			companyListLoad(name);
		}
    }
   	$this.parent().find('.msg').remove();

}

function accountReSearch(e) {
	CPNAME = e.target.value.replace(/[\.\s]/g,'');
	companyListLoad(e.target.name);
}


function popExpand() {
	var frmData = $('#frm').serialize();
	$.ajax({
		type: "POST",
		data: frmData,
		url: 'section/common/add_data',
		success: function(msg){
			$('body').append('<div class="popup">' + msg + '</div>');
			splClose();
			$('.layerPop').css({'margin-top': -$('.layerPop').height()/2, 'margin-left': -$('.layerPop').width()/2});
			$("select").each(function(){
				selectbox.reload($(this));
			});
			$('.layerPop input[type=text]').eq(0).focus();
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
}

function lClose() {
	$('.popup').remove();
	multiTxtArr = [];
	multiArr = [];
}

var X, XW, XDATA, dataimport;
function addDataMulti() {
	X = XLSX,
	XW = {
		msg: 'xlsx',
		worker: 'js/xlsx/xlsxworker.js'
	},
	XDATA,
	dataimport;

	$.ajax({
		type: "POST",
		url: 'section/common/add_data_multi',
		success: function(msg){
			$('body').append('<div class="popup">' + msg + '</div>');
			$('.layerPop').css({'margin-top': -$('.layerPop').height()/2, 'margin-left': -$('.layerPop').width()/2});
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
}

// var X = XLSX;
// var XW = {
// 	msg: 'xlsx',
// 	worker: 'js/xlsx/xlsxworker.js'
// };
// var XDATA;
// var dataimport;

function excelUpload(e) {
	if( $('#fileBox canvas').length == 0) {
		e.stopPropagation();
		e.preventDefault();
		loadExcel(e.dataTransfer.files);
	}
}

function loadExcel(files) {
	if(files.length > 1) {
		alert('하나의 파일만 올려주세요.');
		return;
	}
	var ext = /xlsx|xls|csv|xltx|xlsm/i;
	var currentExt = files[0].name.split('.').pop();

	if(!ext.test(currentExt)) {
		alert('파일 업로드는 xlsx, xls, csv, xltx, xlsm 확장자만 가능합니다.');
		return;
	}

	loading();
	var f = files[0];
	var rABS = typeof FileReader !== "undefined" && (FileReader.prototype||{}).readAsBinaryString;
	var reader = new FileReader();
	reader.onload = function(e) {
		var data = e.target.result;
		var w = $('body').width() * .95;
		var h = $('body').height() * .8;

		if(!rABS) data = new Uint8Array(data);

		XDATA = to_(X.read(data, {type: rABS ? 'binary' : 'array'}));
		XDATA = parseCSV(XDATA);

		$('.layerPop .step1').hide();
		$('.layerPop .addDataMulti').animate({
			width: w,
			height: h
		}, function() {
			$('.layerPop .step2').show();
			$('#fileBox').css({'width': $(this).width()+'px', 'height': $(this).height()+'px'});
			$('#fileBox').append('<div id="canvasWrap"><canvas id="multiCvs" width="' + $('#fileBox').width() + '" height="' + ($('#fileBox').height() - $('#fileBox .step2').height()) + '"></canvas></div>');
			mst = 0;

			reArray();		// 회사 ID확인

			// addDataMultiDraw();	// 그리자그리자데이터를그리자
		});
		$('.layerPop').animate({'margin-top': -(h+84)/2, 'margin-left': -w/2});

		$('.totalCount').html('데이터: ' + (XDATA.length-1));
		loads();

		dataimport = new Dataimport();
	};
	// reader.readAsBinaryString(f);
	if(rABS) reader.readAsBinaryString(f);
	else reader.readAsArrayBuffer(f);

	reader.onprogress = function(e) {
		var progress = e.loaded/e.total * 100;

		$('.layerPop .loading p').css('width', progress + '%');
	}
}

function reArray() {
	var changeNum,
		dataId = [];

	isCompleteArr = [];
	if(section != 'account'){

		var idCheck = XDATA[0].some(function(val) {			// 회사ID필드 여부
			return val.replace(/\s/gi, '') === '회사ID';
		});

		if(!idCheck) {
			$.each(XDATA, function(idx, arr) {
				var cpId = ( idx === 0 ) ? '회사ID' : '';
				arr.unshift(cpId);
			});
		}else {
			$.each(XDATA[0], function(idx, val) {
				var txt = val.replace(/\s/gi, '');

				if( txt == '회사ID') {
					changeNum = idx;
					return false;
				}
			});
		}

		$.ajax({
			type: "POST",
			url: 'db/common',
			data: 'type=account_id',
			success: function(data){
				data = data.trim();
				dataId = data.split(',');

				$.each(XDATA, function(idx, val) {
					if( isCompleteArr[idx] == undefined) isCompleteArr[idx] = {boolean: false, error: ''};
					if( idx !== 0 && dataId.indexOf(val[changeNum]) === -1 ) {
						// val[changeNum] = 'error';
						isCompleteArr[idx].boolean = true;
						isCompleteArr[idx].error = '등록된 회사ID가 없음';
					}
					val.unshift(val[changeNum]);
					val.splice(changeNum+1, 1);
				});

				addDataMultiDraw();
				canvasdraw = new Canvasdraw('multiCvs', XDATA, 30);
			},
			error: function() {

			}
		});
	}else{
		addDataMultiDraw();
		canvasdraw = new Canvasdraw('multiCvs', XDATA, 30);
	}
}

function parseCSV(str) {
    var arr = [];
    var quote = false;
    for (var row = col = c = 0; c < str.length; c++) {
        var cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
        if (cc == '"') { quote = !quote; continue; }
        if (cc == ',' && !quote) { ++col; continue; }
        if (cc == '\n' && !quote) { ++row; col = 0; continue; }

        arr[row][col] += cc;
    }
    return arr;
}

function to_(workbook) {
	var result = [];
	var shName = workbook.SheetNames[0];

	workbook.SheetNames.forEach(function(sheetName) {
		if( shName === sheetName) {
			var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);

			if(csv.length){
				result.push(csv);
			}

		}
	});

	return result.join("\n");
}
var _txtLen = [];
var txtX = [];
var totalWidth = 0;
function addDataMultiDraw() {
	var _len = 0;
	var med = ( mst+50 > XDATA.length ) ? XDATA.length : mst+50;
	_txtLen = [];
	txtX = [];
	totalWidth = 0;

	for(var i=mst; i<med; i++) {
		for(var j=0; j<XDATA[i].length; j++) {
			$('#measuretext').html(XDATA[i][j]);

			if( _txtLen[i] == undefined) _txtLen[i] = 200;
			_txtLen[i] = ( $('#measuretext').width() > _txtLen[i] ) ? $('#measuretext').width() : _txtLen[i];

		}
		_len = (XDATA[i].length > _len) ? XDATA[i].length : _len;
		c_checkbox[i] = false;
	}

	var col = '';
	// 처리결과
	var slt = $('#checkField').html();
	var html = '<table class="move"><tbody>';

	for(var i=0; i<2; i++) {
		html += '<tr>';
		for(var j=0; j<_len; j++) {
			if( i == 0) {
				if(j === 0 && XDATA[i][j] === '회사ID' && section === 'contact') {
					html += '<th></th>';
				}else {
					html += '<th><select name="checkField[]" onclick="dataimport.checkField()" data-search="on" class="width100per">' + slt + '</select></th>';
				}
				txtX[j] = 0;
			}else {
				html += '<th>' + XDATA[0][j] + '</th>'

				col += '<col width="' + _txtLen[i] + '" />';
				txtX[j] = totalWidth + 233;
				totalWidth += _txtLen[i];
			}
		}
		html += '</tr>';
	}

	html += '</tbody></table>';
	$('.step2 .head').append(html);
	$('.step2 .head table:eq(1)').css('width', totalWidth).find('tbody').before(col);

	$('.addDataMulti .head .move tr:eq(1) th').each(function(i, txt) {	// 같은 필드명 찾기
		var $this = $(this).parents('.move').find('tr:eq(0) th')[i];
		var field = $(this).text().replace(/\s/gi, '');

		$.each($($this).find('option'), function(idx, val) {
			var txt = $(this).text();
			if( txt.replace(/\s/gi, '') === field && multiTxtArr.indexOf(field) === -1 ) {
				$(this).prop('selected', true);
				multiTxtArr.push(txt);
				multiArr.push($(this).val());

				// console.log($(this).text(), $(this).val());
			}
		});
	});

	$('.addDataMulti .head .move tr:eq(1) th').each(function(i, txt) {	// 같은 글자 포험된 필드명 찾기
		var $this = $(this).parents('.move').find('tr:eq(0) th')[i];
		var field = $(this).text();

		if(multiTxtArr.indexOf(field) === -1 ) {
			$('.addDataMulti .head .move tr:eq(0) th:eq(0) select:eq(0) option').each(function(j, select) {
				if( $(this).text().indexOf(field) !== -1 && multiTxtArr.indexOf($(this).text()) == -1 ) {
					// $($this).find('option').eq(j).attr('selected', 'selected');
					$($this).find('option').eq(j).prop('selected', true);
					multiTxtArr.push($(this).text());
					multiArr.push($(this).attr('value'));

					return false;
				}
			});
		}
	});

	$(".addDataMulti select").each(function(){
		selectbox.reload($(this));
	});

	$('.addDataMulti table.move th .body p').each(function(){
 		var val = $(this).text();

 		if(!$(this).hasClass('act') && multiTxtArr.indexOf(val) !== -1 ) {
 			$(this).addClass('none');
 		}

	});

	txtX.unshift(0,30,83);
}

function selectCheck(arr, txt, j) {
	var slt = '';

	$.each(arr, function(idx, t) {
		var _t = t.trim();
		var st = _t.trim().indexOf('>');
		var en = _t.trim().indexOf('</option>');

		if( _t.indexOf(txt) != -1 ) {
			slt += _t.substring(0, 7) + ' selected ' + _t.substring(8, _t.length);
		}else {
			slt += _t;
		}
	});

	return slt;
}

var multictxTop = 0,
	multictxLeft = 0,
	mst = 0,
	c_checkbox = [],
	xlsxRemoveData = [],
	isCompleteArr = [];
function Canvasdraw(id, data, height) {
	multictxTop = 0,
	multictxLeft = 0,

	this.cvs = document.getElementById(id);
	this.ctx = this.cvs.getContext('2d');
	this.data = data;
	this.height = height;
	this.scL = 0;
	this.scT = 0;
	this.modify = false;
	this.lastTarget;

	this.init();

	document.addEventListener('keydown', this.keydown);
	this.cvs.addEventListener('dblclick', this.dblclick);
	this.cvs.addEventListener('click', this.click);
}

Canvasdraw.prototype = {
	init: function() {
		c_this = this;
		this.draw();
		multiCvsScroll = new SC('multiCvs', totalWidth, this.data.length*this.height, 233);
		// isCompleteArr = [];
	},
	draw: function() {
		var _data = this.data;
		var _ctx = this.ctx;
		var textX = 0;
		var ty = this.height/2 - 5;
		var med = ( mst+50 > _data.length ) ? _data.length : mst+50;

		// right
		_ctx.save();
		_ctx.beginPath();
		_ctx.strokeStyle = '#cdcdcd';
		_ctx.lineWidth = '1';
		_ctx.rect(233.5, .5, this.cvs.width-233, this.cvs.height);
		_ctx.stroke();
		_ctx.clip();

		for(var i=mst; i<med; i++) {
			for(var j=0; j<_data[i].length; j++) {
				_ctx.setTransform(1, 0, 0, 1, multictxLeft, multictxTop);

				var size = (txtX[j+4]-txtX[j+3]) ? txtX[j+4]-txtX[j+3] : 200;
				_ctx.beginPath();
				_ctx.fillStyle = '#fff';
				_ctx.fillRect(txtX[j+3], this.height*i-this.height, size, this.height);

				_ctx.beginPath();
				_ctx.font = '12px dotum';
				_ctx.fillStyle = '#000';
				_ctx.fillText(XDATA[i][j].replace(/\r?\n|\r/g, "^"), txtX[j+3]+7, i*this.height-ty);
				_ctx.fill();

				_ctx.beginPath();
				_ctx.lineWidth = 1;
				_ctx.strokeStyle = '#eee';
				_ctx.moveTo(txtX[j+3]+.5, .5);
				_ctx.lineTo(txtX[j+3]+.5, this.height*_data.length+.5);
				_ctx.stroke();

			}
			_ctx.moveTo(0, i*this.height+.5);
			_ctx.lineTo(totalWidth+233, i*this.height+.5);
			_ctx.stroke();
			if( isCompleteArr[i] == undefined) isCompleteArr[i] = {boolean: false, error: ''};
		}
		_ctx.restore();

		// left
		for(var i=mst; i<med; i++) {
			for(var j=0; j<3; j++) {
				_ctx.setTransform(1, 0, 0, 1, 0, multictxTop);

				if(j == 0) {	// checkbox
					if( i < XDATA.length && !isCompleteArr[i].boolean) {
						drawCheckbox(_ctx, c_checkbox[i], 0, (i-1)*this.height, this.height);
					}
				}else if(j == 1) {	// number
					var measuretext = _ctx.measureText(i).width;
					var x = $('.fixed tr th:eq(1)').width()/2 - measuretext/2;
					_ctx.font = '12px dotum';
					_ctx.fillStyle = '#000';
					_ctx.fillText(i, txtX[j]+x, i*this.height-ty);
				}else if(j == 2) {	// result
					var txt = '';
					var completeTxt = '';

					if( dataimport.XDATA_RESULT.length > 0 ) {
						if(isCompleteArr[i].boolean) {
							completeTxt = ' (완료)';
						}else {
							if(isCompleteArr[i].error != '') {
								completeTxt = ' (오류) - ' + isCompleteArr[i].error;
							}
						}

						if(isCompleteArr[i].boolean && isCompleteArr[i].error != '') {
							_ctx.fillStyle = 'red';
							txt = ' (오류) - ' + isCompleteArr[i].error;
						}else {
							switch (dataimport.XDATA_RESULT[i].type) {
								case 'new':
									_ctx.fillStyle = ( isCompleteArr[i].error != '') ? 'rgb(255,0,0)' : 'rgb(0,149,202)';
									txt = '신규등록' + completeTxt;
									break;
								case 'update':
									_ctx.fillStyle = ( isCompleteArr[i].error != '') ? 'rgb(255,0,0)' : 'rgb(34,193,45)';
									txt = '업데이트' + completeTxt;
									break;
								case 'skip':
									_ctx.fillStyle = ( isCompleteArr[i].error != '') ? 'rgb(255,0,0)' : 'rgb(149,149,149)';
									txt = '건너뛰기' + completeTxt;
									break;
							}

						}
					}else {
						// console.log(isCompleteArr);
						if(isCompleteArr[i].error != '') {
							_ctx.fillStyle = 'red';
							txt = ' (오류) - ' + isCompleteArr[i].error;
						}
					}
					_ctx.fillText(txt, txtX[j]+7, i*this.height-ty);
				}
				_ctx.beginPath();
				_ctx.lineWidth = 1;
				_ctx.strokeStyle = '#eee';
				_ctx.moveTo(txtX[j]+.5, .5);
				_ctx.lineTo(txtX[j]+.5, this.height*_data.length+.5);
				_ctx.stroke();
			}
			_ctx.moveTo(0, i*this.height+.5);
			_ctx.lineTo(totalWidth+233, i*this.height+.5);
			_ctx.stroke();
		}

		_ctx.setTransform(1, 0, 0, 1, 0, 0);
	},
	dblclick: function(e) {
		e.preventDefault();

		var top = Math.floor((e.offsetY-multictxTop)/30);
		var left = c_this.getX(e.offsetX-multictxLeft);
		var txtWidth = txtX[left] - txtX[left-1];

		if( left > 3) {
			if(isCompleteArr.length < 1 || !isCompleteArr[top+1].boolean) {
				$('#canvasWrap input').remove();
				$('#canvasWrap').append('<input type="text" class="modifyText" data-x="' + (left-4) + '" data-y="' + (top+1) + '" style=" top:' + (top*30+multictxTop) + 'px; left:' + (txtX[left-1]+multictxLeft) + 'px; width:' + txtWidth + 'px;" value="' + XDATA[top+1][left-4] + '"/>');
				var val = $('#canvasWrap input').val();
				$('#canvasWrap input').val('');
				$('#canvasWrap input').val(val);
				$('#canvasWrap input').focus();
				c_this.modify = true;
			}
		}
	},
	click: function(e) {
		e.preventDefault();

		if( $('#canvasWrap input').length > 0) {
			$('#canvasWrap input').remove();
			c_this.modify = false;
		}

		if(pointCheck(e, 0, 0, 30, c_this.cvs.height)) {
			var n = Math.floor((e.offsetY-multictxTop)/c_this.height)+1;

			if(c_checkbox[n]) {
				c_checkbox[n] = false;
				xlsxRemoveData.splice(xlsxRemoveData.indexOf(n), 1);
			}else {
				c_checkbox[n] = true;
				xlsxRemoveData.push(n);
			}

			if(xlsxRemoveData.length > 0) {
				if($('.btn .step2 .red').length == 0) {
					$('.btn .step2 .l').after('<button class="bt_pop red" onclick="delXlsxData();">삭제</button>');
				}
			}else {
				$('.btn .step2 .red').remove();
			}
			multiCvsReDraw();
		}
	},
	getX:function(x) {
		for(var i=0; i<txtX.length; i++) {
			if( x < txtX[i]) {
				return i;
			}
		}
	},
	keydown:function(e){
		if( e.target == c_this.lastTarget) {
			switch(e.keyCode) {
				case 13: 	// enter
					var txt = $('#canvasWrap .modifyText').val();
					var x = $('#canvasWrap .modifyText').attr('data-x');
					var y = $('#canvasWrap .modifyText').attr('data-y');

					XDATA[y][x] = txt;
					isCompleteArr[y].boolean = '';

					$('#canvasWrap input').remove();
					c_this.modify = false;
					dataimport.checkRow(y);
					multiCvsReDraw();

					break;
			}
		}
		c_this.lastTarget = e.target;
	}
}

function multiCvsReDraw() {
	canvasdraw.ctx.clearRect(0,0,c_this.cvs.width, c_this.cvs.height);
	canvasdraw.draw();
	multiCvsScroll.scrollDraw();
}

function delXlsxData() {
	xlsxRemoveData.sort(function(a, b) {
		return b-a;
	});

	for(var i=0; i<xlsxRemoveData.length; i++) {
		XDATA.splice(xlsxRemoveData[i], 1);
	}

	for(var i=0; i<c_checkbox.length; i++) {
		c_checkbox[i] = false;
	}

	$('.btn .step2 .red').remove();
	xlsxRemoveData = [];
	multiCvsScroll.maxHeight = XDATA.length * c_this.height;
	multiCvsReDraw();
	dataimport.checkProcess();
}

var runData = [];
function xlsxDataRun() {
	var skip = [];
	var n = [];
	var _idx = [];
	runData = [];
	errCnt = 0, gogo = 0;
	downloadData = [];

	$('table.move tr:eq(0) th').each(function(idx) {
		var t = $(this).find('.select-element .header .label').text();
		if( t !== '' ) {
			_idx.push(idx);
		}
	});

	if( overlapCheckArr.length == 0) {
		alert('중복값 체크 항목을 선택해주세요.');
		return;
	}

	if( multiArr.length == 0 ) {
		alert('체크 기준 항목 필드는 반드시 선택해주세요.');
		return;
	}

	for( var i=0; i<overlapCheckArr.length; i++) {
		if( multiArr.indexOf(overlapCheckArr[i]) == -1) {
			alert('체크 기준 항목 필드는 반드시 선택해주세요.');
			return;
		}
	}

	// 선택된 필드 재정렬
	var slt = $('.head .move select');
	multiArr = [];
	slt.each(function(idx, o) {
		var val = $(this).find('option:selected').val();
		if(val !== '') {
			multiArr.push(val);
		}
	})

	var n = 0;
	runBtn('disabled');
	for(var i=0; i<XDATA.length; i++) {
		if( i > 0 ) {
			runData[n] = {
				'idx': n,
				'type': dataimport.XDATA_RESULT[i].type,
				'id': dataimport.XDATA_RESULT[i].id,
				// 'account_id': XDATA[n+1][0],
				'n': i
			};
			if(section === 'contact') {
				runData[n].account_id = XDATA[n+1][0];
			}
			for(var j=0; j<multiArr.length; j++) {
				runData[n][multiArr[j]] = encodeURIComponent(XDATA[i][_idx[j]].replace(/\r?\n|\r/g, "^"));
			}
			n++;
		}else {
			isCompleteArr[i] = { boolean: true, error: ''};
		}

		downloadData[i] = [];
		multiTxtArr.unshift('처리결과');
		for(var j=0; j<multiArr.length+1; j++) {
			if( i == 0) {
				downloadData[i][j] = multiTxtArr[j];
			}else {
				if( j > 0) {
					downloadData[i][j] = XDATA[i][_idx[j-1]];
				}else {
					if( dataimport.XDATA_RESULT[i].type == 'skip') {
						downloadData[i][j] = '건너뛰기';
					}else if(dataimport.XDATA_RESULT[i].type == 'update') {
						downloadData[i][j] = '업데이트';
					}else {
						downloadData[i][j] = '신규등록';
					}
				}
			}
		}
	}

	if( runData.length > pushDataLen) {
		var r = Math.floor(runData.length/pushDataLen)+1;
		for(var i=0; i<r; i++) {
			if(i == r-1) {
				cutArr[i] = runData.slice(i*pushDataLen, runData.length);
			}else {
				cutArr[i] = runData.slice(i*pushDataLen, i*pushDataLen+pushDataLen);
			}
		}
		_xlsxDataRun(cutArr[0]);
	}else {
		_xlsxDataRun(runData);
	}
}
var downloadData = [];
var cutArr = [];
var pushDataLen = 100;
var gogo = 0;
var errCnt = 0;
function _xlsxDataRun(_runData) {
	// console.log('[' + gogo + ']', _runData);

	$.ajax({
		type: "POST",
		url: 'db/common',
		data: 'type=importXDATA&data=' + JSON.stringify(_runData),
		success: function(data){
			var r_data = $.parseJSON(data);

			$('#checkFieldSselectArea, .overlap .r .select-element, #addSelect').hide();
			$('.overlap .txt1').show().html(overlapCheckTxtArr.join(' + '));
			$('.overlap .txt2').show().html($('.overlap .r .select-element .label').text());

			multiImportProgress();

			r_data.forEach(function(data) {
				var errData, errData2;
				if( data.error ) {
					errCnt++;
					isCompleteArr[data.n] = { boolean: false, error: data.error};
					errData2 = isCompleteArr[data.n];
					console.log(data.error);
					errData = XDATA[data.n];
					XDATA.splice(data.n, 1);
					XDATA.splice(1, 0, errData);
					isCompleteArr.splice(data.n, 1);
					isCompleteArr.splice(1, 0, errData2);
				}else {
					isCompleteArr[data.n] = { boolean: true, error: data.error};
					dataimport.XDATA_RESULT[data.n].status = 'complete';
				}
			})

			$('.step2 span.err em').html(errCnt);

			if(runData.length > pushDataLen) {
				if(gogo > cutArr.length-2) {
					console.log('end');
					xlsxDataCount();
					multiDataComplete();
					multiImportProgress();
					if( errCnt != 0) {
						$('.layerPop .step2 .bt_pop.blue').remove();
						$('.layerPop .btn .step2 .re').show();

						multictxTop = 0;
						mst = 0;
						multiCvsScroll.scy = 0;
					}
					multiCvsReDraw();
					return;
				}
				gogo++;
				_xlsxDataRun(cutArr[gogo]);
				multiCvsReDraw();
			}else {
				console.log('pass');
				multiCvsReDraw();
				multiDataComplete();
			}

			xlsxDataCount();
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});

}

function multiImportProgress() {
	var width = parseInt($('.layerPop').width()) - 232;
	var height = parseInt($('.layerPop canvas').height()) + 70;
	$('.layerPop .progressLayer').show();
	$('.layerPop .progressLayer').css({
		'width': width + 'px',
		'height': height + 'px'
	});

	var total = dataimport.XDATA_RESULT.length - 1;
	var complete = parseInt($('.layerPop .new i').text()) + parseInt($('.layerPop .update i').text()) + parseInt($('.layerPop .skip em').text());
	var n = complete / total * 100;
	n = n.toFixed(1);

	$('.layerPop .progressLayer .percent').html(n + '%');
	$('.layerPop .progressLayer .box .bar p').css('width', n + '%');
}

function multiDataComplete() {
	$('.dimd').css({
		width: $('.layerPop').width(),
		height: $('.layerPop').height(),
		top: $('.layerPop').css('top'),
		left: $('.layerPop').css('left'),
		margin: $('.layerPop').css('margin')
	});
	$('.complete').css({
		marginTop: parseInt($('.layerPop').css('margin-top'))+21+'px'
	});
	$('.complete, .dimd').show();

	$('.layerPop .btn .step2 .download').show();

	$('.layerPop .step2 .bt_pop.blue').html('실행');
}

function completeClose() {
	$('.complete, .dimd, .layerPop .progressLayer').hide();
	// $('#checkFieldSselectArea, .overlap .r .select-element, #addSelect').show();
	// $('.overlap .txt1, .overlap .txt2').hide();
	// console.log('d');
	grid.sqlCall();
}

function runBtn(type) {
	var o = $('.layerPop .step2 .bt_pop.blue');

	if( type == 'disabled') {
		// $('.layerPop .step2 .bt_pop.blue').attr('disabled', 'disabled');
		$('.layerPop .step2 .bt_pop.blue').attr('disabled', 'disabled').html(`<div class="spinner">
																				<div class="dot1"></div>
																				<div class="dot2"></div>
																				<div class="dot3"></div>
																			</div>`);
	}else {
		$('.layerPop .step2 .bt_pop.blue').removeAttr('disabled').html('실행');
	}
}

function xlsxDataCount() {
	var newCnt = 0,
		updateCnt = 0,
		skipCnt = 0,
		_newCnt = 0,
		_updateCnt = 0;

	for(var i=1; i<dataimport.XDATA_RESULT.length; i++) {
		var status = dataimport.XDATA_RESULT[i].status;
		switch (dataimport.XDATA_RESULT[i].type) {
			case 'new':
				if(status == 'complete') {
					_newCnt++;
				}else {
					newCnt++;
				}
				break;
			case 'update':
				if(status == 'complete') {
					_updateCnt++;
				}else {
					updateCnt++;
				}
				break;
			case 'skip':
				skipCnt++;
				break;
		}
	}

	$('.step2 span.new em').html(newCnt + '(<i>' + _newCnt + '</i>)');
	$('.step2 span.update em').html(updateCnt + '(<i>' + _updateCnt + '</i>)');
	$('.step2 span.skip em').html(skipCnt);
}


/* Excel Download */
function xlsxDownload() {
	var ws_name = "등록 결과";
	var wb = new Workbook(), ws = sheet_from_array_of_arrays(downloadData);

	wb.SheetNames.push(ws_name);
	wb.Sheets[ws_name] = ws;
	var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

	saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), "data.xlsx");
}


function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});

			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';

			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}



function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}


function s2ab(s) {
	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);
	for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	return buf;
}

/* -------- */


function Dataimport(){
	this.jsonData;
	this.field = [];
	this.compareData = [];
 	this.defaultField = $('#checkField').parent().html();
 	this.XDATA_RESULT = [];

 	var slt = selectbox.open;
 	selectbox.open = function(target) {
 		var targetSlt = target.parent();

 		slt(target);
 		if(target.parents('.head').length > 0) {
			targetSlt.find('p.option').each(function(i, o) {
				var val = $(o).attr('data-value');
				if(!$(o).hasClass('act') && arrCheck(multiArr, val)) {
					$(o).addClass('none');
				}else {
					$(o).removeClass('none');
				}
			});
 		}
 	}
};

Dataimport.prototype.fieldData = function() {
	loading();

	$.ajax({
		type: "POST",
		data: $('#frm_import').serialize(),
		url: 'db/common',
		success: function(data){
			dataimport.jsonData = $.parseJSON(data);
			dataimport.disableOpt();
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
}

Dataimport.prototype.addSelect = function() {
	$('#checkFieldSselectArea').append('<div class="fl">+</div>' + this.defaultField + '');
	var elem = $('#checkFieldSselectArea select').last();
	selectbox.reload(elem);

	if($('#checkFieldSselectArea select').length > 3){
		$('#addSelect').remove();
	}

	this.disableOpt();
}

var multiArr = [];
var multiTxtArr = [];
Dataimport.prototype.checkField = function() {
	var arr = [],
		targetSlt = $(event.target).parents('.select-element');
	multiTxtArr = [];

	$('.addDataMulti table.move th > select').each(function(){
		if($(this).val()){
			arr.push($(this).val());
			multiTxtArr.push($(this).find('option[value="' + $(this).val() + '"]').text());
		}
	});

	multiArr = arr;

	// $('.addDataMulti table.move th p.option').each(function(){
 // 		var val = $(this).attr('data-value');

 // 		if(!$(this).hasClass('act') && arr.indexOf(val) !== -1){
	//  		$(this).addClass('none');
 // 		}else{
	//  		$(this).removeClass('none');
 // 		}
	// });

	var targetVal = $(event.target).parent().attr('data-value'),
		sltVal = [];

	$('#checkFieldSselectArea select').each(function(i) {
		var a = $(this).find('option:selected').val();

		sltVal[i] = a;
	});

	if(arrCheck(sltVal, targetVal)) this.checkProcess();
}

var overlapCheckArr = [];
var overlapCheckTxtArr = [];
Dataimport.prototype.disableOpt = function() {
	var arr = [];
	overlapCheckTxtArr = [];

	$('#checkFieldSselectArea select').each(function(){
		if($(this).val()){
			arr.push($(this).val());
			overlapCheckTxtArr.push($(this).find('option[value="' + $(this).val() + '"]').text());
		}
	});
	overlapCheckArr = arr;

	$('#checkFieldSselectArea p.option').each(function(){
 		var val = $(this).attr('data-value');

 		if(!$(this).hasClass('act') && arr.indexOf(val) !== -1){
	 		$(this).addClass('none');
 		}else{
	 		$(this).removeClass('none');
 		}
	});

	this.field = arr;
	this.checkProcess();
}

Dataimport.prototype.checkData = function() {
	this.compareData = [];
	for(var i=0; i<this.jsonData.length; i++){
		var arr = [];
		if(section == 'contact'){
			arr.push(this.jsonData[i]['account_id']);
		}
		for(var j=0; j<this.field.length; j++){
			arr.push(this.jsonData[i][this.field[j]]);
		}
		this.compareData.push(arr.join('^'));
	}
}

Dataimport.prototype.checkProcess = function() {
	var arr = [];
	var arrIdx = [];
	var pass = 0;;
	var processType = '';
	var XDATA_RESULT = [];

	if(this.field.length === 0) return;

	$('.addDataMulti table.move th > select').each(function(){
		arr.push($(this).val());
	});


	for(var i=0; i<this.field.length; i++){
		var idx = arr.indexOf(this.field[i]);
		if(idx === -1){
			pass++
		}else{
			arrIdx.push(idx);
		}
	}

	if($('#process_type').val() === 'update'){
		processType = 'update';
	}else{
		processType = 'skip';
	}

	if(pass === 0){
		// 비교 실행
		dataimport.checkData();
		for(var i=0; i<XDATA.length; i++){
			var arr = [];
			if(section == 'contact'){
				arr.push(XDATA[i][0]);
			}

			arrIdx.forEach(function(elem){
				arr.push(XDATA[i][elem]);
			});
			var txt = arr.join('^');
			var idx = this.compareData.indexOf(txt);
			if(idx !== -1){
				XDATA_RESULT.push({
					'status': 'ready',
					'type': processType,
					'id': dataimport.jsonData[idx].id
				});
			}else{
				XDATA_RESULT.push({
					'status': 'ready',
					'type': 'new',
					'id' : ''
				});
			}
		}
		this.XDATA_RESULT = XDATA_RESULT;
		xlsxDataCount();
		multiCvsReDraw();

		// console.log(XDATA_RESULT);
	}else{
		// 비교 하지마
		// console.log(XDATA_RESULT);
	}

	if( section === 'account') {
		if( this.field.indexOf('account_id') != -1) {
			$('#addSelect').hide();
		}else {
			$('#addSelect').show();
		}
	}

	runBtn();
	loads();
};


Dataimport.prototype.checkRow = function(y) {
	var arr = [];
	var arrIdx = [];
	var pass = 0;;
	var processType = '';
	var XDATA_RESULT = [];

	if(this.field.length === 0) return;

	$('.addDataMulti table.move th > select').each(function(){
		arr.push($(this).val());
	});


	for(var i=0; i<this.field.length; i++){
		var idx = arr.indexOf(this.field[i]);
		if(idx === -1){
			pass++
		}else{
			arrIdx.push(idx);
		}
	}

	if($('#process_type').val() === 'update'){
		processType = 'update';
	}else{
		processType = 'skip';
	}


	if(pass === 0){
		// 비교 실행
		dataimport.checkData();
		var arr = [];
		arrIdx.forEach(function(elem){
		   arr.push(XDATA[y][elem]);
		});
		var txt = arr.join('^');
		var idx = this.compareData.indexOf(txt);

		if(idx !== -1){
		   dataimport.XDATA_RESULT[y].type = processType;
		}else{
		   dataimport.XDATA_RESULT[y].type = 'new';
		}

		// XDATA_RESULT.splice(0,1);
		xlsxDataCount();
		multiCvsReDraw();
	}
};
