grid.prototype.resizing = function(){
	console.log('[fn] resizing');

	var h1 = $(window).height() - $('.grid-area').offset().top - 11;
	var h2 = $(window).height() - grid.canvasTop - 11;

	$('.grid-area').css({'height':h1});
	$('#grid-data').css('height',h2);
	$('#canvas').attr({
		'width':$('.resultCont').width(),
		'height': h2
	});
	inputCancel();
	grid.createData();
};

$(window).resize(function(e) {
	if(e.target === window) {
		grid.resizing();
	}
});

