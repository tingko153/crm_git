grid.prototype.sqlCall = function(){
	console.log('[fn] grid.sqlCall');

	setcookie.set('where',	encodeURI(_this.SQL['where']));
	setcookie.set('sec',	_this.SQL['section']);

	loading();

	grid.saveData();
	$.ajax({
		type: 'POST',
		data: '&viewid=' + $('#tabs li.active').attr('data-tab-no') + '&order=' + encodeURIComponent(_this.SQL['orderBy']) + '&pg=' + pgNow + '&count=' + pageLen,
		url: 'data/users/data',
		success: function(data){
			if(data.trim()){
	 			_this.SQLdata = JSON.parse(data);
	 			totalCount = _this.SQLdata[_this.SQLdata.length - 1];
	 			_this.SQLdata.pop();
	 			dataCount = _this.SQLdata.length;
	 			$('.dataCt').text(totalCount);
			}else{
				_this.SQLdata = [];
				dataCount = 0;
			}

			if(dataCount === 0){
				$('.resultCont .r').hide();
				$("#grid-data canvas").hide();
				$('.noData').remove();
				$("#grid-data").append('<div class="noData"><img src="img/img_noData.gif" /><p>검색된 데이터가 없습니다.</p><a href="javascript:addData(\'' + section + '\');">데이터를 추가</a>하거나 검색 필터 값을 확인해보시기 바랍니다.</div>');
				$('#grid-data .noData').css({
					'width':  $("#grid-data").width(),
					'height': $("#grid-data").height()
				});
				$( window ).resize(function() {
					$('#grid-data .noData').css({
						'width':  $("#grid-data").width(),
						'height': $("#grid-data").height()
					});
				});
	 		}else{
				$('.datagrid .grid-area .grid-header, .resultCont .l').show();
				$("#grid-data canvas").show();
				$("#grid-data .noData").remove();
				_this.paging();
	 		}

			if(!isPipeline) {
				ctxTop = 0;
				ctxLeft = 0;
				rowStart = 0;
				_this.createData();
			}else{
				grid.pipelineView();
			}

			loads();
 		}
	});
}
