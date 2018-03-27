grid.prototype.outline = function(){
	console.log('[fn] grid.outline');

	$gridArea			= $grid.find('.grid-area');
	$dataArea			= $grid.find('.grid-data');
	$grid.gridHeader	= $grid.find('.grid-header');
	$headerLeft			= $grid.find('.grid-header .grid-fixed');
	$headerRight		= $grid.find('.grid-header .grid-moving');

	gd_data				= document.getElementById('grid-data');
	cvs					= document.getElementById('canvas');
	ctx 				= cvs.getContext('2d');
	arrCell				= [];

	colInfo = [];
	for(x=0; x<grid.gridHead[now]['columns'].length; x++){
		if(grid.gridHead[now]['columns'][x].columns){
			for (y=0; y<grid.gridHead[now]['columns'][x].columns.length; y++) {
				if(grid.gridHead[now]['columns'][x]['columns'][y]['field'] === name){
					$this = grid.gridHead[now]['columns'][x]['columns'][y];
				}
				colInfo[grid.gridHead[now]['columns'][x]['columns'][y]['field']] = {template:grid.gridHead[now]['columns'][x]['columns'][y].template, editable:grid.gridHead[now]['columns'][x]['columns'][y].editable, lockable:grid.gridHead[now]['columns'][x]['columns'][y].lockable};
			}
		}else{
			colInfo[grid.gridHead[now]['columns'][x]['field']] = {template:grid.gridHead[now]['columns'][x].template, editable:grid.gridHead[now]['columns'][x].editable, lockable:grid.gridHead[now]['columns'][x].lockable};
		}
	}
};

grid.prototype.drawHeader = function(){
	console.log('[fn] drawHeader');

	this.drawOptMenu();
	this.resizeTable();
	this.dragdrop();
	this.filterling();
};

var maxWidth = [];
grid.prototype.resizeTable = function(){
	console.log('[fn] resizeTable');

	leftwidth	= 0;
	rightwidth	= 0;
	leftField 	= [];
	rightField 	= [];
	maxWidth	= [];

	$headerLeft.find("col").each(function(idx){
		leftField.push({
			'field':	$(this).attr('data-name'),
			'template':	$(this).attr('template'),
			'type':		$(this).attr('data-type'),
			'opt':		$(this).attr('data-opt'),
			'width':	$(this).css('width'),
			'class':	$(this).attr('class'),
			'position': leftwidth
		});
		if(!$(this).hasClass('none')){
			leftwidth += $(this).outerWidth();
		}
		var w = $(this).parent().next().find('th').eq(idx).find('span').width()+50;
		w = ( w < 80) ? 80 : w;
		maxWidth.push(w);
	});

	$headerRight.find("col").each(function(idx){
		rightField.push({
			'field':	$(this).attr('data-name'),
			'template':	$(this).attr('template'),
			'type':		$(this).attr('data-type'),
			'opt':		$(this).attr('data-opt'),
			'width':	$(this).css('width'),
			'class':	$(this).attr('class'),
			'position': rightwidth
		});
		if(!$(this).hasClass('none')){
			rightwidth += $(this).outerWidth();
		}
		var w = $(this).parent().next().find('th').eq(idx).find('span').width()+50;
		w = ( w < 80) ? 80 : w;
		maxWidth.push(w);
	});

	leftcol = $headerLeft.find('colgroup').html();
	rightcol = $headerRight.find('colgroup').html();

	$headerLeft.find("table.grid-table").css("width",leftwidth);
	$headerRight.find("table.grid-table").css("width",rightwidth);
	$headerRight.css("left",leftwidth);
	$dataArea.css({
		height: $('.area-body').height() - $('.area-button').height() - $('#tabs').height() - $('.resultCont').height() - $('#header').height() - 13 + 'px'
	});

	MainFilter.layout.load();

	if(resize) {
		var header = document.getElementById('grid-moving');
		header.style.left = leftwidth + ctxLeft + 'px';

		cvs.width = document.body.clientWidth-20;
		cvs.height = gd_data.offsetHeight;

		grid.cellSet(0, dataCount);
		grid.dataDraw();
		scrollbar.init();
		// scrollbar.reDraw();
	}
};

grid.prototype.drawhtml = function(){
	console.log('[fn] drawhtml');
	$headerLeft.find("table").first().css("width", leftwidth);
	$headerRight.find("table").first().css("width", rightwidth);
	$headerRight.css("left",$headerLeft.outerWidth());

	$dataLeft.css("width",$headerLeft.outerWidth());
	$dataRight.css("left",$headerLeft.outerWidth());
};
