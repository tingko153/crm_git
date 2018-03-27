grid.prototype.paging = function(){
	var s_page = (pgNow-1) * dataLen;
	var l_page = s_page + dataLen;
	var page_per = Math.ceil(totalCount / pageLen);
	var html = '';


	if(page_per === 1){
		$('.resultCont .r').addClass('none');
	}else{
		$('.resultCont .r').removeClass('none');
	}

	if(pgNow > 1){
		html += '<a onclick="grid.pageNum(' + (pgNow - 1) + ')" class="arrow">❮</a>';
	}else{
		html += '<a onclick="grid.pageNum(1)" class="arrow">❮</a>';
	}

	var pgRange = 2;
	if(pgNow < 4) {
		pgRange = 2 + 4 - pgNow;
	}else if(page_per - 3 < pgNow){
		pgRange = 2 + 3 - (page_per - pgNow);
	}


	for(var i=1; i<page_per+1; i++){
		if(i == pgNow){
			html += '<a class="active">' + i + '</a>';
		}else if(i == 1){
			html += '<a onclick="grid.pageNum(' + i + ')">' + i + '</a>';
		}else if(Number(pgNow) - pgRange == i){
			html += '<a>...</a>';
		}else if(i == page_per){
			html += '<a onclick="grid.pageNum(' + i + ')">' + i + '</a>';
		}else if(i<Number(pgNow) + pgRange && i>Number(pgNow) - pgRange){
			html += '<a onclick="grid.pageNum(' + i + ')">' + i + '</a>';
		}else if(Number(pgNow) + pgRange == i){
			html += '<a>...</a>';
		}
	}

	if(pgNow < page_per){
		html += '<a onclick="grid.pageNum(' + (pgNow + 1) + ')" class="arrow">❯</a>';
	}else{
		html += '<a onclick="grid.pageNum(' + (page_per) + ')" class="arrow">❯</a>';
	}

	if(document.getElementById('paging')) document.getElementById('paging').innerHTML = html;
	if(document.getElementById('nowPage')) document.getElementById('nowPage').value = pgNow;


}

var rememberCheck = [];
grid.prototype.pageNum = function(no){
	pgNow = no;
	this.sqlCall();
	arrCell = [];

	// for(var i=0; i<grid.selRow.length; i++) {
	// 	var val = grid.selRow[i];
	// 	if( !arrCheck(rememberCheck, val) ) rememberCheck.push(val);
	// }
	// grid.selRow = [];
	this.selRowLength(grid.selRow.length);
}


grid.prototype.pageMove = function(){
	var pg = document.getElementById('nowPage').value;
	this.pageNum(pg);
}


grid.prototype.pageCount = function(){
	var val = document.getElementById('pageCount').value;
	setcookie.set('pgCount',val);
	pageLen = val;
	pgNow = 1;
	this.sqlCall();
}
