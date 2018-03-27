grid.prototype.saveData = function(){
	var arrLeft		= [];
	var arrRight	= [];
	var saveArray	= [];
	var a			= 0;
	var tabNo		= $('#tabs li.active').attr('data-tab-no');

	var name, width, color, background, view;

	targetArr = arrLeft;
	$(".area-filter").find('.filter-group > div').each(function(){
		if($(this).hasClass('line')){
			targetArr = arrRight;
			a = -1;
		}else if($(this).hasClass('filterList')){
			name		= $(this).attr('data-name');
			width		= $(this).attr('data-width');
			color		= $(this).attr('data-color');
			background	= $(this).attr('data-background');
			view		= $(this).attr('data-view');
			// if($(this).find('input.switch[type="checkbox"]').is(':checked')){
			// 	view = 'on';
			// }else{
			// 	view = 'off';
			// }
			targetArr.push({'name':name, 'width':width, 'color':color, 'background':background, 'view':view});
		}else if($(this).hasClass('group')){
			var c = [];
			var d = [];
			$(this).find('.filterGroup, .filterList').each(function(){
				if($(this).hasClass('filterGroup')){
					c.push({'group-name':$(this).find('.title span').text(),'background':$(this).attr('data-background'),'color':$(this).attr('data-color')});
				}else{
					name		= $(this).attr('data-name');
					width		= $(this).attr('data-width');
					color		= $(this).attr('data-color');
					background	= $(this).attr('data-background');
					view		= $(this).attr('data-view');
					// if($(this).find('input.switch[type="checkbox"]').is(':checked')){
					// 	view = 'on';
					// }else{
					// 	view = 'off';
					// }
					d.push({'name':name, 'width':width, 'color':color, 'background':background, 'view':view});
				}
			});
			c.push(d);
			targetArr.push(c);
		}
	});

	if(arrLeft.length > 0 || arrRight.length > 0){
		saveArray.push({'left':arrLeft, 'right':arrRight});

		filterValue = '';
		fArr = [];
		for (var xx in filterArray) {
			if(xx) {
				var value 		= '';
				var fname		= xx;
				var type		= filterArray[xx]['type'];
				var condition	= filterArray[xx]['condition'];
				if(filterArray[xx]['value']) value  = filterArray[xx]['value'].toLowerCase();

				fArr.push(fname + '|' + type + '|' + condition + '|' + value);
			}
		}
		filterValue = fArr.join('^');
		var filterIndex = '';
		fArr = [];
		for (xx in idxCheck) {
			if(xx && xx !== 'undefined') {
				var fname		= xx;
				if(idxCheck[xx] !== null){
					var idxLeft		= idxCheck[xx][0].join('|');
					var idxRight	= idxCheck[xx][1].join('|');
					fArr.push(fname + '^' + idxLeft + '^' + idxRight);
				}
			}
		}
		filterIndex = encodeURIComponent(JSON.stringify(fArr));
		var tid = $('#tid').val();
		grid.gridHead[now].filters = JSON.stringify(saveArray);
		grid.gridHead[now].filter_index = JSON.stringify(fArr);
		$.ajax({
			type: "POST",
			url: "db/common",
			data: 'type=saveview&no=' + tabNo + '&tid=' + tid + '&field=' + JSON.stringify(saveArray) + '&filters=' + filterValue + '&filter_index=' + filterIndex + '&sort=' + _this.SQL['orderBy'],
			async: false,
			success: function(txt){
				// console.log(txt);
			},
			error: function(request, status, error) {
				alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
			}
		});
	}
}

//// save date before closing browser
$(window).bind("beforeunload unload",function() {
	setcookie.set(tid,'');
	setcookie.set('where','');
	setcookie.set('opp_field','');
	setcookie.set('opp_condition','');
	setcookie.set('opp_value','');
	setcookie.set('sec','');
	grid.saveData();
});
