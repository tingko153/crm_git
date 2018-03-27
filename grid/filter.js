var isFilter = false;
var filter = new function() {
	this.open = function() {
		console.log('[fn] filter.open');
		// $(".area-dbgrid, .area-filter").toggleClass("filter");
		$(".area-filter").toggle();
		if(isWidget) widget.close();


		var w = $('body').width() - $('.area-filter').width() - 23;

		if( $(".area-filter").css('display') == 'block') {
			var h = $('.area-body').height() - $('.area-button').height();
			$('#canvas').attr('width', w);
			$(".area-filter .outline").css('height', h);
			isFilter = true;
		}else {
			$('#canvas').attr('width', $('body').width()-20);
			isFilter = false;
		}

		grid.dataDraw();
		scrollbar.init();

  	}

	this.dragDrop = function()  {
		$("#filter-box .filterList").not(".filterGroup").each(function(){
			var target	= $(this);
			var type	= $(this).attr("data-type");
			var name	= $(this).attr("data-name");
			var a = '';
			target.append('<div class="filterIdxBox" data-type="' + type + '" data-name="' + name + '">' + a + '</div>');
			target.find(".filterIdxBox select").each(function(){
				$(this).css("display","none");
				var opt = '';
				$(this).find("option").each(function(n,obj){
					opt = opt + '<p class="option" data-value="' + obj.value + '" ' + obj.selected + ' onclick="selectbox.select($(this)); grid.changeCondition($(this));">' + obj.text + '</p>';
				});
				var sel = '<div class="select-element keepShow">' +
								'<div class="header" onclick="selectbox.open($(this))">' +
									'<div class="label">-- Select --</div>' +
									'<div class="fr icon select"></div>' +
								'</div>' +
								'<div class="body">' + opt + '</div>' +
							'</div>';
				$(this).after(sel);
				if(type === 'singleText') {
					if (filterArray[name]) {
						$(this).closest(".filterArea-wrap").find("#fieldValue").val(filterArray[name]['value']);
					}else{
						selectbox.select($(this).parent().find(".select-element p.option[data-value='contains']"));
					}
				}
			});
		});

		$("#filter-box").sortable({
			items: '> div.filterList:not(.fixeded), > div.filterOpt.group .filterList:not(.account_name), > div.line',
			cancel: '.label, .switch, .tab-menu, .fr, input',
			placeholder: "ui-state-highlight",
			connectWith: ".filterOpt.group",
			axis: 'y',
			start:function(e,ui){
				$(ui.placeholder[0]).css('height',ui.item[0].clientHeight);
				// $(ui.item[0]).css('width','279px');
				$(ui.item[0]).find('.ungroup').css('display','none');
			},
			update:function(){
				filter.groupCheck();
			},
			stop:function(e, ui) {
				$(ui.item[0]).find('.ungroup').css('display','block');
			}
		});

		$('.filterList.account_name, .filterList.owner').disableSelection();
	}

	this.createFilter = function(){
		console.log('[fn] filter.createFilter');

		$("#filter-box").html('');
		var filter_fixed = '';
		var filter_moving = '';
		var view;
		if(grid.gridHead[now]['filters'] !== null){
			var filterGetArr = grid.gridHead[now]['filters'].split('^');
			for(i=0; i<filterGetArr.length; i++){
				var arr = filterGetArr[i].split('|');
				var arr2 = [];
				arr2['condition'] = arr[2];
				arr2['type'] = arr[1];
				arr2['value'] = arr[3];
				filterArray[arr[0]] =  arr2;
			}
		}

		if(grid.gridHead[now]['filter_index'] !== null){
			var arr = JSON.parse(grid.gridHead[now]['filter_index']);
			for(i=0; i<arr.length; i++){
				var arr2 = arr[i].split('^');
				var arrLeft = arr2[1].split('|');
				var arrRight = arr2[2].split('|');
				idxCheck = [];
				idxCheck[arr2[0]] = new Array();
				if(arr2[1] !== ''){
					idxCheck[arr2[0]][0] = arrLeft;
				}else{
					idxCheck[arr2[0]][0] = [];
				}
				if(arr2[2]){
					idxCheck[arr2[0]][1] = arrRight;
				}else{
					idxCheck[arr2[0]][1] = [];
				}
			}
		}
		var fieldData = [];
		if(section == 'account'){
			var idx = 6;
			for(var i=0; i<grid.gridHead[now]['columns'].length; i++){
				if(i<3) {
					fieldData[i] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'account_name'){
					fieldData[3] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'account_id'){
					fieldData[4] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'owner'){
					fieldData[5] = grid.gridHead[now]['columns'][i];
				}else{
					fieldData[idx] = grid.gridHead[now]['columns'][i];
					idx++;
				}
			}
		}else if(section == 'contact') {
			var idx = 8;
			for(var i=0; i<grid.gridHead[now]['columns'].length; i++){
				if(i<3) {
					fieldData[i] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'account_name'){
					fieldData[3] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'contact_name'){
					fieldData[4] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'account_id'){
					fieldData[5] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'contact_id'){
					fieldData[6] = grid.gridHead[now]['columns'][i];
				}else if(grid.gridHead[now]['columns'][i]['field'] === 'owner'){
					fieldData[7] = grid.gridHead[now]['columns'][i];
				}else{
					fieldData[idx] = grid.gridHead[now]['columns'][i];
					idx++;
				}
			}
		}else{
			for(var i=0; i<grid.gridHead[now]['columns'].length; i++){
				fieldData[i] = grid.gridHead[now]['columns'][i];
			}
		}

		for(i=0; i<fieldData.length; i++){
			$this = fieldData[i];
			$label = $this.title;
			var color;
			var background;
			var a = '';

			if($this['columns']){
				if($this.color !== 'null' || $this.color !== 'undefined'){
					color = $this.color;
				}else{
					color = '';
				}
				if($this.background !== 'null' || $this.background !== 'undefined'){
					background = $this.background;
				}else{
					background = '';
				}
				if($this.view === false) {
					view = '';
				}else{
					view = 'checked="checked"';
				}
				a += '<div class="filterOpt group">' +
							'<div class="filterGroup" data-color="' + color + '" data-background="' + background + '">' +
								'<div class="title">' +
									// '<div class="switch transit-bounce" data-checked="checked" onclick="filter.viewGroup($(this))">' +
									// 	'<input type="checkbox"/><span class="set transit-bounce"></span>' +
									// '</div>' +
									// '<div class="label">[Group] <span>' + $label + '</span></div>' +
									'<input type="checkbox" id="_filter'+i+'" class="switch" onclick="filter.viewGroup($(this))" checked/><label for="_filter'+i+'"></label><strong>[' + lang('group') + '] <span>' + $label + '</span></strong>' +
									'<div class="fr bt-area"><span class="icon arrow bottom" onclick="filter.moving($(this),\'down\')"></span><span class="icon arrow top" onclick="filter.moving($(this),\'up\')"></span></div>' +
									'<div class="clear"></div>' +
								'</div>' +
							'</div>';
				for(j=0; j<$this['columns'].length; j++){
					$this2 = fieldData[i]['columns'][j];
					$label2 = fieldData[i]['columns'][j].title;
					if($this2.color){
						color = $this2.color;
					}else{
						color = '';
					}
					if($this2.background){
						background = $this2.background;
					}else{
						background = '';
					}
					if(!$this2.width || $this2.width === 'null') {
						width = '100';
					}else{
						width = $this2.width.replace('px','');
					}
					if($this2.view === false) {
						view = '';
					}else{
						view = 'checked="checked"';
					}
					if($this2.fixeded) {
						fixeded = 'fixeded ';
					}else{
						fixeded = '';
					}

					console.log('2')
					a += filter.filerListHtml(fixeded, $this2.type, $this2.field, $label2, '', {
						'width': width,
						'color': color,
						'background': background,
						'i': i,
						'view': (!$this2.visable) ? '' : view
					});
				}
				a = a + '</div>';
				if($this.fixedcolum === true || $this.fixeded === true){
					filter_fixed = filter_fixed + a;
				}else{
					filter_moving = filter_moving + a;
				}
			}else{
				var checkboxVisible = '';
				if(fieldData[i].filterable !== false) {
					if(!$this.width || $this.width === 'null') {
						width = '100';
					}else{
						width = $this.width.replace('px','');
					}
					if($this.color){
						color = $this.color;
					}else{
						color = '';
					}
					if($this.background){
						background = $this.background;
					}else{
						background = '';
					}
					if($this.fixeded){
						fixeded = 'fixeded ';
						// checkboxVisible = 'hidden';
					}else{
						fixeded = '';
					}

					if($this.field !== 'f_name' && $this.field !== 'l_name'){
						if($this.visable === false) {
							a += filter.filerListHtml(fixeded, $this.type, $this.field, $label, $this.field_opt, {
								'width': width,
								'color': color,
								'background': background,
								'i': i,
								'view': view,
								'check': checkboxVisible
							});

						}else {
							a += filter.filerListHtml(fixeded, $this.type, $this.field, $label, $this.field_opt, {
								'width': width,
								'color': color,
								'background': background,
								'i': i,
								'view': (!$this.view) ? '' : 'checked="checked"',
								'check': checkboxVisible
							});
						}

						if($this.fixedcolum === true || $this.fixeded === true){
							filter_fixed += a;
						}else{
							filter_moving += a;
						}
					}
				}
			}
		}
		var line;
		if (!filter_fixed) filter_fixed = '';
		line = '<div class="line"></div>';
		$("#filter-box").html(filter_fixed + line + filter_moving);

		$("#filter-box").find(".datetime").calendar();

		filter.dragDrop();
		filter.groupCheck();
	};

	this.filerListHtml = function(fixed, dataType, dataField, label, dataOpt, args) {
		var html = '';

		// ==== [args]
		// 'width': width,
		// 'color': color,
		// 'background': background,
		// 'i': i,
		// 'view': view,
		// 'check': check
		args.color = args.color || '';
		args.background = args.background || '';
		args.check = args.check || '';
		args.i = args.i || '';

		// var dis = '';
		// if(fixed != '') {
		// 	dis = 'disabled';
		// }
		var view = '';
		if(args.view !== '') {
			view = 'on'
		}
		html = '<div class="filterList ' + fixed + dataField + '" data-type="' + dataType + '" data-view="' + view + '" data-name="' + dataField + '" data-opt="' + dataOpt + '" data-width="' + args.width + '" data-color="' + args.color + '" data-background="' + args.background + '">' +
					'<div class="title">' +
						'<input type="checkbox" id="filter'+args.i+'" class="switch" ' + args.view + ' onclick="filter.viewOnOff($(this))" /><label for="filter'+args.i+'" class="' +  args.check + '"></label>' +
						'<div class="icon filter off" onclick="filter.openFilter($(this),\'' + dataType + '\',\'' + dataField + '\');"></div>' +
						'<span onclick="filter.openFilter($(this),\'' + dataType + '\',\'' + dataField + '\');">' + label + '</span>' +
					'</div>' +
				'</div>';

		return html;
	}


	this.openFilter = function($target,type,name){
		console.log('[fn] filter.openFilter');
		filterStatus = true;
		grid.dataindex($target.closest(".filterList").find(".filterIdxBox"),name,type);
	};

	this.viewGroup = function($target){
		console.log('[fn] filter.viewGroup');

		var a = $target.is(':checked');

		if (a) {
			$target.closest(".filterOpt").find(".filterList").each(function(){
				$(this).find('input[type="checkbox"]').prop("checked",true);
			});
		}else{
			$target.closest(".filterOpt").find(".filterList").each(function(){
				$(this).find('input[type="checkbox"]').prop("checked", false);
			});
		}
		grid.drawHeader();
	};

	this.viewOnOff = function($target){
		console.log('[fn] filter.viewInOff');

		if ($target.closest(".filterOpt").find(".filterGroup").length > 0) {
			if($target.is(':checked')) {
				$target.closest(".filterOpt").find('input[type="checkbox"]').prop('checked', true);
			}else {
				$target.closest(".filterOpt").find('input[type="checkbox"]').prop("checked", false);
			}
		}
		// drawtime();

		ctxLeft = 0;
	};

	this.ungroup = function($target){
		console.log('[fn] filter.ungroup');
		$targetList = $target.closest('.filterList');
		$target.closest('.filterOpt.group').after($targetList);
		filter.groupCheck();
	};

	this.makegroup = function($target){
		console.log('[fn] filter.makegroup');
		$target.find('.tab-layer').addClass('show');
		$target.find('.tab-layer input').first().focus();
	};

	this.makegroupenter = function(e,$target){
		if(e.keyCode === 13){
			filter.makegroupsubmit($target);
		}
	};

	this.makegroupsubmit = function($target){
		console.log('[fn] filter.makegroupsubmit');
		$input = $target.closest(".tab-layer").find("input[type=text]");
		if($input.val().trim()){
			$target.closest(".tab-layer").find(".err").text("");
			// $target.closest(".filterList").find('.switch').attr("data-checked","checked");
			$target.closest(".filterList").find('input[type="checkbox"]').prop("checked",true);
			var a = '<div class="filterOpt group">' +
						'<div class="filterGroup">' +
							'<div class="title">' +
								// '<div class="switch transit-bounce" data-checked="checked" onclick="filter.viewGroup($(this))"><input type="checkbox"><span class="set transit-bounce"></span></div>' +
								// '<div class="label">[Group] <span>' + $input.val().trim() + '</span></div>' +
								'<input type="checkbox" id="_filter'+i+'" class="switch" onclick="filter.viewGroup($(this))" checked/><label for="_filter'+i+'"></label><strong>[Group] <span>' + $input.val().trim() + '</span></strong>' +
								'<div class="fr bt-area"><span class="icon arrow bottom" onclick="filter.moving($(this),\'down\')"></span><span class="icon arrow top" onclick="filter.moving($(this),\'up\')"></span></div>' +
							'</div>' +
						'</div>' + $target.closest(".filterList").prop('outerHTML') +
					'</div>';
			$target.closest(".filterList").prop('outerHTML',a);
			filter.dragDrop();
			filter.groupCheck();
		}else{
			$target.closest(".tab-layer").find(".err").text("Please enter some label.");
		}
	};

	this.moving = function($target,type){
		console.log('[fn] filter.moving');

		if (type === "up") {
			$this = $target.closest(".filterOpt");
			if($(this).prev().hasClass("line")){
				$this.prev().prev().before($this);
			}else{
				$this.prev().before($this);
			}
		}else{
			$this = $target.closest(".filterOpt");
			if($(this).next().hasClass("line")){
				$this.next().next().after($this);
			}else{
				$this.next().after($this);
			}
		}
		grid.drawHeader();
	};

	this.groupCheck = function(){
		console.log('[fn] filter.groupCheck');
		var gridHead = grid.gridHead[now].columns;
		$(".ungroup").remove();
		$(".filterOpt.group > .filterList").each(function(){
			$(this).append('<div class="fr ungroup" onclick="filter.ungroup($(this))">' + lang('ungroup') + '</div>');
		});

		$("#filter-box > .filterList").each(function(idx){
			if(!gridHead[idx+3].fixeded){
				if(!$(this).closest(".filterOpt.group").length){
					a = '<div class="fr ungroup tab-menu" onclick="filter.makegroup($(this))">' + lang('new group') +
						'	<div class="tab-layer bodyhidden middle-right" style="z-index:999; width:200px;">' +
						'		<div><label class="input"><input type="text" class="width100per" onkeypress="filter.makegroupenter(event,$(this));"/></label></div>' +
						'		<div class="err"></div>' +
						'		<div class="height5"></div>' +
						'		<div><button class="bt black width100per" onclick="filter.makegroupsubmit($(this))">Submit</button></div>' +
						'	</div>' +
						'</div>';
					$(this).append(a);
				}
			}

		});
		$("#filter-box .filterOpt.group").each(function(){
			if($(this).find(".filterList").length === 0){
				$(this).remove();
			}
		});

		grid.drawHeader();
	};

}();

function drawtime() {
	var word = $('.header-menu.active #fieldValue').val();

	if(word) {
		grid.filterKeyword($('.header-menu.active #fieldValue')[0]);
	}
	$('#filter-box .filterList').each(function(){
		if($(this).find('input[type=checkbox]').prop('checked')){
			$(this).attr('data-view','on');
		}else{
			$(this).attr('data-view','');
		}
	});
	grid.drawHeader();
}
$(function() {
	$('.apply-filter a').click(function() {
		// $('#filter-box .filterList').not('.fixeded').find('input[type="checkbox"]').prop('checked', false);
		$('#filter-box .filterList').find('input[type="checkbox"]').prop('checked', false);
	});
});
