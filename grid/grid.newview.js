// jQuery.fn.extend({
// 	calendar: function(set){
// 		var type = $(this).attr("data-type");
// 		var html =	'<div class="element-calendar" onclick="calendarPicker.create($(this));">' +
// 						'<label class="input"><input type="text" class="keepShow" disabled/></label>' +
// 						'<div class="bt-calendar"><span class="icon calendar"></span></div>' + 
// 					'</div>';
// 		$(this).after(html);
// 		$(this).hide();
// 	}
// });
	
// var calendarPicker = new function(){
// 	this.create = function($this){
// 		$target = $this.find(".bt-calendar");
// 		$target.toggleClass("active");
// 		$target.find(".icon.calendar").toggleClass("active");
		
// 		var startDate;
// 		var endDate;
		
// 		if ($target.hasClass("active")) {
// 			var date_prev = new Date();
// 			date_prev.setMonth(date_prev.getMonth()-1);
// 			var cal = getData(new Date());
// 			var cal_prev = getData(date_prev);
			
// 			$(".calendar-picker").remove();
// 			var html = '<div class="calendar-picker keepShow">' +
// 							'<table>' +
// 								'<tr>' +
// 									'<td class="left"><div class="outline">' + cal_prev + '</div></td>' +
// 									'<td><div class="outline">' + cal + '</div></td>' +
// 								'</tr>' +
// 							'</table>' +
// 						'</div>';
// 			$("body").append(html);
// 			$(".calendar-picker").addClass("show");
// 			$(".calendar-picker .edit").click(function(){
// 				if (!$(this).find("input").length) {
// 					var a = $(this).text();
// 					var sel = '<input type="number" class="keepShow" value="'+a+'" style="width:100%; height:100%; color:#000;"/>';
// 					$(this).html(sel);
// 				}
// 			});
			
// 			$(".calendar_table td span").click(function(){
// 				$(".calendar-picker td").removeClass("select-start select-end selected");
// 				var selDate = $(this).attr("data-date");
// 				if (selDate == startDate && selDate == endDate) {
// 					var dateTime = '';
// 					startDate = '';
// 					endDate = '';
// 				}else{
// 					if (selDate == startDate) {
// 						startDate = endDate;
// 						selDate = endDate;
// 					}else if (selDate == endDate) {
// 						endDate = startDate;
// 						selDate = startDate;
// 					}else{
// 						if ($(this).closest("td").hasClass("select-start")) {
// 							selDate = '';
// 						}
// 						if ($(this).closest("td").hasClass("select-end")) {
// 							selDate = '';
// 						}
// 						if (!startDate) {
// 							startDate = selDate;
// 						}
// 						if (startDate && endDate && (selDate > startDate) && (selDate < endDate)) {
// 							startDate = selDate;
// 							endDate = '';
// 						}
// 					}
					
// 					if (startDate) {
// 						if (startDate && endDate) {
// 							if (selDate < startDate) {
// 								startDate = selDate;
// 							}else if (selDate > endDate) {
// 								endDate = selDate;
// 							}
// 						}else if (startDate > selDate) {
// 							endDate = startDate;
// 							startDate = selDate;
// 						}else{
// 							endDate = selDate;
// 						}
// 						$(".calendar_table td").each(function(){
// 							var a = $(this).find("span").attr("data-date");
// 							if (a && (startDate < a && endDate > a)) {
// 								$(this).addClass("selected");
// 							}
// 							if (a == startDate) {
// 								$(this).addClass("select-start");
// 							}
// 							if (a == endDate) {
// 								$(this).addClass("select-end");
// 							}
// 						});
// 					}
// 					if (startDate) {
// 						var dateTime = startDate.substring(0,4) + '.' + startDate.substring(4,6) + '.' + startDate.substring(6,8);
// 					}
// 					if (endDate && startDate != endDate) {
// 						dateTime += ' ~ ' + endDate.substring(0,4) + '.' + endDate.substring(4,6) + '.' + endDate.substring(6,8);
// 					}
// 				}
// 				$(".element-calendar input").val(dateTime);
// 			});
// 			var top = $target.offset().top + 30;
// 			var left = $target.offset().left - $(".calendar-picker").outerWidth() + 28;
// 			$(".calendar-picker").css({
// 				'top': top,
// 				'left': left
// 			});
// 		}else{
// 			$(".calendar-picker").remove();
// 		}
		
// 		function getData(date){
// 			var y = date.getFullYear();
// 			var m = date.getMonth();
// 			var d = date.getDate();
			
// 			var theDate = new Date(y,m,1);
// 			var theDay = theDate.getDay();
// 			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
// 			if (y%4 && y%100!=0 || y%400===0) {
// 				lastDate = last[1] = 29;
// 			}
// 			var lastDate = last[m];
// 			var row = Math.ceil((theDay+lastDate)/7);
			
// 			var dNum = 1;
// 			var days = '';
// 			for (var i=1; i<=row; i++) {
// 				days += '<tr>';
// 				for (var k=1; k<=7; k++) {
// 					if(i===1 && k<=theDay || dNum>lastDate) {
// 						days += '<td>&nbsp;</td>';
// 					} else {
// 						if (m+1 < 10) {
// 							var month = '0' + (m + 1);
// 						}else{
// 							var month = m + 1;
// 						}
						
// 						if (dNum < 10) {
// 							var day = '0' + dNum;
// 						}else{
// 							var day = dNum;
// 						}
// 						if (dNum == 1) {
// 							days += '<td><span class="first" data-date="' + y + month + day + '">' + dNum + '</span></td>';
// 						}else if(dNum == lastDate){
// 							days += '<td><span class="last" data-date="' + y + month + day + '">' + dNum + '</span></td>';
// 						}else{
// 							days += '<td><span data-date="' + y + month + day + '">' + dNum + '</span></td>';
// 						}
// 						dNum++;
// 					}
// 				}
// 				days += '</tr>';
// 			}
			
// 			var returnHtml = '<table class="calendar_table">' +
// 								'<tr>' +
// 									'<th><div class="icon calendar arrow left"></div></th>' + 
// 									'<th colspan="5" class="title">' + y + '. ' + (m+1) + '</th>' +
// 									'<th><div class="icon calendar arrow right"></div></th>' + 
// 								'</tr>' + 
// 								'<tr>' +
// 									'<th>Sun</th>' + 
// 									'<th>Mony</th>' + 
// 									'<th>Tue</th>' + 
// 									'<th>Wed</th>' + 
// 									'<th>Thu</th>' + 
// 									'<th>Fri</th>' + 
// 									'<th>Sat</th>' + 
// 								'</tr>' + days +
// 							'</table>';
// 			return returnHtml;
// 		}
// 	};
// }();


// var datepicker = new function(){
// 	this.create = function($this){
// 		$target = $this.find(".bt-calendar");
// 		$target.toggleClass("active");
// 		$target.find(".icon.calendar").toggleClass("active");
		
// 		var selDate;
// 		var dateTime;
		
// 		if ($target.hasClass("active")) {
// 			var date_prev = new Date();
// 			date_prev.setMonth(date_prev.getMonth()-1);
// 			var cal = getData(new Date());
// 			var cal_prev = getData(date_prev);
			
// 			$(".calendar-picker").remove();
// 			var html = '<div class="calendar-picker keepShow">' +
// 							'<table>' +
// 								'<tr>' +
// 									'<td class="left">' +
// 										'<div class="outline">' + cal_prev + '</div>' +
// 									'</td>' +
// 									'<td><div class="outline">' + cal + '</div>' +
// 									'</td>' +
// 								'</tr>' +
// 							'</table>' +
// 						'</div>';
// 			$("body").append(html);
// 			$(".calendar-picker").addClass("show");
// 			$(".calendar-picker .edit").click(function(){
// 				if (!$(this).find("input").length) {
// 					var a = $(this).text();
// 					var sel = '<input type="number" class="keepShow" value="'+a+'" style="width:100%; height:100%; color:#000;"/>';
// 					$(this).html(sel);
// 				}
// 			});
			
// 			$(".calendar_table td span").click(function(){
// 				$(".calendar-picker td").removeClass("select-start select-end selected");
// 				selDate = $(this).attr("data-date");
// 				$(".calendar-picker td").removeClass("select-start select-end");
// 				$(this).parent().addClass("select-start select-end");
// 				dateTime = selDate.substring(0,4) + '.' + selDate.substring(4,6) + '.' + selDate.substring(6,8);
// 				$(".element-calendar input").val(dateTime);
// 				$(".calendar-picker").remove();
// 				$target.removeClass("active");
// 				$target.find(".icon.calendar").removeClass("active");
// 			});
// 			if($target.parent().hasClass("left")){
// 				var top = $target.offset().top + Number($target.outerHeight());
// 				var left = $target.offset().left;
// 				$(".calendar-picker").css({
// 					'top': top,
// 					'left': left
// 				});
// 			}else{
// 				var top = $target.offset().top + Number($target.outerHeight());
// 				var left = $target.offset().left - $(".calendar-picker").outerWidth() + 28;
// 				$(".calendar-picker").css({
// 					'top': top,
// 					'left': left
// 				});	
// 			};
// 		}else{
// 			$(".calendar-picker").remove();
// 		}
		
// 		function getData(date){
// 			var y = date.getFullYear();
// 			var m = date.getMonth();
// 			var d = date.getDate();
			
// 			var theDate = new Date(y,m,1);
// 			var theDay = theDate.getDay();
// 			var last = [31,28,31,30,31,30,31,31,30,31,30,31];
			
// 			if (y%4 && y%100!=0 || y%400===0) {
// 				lastDate = last[1] = 29;
// 			}
// 			var lastDate = last[m];
// 			var row = Math.ceil((theDay+lastDate)/7);
			
// 			var dNum = 1;
// 			var days = '';
// 			for (var i=1; i<=row; i++) {
// 				days += '<tr>';
// 				for (var k=1; k<=7; k++) {
// 					if(i===1 && k<=theDay || dNum>lastDate) {
// 						days += '<td>&nbsp;</td>';
// 					} else {
// 						if (m+1 < 10) {
// 							var month = '0' + (m + 1);
// 						}else{
// 							var month = m + 1;
// 						}
						
// 						if (dNum < 10) {
// 							var day = '0' + dNum;
// 						}else{
// 							var day = dNum;
// 						}
// 						if (dNum == 1) {
// 							days += '<td><span class="first" data-date="' + y + month + day + '">' + dNum + '</span></td>';
// 						}else if(dNum == lastDate){
// 							days += '<td><span class="last" data-date="' + y + month + day + '">' + dNum + '</span></td>';
// 						}else{
// 							days += '<td><span data-date="' + y + month + day + '">' + dNum + '</span></td>';
// 						}
// 						dNum++;
// 					}
// 				}
// 				days += '</tr>';
// 			}
			
// 			var returnHtml = '<table class="calendar_table">' +
// 								'<tr>' +
// 									'<th><div class="icon calendar arrow left"></div></th>' + 
// 									'<th colspan="5" class="title">' + y + '. ' + (m+1) + '</th>' +
// 									'<th><div class="icon calendar arrow right"></div></th>' + 
// 								'</tr>' + 
// 								'<tr>' +
// 									'<th>Sun</th>' + 
// 									'<th>Mony</th>' + 
// 									'<th>Tue</th>' + 
// 									'<th>Wed</th>' + 
// 									'<th>Thu</th>' + 
// 									'<th>Fri</th>' + 
// 									'<th>Sat</th>' + 
// 								'</tr>' + days +
// 							'</table>';
// 			return returnHtml;
// 		}
// 	};
// }();