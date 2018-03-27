grid.prototype.tab = function($this){
	console.log('[fn] tab');

	if (grid.gridHead.length > 0) {
		var a = '<div class="fl width100per list"><input type="checkbox" disabled="disabled" checked="checked" id="chk_tabs_0"/><label class="checkbox" for="chk_tabs_0" data-checked="checked" data-id="' + grid.gridHead[0]['no'] + '"><span class="title">' + grid.gridHead[0]['title'] + '</span></label></div>';
		for(i=1; i<grid.gridHead.length; i++){
			if(grid.gridHead[i]['view'] === 'n'){
				a += '<div class="fl width100per list"><input type="checkbox" id="chk_tabs_' + i + '"/><label class="checkbox" for="chk_tabs_' + i + '" data-id="' + grid.gridHead[i]['no'] + '" onclick="gridtab.view($(this));"><span class="title">' + grid.gridHead[i]['title'] + '</span></label></div>';
			}else{
				a += '<div class="fl width100per list"><input type="checkbox" id="chk_tabs_' + i + '" checked/><label class="checkbox" for="chk_tabs_' + i + '" data-checked="checked" data-id="' + grid.gridHead[i]['no'] + '" onclick="gridtab.view($(this));"><span class="title">' + grid.gridHead[i]['title'] + '</span></label></div>';
			}
		}
		var tabList = '<div class="tabList bodyhidden">' + a + '</div>';
		
		var tabhtml = '<div class="tabBtn"><div class="moving-bt none tab-left"><i class="xi-angle-left"></i></div><div class="moving-bt none tab-right"><i class="xi-angle-right"></i></div><div class="moving-bt" onclick="gridtab.newtab();"><i class="xi-plus"></i></div><div class="moving-bt setup" onclick="gridtab.setup();">' + tabList + '</div></div><div class="tabWrap"><ul>';
		for (var no in grid.gridHead) {
			var active;

			if (Number(no) === now) {
				active = 'active';
			}else{
				active = '';
			}
			var tabmenu = '';
			if(Number(no) !== 0){
				var tabmenu = '<div class="icon tab-menu">' +
									'<div class="tab-layer bodyhidden">' +
										'<div class="menu" onclick="gridtab.editTab(' + grid.gridHead[no]['no'] + ');"><span class="icon edit"></span>수정</div>' +
										'<div class="menu" onclick="gridtab.cloneTab(' + grid.gridHead[no]['no'] + ');"><span class="icon clone"></span>복제</div>' +
										'<div class="menu" onclick="gridtab.shareTab(' + grid.gridHead[no]['no'] + ');"><span class="icon share"></span>공유</div>' +
										'<div class="line"></div>' +
										'<div class="menu" onclick="gridtab.hideTab(' + grid.gridHead[no]['no'] + ');"><span class="icon hide"></span>숨기기</div>' +
										'<div class="menu" onclick="gridtab.deleteTab(' + grid.gridHead[no]['no'] + ');"><span class="icon delete"></span>삭제</div>' +
									'</div>' +
								'</div>';
			}

			if(grid.gridHead[no]['view'] === 'n'){
				tabhtml += '<li style="display:none;" class="' + active + '" data-tab-no="' + grid.gridHead[no]['no'] + '"><a>' + grid.gridHead[no]['title'] + '</a>' + tabmenu + '</li>';
			}else {
				tabhtml += '<li class="' + active + '" data-tab-no="' + grid.gridHead[no]['no'] + '"><a>' + grid.gridHead[no]['title'] + '</a>' + tabmenu + '</li>';
			}
		}
		tabhtml += '</ul></div>';

		var tab = document.getElementById('tabs');
		tab.innerHTML = tabhtml;

		$grid.find("#tabs li a").click(function(){
			location.replace('?sec=' + section + '/main&tab=' + $(this).parent().index());
			return false;
		});

		if(grid.set === 99999){
			$('#tabs li').last().find('a').click();
		}

	}
	$gridTab = $grid.find(".tabs");
};


var gridtab = new function(){
	this.view = function($target){
		var view;
		var id = $target.attr('data-id');

		if($target.attr('data-checked') === 'checked'){
			view = 'n';
		}else{
			view = 'y';
		};

		for(i=0; i<grid.gridHead.length; i++){
			if(grid.gridHead[i]['no'] === id){
				grid.gridHead[i]['view'] = view;
			}
		};

		if(grid.gridHead[now]['no'] === id){
			now = 0;
			grid.build();
		};

		$.ajax({
			type: "POST",
			data: 'type=onoffView&id=' + id + '&view=' + view,
			url: 'db/' + section,
			success: function(){
				$tab = $('.tabs .tab[data-tab-no="' + id + '"]');
				if(view === 'n'){
					$tab.addClass('none');
					if($tab.hasClass('active')){
						$('.tabs .tab').not('.none').first().click();
					}
				}else{
					$tab.removeClass('none');
				}

				// if($('.tabs .tab').not('.none').length === 0){
				// 	$('.grid-area').addClass('none');
				// }else{
				// 	$('.grid-area').removeClass('none');
				// }
				location.reload();
			}
		});
	};

	this.setup = function(){
		$('.moving-bt.setup').toggleClass('active');
		$('.tabList').toggleClass('show');
	};

	this.newtab = function(){
		$.ajax({
			type: "POST",
			url: 'section/grid/tab-new',
			success: function(data){
				arr = [];
				arr['html'] = data;
				popup.create(arr);
			}
		});
	};

	this.newtabSelect = function(){
		$.ajax({
			type: "POST",
			url: 'section/grid/tab-new',
			data: 'ids=' + grid.selRow.join(','),
			success: function(data){
				arr = [];
				arr['html'] = data;
				popup.create(arr);
			}
		});
	};

	this.editTab = function(no){
		$.ajax({
			type: "POST",
			data: 'no=' + no,
			url: 'section/grid/tab-edit',
			success: function(data){
				arr = [];
				arr['html'] = data;
				popup.create(arr);
			}
		});
	};

	this.cloneTab = function(no){
		$.ajax({
			type: "POST",
			data: 'no=' + no,
			url: 'section/grid/tab-copy',
			success: function(data){
				arr = [];
				arr['html'] = data;
				popup.create(arr);
			}
		});
	};

	this.hideTab = function(no){
		$('.tabList .checkbox').each(function(){
			var data_id = Number($(this).attr('data-id'));
			if(data_id === no){
				$(this).click();
			}
		});
	};

	this.deleteTab = function(no){
		if(confirm('선택하신 탭을 삭제하시겠습니까?')){
			$.ajax({
				type: "POST",
				data: 'type=deleteTab&no=' + no,
				url: 'db/common',
				success: function(txt){
					console.log(txt);
					now = 0;
					location.reload();
				}
			});
		};
	};

	this.shareTab = function(no){
		$.ajax({
			type: "POST",
			url: 'section/grid/tab-share',
			data: 'tabno=' + no,
			success: function(data){
				arr = [];
				arr['html'] = data;
				popup.create(arr);
			}
		});
	};

	this.selectAll = function(){
		$('.advanced-filters.userList p input[type=checkbox]').each(function(){
			$('#shareSelectAll').prop('checked') ? $(this).prop('checked','checked') : $(this).prop('checked','');

		});
	}
}

$(function() {
	var tabWidth = $('.tabWrap').width() - 60,
		tabTotal = $('.tabWrap ul').width();

	console.log(tabWidth, tabTotal);

	if( tabTotal > tabWidth ) {
		$('.tab-right, .tab-left').removeClass('none');
	}

	var tabn = 0;
	$('.tab-right').click(function() {
		console.log('right');
	});
	$('.tab-left').click(function() {
		console.log('left');
	});
});