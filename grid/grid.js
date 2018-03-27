jQuery.fn.extend({
	datagrid: function(set){
		// Default value
		sortName		= '';
		sortType		= '';
		leftcol			= '';
		rightcol		= '';
		leftwidth		= 0;
		rightwidth		= 0;
		dataLen			= 30;
		tdHeight		= 38;
		pgNow			= 1;
		nowPg			= 0;
		dataCount		= 200;
		idxCheck		= [];
		idxUncheck		= [];
		filterArray		= [];
		gridDataLeft	= [];
		gridDataRight	= [];
		totalCount		= 0;

		grid.gridHead 	= set.header;
		grid.set 		= set['now'];
		grid.orderBy	= set['sort'];

		if(set['now'] === 99999){
			now 		= set.header.length-1;
		}else if(set['now']){
			now 			= set['now'];
		}else {
			now			= 0;
		}
		if(!grid.gridHead[now]){
			now 		= 0;
		}

		grid.SQL['orderBy']= grid.gridHead[now]['sort'];

		if(setcookie.get('pgCount')){
			pageLen		= setcookie.get('pgCount');
		}else{
			pageLen		= 200;
		}

		// Default Element
		// $(this).html('<div class="datagrid transit-bounce"></div>');
		$grid = $(".datagrid");

		// Data type
		tid				= set.tid;
		section			= set.section;
		section2 		= '';

		// Field Value
		for(var i=0; i<set.header[nowPg].columns.length; i++){
			var fieldName = set.header[nowPg].columns[i].field;
			var fieldTemp = set.header[nowPg].columns[i].template;
			grid.fieldInfo[fieldName] = fieldTemp;
		}
		grid.build();
	}

});


function grid(){
	_this = this;
	_this.color			= '';
	_this.filterValue	= '';
	_this.keytimeout;
	_this.drawtimeout;
	_this.tid;
	_this.section;
	_this.SQL			= [];
	_this.SQLdata		= [];
	_this.SQLwhere		= '';
	_this.colLeft		= [];
	_this.colRight		= [];
	_this.dbtimer;
	_this.scrolltimer;
	_this.resizetimer;
	_this.filterStatus	= false;
	_this.favoriteView	= false;
	_this.selRow		= [];
	_this.fieldInfo		= [];
	_this.pgEnd			= 0;
	_this.canvasTop		= $('#canvas').offset().top;
};

var isContextMenu  = false;
grid.prototype.build = function(){
	console.log('[fn] grid.build');

	ctxLeft 			= 0;
	ctxTop 				= 0;
	rowStart 			= 0;
	resize 				= false;

	grid.tab();
	grid.outline();
	filter.createFilter();

	$("#canvas").bind("contextmenu", function(e) {
		var y = getY(e.offsetY);
		var w = parseInt($('#grid-moving').css('left')) + $('#grid-moving').width();
		var arrPrev = grid.eventConfig.prevObj;

		if( dataCount*tdHeight > e.offsetY && w > e.offsetX) {
			$('.contextmenu').remove();
			e.preventDefault();
			$('body').click();
			var html = '<div class="contextmenu bodyhidden show">';
			html += '<div class="menu" onclick="clickCopy()"><span class="icon context copy"></span>복사</div>';
			html += '<div class="menu" oncllick="grid.excelExport()"><span class="icon context download"></span>엑셀 다운로드</div>';
			html += '<div class="line"></div>';
			html += '<div class="menu" onclick="gridtab.newtabSelect();"><span class="icon context addtab"></span>선택된 데이터 탭생성</div>';
			if(section == 'account') {
// 				html += '<div class="menu" onclick="alert(\'기능 준비중입니다.\')"><span class="icon context addcontab"></span>선택된 회사 연락처 탭생성</div>';
				if(grid.selRow.length > 1) html += '<div class="menu" onclick="grid.accountCombine();"><span class="icon context addtab"></span>선택된 회사 병합하기</div>';
			}
			if(section == 'account' || section == 'contact') html += '<div class="menu" onclick="territory.createData(\'' + section + '\');"><span class="icon context addopp"></span>선택된 데이터 기회생성</div>';
			html += '<div class="line"></div>';
			html += '<div class="menu" onclick="grid.deleteData();"><span class="icon context delete"></span>삭제</div>';
			html += '</div>';

			var left = ( canvas.width - 300 < event.pageX) ? canvas.width - 300 : event.pageX;
			var top = ( canvas.height - 270 < event.pageY) ? event.pageY - 240 : event.pageY;

			$(html).appendTo("body").css({
				position:'absolute',
				top: top + "px",
				left: left + "px"
			});

			isContextMenu = true;

			if(arrPrev[0].selected) {
				resetGrid(true, true, true, true);
			}
			if(!arrCell[y][0].checked && !checkSelected(arrPrev, y)) {
				for(var i=0; i<arrPrev.length; i++) {
					arrPrev[i].checked = false;
					arrPrev[i].selected = false;
				}

				grid.eventConfig.stBoxX = 3;
				grid.eventConfig.stBoxY = y;
				grid.eventConfig.enBoxX = wLen-1;
				grid.eventConfig.enBoxY	= y;

				grid.selRow = [];
				fncCheckbox(y);
				scrollbar.reDraw();
			}

			// console.log(grid.eventConfig.prevObj);
		}else {
			$('.contextmenu').remove();
			isContextMenu = false;
		}
	}).bind("click", function(event) {
	    $("div.custom-menu").hide();
	});
}

function checkSelected(arr, val) {
	return arr.some(function(ele) {
		if(ele.selected) {
			return val === ele.yn;
		}
	});
}

function clickCopy() {
	lastDownTarget = cvs;
	document.execCommand('copy');
}

var scrollbar;
var key;
var	ctxLeft = 0,
	ctxTop = 0,
	rowStart = 0;
