var isPipeline = false;
grid.prototype.pipelineView = function(){
	console.log('[fn] grid.pipelineView');

	var upid		= document.getElementById('upid').value;
	// console.log(upid);
	var pipeType	= document.getElementById('pipeType');
	var xhttp 		= new XMLHttpRequest();
	var url 		= 'section/potential/pipe_view';
	if(pipeType){
		var params 		= 'upid=' + upid + '&w=' + encodeURIComponent(_this.SQL['where']) + '&v=' + pipeType.value;
	}else{
		var params 		= 'upid=' + upid + '&w=' + encodeURIComponent(_this.SQL['where']);
	}
	xhttp.open("POST", url, true);
	xhttp.onreadystatechange = function() {
		if(xhttp.readyState == XMLHttpRequest.DONE && xhttp.status == 200) {
			document.getElementsByClassName('grid-area')[0].innerHTML = xhttp.responseText;
			pipeLoad();
		};
	};
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send(params);

	var h1 = $(window).height() - $('.grid-area').offset().top;
	$('.grid-area').css('height',h1);
}


var potentialEvent = {
	priceChange: function($target){
		var i = $target.closest('tr').attr('data-num');
		potentialData[i].save_price = $target.val();
	},
	nameChange: function($target){
		var i = $target.closest('tr').attr('data-num');
		potentialData[i].save_name = $target.val();
	},
	applyNext: function($target){
		var value;
		var type = $target.closest('td').attr('data-type');
		var now = $target.closest('tr').attr('data-num');
		(type === 'price') ? value = $target.closest('td').find('input').val() : value = $target.closest('td').find('select').val();

		if(type === 'date') {
			value = $target.closest('td').find('input').val();
		}

		for(i=now; i<potentialData.length; i++){
			potentialData[i]['save_' + type] = value;
		}

		// // console.log(potentialData);

  		$table = $target.closest('table');
		$tr = $target.closest('tr');
		$td = $target.closest('td.applyAll');
		var trIdx = $tr.index();
		var tdIdx = $td.index();
		$target.remove();
		$td.removeAttr('style');
		var selVal = $td.find('select').val();
		$tr.nextAll().each(function() {
			$td.clone().insertAfter($(this).find('td').eq(tdIdx));
			$(this).find('td').eq(tdIdx).remove();
			$(this).find('td').eq(tdIdx).find('select').val(selVal);
			$(this).find('.icon-applyAll').remove();
		});

		fncApplyAll();
	}
}

function pipeLoad() {
	var h = $('.pipeWrap ol').height() - $('.pipeWrap .step').height() - 37;
	$('.pipeWrap ol ul').css('height', h);
	var el = document.querySelectorAll('.pipeWrap ol ul');
	var i=0;
	for(; i<el.length; i++){
		var sortable = Sortable.create(el[i], {
			group: 'elem',
			ghostClass: 'placeholder',
			onEnd: function () {
				getCost();
			},
			onAdd: function (e) {
				$target = $(e.target);
				var uppid = $target.parents('li.pipe-step').attr('data-uppid');
				var id = $(e.item).attr('data-id');
				$.ajax({
					type: "POST",
					url: 'db/potential',
					data: 'type=update_potential&uppid=' + uppid + '&id=' + id,
					success: function(data){
						// console.log(data);
					},
					error: function(txt){
						alert("Error");
					}
				});
			}
		});
	}
	// $('.pipeWrap ol ul').sortable({
	// 	helper: "clone",
	// 	placeholder: 'placeholder',
	// 	connectWith: '.pipeWrap ol ul',
	// 	containment: '.pipeWrap ol',
	// 	start: function(e, ui){
	// 		ui.placeholder.height(ui.helper.height());
	// 		$target = $(e.target);
	// 		var uppid = $target.parents('li.pipe-step').attr('data-uppid');
	// 	},
	// 	stop: function(e,ui) {
	// 		getCost();
	// 	},
	// 	receive: function(e, ui) {
	// 		$target = $(e.target);
	// 		var uppid = $target.parents('li.pipe-step').attr('data-uppid');
	// 		var id = $(ui.item[0]).attr('data-id');
	// 		$.ajax({
	// 				type: "POST",
	// 				url: 'db/potential',
	// 				data: 'type=update_potential&uppid=' + uppid + '&id=' + id,
	// 			success: function(data){
	// 				console.log(data);
	// 			},
	// 			error: function(txt){
	// 				alert("Error");
	// 			}
	// 		});
	// 	}
	// }).disableSelection();

	getCost();

	// 합/평균/갯수
	$('.pipeWrap .pipe-step li').click(function() {
		if($(this).hasClass('act')) {
			$(this).removeClass('act');
		}else {
			$(this).addClass('act');
		}

		var sum = 0 , average = 0,
			len = $('.pipeWrap .pipe-step li.act').length;
		$('.pipeWrap .pipe-step li.act').each(function() {
			var price = $(this).find('.price').text(),
				price = Number(price.replace("₩", '').split(',').join(''));

			sum += price;
			average = sum / len;
		});
		$('.checkCount').show();
		$('.checkCount').html('<span>개수 :</span> ' + len + '<span>합계 :</span>' + format._currency(sum, 'value') + '<span>평균 :</span>' + format._currency(average, 'value'));
	});
}

function getCost() {
	var i = 0,
		totalCost,
		pipeStep = $('.pipeWrap .pipe-step'),
		pipeStepIdx, len, cost,
		pipeStepLen = pipeStep.length;

	for(; i<pipeStepLen; i++) {
		totalCost = 0;
		cost = 0;
		len = 0;
		pipeStepIdx = pipeStep.eq(i);
		pipeStepIdx.find('li').each(function() {
			len = pipeStepIdx.find('li').length;
			cost = $(this).find('.price').text();
			cost = parseInt(format.onlyNumber(cost));

			totalCost += cost;
		});

		pipeStepIdx.find('.step .price').html('&#8361;' + format._currency(totalCost, 'value'));
		pipeStepIdx.find('.step em').html(len);
	}
}

var pipeSelectBox = selectbox.select;

selectbox.select = function($this) {
	pipeSelectBox($this);
	var idx = $this.index(),
		$target = $this.parents('li'),
		date = new Date(),
		slt = $this.parents('.select-element').prev(),
		dataType = slt.find('option').eq(idx).attr('data-type'),
		dataId =  slt.find('option').eq(idx).attr('data-id'),
		html = '';

	date = date.getFullYear() + '.' + (date.getMonth()+1) + '.' + date.getDate();

	if( slt.attr('class') === 'fieldSelect') {
		switch (dataType) {
			case 'multiSelect':
			case 'singleSelect':
			case 'step':
				html = '<option value="contains">값을 포함</option>'
				html += '<option value="not_contains">값을 미포함</option>'
				html += '<option value="not_empty">값이 있음</option>'
				html += '<option value="empty">값이 없음</option>'

				var len = $target.find('.type select').length;
				var html2 = '<select class="width100per" name="field' + dataId + '" multiple>';
				$.each(opt, function(idx, val) {
					if( dataId === val.field_id) {
						html2 += '<option data-id="' + val.field_id + '">' + val.opt_value + '</option>';
					}
				});
				html2 +=  '</select>';
				$target.find('.type').html(html2);
				selectbox.reload($target.find('.type select'));
				break;
			case 'checkbox':
				html = '<option value="checked">체크 됨</option>'
				html += '<option value="not_checked">체크되지 않음</option>'

				// $target.find('input[type="text"]').css('visibility', 'hidden');
				$target.find('input[type="text"]').remove();
				break;
			case 'date':
			case 'datetime':
			case 'currency':
			case 'number':
				html = '<option value="is">값이 같음</option>'
				html += '<option value="more">값이 큼</option>'
				html += '<option value="with_more">값이 크거나 같음</option>'
				html += '<option value="less">값이 작음</option>'
				html += '<option value="with_less">값이 작거나 같음</option>'
				html += '<option value="not_empty">값이 있음</option>'
				html += '<option value="empty">값이 없음</option>'

				if( dataType === 'date' || dataType === 'datetime') {
					$target.find('.type').html('<div class="element-calendar" data-type="' + dataType + '" onclick="calendarPicker.create($(this));"><input type="text" class="keepShow width100per" name="date" data-type="date" value="' + date + '" onkeydown="return calendarPicker.key($(this))"><div class="bt-calendar"></div></div>');
				}else {
					$target.find('.type').html('<input type="text" name="number" class="frmVal" data-type="number" onkeyup="pasteInput($(this))" value="" required="">');
				}
				break;
			default:
				html = '<option value="contains">값을 포함</option>'
				html +=	'<option value="not_contains">값을 미포함</option>'
				html +=	'<option value="is">같은 값</option>'
				html +=	'<option value="is_not">다른 값</option>'
				html +=	'<option value="starts_with">단어로 시작</option>'
				html +=	'<option value="ends_with">단어로 끝남</option>'
				html +=	'<option value="empty">값이 없음</option>'
				html +=	'<option value="not_empty">값이 있음</option>';

				$target.find('.type').html('<input type="text" placeholder="검색어" />');
				break;
		}
		$target.find('.filterSelect').html(html).next().remove();
		selectbox.reload($target.find('.filterSelect'));
	}else {
		var data_value = $this.attr('data-value');
		var data_name = $this.parents('.select-element').attr('data-name');

		var li = $this.parents('li');
		if( data_value === 'empty' || data_value === 'not_empty' ) {
			li.find('.type input').addClass('none');
		}else{
			li.find('.type input').removeClass('none');
		}

		var num = $this.parents('tr').attr('data-num');
		if( data_name === 'contact' || data_name === 'owner' || data_name === 'step') {
			potentialList.save(data_name, data_value, num);

		}else if( data_name === 'type') {
			var selVal = $('.changeSelPipeline').val();

			$('.pipeline tbody tr').each(function(idx) {
				potentialList.save('step', pValue[selVal][0]['uppid'], idx);
			});
		}
	}
}

// 데이터 검색
var potentialList = function(st, showCnt) {
	console.log('==========list');
	var html = '',
		en = (potentialData.length < st+showCnt) ? potentialData.length : st+showCnt;
	var d = new Date();
	var date = d.toISOString().slice(0,10).replace(/-/g,"");
	var contactName = [],
		contactId = [], save_date;

	$('.pipeline tbody tr').each(function(idx) {
		var n = $(this).attr('data-num');
		potentialData[n].save_date = '' || $(this).find('.element-calendar input').val();
		save_date = potentialData[n].save_date;
	});

	for(var i=st; i<en; i++) {
		contactName = (potentialData[i].contact_names == null) ? [] : potentialData[i].contact_names.split(',');
		contactId = (potentialData[i].contact_ids == null) ? [] : potentialData[i].contact_ids.split(',');
		// price = (!potentialData[i].save_price) ? '' : potentialData[i].save_price;
		potentialData[i].save_price = potentialData[i].save_price || '';
		// potentialData[i].save_step = potentialData[i].save_step || ;
		// potentialData[i].save_contact = potentialData[i].save_contact || '';
		// potentialData[i].save_owner = potentialData[i].save_owner || $(userList).eq(0).val();
		potentialData[i].save_name = potentialData[i]['account_name'] + '_' + date || potentialData[i].save_name;
		if(!potentialData[i].save_date) potentialData[i].save_date = '';
		if(contact_id) {
			var contact_selected = contact_id.split(',');
			for(var j=0; j<contact_selected.length; j++){
				for(var k=0; k<contactId.length; k++){
					if(contact_selected[j] === contactId[k]){
						potentialData[i].save_contact = contactId[k];
						var idx = contact_selected[j].indexOf(contactId[k]);
						contact_selected.splice(idx,1);
						k = contactId.length;
					}
				}
			}
		}

		html += '<tr data-num="' + i + '">';
		html += '	<td>' + potentialData[i]['account_name'] + '</td>';
		html += '	<td><input type="text" value="' + potentialData[i].save_name + '" onkeyup="potentialEvent.nameChange($(this))" /></td>';
		html += '	<td><select class="width100per" data-search="off" data-name="contact">' + potentialList.contact(contactName, contactId, potentialData[i].save_contact) + '</select></td>';
		html += '	<td data-type="owner" class="applyAll">';
		html += '		<select class="width100per" data-search="off" data-name="owner"><option></option>' + potentialList.owner(userList, potentialData[i].save_owner) + '</select>';
		html += '	</td>';
		html += '	<td data-type="price" class="applyAll">';
		html += '		<div class="inputT">';
		html += '			<span class="l"><span class="symbol" onclick="Form.currencyChange($(this))">₩</span></span>';
		html += '			<div><input type="number" min="0" onkeyup="potentialEvent.priceChange($(this))" value="' + potentialData[i].save_price + '"/></div>';
		html += '		</div>';
		html += '	</td>';
		html += '	<td data-type="step" class="applyAll potential-stage"><select class="width100per" data-search="off" ></select>';
		html += '	</td>';
		html += '	<td data-type="date" class="applyAll">';
		html += '		<div class="element-calendar" data-type="date" onclick="calendarPicker.create($(this));"><input type="text" class="keepShow width100per" name="date" data-type="date" onkeydown="return calendarPicker.key($(this))" value="' + potentialData[i].save_date + '"><div class="bt-calendar"></div></div>';
		html += '	</td>';
		html += '</tr>';
	}

	$('.potentialStep2 .pipeline tbody').html(html);
	$('.potentialStep2 .pipeline select').each(function(){
		selectbox.reload($(this));
	});

	potential.changeType();
	fncApplyAll();
};

function fncApplyAll() {
	$('#potentialList td.applyAll').hover(function(){
		$(this).append('<div class="icon-applyAll icon size40 applyall" onclick="potentialEvent.applyNext($(this))"></div>');
	},function(){
	  	$(this).find('.icon-applyAll').remove();
	});
}

$(function() {
	$('.bt_cancel').click(function() {
		location.href = '/?sec=potential/main';
	});

	$('.bt_pop.back').click(function() {
		$('.potentialStep1, .btn_step1').show();
		$('.potentialStep2, .btn_step2').hide();
	});

	// 요약보기
	$('#groupMenu .tit a').click(function() {
		console.log('요약보기');
		$('#pipeLine').toggleClass('simple');
	});
});

potentialList.owner = function(html, owner) {
	// var html = '<option></option>' + html;
	if(owner) {
		html = html.replace('value="' + owner + '"', 'value="' + owner + '" selected');
	}else {
		var uid = $('#uid').val();
		html = html.replace('value="' + uid + '"', 'value="' + uid + '" selected');
	}
	return html;
};
potentialList.contact = function(name, id, contact) {
	var opt = '<option></option>';
	for(var i=0, len=name.length; i<len; i++) {
		if(contact && contact === id[i])
			opt += '<option value="' + id[i] + '" selected>' + name[i] + '</option>';
		else
			opt += '<option value="' + id[i] + '">' + name[i] + '</option>';
	}
	return opt;
};

potentialList.save = function(type, val, i) {
	switch(type){
		case 'contact' :
		case 'owner' :
		case 'step' :
		case 'date' :
			var _type = 'save_' + type;
			potentialData[i][_type] = val;
			break;
	}
};

potentialList.complete = function(count) {
	console.log('count: ' + count);
	var frmdata = '',
		dataLen = 100,
		total = Math.ceil(potentialData.length/dataLen),
		len = (potentialData.length < count*dataLen+dataLen) ? potentialData.length : count*dataLen+dataLen;
	var d = new Date();
	var date = d.toISOString().slice(0,10).replace(/-/g,"");
	var selVal = $('.changeSelPipeline').val();

	if($('.changeSelPipeline option:selected').val()) {
		for(var i=count*dataLen; i<len; i++) {
			frmdata += '&accid[]=' + potentialData[i].id;
			frmdata += '&portName[]=' + (potentialData[i].save_name || potentialData[i].account_name + '_' + date);
			frmdata += '&contactid[]=' + (potentialData[i].save_contact || '');
			frmdata += '&userid[]=' + (potentialData[i].save_owner || '');
			frmdata += '&amount[]=' + (potentialData[i].save_price || '');
			frmdata += '&uppid[]=' + (potentialData[i].save_step || pValue[selVal][0]['uppid']);
			frmdata += '&closing_date[]=' + (potentialData[i].save_date || '');
		}

		console.log(frmdata);
		loading();

		$.ajax({
			type: "POST",
			data: 'type=create_pipeline' + frmdata,
			url: 'db/pipeline',
			success: function(msg){
				count++;

				if(count < total) {
					potentialList.complete(count);
				}else {
					window.location.replace('?sec=potential/main');
				}
			}
		});
	}else {
		alert('기회 타입을 선택해주세요.');
	}
}

var searchData = function() {
	loading();
	var t = $('.filterAddList select option:selected').text();
	var bool = false;

	$.each($('.filterAddList .select-element'), function(idx, val) {
		// console.log(idx, $(this).find('.header .label').text());
		if($(this).find('.header .label').text() === '') {
			bool = true;
		}
	});

	$.each($('.filterAddList .type > input'), function(idx, val) {
		if($(this).val() === '' && !$(this).hasClass('none')) {
			bool = true;
		}
	});

	if(!bool) {
		var field_arr = [];
		var condition_arr = [];
		var value_arr = [];
		var field, condition, value;
		$.each($('.filterAddList li'), function(idx, elem){
			var field = $(elem).find('select').first().val();
			var condition = $(elem).find('select').eq(1).val();
			var value = $(elem).find('input[type=text]').last().val();
			if(!value) value = $(elem).find('select').last().val();
			field_arr.push(field);
			condition_arr.push(condition);
			value_arr.push(encodeURIComponent(value));
		});

		setcookie.set('opp_field',		field_arr.join('^'));
		setcookie.set('opp_condition',	condition_arr.join('^'));
		setcookie.set('opp_value',		value_arr.join('^'));

		$.ajax({
			url: 'db/common',
			data: 'type=potentialData',
			success: function(data){
				loads();
				var data = JSON.parse(data);
				var showCnt = 20;
				var total = data.length;
				potentialData = data;

				potentialList(0, showCnt);

				$('#searchCount').html(total);
				Page.load('paging', total, showCnt, potentialList);

				$('.potentialStep1, .btn_step1').hide();
				$('.potentialStep2, .btn_step2').show();

				$('.btn_step2 .blue').click(function() {
					potentialList.complete(0);
				});
			},
			error: function(txt){
				alert("Error");
			}
		});

	}else {
		alert('빈 값을 입력해주세요.');
	}
};

var potentialSearch = function(field,condition,value){
	setcookie.set('opp_field',		field);
	setcookie.set('opp_condition',	condition);
	setcookie.set('opp_value',		value);

	$.ajax({
		url: 'db/common',
		data: 'type=potentialData',
		success: function(data){
			loads();
			var data = JSON.parse(data);
			var showCnt = 20;
			var total = data.length;
			potentialData = data;

			potentialList(0, showCnt);

			$('#searchCount').html(total);
			Page.load('paging', total, showCnt, potentialList);

			$('.potentialStep1, .btn_step1').hide();
			$('.potentialStep2, .btn_step2').show();

			$('.btn_step2 .blue').click(function() {
				potentialList.complete(0);
			});
		},
		error: function(txt){
			alert("Error");
		}
	});
}




var Page = Page || {};

Page = {
	load: function(id, total, len, fnc, data) {
		this.el = document.getElementById(id),
		this.total = total,
		this.len = len,
		this.lastPg = Math.ceil(this.total/this.len),
		this.currentPg = 1;
		this.fnc = fnc;
		this.data = data;

		this.draw();
		this.el.addEventListener('click', bind(this, this.event));
	},
	draw: function() {
		var nowPg = this.currentPg,
			html = '',
			cl, prevPg, nextPg,
			range = 2;

		// console.log(nowPg);
		if( nowPg < 4) {
			range = 6 - nowPg;
		}else if( nowPg > this.lastPg-3) {
			range = 5 - (this.lastPg-nowPg);
		}

		prevPg = (nowPg-1 < 1) ? 1 : nowPg-1;
		html = '<a class="arrow" data-pg="' + prevPg + '">❮</a>';
		for(var i=1; i<this.lastPg+1; i++) {
			cl = ( i === nowPg ) ? 'class="active"' : '';

			if( i === 1 || i === this.lastPg || i === nowPg) {
				html += this.pgCode(i, cl);
			}else if( i === nowPg-range || i === nowPg+range ) {
				html += '<a>...</a>';
			}else if( i < nowPg+range && i > nowPg-range) {
				html += this.pgCode(i, cl);
			}
		}

		nextPg = (nowPg+1 > this.lastPg) ? this.lastPg : nowPg+1;
		html += '<a class="arrow" data-pg="' + nextPg + '">❯</a>';
		this.el.innerHTML = html;
	},
	pgCode: function(i, cl) {
		return '<a data-pg="' + i + '" ' + cl + '>' + i + '</a>';
	},
	getCurrentPage: function() {
		return this.currentPg;
	},
	event: function() {
		var target = event.target;
		if(target && target.nodeName === 'A' && target.getAttribute('data-pg') !== null) {
			this.currentPg = parseInt(target.getAttribute('data-pg'));
			this.draw();
			this.fnc((this.currentPg-1)*this.len, this.len, this.data);
		}
	}
}

function bind(obj, fnc) {
	return function() {
		fnc.apply(obj, arguments);
	};
}
