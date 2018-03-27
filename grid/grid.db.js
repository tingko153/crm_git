$( document ).ready(function() {

	$("#hiddenTab").click(function(){
		if ($(this).hasClass("hidden")) {
			$(this).toggleClass("hidden");
			$("#tabs").slideDown();
			$(".grid-area").animate({
				top: "40px"
			});
		}else{
			$(this).toggleClass("hidden");
			$("#tabs").slideUp();
			$(".grid-area").animate({
				top: "1px"
			});
		}
	});
	
	
	
	// if (!window.openDatabase) {
	// 	alert("this browser  is not support Web SQL Database.");
	// }
	
	$('.addData').click(function(){
		$.ajax({
			type: "POST",
			url: 'section/' + section + '/pop/add_data',
			success: function(data){
				arr = [];
				arr['html'] = data;
				popup.create(arr);
				$('.popup .con').css('width', '800px');
			}
		});
		
	});
	
});