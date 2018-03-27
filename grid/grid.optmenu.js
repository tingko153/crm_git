// grid.color = '';
// for(i=1; i<19; i++){
// 	if (i === 1) {
// 		grid.color += '<span class="selector active color' + i + '" onclick="grid.colorSelect($(this))"></span>';
// 	}else{
// 		grid.color += '<span class="selector color' + i + '" onclick="grid.colorSelect($(this))"></span>';
// 	}
// }
var backgroundColor = [];
var textColor = [];
var columnTop = '<div class="tab-layer bodyhidden">' +
					'<table style="width:202px;">' +
						'<tr>' +
							'<td style="vertical-align:top;">';
var columnTopW = '<div class="tab-layer bodyhidden">' +
					'<table style="width:500px;">' +
						'<tr>' +
							'<td style="paddint-top:1px;">';
var columnMiddle =  '<div class="menu colorpicker keepShow" onclick="grid.optmenuSlide($(this))"><span class="icon colorpicker"></span>셀 칼라 변경<span class="icon sort-header asc"></span></div>' +
					'<div class="palette">' +
						'<ol>' +
							'<li style="background:#ccf3fc; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#cedffc; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#c1b9fc; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#d6b8fc; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e8c6db; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f0ced1; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f4d5cc; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f8e4ce; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f9e7cb; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#fef6d5; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f9f7d4; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e0e9ca; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#a0e7f7; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#a2c1f7; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#998cf8; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#bc8cf8; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#dba3c5; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e4a9ae; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ebb4a5; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f1cca1; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f2d2a1; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#faeaa8; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f1edaa; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ccdba7; color:#000000;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#73dcf4; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#76a4f4; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#7260f5; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#a360f5; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#d07fb1; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#db838b; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e3947d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ecb577; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#eebf76; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f5dd7d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ece681; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#bad083; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#4ad1f0; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#4c88f0; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#4e38f0; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#8a38f0; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#c75a9d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#d45c67; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#de7354; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e8a04d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ebac4b; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#f0d154; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e8e056; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#a9c75f; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#23c5eb; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#256eeb; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#2b11eb; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#7311eb; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#c1358b; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#cf3643; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#db532b; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e78b22; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ea9b20; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ebc62d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e6dc2c; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#99c03a; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#00b8e3; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#0054e5; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#1900d2; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#5e00d2; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#aa2176; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#c21827; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#d0380c; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#de7700; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#df8800; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e6ba07; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#e6d902; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#85ad23; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#0097ba; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#0045bc; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#1400a9; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#4c00a9; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#8d165f; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#a20f1c; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#ae2b05; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#b56100; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#b66f00; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#c49d00; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#beb400; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#6d8f18; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#007793; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#003794; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#100082; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#3a0082; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#6e0e49; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#820813; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#8b2000; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#8e4c00; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#8f5700; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#9c7e00; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#978f00; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#55710f; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#00586d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#00296f; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#0b005d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#2a005d; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#4f0834; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#61030c; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#661700; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#693800; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#6a4000; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#765f00; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#716b00; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#3d5309; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +

							'<li style="background:#ffffff; color:#000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#eaeaea; color:#000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#d5d5d5; color:#000;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#c0c0c0; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#aaaaaa; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#959595; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#808080; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#6b6b6b; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#565656; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#414141; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#2b2b2b; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
							'<li style="background:#161616; color:#ffffff;" onclick="grid.colorSelect($(this))"></li>' +
						'</ol>' +
					'</div><div class="clear"></div>';
				'</td>';
var columnBottom = 		'</tr>' +
					'</table>' +
				'</div>';

grid.prototype.optmenuSlide = function($target) {
	if( $target.attr('class').indexOf('colorpicker') == -1 ) {
		if( $target.closest('.tab-layer').find('.filter-searchbox').attr('class').indexOf('active') == -1 ) {
			$target.find('.sort-header').removeClass('asc').addClass('desc');
			$target.closest('.tab-layer').find('.palette').removeClass('active');
			$target.closest('.tab-layer').find('.filter-searchbox').addClass('active');
		}else {
			// $target.find('.sort-header').removeClass('desc').addClass('asc');
			// $target.closest('.tab-layer').find('.filter-searchbox').removeClass('active');
		}
	}else {
		if( $target.closest('.tab-layer').find('.palette').attr('class').indexOf('active') == -1) {
			$target.find('.sort-header').removeClass('asc').addClass('desc');
			$target.closest('.tab-layer').find('.palette').addClass('active');
			$target.closest('.tab-layer').find('.filter-searchbox').removeClass('active');
		}else {
			// $target.find('.sort-header').removeClass('desc').addClass('asc');
			// $target.closest('.tab-layer').find('.palette').removeClass('active');
		}
	}
}

grid.prototype.drawOptMenu = function() {
	console.log('[fn] grid.drawOptMenu');

	leftcol			= '';
	rightcol		= '';
	colLeft			= [];
	colRight		= [];
	headfixed 		= '';
	headfixed2		= '';
	headmoving		= '';
	headmoving2		= '';
	fieldName		= [];
	$headerLeft.html('');
	$headerRight.html('');
	// $gridArea.css("top",$gridTab.outerHeight());
	leftwidth	= 0;
	rightwidth	= 0;

	var menuOptSortasc	= '<div class="menu sort asc" data-sort="asc" onclick="grid.dataSort($(this))"><span class="icon sort asc"></span>오름차순 정렬</div>';
	var menuOptSortdesc = '<div class="menu sort desc" data-sort="desc" onclick="grid.dataSort($(this))"><span class="icon sort desc"></span>내림차순 정렬</div>';
	var menuOptLock		= '<div class="menu lock" onclick="grid.menuLock($(this))"><span class="icon lock"></span>잠금</div>';
	var menuOptUnlock	= '<div class="menu unlock" data-lock="true" onclick="grid.menuUnlock($(this))"><span class="icon unlock"></span>잠금해제</div>';
	var menuOptLine		= '<div class="line"></div>';
	var menuOptHide		= '<div class="menu hideColumn" onclick="grid.hideColumn($(this))"><span class="icon hide"></span>숨기기</div>';
	var menuOptDelete	= '<div class="menu"><span class="icon delete"></span>삭제</div>';
	var menuOpt;
	var fixed = 'true';
	var filterOpt = '<div class="filterIdx" style="display:none; vertical-align:top;"></div><div class="apply-filter" data-pos="header"><button type="button" class="bt submit" onclick="loadingBtn($(this), drawtime)">필터 적용</button><a>전체 해제</a></div>';
	var _this = grid.gridHead[now].columns;

	for(i=0; i<_this.length; i++){
		if(_this[i].defult === true){
			headfixed 	+= '<th class="col column fixed" rowspan="2" style="width:' + _this[i].width + 'px">' + _this[i].header + '</th>';
			leftcol 	+= '<col class="fixed" data-name="' + _this[i].field + '" data-type="' + _this[i].type + '" data-opt="' + _this[i].field_opt + '" style="width:' + _this[i].width + 'px;">';
		}
	}
	$('.area-filter .filter-group > div').each(function(idx){
		var colclass 	= '';
		var style		= '';
		var stylecol	= '';
		var columnmenu	= '';
		var classarray	= [];
		var fixeded = ($(this).hasClass('fixeded')) ? ' fixeded' : '';

		if($(this).hasClass('line')){
			fixed = 'false';
		}else{
			if($(this).hasClass('group')){
				var colspan = 0;
				$(this).find('.filterList').each(function(){
					if($(this).find('input[type="checkbox"]').is(':checked') ){
						colspan++;
					}
				});

				// Group Header
				$target = $(this).find('.filterGroup');
				classarray = [];
				if (!$target.find('input[type="checkbox"]').is(':checked')){
					classarray.push('none');
				}
				colclass = classarray.join(" ");
				var title = $target.find('.label span').text();
				columnmenu = columnTop + (menuOptLock + menuOptUnlock + menuOptLine + menuOptHide + menuOptLine) + '</td><td>' + columnMiddle + menuOptLine + filterOpt + columnBottom;

				if($target.attr('data-color') && $target.attr('data-color') != 'undefined'){
					style += 'color:' + $target.attr('data-color') + '; ';
				}
				if($target.attr('data-background') !== '' && $target.attr('data-background') != 'undefined'){
					style += 'background-color:' + $target.attr('data-background') + '; ';
				}
				if(style !== ''){
					style = 'style="' + style + '"';
				}

				var html = '<th class="col group-title ' + colclass + fixeded +'" colspan="' + colspan + '" ' + style + ' data-lock="true"><div class="th-label"><div class="title"><span>' + title + '</span></div><div class="icon tab-menu header-menu">' + columnmenu + '</div></div></th>';
				if(fixed === 'true'){
					headfixed += html;
				}else{
					headmoving += html;
				}

				$(this).find('.filterList').each(function(){
					$target = $(this);
					classarray = [];
					if (!$target.find('input[type="checkbox"]').is(':checked')){
						classarray.push('none');
					}
					colclass = classarray.join(" ");

					var name = $target.attr('data-name');
					var type = $target.attr('data-type');
					var opt = $target.attr('data-opt');
					var text = $target.find('.title').text();
					var style ='';

					menuOpt = menuOptSortasc + menuOptSortdesc + menuOptLine + menuOptLock + menuOptUnlock + menuOptLine + menuOptHide + menuOptDelete;
					columnmenu = columnTopW + menuOpt + '</td><td>' + columnMiddle + menuOptLine + filterOpt + columnBottom;

					if($target.attr('data-color') && $target.attr('data-color') != 'undefined'){
						style += 'color:' + $target.attr('data-color') + '; ';
					}
					if($target.attr('data-background') !== '' && $target.attr('data-background') != 'undefined'){
						style += 'background-color:' + $target.attr('data-background') + '; ';
					}

					if($target.attr('data-width')){
						style += 'width:' + $target.attr('data-width').replace('px','') + 'px; ';
					}else{
						style += 'width:100px; ';
						$target.attr('data-width','100px');
					}

					if(style !== ''){
						style = 'style="' + style + '"';
					}

					if(fixed === 'true'){
						headfixed2 += '<th class="column second resize ' + colclass + fixeded + '" data-idx="' + (idx+3) + '" data-name="' + name + '" data-type="' + type + '" ' + style + ' data-lock="false"><div class="th-label"><div class="title"><span>' + text + '</span></div><div class="icon tab-menu header-menu" onclick="grid.optMenu($(this))">' + columnmenu + '</div></div></th>';
						leftcol += '<col class="' + colclass + '" data-name="' + name + '" data-type="' + type + '" data-opt="' + opt + '" ' + style + '">';
						colLeft.push(name);
					}else{
						headmoving2 += '<th class="column second resize ' + colclass + fixeded + '" data-idx="' + (idx+2) + '" data-name="' + name + '" data-type="' + type + '" ' + style + ' data-lock="false"><div class="th-label"><div class="title"><span>' + text + '</span></div><div class="icon tab-menu header-menu" onclick="grid.optMenu($(this))">' + columnmenu + '</div></div></th>';
						rightcol += '<col class="' + colclass + '" data-name="' + name + '" data-type="' + type + '" data-opt="' + opt + '" ' + style + '">';
						colRight.push(name);
					}
				});
			}else{
				$target = $(this);
				var name = $target.attr('data-name');
				var type = $target.attr('data-type');
				var opt = $target.attr('data-opt');
				var text = $target.find('.title').text();
				classarray = [];
				if (!$target.find('input[type="checkbox"]').is(':checked')){
					classarray.push('none');
				}
				colclass = classarray.join(" ");
				menuOpt = menuOptSortasc + menuOptSortdesc + menuOptLine + menuOptLock + menuOptUnlock + menuOptLine + menuOptHide + menuOptDelete;
				columnmenu = columnTopW + menuOpt + '</td><td>' + columnMiddle + filterOpt + columnBottom;

				if($target.attr('data-color') && $target.attr('data-color') != 'undefined'){
					style += 'color:' + $target.attr('data-color') + '; ';
				}
				if($target.attr('data-background') !== '' && $target.attr('data-background') != 'undefined'){
					style += 'background-color:' + $target.attr('data-background') + '; ';
				}

				if($target.attr('data-width')){
					style += 'width:' + $target.attr('data-width').replace('px','') + 'px; ';
				}else{
					style += 'width:100px; ';
					$target.attr('data-width','100px');
				}

				if(style !== ''){
					style = 'style="' + style + '"';
				}

				if(fixed === 'true'){
					headfixed += '<th class="col column second resize ' + colclass + fixeded + '" data-idx="' + (idx+3) + '" data-name="' + name + '" data-type="' + type + '" ' + style + ' rowspan="2"><div class="th-label"><div class="title"><span>' + text + '</span></div><div class="icon tab-menu header-menu" onclick="grid.optMenu($(this))">' + columnmenu + '</div></div></th>';
					leftcol += '<col class="' + colclass + '" data-name="' + name + '" data-type="' + type + '" data-opt="' + opt + '" ' + style + '">';
					colLeft.push(name);
				}else{
					headmoving += '<th class="col column second resize ' + colclass + fixeded + '" data-idx="' + (idx+2) + '" data-name="' + name + '" data-type="' + type + '" ' + style + ' rowspan="2"><div class="th-label"><div class="title"><span>' + text + '</span></div><div class="icon tab-menu header-menu" onclick="grid.optMenu($(this))">' + columnmenu + '</div></div></th>';
					rightcol += '<col class="' + colclass + '" data-name="' + name + '" data-type="' + type + '" data-opt="' + opt + '" ' + style + '">';
					colRight.push(name);
				}
			}
		}
	});

	headfixed = '<tr class="sortable">' + headfixed + '</tr>';
	headmoving = '<tr class="sortable">' + headmoving + '</tr>';
	if (headfixed2) {headfixed2 = '<tr class="sortable">' + headfixed2 + '</tr>';}
	if (headmoving2) {headmoving2 = '<tr class="sortable">' + headmoving2 + '</tr>';}
	$headerLeft.html('<table class="grid-table"><colgroup>' + leftcol + '</colgroup><tbody>' + headfixed + headfixed2 + '</tbody></table>');
	$headerRight.html('<table class="grid-table"><colgroup>' + rightcol + '</colgroup><tbody>' + headmoving + headmoving2 + '</tbody></table>');

	aa.colSel();
}

grid.prototype.menuLock = function($target){
	console.log('[fn] grid.menuLock');

	if (!$target.hasClass("disabled")) {
		var name = $target.closest('th').find('.title span').text();
		$('.filter-group .filterGroup').each(function(){
			if(name === $(this).find('.label span').text()){
				$targetFrom = $(this).closest('.filterOpt');
				$('.filter-group .line').before($targetFrom);
				filter.groupCheck();
			}
		});

		$('.filter-group > div.filterList').each(function(){
			if(name === $(this).find('.label span').text()){
				$targetFrom = $(this);
				$('.filter-group .line').before($targetFrom);
				filter.groupCheck();
			}
		});
	}
};

grid.prototype.menuUnlock = function($target){
	console.log('[fn] grid.menuUnlock');
	if (!$target.hasClass("disabled")) {
		var name = $target.closest('th').find('.title span').text();
		$('.filter-group .filterGroup').each(function(){
			if(name === $(this).find('.label span').text()){
				$targetFrom = $(this).closest('.filterOpt');
				$('.filter-group .line').after($targetFrom);
				grid.drawHeader();
			}
		});

		$('.filter-group > div.filterList').each(function(){
			if(name === $(this).find('.label span').text()){
				$targetFrom = $(this);
				$('.filter-group .line').after($targetFrom);
				grid.drawHeader();
			}
		});
	}
};

grid.prototype.dataSort = function($target){
	console.log('[fn] grid.dataSort');
	event.stopPropagation();
	arrCell = [];
	$gridArea.find(".sort-header").remove();
	$th = $target.closest("th");
	sortName = $th.attr("data-name");
	sortType = $target.attr("data-sort");
	this.filterling();

};

grid.prototype.hideColumn = function($target){
	console.log('[fn] grid.hideColumn');
	arrCell = [];
	$th = $target.closest("th");
	if($th.hasClass('group-title')){
		var name = $th.find('.title span').text();
		$('.filter-group .filterOpt.group').each(function(){
			console.log($(this).find('.label span').text());
			if($(this).find('.filterGroup .label span').text() === name){
				filter.viewGroup($(this).find('.filterGroup .switch'));
			}
		});
	}else{
		var name = $th.attr("data-name");
		$('.filter-group .filterList').each(function(){
			if($(this).attr('data-name') === name){
				$switch = $(this).find('.switch')
				$switch.prop("checked", false);
				$(this).attr('data-view','');
				grid.drawHeader();
			}
		});
	}
};

grid.prototype.optMenu = function($target){
	console.log('[fn] grid.optMenu');

	if (!$target.find(".tab-layer").hasClass("show") && $target.hasClass("header-menu")) {
		$target.find('.palette').removeClass('active');
		$(".area-dbgrid, .area-filter").removeClass("filter");
		$grid.find(".header-menu.active").removeClass("active");
		$target.addClass("active");
		$layer = $target.find(".tab-layer").first();
		$layer.addClass("right");
		$layer.show();
		if($(window).width() > $target.offset().left + $layer.outerWidth()) {
			$layer.removeClass("right");
		}
		if ($target.closest("th").attr("data-lock") === 'false') {
			$layer.find(".menu.lock").addClass("disabled");
			$layer.find(".menu.unlock").addClass("disabled");
		}else if ($target.closest(".grid-fixed").length > 0) {
			$layer.find(".menu.lock").addClass("disabled");
			$layer.find(".menu.unlock").removeClass("disabled");
		}else{
			$layer.find(".menu.lock").removeClass("disabled");
			$layer.find(".menu.unlock").addClass("disabled");
		}
		var dataName = $target.closest("th").attr("data-name");
		var dataType = $target.closest("th").attr("data-type");
		if(dataName){
			filterAll = true;
			_this.dataindex($layer,dataName,dataType);
		}

		setTimeout(function() {
			$target.find(".input input").first().focus();
		}, 500);
	}

	var currentBackground = $target.parents('.col').css('background-color');

	$target.find('.palette ol li').each(function() {
		var background = $(this).css('background-color');
		if( currentBackground == background ) {
			$(this).addClass('active');
		}
	});
};

grid.prototype.colorSelect = function($target){
	console.log('[fn] grid.colorSelect');

	var background = $target.css("background-color");
	var color = $target.css("color");
	var $targetTh = $target.closest("th");
	var name;
	$target.closest("ol").find(".active").removeClass("active");
	$target.addClass("active");

	$targetTh.css("background-color",background);
	$targetTh.find(".title").first().css("color",color);

	if ($targetTh.hasClass("group-title")) {
		var a = $targetTh.find('.title span').text();
		$('.filter-group .filterGroup').each(function(){
			if($(this).find('.title .label span').text() === a){
				$(this).attr('data-background',background);
				$(this).attr('data-color',color);

				$(this).parent().find('.filterList').each(function(){
					var b = $(this).attr('data-name');
					$(this).attr('data-background',background);
					$(this).attr('data-color',color);

					$grid.gridHeader.find('th').each(function(){
						if($(this).attr('data-name') === b){
							$(this).css("background-color",background);
							$(this).css('color',color);
						}
					});
				});
			}
		});
	}
	var name = $targetTh.attr('data-name');
	if(name){
		$("#filter-box .filterList").each(function(){
			if($(this).attr('data-name') === name){
				$(this).attr('data-background',background);
				$(this).attr('data-color',color);
			}
		});
	}else if($targetTh.hasClass('group-title')){
		name = $targetTh.find('.title span').text();
		$("#filter-box .filterGroup").each(function(){
			if($(this).find('.title .label span').text() === name){
				$(this).attr('data-background',background);
				$(this).attr('data-color',color);
			}
		});
	}
};

grid.prototype.markfilter = function(){
	console.log('[fn] grid.markfilter');
	$(".filterList").not(".filterGroup").each(function(){
		var name = $(this).attr("data-name");
		if (filterArray[name]) {
			if ((filterArray[name]['condition'] === 'empty' || filterArray[name]['condition'] === 'not_empty' || filterArray[name]['value'] !== '')) {
				$(this).find(".filter.off").removeClass("off").addClass("on");
			}else{
				$(this).find(".filter.on").removeClass("on").addClass("off");
			}
		}else if(idxCheck[name] && idxCheck[name] !== null){
			$(this).find(".filter.off").removeClass("off").addClass("on");
		}else{
			$(this).find(".filter.on").removeClass("on").addClass("off");
		}
	});
};

grid.prototype.dataindex = function($target,name,type){
	console.log('[fn] grid.dataindex');

	grid.arrIndex;

	var arr2 = [];
	for(var na in idxCheck){
		if(name !== na) {
			if(idxCheck[na] !== null){
				var w;
				if(idxCheck[na][0].length > 0){
					w = "'" + idxCheck[na][0].join("','") + "'";
					arr2.push(na + " NOT IN (" + w + ")");
				}else{
					w = "'" + idxCheck[na][1].join("','") + "'";
					arr2.push(na + " IN (" + w + ")");
				}
			}
		}
	}

	this.SQLwhere2 = '';

	if(arr2.length > 0){
		if(_this.SQLwhere === ''){
			this.SQLwhere2 = ' (' + arr2.join(') AND (') + ')';
		}else{
			this.SQLwhere2 = ' AND (' + arr2.join(') AND (') + ')';
		}
	}

	var w = [];
	if(_this.SQLwhere || _this.SQLwhere2){
		w.push('(' + _this.SQLwhere + this.SQLwhere2 + ')');
	};

	var where = w.join(' AND ');

	var filterSelType;
	(idxCheck[name] && idxCheck[name][1].length !== 0) ? filterSelType = 'deselect' : filterSelType = 'select';
	setcookie.set('where',	where);

	$.ajax({
		type: 'POST',
		data: 'type=data_index&viewid=' + $('#tabs li.active').attr('data-tab-no') + '&field=' + name,
		url: 'db/common',
		success: function(data){
			var arr_index = arrayUnique(JSON.parse(data));
			arr_index.sort();

			grid.arrIndex = arr_index;

			var val;
			if(filterArray[name]){
				val = filterArray[name]['value'];
			}else{
				val = '';
			}

			var applyButton = '<div class="apply-filter"><button type="button" class="bt submit" onclick="loadingBtn($(this), drawtime)">필터 적용</button><a>전체 해제</a></div>';

			switch (type) {
				default:
					a = '<div class="filter-searchbox active">' +
								'<div class="filterArea-wrap">' +
									'<select id="fieldOpt" class="width100per" name="filter_opt[]" style="display:none;" onclick="grid.changeCondition($(this));">'+
										'<option value="contains">' + lang('contains') + '</option>' +
										'<option value="not_contains">' + lang('doesn\'t contain') + '</option>' +
										'<option value="is">' + lang('is') + '</option>' +
										'<option value="is_not">' + lang('isn\'t') + '</option>' +
										'<option value="starts_with">' + lang('starts with') + '</option>' +
										'<option value="ends_with">' + lang('ends with') + '</option>' +
										'<option value="empty">' + lang('is empty') + '</option>' +
										'<option value="not_empty">' + lang('is not empty') + '</option>' +
									'</select>' +
									'<input type="text" name="filter_value[]" id="fieldValue" placeholder="' + lang('filter keyword') + '" value="' + val + '" onkeyup="grid.searchKeyword(event)" data-name="' + name + '">' +
									'<div class="inputT sch"><span class="l"><img src="img/icon_search.gif" width="14" height="15" /></span><div><input type="text" placeholder="' + lang('search keyword') + '" onkeyup="grid.filterKeywordSearch($(this));" data-name="' + name + '"></div></div>' +
									'<div class="filterArea quickFilter" data-status="selected">' +
										'<input type="hidden" name="selectType" class="selectType" value=' + filterSelType + ' />' +
										'<input type="hidden" name="selectItem[]" class="selectItem" />' +
										'<input type="hidden" name="hiddenItem[]" class="hiddenItem" />' +
										'<div class="box">';
											a += filterSearchBox(arr_index, name, 0);
											a += wrapPageHTML(arr_index);
					draw(a);

					break;
				case 'number':
				case 'currency':
				case 'percent':
					a = '<div class="filter-searchbox active">' +
								'<div class="filterArea-wrap">' +
									'<div class="fl col2" style="padding-right:5px;">' +
										'<select class="fieldOpt width100per" name="filter_opt[]" data-search="off" onclick="grid.searchKeyword(event)">'+
											'<option value="same">=</option>' +
											'<option value="not_same">!=</option>' +
											'<option value="big"><</option>' +
											'<option value="big_same"><=</option>' +
											'<option value="small">></option>' +
											'<option value="small_same">>=</option>' +
											'<option value="atob">A to B</option>' +
										'</select>' +
									'</div>' +
									'<div class="fl col2 style="padding-left:5px;"">' +
										'<label class="input w filter"><input type="number" name="filter_value[]" id="fieldValue1" value="' + val + '" onkeyup="grid.searchKeyword(event)" data-name="' + name + '"></label>' +
									'</div>' +
									'<div class="clear"></div>' +
									'<div class="height5"></div>' +
									'<div class="ta_c">' +
										'<input type="radio" id="contain_and" name="contain" value="and" checked/><label class="radio" style="margin-right:10px;" for="contain_and"> AND</label>' +
										'<input type="radio" id="contain_or" name="contain" value="or" /><label class="radio" for="contain_or"> OR</label>' +
									'</div>' +
									'<div class="height5"></div>' +
									'<div class="clear"></div>' +
									'<div class="fl col2" style="padding-right:5px;">' +
										'<select class="fieldOpt width100per" name="filter_opt[]" data-search="off" onclick="grid.searchKeyword(event)">'+
											'<option value="same">=</option>' +
											'<option value="not_same">!=</option>' +
											'<option value="big"><</option>' +
											'<option value="big_same"><=</option>' +
											'<option value="small">></option>' +
											'<option value="small_same">>=</option>' +
											'<option value="atob">A to B</option>' +
										'</select>' +
									'</div>' +
									'<div class="fl col2 style="padding-left:5px;"">' +
										'<label class="input w filter"><input type="number" name="filter_value[]" id="fieldValue2" onkeyup="grid.searchKeyword(event)" data-name="' + name + '"></label>' +
									'</div>' +
									'<div class="clear"></div>' +
									'<div class="height5"></div>' +
									'<label class="input w search"><input type="text" placeholder="Search Keyword" onkeyup="grid.filterKeywordSearch($(this));" data-name="' + name + '"></label>' +
									'<div class="filterArea quickFilter" data-status="selected" style="height:230px;">' +
										'<input type="hidden" name="selectType" class="selectType" value=' + filterSelType + ' />' +
										'<input type="hidden" name="selectItem[]" class="selectItem" />' +
										'<input type="hidden" name="hiddenItem[]" class="hiddenItem" />' +
										'<div class="box">';
										a += filterSearchBox(arr_index, name, 0);
										a += wrapPageHTML(arr_index);
					// a += '</div></div></div></div>';
					draw(a);
					break;
				case 'datetime':
					b = '<p class="all"><input type="checkbox" class="checkboxAll" checked="checked" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"/> <label class="checkbox" data-checked="checked" for="' + name + '_checkAll">[' + lang('select all') + ']</label> </p>';

					for(i=0; i<arr_index.length; i++){
						b = b + '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked" for="' + name + '_check' + i + '"><span class="text">' + arr_index[i] + '</span></label></p>';
					}

					a = '<div class="filter-searchbox active">' +
							'<div class="filterArea-wrap">' +
								'<div>' +
									'<select class="fieldOpt width100per" name="filter_opt[]">'+
										'<option value="today">Today</option>' +
										'<option value="this_week">This Week</option>' +
										'<option value="next_week">Next Week</option>' +
										'<option value="next_month">Next Month</option>' +
										'<option value="last_month">Last Month</option>' +
										'<option value="next_quarter">Next Quarter</option>' +
										'<option value="this_quarter">This Quarter</option>' +
										'<option value="last_quarter">Last Quarter</option>' +
										'<option value="next_year">Next Year</option>' +
										'<option value="this_year">This Year</option>' +
										'<option value="last_year">Last Year</option>' +
									'</select>' +
								'</div>' +
								'<div>' +
									'<label class="input w filter"><input type="text" class="datetime" data-type="range" name="filter_value[]" id="fieldValue" value="' + val + '" ></label>' +
								'</div>' +
								'<div class="clear"></div>' +
								'<div class="height5"></div>' +
								'<label class="input w search"><input type="text" placeholder="Search Keyword" onkeyup="grid.filterKeywordSearch($(this));"></label>' +
								'<div class="filterArea quickFilter" data-status="selected">' +
									'<input type="hidden" name="selectType" class="selectType" value=' + filterSelType + ' />' +
									'<input type="hidden" name="selectItem[]" class="selectItem" />' +
									'<input type="hidden" name="hiddenItem[]" class="hiddenItem" />' +
									'<div class="box">' + b + '</div>' +
								'</div>' +
							'</div>' +
						'</div>';
					draw(a);
					break;
			}
 		}
	});

	function draw(a){
		if($target.closest('.filterList').length > 0){
			$target.html('<div class="filterArea"><div class="box">' + a + '</div></div>');
			// $target.html('<div class="filterArea"><div class="box"></div></div>');
			$target2 = $target.closest(".filterList").find(".filterIdxBox");
			if(filterStatus === true){
				$(".filterIdxBox").not($target.closest(".filterList").find(".filterIdxBox")).slideUp();
				$target2.stop().slideToggle();
				filterStatus = false;
			}
		}else{
			$target.find(".filterIdx").html('<div class="line"></div><div class="menu keepShow" onclick="grid.optmenuSlide($(this))"><span class="icon filter"></span>Filter<span class="icon sort-header asc"></span></div>'+a);
			$target.find(".filterIdx").css("display","block");
			$target.find("table").first().css({
				"width":"500px",
			});
		}

		if(filterArray[name]){
			var condition = filterArray[name]['condition'];
			$target.find('select').val(condition);
		}

		$target.find('select').each(function() {
			selectbox.reload($(this));
		});
		// $('.element-calendar').remove();
		// $('.datetime').calendar();

		var _currentPage = 0,
			lastScTop = 0;
		$('.filterArea').scroll(function(e) {
			var aa = 25 * 100;
			var $this = $(this),
				scTop = $this.scrollTop(),
				name = $this.parents('th').attr('data-name'),
				currentPage = Math.floor(scTop / aa),
				html = 'ssss',
				dir = ( scTop > lastScTop ) ? 'down' : 'top';
			if( currentPage !== _currentPage || $this.find('.box .wrapPage').eq(currentPage-1).html() === '') {
				if( currentPage !== 0) {
					scrollFilter();
					_currentPage = currentPage;
				}
			}

			function scrollFilter() {
				html = filterSearchBox(filterSearchIndex, name, currentPage * 100);
				$this.find('.box .wrapPage').eq(currentPage-1).html(html);
			}
			lastScTop = scTop;
		});
	}
};

// grid.prototype.drawFilterType = function(type, val, name, filterSelType) {
// 	console.log(type);
// 	switch (type) {
// 		case 'number':
// 		case 'currency':
// 		case 'percent':
// 			break;
// 		case 'datetime':
// 			break;
// 		default:
// 			a = '<div class="filter-searchbox active">' +
// 						'<div class="filterArea-wrap">' +
// 							'<select id="fieldOpt" class="width100per" name="filter_opt[]" style="display:none;" onclick="grid.changeCondition($(this));">'+
// 								'<option value="contains">' + lang('contains') + '</option>' +
// 								'<option value="not_contains">' + lang('doesn\'t contain') + '</option>' +
// 								'<option value="is">' + lang('is') + '</option>' +
// 								'<option value="is_not">' + lang('isn\'t') + '</option>' +
// 								'<option value="starts_with">' + lang('starts with') + '</option>' +
// 								'<option value="ends_with">' + lang('ends with') + '</option>' +
// 								'<option value="empty">' + lang('is empty') + '</option>' +
// 								'<option value="not_empty">' + lang('is not empty') + '</option>' +
// 							'</select>' +
// 							'<input type="text" name="filter_value[]" id="fieldValue" placeholder="' + lang('filter keyword') + '" value="' + val + '" onkeyup="grid.searchKeyword(event)" data-name="' + name + '">' +
// 							'<div class="inputT sch"><span class="l"><img src="img/icon_search.gif" width="14" height="15" /></span><div><input type="text" placeholder="' + lang('search keyword') + '" onkeyup="grid.filterKeywordSearch($(this));" data-name="' + name + '"></div></div>' +
// 							'<div class="filterArea quickFilter" data-status="selected">' +
// 								'<input type="hidden" name="selectType" class="selectType" value=' + filterSelType + ' />' +
// 								'<input type="hidden" name="selectItem[]" class="selectItem" />' +
// 								'<input type="hidden" name="hiddenItem[]" class="hiddenItem" />';

// 			break;
// 	}

// 	return a;
// }

grid.prototype.fieldSearch = function(){
	console.log('[fn] grid.fieldSearch');

	var keyword = $('.topSearch').val();
	$(".filter-group .filterList, .filter-group .filterGroup").each(function(){
		if($(this).find('.title span').text().indexOf(keyword) === -1){
			$(this).addClass('none');
		}else{
			$(this).removeClass('none');
		}
	});
};

grid.prototype.dataindexSearch = function($target,name,type){
	console.log('[fn] grid.dataindexSearch');

	var filterSelType = 'select';

	$.ajax({
		type: 'POST',
		data: 'type=data_index&sec=' + _this.SQL['section'] + '&where=' + _this.SQLwhere + '&field=' + name,
		url: 'db/common',
		success: function(data){
			var arr_index = JSON.parse(data);

			var val;
			if(filterArray[name]){
				val = filterArray[name]['value'];
			}else{
				val = '';
			}

			if(idxCheck[name]){
				if(idxCheck[name][0].length > 0){
					filterSelType = 'deselect';
					idxData = idxCheck[name][0];
				}else if(idxCheck[name][1].length > 0){
					var idxData = idxCheck[name][1];
				}
			}
			a = '';

			switch (type) {
				default:
					if(arr_index.length > 100){
						arr_len = 100;
					}else{
						arr_len = arr_index.length;
					}
					if(idxCheck[name]){
						if(filterSelType === 'select'){
							a += '<p class="all"><input type="checkbox" class="checkboxAll" checked="checked" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"><label class="checkbox" data-checked="checkbox" for="' + name + '_checkAll">[' + lang('select all') + ']</label></p>';
						}else{
							a += '<p class="all"><input type="checkbox" class="checkboxAll" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"><label class="checkbox" data-checked="" for="' + name + '_checkAll"> [' + lang('select all') + ']</label></p>';
						}
						if(filterSelType === 'deselect'){
							for(i=0; i<arr_len; i++){
								if($.inArray(arr_index[i], idxData) !== -1){
									a += '<p><input type="checkbox" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/><label class="checkbox" data-checked=""  for="' + name + '_check' + i + '"> <span class="text">' + arr_index[i] + '</span></label></p>';
								}else{
									a += '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked"  for="' + name + '_check' + i + '"> <span class="text">' + arr_index[i] + '</span></label> </p>';
								}
							}
						}else{
							for(i=0; i<arr_len; i++){
								if($.inArray(arr_index[i], idxData) !== -1){
									a += '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked"  for="' + name + '_check' + i + '"><span class="text">' + arr_index[i] + '</span></label> </p>';
								}else{
									a += '<p><input type="checkbox" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/><label class="checkbox" data-checked=""  for="' + name + '_check' + i + '"> <span class="text">' + arr_index[i] + '</span></label></p>';
								}
							}
						}

					}else{
						a += '<p class="all"><input type="checkbox" class="checkboxAll" checked="checked" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"/> <label class="checkbox" data-checked="checked" for="' + name + '_checkAll">[' + lang('select all') + ']</label> </p>';
						for(i=0; i<arr_len; i++){
							a += '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked" for="' + name + '_check' + i + '"><span class="text">' + arr_index[i] + '</span></label></p>';
						}
					}

					$target.html(a);
					break;


				case 'number':
				case 'currency':
				case 'percent':

					if(arr_index.length > 100){
						arr_len = 100;
					}else{
						arr_len = arr_index.length;
					}
					if(idxCheck[name]){
						if(filterSelType === 'select'){
							a += '<p class="all"><input type="checkbox" class="checkboxAll" checked="checked" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"><label class="checkbox" data-checked="checkbox" for="' + name + '_checkAll">[' + lang('select all') + ']</label></p>';
						}else{
							a += '<p class="all"><input type="checkbox" class="checkboxAll" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"><label class="checkbox" data-checked="" for="' + name + '_checkAll"> [' + lang('select all') + ']</label></p>';
						}
						if(filterSelType === 'deselect'){
							for(i=0; i<arr_len; i++){
								if($.inArray(arr_index[i], idxData) !== -1){
									a += '<p><input type="checkbox" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/><label class="checkbox" data-checked=""  for="' + name + '_check' + i + '"> <span class="text">' + arr_index[i] + '</span></label></p>';
								}else{
									a += '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked"  for="' + name + '_check' + i + '"> <span class="text">' + arr_index[i] + '</span></label> </p>';
								}
							}
						}else{
							for(i=0; i<arr_len; i++){
								if($.inArray(arr_index[i], idxData) !== -1){
									a += '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked"  for="' + name + '_check' + i + '"><span class="text">' + arr_index[i] + '</span></label> </p>';
								}else{
									a += '<p><input type="checkbox" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/><label class="checkbox" data-checked=""  for="' + name + '_check' + i + '"> <span class="text">' + arr_index[i] + '</span></label></p>';
								}
							}
						}

					}else{
						a += '<p class="all"><input type="checkbox" class="checkboxAll" checked="checked" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"/> <label class="checkbox" data-checked="checked" for="' + name + '_checkAll">[' + lang('select all') + ']</label> </p>';
						for(i=0; i<arr_len; i++){
							a += '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked" for="' + name + '_check' + i + '"><span class="text">' + arr_index[i] + '</span></label></p>';
						}
					}
					a += '</div></div></div></div>';
					$target.html(a);
					break;


				case 'datetime':
					a = '<p class="all"><input type="checkbox" class="checkboxAll" checked="checked" onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"/> <label class="checkbox" data-checked="checked" for="' + name + '_checkAll">[' + lang('select all') + ']</label> </p>';
					for(i=0; i<arr_index.length; i++){
						a = a + '<p><input type="checkbox" checked="checked" onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked" for="' + name + '_check' + i + '"><span class="text">' + arr_index[i] + '</span></label></p>';
					}
					$target.html(a);
					break;
			}
 		}
	});
};

var filterAll = true;
grid.prototype.filterIndexAll = function($target){
	console.log('[fn] grid.filterIndexAll');
	resize = true;
	ctxTop = 0;
	scrollbar.MS_Y = scrollbar.BTN_WH;
	var name = $target.closest('th').attr('data-name');
	idxCheck[name] = null;
	if($target.prop('checked')) {
		arrCell = [];
		$target.closest('.quickFilter').find('input[type="checkbox"] + label').attr('data-checked','checked');
		$target.closest('.quickFilter').find('input[type="checkbox"]').prop('checked',true);
		$target.closest(".quickFilter").find(".selectType").val("select");
		filterAll = true;
		// this.filterling();
	}else{
		$target.closest('.quickFilter').find('input[type="checkbox"] + label').attr('data-checked','');
		$target.closest('.quickFilter').find('input[type="checkbox"]').prop('checked',false);
		$target.closest(".quickFilter").find(".selectType").val("deselect");
		filterAll = false;
	}
};

grid.prototype.filterIndex = function($target){
	console.log('[fn] filterIndex');

	resize = true;
	ctxTop = 0;
	scrollbar.MS_Y = scrollbar.BTN_WH;
	var name = $target.closest("th").attr("data-name");
	if($target.closest(".box").find(":checkbox:checked").length !== 0){

		if(!name){
			name = $target.closest(".filterIdxBox").attr("data-name");
		}
		if(!idxCheck[name]) idxCheck[name] = [];
		if(!idxCheck[name][0]) idxCheck[name][0] = [];
		if(!idxCheck[name][1]) idxCheck[name][1] = [];

		if($target.prop("checked") === false){
			$target.closest(".box").find(".checkboxAll").prop('checked','');
			$target.closest(".box").find(".checkboxAll").next().attr("data-checked","");
			$target.closest(".box").find(".checkboxAll").removeAttr("checked");
		}
		$targetOutline = $target.closest('.quickFilter');
		var selType = $targetOutline.find('.selectType').val();
		var a = grid.arrIndex.length;
		var txt = $target.parent().find('.text').text();
		if(selType === 'deselect'){
			if($target.prop('checked') === true) {
				idxCheck[name][1].push(txt);
			}else{
				var idx = idxCheck[name][1].indexOf(txt);
				idxCheck[name][1].splice(idx, 1);
			}
		}else{
			if($target.prop('checked') === true) {
				var idx = idxCheck[name][0].indexOf(txt);
				idxCheck[name][0].splice(idx, 1);
			}else{
				idxCheck[name][0].push(txt);
			}
		}
		// this.filterling();
	}else{
		idxCheck[name][0] = [];
		idxCheck[name][1] = [];
	}
};

grid.prototype.filterKeyword = function(target) {
	console.log('[fn] grid.filterKeyword');

	var name;
	var type;
	var condition;
	var value;

	if ($(target).closest(".filterIdxBox").length > 0) {
		name		= $(target).parents(".filterIdxBox").attr("data-name");
		type		= $(target).parents(".filterIdxBox").attr("data-type");
		condition	= $(target).parents(".filterIdxBox").find("select").val();
		value		= $(target).val();
	}else{
		name		= $(target).parents("th").attr("data-name");
		type		= $(target).parents("th").attr("data-type");
		condition	= $(target).parents("th").find("select#fieldOpt").val();
		value		= $(target).parents("th").find(".filterArea-wrap input[name='filter_value[]']").val();
	}
	idxCheck = [];

	if( (condition != 'empty' || condition != 'not_empty' || value !== '') ){
		filterArray[name] = [];
		filterArray[name]['condition']	= condition;
		filterArray[name]['type']		= type;
		filterArray[name]['value']		= value;
	}else{
		delete filterArray[name];
	}
	this.filterling();
// 	this.dataindexSearch($(target).closest(".filterArea-wrap").find(".filterArea .box"),name,type);
};

var keyClear;
grid.prototype.filterKeywordSearch = function($target){
	keyClear = setTimeout(function() {
		console.log('[fn] grid.filterKeywordSearch');

		clearTimeout(keyClear);
		var regExp = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;
		var txt = $target.val(),
			searchList = [],
			html = '',
			name = $target.attr('data-name');

		$target.val(txt.replace(regExp, ''));

		if( txt !== '') {
			$.each(grid.arrIndex, function(idx, val) {
				if( val.indexOf(txt) !== -1 ) {
					searchList.push(val);
				}
			});
		}

		if( txt == '' ) {
			$target.closest('.filterArea-wrap').find('p, .wrapPage').remove();
			html = filterSearchBox(grid.arrIndex, name, 0);
			html += wrapPageHTML(grid.arr_index);
		}else {
			$target.closest('.filterArea-wrap').find('p, .wrapPage').remove();
			html = filterSearchBox(searchList, name, 0);
			html += wrapPageHTML(searchList);
		}

		$target.closest('.filterArea-wrap').find('.filterArea.quickFilter .box').css({height: 'auto'}).append(html);
	}, 500);
};

grid.prototype.searchKeyword = function(event){
	console.log('[fn] grid.searchKeyword');

	var target = event.target;
	var regExp = /[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]/gi;
	var val = '';

	if( $(target).attr('name') == 'filter_opt[]' || $(target).attr('type') == 'number') {
		var filterArea = $('.filterArea-wrap'),
			val1 = filterArea.find('input[name="filter_value[]"]').eq(0).val(),
			val2 = filterArea.find('input[name="filter_value[]"]').eq(1).val(),
			sltVal1 = filterArea.find('select:eq(0) option:selected').val(),
			sltVal2 = filterArea.find('select:eq(1) option:selected').val(),
			and_or = $('.filterArea-wrap .ta_c input[name="contain"]:checked').val();
	}else {
		val = $(target).val().replace(regExp, '');
		$(target).val(val);

		// keytimeClear();
		// keytime(target);

		// if (event.keyCode === 13) {
		// 	event.preventdefault;
		// 	keytimeClear();
		// 	this.filterKeyword(target);
		// }
	}

};

grid.prototype.changeCondition = function($target){
	console.log('[fn] grid.changeCondition');
	var name;
	var condition;
	var value;
	var type = $target.closest(".filterIdxBox").attr("data-type");



	$target.closest(".filterArea-wrap").find('label.search input').val('');
	if ($target.closest(".filterIdxBox").length > 0) {
		name = $target.closest(".filterIdxBox").attr("data-name");
		condition = $target.closest(".filterIdxBox").find("select").val();
		value = $target.closest(".filterIdxBox").find(".input.filter input[type=text]").val();
	}else{
		name = $target.closest("th.col").attr("data-name");
		condition = $target.closest(".filterArea-wrap").find("select").val();
		value = $target.closest(".filterArea-wrap").find("#fieldValue").val();
	}
	condition = $target.closest(".filterArea-wrap").find("select").val();
	if(name){
		if (condition === "empty" || condition === "not_empty") {
			filterArray[name] = [];
			filterArray[name]['condition'] = condition;
			$target.closest(".filterArea-wrap").find('label.filter input').val('');
			$target.closest(".filterArea-wrap").find("#fieldValue").slideUp();
			this.filterling();
			this.filterKeyword($target.closest('.filterArea-wrap').find('input[type=text]'));
		}else if(filterArray[name] !== '' && value){
			filterArray[name] = [];
			filterArray[name].condition = condition;

			if (value) {
				this.filterling();
				this.filterKeyword($target.closest('.filterArea-wrap').find('input[type=text]'));
			}
			$target.closest(".filterArea-wrap").find("#fieldValue").slideDown();
		}else{
			$target.closest(".filterArea-wrap").find("#fieldValue").slideDown();
		}
	}else{
		alert('error');
	}

};

function openPalette(e) {
	console.log('[fn] openPalette');

	e.stopPropagation();
	$('.palette').show();
	$layer.show();
}

var filterSearchIndex, filterSearchTime;
function filterSearchBox(arr_index, name, len) {
	var html = '',	filterSelType = '', idxData = '',
		total = arr_index.length;
		// page = Math.floor(len/100);

	if(len+100 > total) {
		end = total;
	}else {
		end = (len+100 > arr_index) ? total : len+100;
	}

	if(idxCheck[name]){
		if(idxCheck[name][0].length > 0){
			filterSelType = 'deselect';
			idxData = idxCheck[name][0];
		}else if(idxCheck[name][1].length > 0){
			idxData = idxCheck[name][1];
		}
	}

	var h = (len === 0 ) ? 0 : 25;
	if(idxCheck[name]){
		console.log('filterSelType: ' + filterSelType);
		if(len === 0) {
			var check = (filterSelType === 'select') ? true : false;

			html += filterListHTML('checkboxAll', i, name, check);
		}

		var _check;
		for(i=len; i<end; i++){
			if(filterSelType === 'deselect') {
				// console.log($.inArray(arr_index[i], idxData), filterAll)
				_check = ($.inArray(arr_index[i], idxData) !== -1 || filterAll) ? false : true;
				html += filterListHTML(arr_index[i], i, name, _check);
			}else {
				_check = ($.inArray(arr_index[i], idxData) !== -1 || filterAll) ? true : false;
				html += filterListHTML(arr_index[i], i, name, _check);
			}
		}
	}else{
		if(len === 0) html += filterListHTML('checkboxAll', '', name, filterAll);
		for(i=len; i<end; i++){
			html += filterListHTML(arr_index[i], i, name, filterAll);
		}
	}

	filterSearchIndex = arr_index;

	return html;
}

function filterListHTML(text, i, name, checked) {
	var check = (checked) ? 'checked' : '',
		html = '';

	if(text == 'checkboxAll') {
		html += '<p class="all"><input type="checkbox" class="checkboxAll" ' + check + ' onchange="grid.filterIndexAll($(this))" id="' + name + '_checkAll"/> <label class="checkbox" data-checked="checked" for="' + name + '_checkAll"> [' + lang('select all') + ']</label> </p>';
		filterAll = (checked) ? true : false;
	}else {
		html = '<p><input type="checkbox" ' + check + ' onchange="grid.filterIndex($(this))" id="' + name + '_check' + i + '"/> <label class="checkbox" data-checked="checked" for="' + name + '_check' + i + '"><span class="text">' + text + '</span></label></p>';
	}

	return html;
}

function wrapPageHTML(data) {
	var pg = (data) ? Math.floor(data.length/100) : 0,
		html = '';

	for(var i=0; i<pg; i++) {
		if( i == pg-1 ) {
			html += '<div class="wrapPage" data-page="' + (i+1) + '" style="height:' + (data.length%100*25) + 'px;"></div>'
		}else {
			html += '<div class="wrapPage" data-page="' + (i+1) + '"></div>'
		}
	}

	return html;
}
