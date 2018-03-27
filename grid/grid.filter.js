grid.prototype.filterling = function(){
	console.log('[fn] grid.filterling');

	arrCell =[];
	_this = this;
	var arr = [];
	for (var name in filterArray) {
		var type		= filterArray[name]['type'];
		var condition	= filterArray[name]['condition'];
		var value 		= filterArray[name]['value'];
		if(name !== 'undefined'){
			switch(type) {
				default :
					if (condition === "contains" && value !== '') {
						arr.push(name + " LIKE " + "'%" + value + "%'");
					}else if (condition === "not_contains" && value !== '') {
						arr.push(name + " NOT LIKE " + "'%" + value + "%'");
					}else if (condition === "is") {
						arr.push(name + " = " + "'%" + value + "%'");
					}else if (condition === "is_not") {
						arr.push(name + " != " + "'" + value + "'");
					}else if (condition === "starts_with") {
						arr.push(name + " LIKE " + "'" + value + "%'");
					}else if (condition === "ends_with") {
						arr.push(name + " LIKE " + "'%" + value + "'");
					}else if (condition === 'empty') {
						arr.push(name + "=''");
					}else if (condition === 'not_empty') {
						arr.push(name + "!=''");
					}
					break;
				case "phoneNumber":
					if (condition === "contains" && value !== '') {
						arr.push(name + " LIKE " + "'%" + value + "%'");
					}else if (condition === "not_contains") {
						arr.push(name + " NOT LIKE " + "'%" + value + "%'");
					}else if (condition === "is") {
						arr.push(name + " = " + "'%" + value + "%'");
					}else if (condition === "is_not") {
						arr.push(name + " != " + "'%" + value + "%'");
					}else if (condition === "starts_with") {
						arr.push(name + " LIKE " + "'" + value + "%'");
					}else if (condition === "ends_with") {
						arr.push(name + " LIKE " + "'%" + value + "'");
					}else if (condition === 'empty') {
						arr.push(name + "=''");
					}else if (condition === 'not_empty') {
						arr.push(name + "!=''");
					}
					break;
			}
		}
	}
	if(arr.length > 0){
		_this.SQLwhere = '(' + arr.join(') AND (') + ')';
	}else{
		_this.SQLwhere = '';
	}

	var arr2 = [];
	for(var name in idxCheck){
		if(idxCheck[name] !== null){
			var w;
			if(idxCheck[name][0].length > 0){
				w = "'" + idxCheck[name][0].join("','") + "'";
				arr2.push(name + " NOT IN (" + w + ")");
			}else{
				w = "'" + idxCheck[name][1].join("','") + "'";
				arr2.push(name + " IN (" + w + ")");
			}
		}
	}

	_this.SQLwhere2 = '';

	if(arr2.length > 0){
		if(_this.SQLwhere === ''){
			_this.SQLwhere2 = ' (' + arr2.join(') AND (') + ')';
		}else{
			_this.SQLwhere2 = ' AND (' + arr2.join(') AND (') + ')';
		}
	}
	var w = [];
	if(grid.gridHead[now]['sql'] !== ''){
		w.push(grid.gridHead[now]['sql']);
	}

	if(_this.SQLwhere || _this.SQLwhere2){
		w.push('(' + _this.SQLwhere + _this.SQLwhere2 + ')');
	}

	var orderBy;
	(grid.SQL['orderBy']) ? orderBy = grid.SQL['orderBy'] : orderBy = ' ORDER BY `id` DESC';
	if(sortName !== ''){
		orderBy = ' ORDER BY `' + sortName + '` = "" ASC, ' + sortName + ' ' + sortType;
	}

	if(_this.favoriteView === true){
		w.push("`fno`!=''");
	}

	var where = w.join(' AND ');

	_this.SQL['section'] = section;
	_this.SQL['where'] = where;
	_this.SQL['orderBy'] = orderBy;
	_this.sqlCall();

	$('.filter-group .filterList').each(function(){
		var _this = $(this);
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

		if(idxCheck[name]){
			if(idxCheck[name][0] || idxCheck[name][1]){
				$(this).find(".filter.off").removeClass("off").addClass("on");
			}
		}

		$('#header th').each(function() {
			if($(this).attr('data-name') == name ) {
				if(_this.find('.filter').attr('class').indexOf('off') == -1) {
					$(this).find('.title').addClass('filter');
				}else {
					$(this).find('.title').removeClass('filter');
				}
			}
		});
	});
};
