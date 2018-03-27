grid.prototype.excelExport = function() {
	console.log('[fn] grid.excelExport');

	var arr = [];
	$.ajax({
		type: "POST",
		url: 'section/common/excel_export',
		success: function(data){
			arr = [];
			arr.html = data;
			arr.width = 860;
			popup.create(arr);
		}
	});

};
