var preview = function(){
	var next = true;

	// check name
	var $name = $("#viewname");
	var name = $name.val();
	if (!name) {
        alert("Please enter a label name");
		$name.focus();
		next = false;
        return false;
    }

	// check criteria value
	$("#advanced-filters .filterCondition").each(function(){
		var target = $(this);
		var a = target.val();
		var b = target.closest("tr").find("input.input").val();
		switch (a) {
			case "is":
			case "isn't":
			case "contains":
			case "doesn't contain":
			case "starts with":
			case "ends with":
				if (!b) {
                    alert("Please enter a filter keyword");
					next = false;
					target.closest("tr").find(".inputArea").focus();
                    return false;
                }
				break;
		}
	});

	// check view field
	var selColum = $("#sortable1 p").length;
	if (selColum === 0) {
        alert("Please select view fields");
		next = false;
        return false;
    };

	// run preview query
	if (next === true) {
		var arr = [];
		$("#type").val("preview");
		loading();
		$.ajax({
			type: "POST",
			url: "db/account",
			data: $("#frm").serializeArray(),
			success: function(data){
				var arr = [];
				arr['type'] = 'fullsize';
				arr['html'] = data;
				arr['title'] = 'Preview';
				popup.create(arr);
				loads();
			},
			error: function(request, status, error) {
				alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
			}
		});
    };
}

var saveview = function(section){
	var filter = true;
	$('#advanced-filters input[name="filter_value[]"]').not('.none').each(function(idx, target) {
		if( $(target).val() == '' ) filter = false;
	});

	if($("#filter_title").val() == ""){
		alert("Please enter the view name.");
	}else if(!filter) {
		alert('필터 조건을 입력해주세요');
	}else{
		$("#formviewname").val($("#viewname").val());
		var formData = $("#frm-newtab").serializeArray();
		$.ajax({
			url: 'db/' + section,
			type: 'POST',
			data: formData,
			success: function(data) {
 				location.replace('?sec=' + section + '/main&tab=99999');
			}
		});
	}
};

var shareview = function(section){
	var formData = $("#frm-sharetab").serializeArray();
	$.ajax({
		url: 'db/common',
		type: 'POST',
		data: formData,
		success: function(data) {
			alert('해당유저에게 공유되었습니다.');
			location.reload();
		}
	});
};

var applystyle = function(){
	var arr = [];
	$('.userList input[type=checkbox]').each(function(){
		var chk = $(this).prop('checked');
		if(chk) arr.push($(this).val());
	});
	var user = arr.join(',');
	var tabno = $('#frm-sharetab input[name=tabno').val();
	$.ajax({
		url: 'db/common',
		type: 'POST',
		data: 'type=copyTab&user=' + user + '&tabno=' + tabno + '&section=' + section,
		success: function(data) {
			alert('공유된 유저에게 현제 값을 적용하였습니다.');
			location.reload();
		}
	});
};


var closeNewView = function(){
	$("#step1").removeClass("none");
	$("#step2").addClass("none");
	$("#step2 .contents").html("");
}

var viewOnOff = function(target){
	target2 = target.find("label.chkbox");
	if(target2.attr('data-checked') == "checked"){
		target2.attr('data-checked','');
		target.find("input:checkbox").attr('name','');
	}else{
		target2.attr('data-checked','checked');
		target.find("input:checkbox").attr('name','viewColum[]');
	}
}

var cancelSave = function(){
	$("#step1").removeClass("none");
	$("#step2").addClass("none");
	$("#step2 .con").html("");
    $("#grid-util-new").html('<span type="button" class="button type1" onclick="closeNewView()">Cancel</span> <span type="button" class="button type1 submit" onclick="preview()">Preview</span>');
}

var changeCondition = function(target){
	var a = target.val();
	switch (a) {
        case "is":
		case "isn't":
		case "contains":
		case "doesn't contain":
		case "starts with":
		case "ends with":
			target.closest("tr").find("input[name='filter_value[]']").removeClass('none');
			break;
		case "is empty":
		case "is not empty":
			target.closest("tr").find("input[name='filter_value[]']").val("");
			target.closest("tr").find("input[name='filter_value[]']").addClass('none');
			break;
    }
};

var checkActField = function(){
	$("#sortable1").find("input").attr("name","");
	$("#sortable1").find("input").attr("name","viewColum[]");
	$("#sortable1 .chkbox.lg").each(function(){
		$(this).attr("data-checked","checked");
	});
};

var submit = function() {
	if($("#filter_title").val() == ""){
		alert("Please enter the list name.");
	}else{
		$("#frm").submit();
	}
};

var addEmailAddressLine = function(target) {
	var a = target.parent().parent().parent().find("tr").html();
	var b = target.closest("tr").find('select').eq(1).val();
	target.closest("#advanced-filters").append("<tr>"+a+"</tr>");
	target.closest("#advanced-filters").find('tr').last().find('input').val('');
	target.closest("#advanced-filters").find('tr').last().find('select').eq(1).val(b);
	checkAddDelete();
	criteriaAdd();

	target.closest("#advanced-filters select").each(function(){
		selecbox.select($(this));
	});
};

var removeEmailAddressLine = function(target) {
	var a = ($(".delete-line").index(target)) + 1;
	var b = $("#criteria").text();
	var c = target.parent().parent().find(".filter_contain").val().toLowerCase(); // AND or OR
	var aa = b.split(" ");

	var v = "";
	var x = 1;
	for(i=0; i<aa.length; i++){
		if (aa[i] != a) {
			if (aa[i] == "and" || aa[i] == "or") {
				x++;
			}
			if (x != a) {
				if (aa[i] > a) {
					aa[i] = aa[i]-1;
				};
				v = v.concat(aa[i]+" ");
			}else{
				x++;
			}
		}
	}

	z = v.toLowerCase();
	$("#criteria").text(z);
	changeCriteria(z);

	target.parent().parent().remove();
	renumber();
	if ($("#advanced-filters tbody tr").length == 1) {
		$("#advanced-filters tbody tr:first-child").find(".delete-line").css("display","none");
		$("#criteria-textarea").val('1');
		$("#criteria").text('1');
	}
};

var setCharAt = function(str,index,chr) {
	if(index > str.length-1) return str;
	return str.substr(0,index) + chr + str.substr(index+1);
};

var criteriaAdd = function(){
	var b = $(".filter_contain").length;
	var a = String($("#criteria").text());
	if (a === "") {
		changeCriteria("( 1 and 2 )");
	}else{
		a = " ( " + a + " and " + b + " ) ";
		changeCriteria(a)
	}
};

var checkAddDelete = function() {
	var a = $(".filter_contain").length;
	if (a > 1) {
		$(".delete-line").css("display","inline-block");
	}
	renumber();
	$('.advanceFilter .select-element').each(function(){
		$(this).css('display','block');
	});
	$('.advanceFilter .select-element').first().css('display','none');
};

var renumber = function() {
	var a = 1;
	$(".filter-no").each(function(){
		$(this).text(a);
		a++;
	});
};

var changeContain = function(target) {
	var a = ($(".filter_contain").index(target));
	console.log(a);
	var b = $("#criteria").text();
	var aa = b.split(" ");

	var z = "";
	var x = 1;
	for(i=0; i<aa.length; i++){
		if (aa[i] == "and" || aa[i] == "or") {
			if (x == a) {
				aa[i] = target.val();
			}
			x++;
		}
		z = z.concat(aa[i]+" ");
	}
	z = z.toLowerCase();
	changeCriteria(z);
};

var changeCriteria = function(txt){
	a = txt.replace(/ +(?= )/g,'').trim();
	$("#criteria").text(a);
	$("#criteria-textarea").text(a);
	$("#criteria-textarea").val(a);
};


var editPattern = function(){
	$("#criteria, #edit-pattern").css("display","none");
	$("#criteria-textarea, #edit-save, #edit-cancel").css("display","block");
}

var editCancel = function(){
	$("#criteria-textarea").val($("#criteria").text());
	$("#criteria, #edit-pattern").css("display","block");
	$("#criteria-textarea, #edit-save, #edit-cancel").css("display","none");
}

var editSave = function(){
	var a = $("#criteria-textarea").val();
	var txt1 = a.split("(").length-1; // count (
	var txt2 = a.split(")").length-1; // count )
	var txt3 = $(".filter_contain").length-1; // count select and/or

	if(txt1 != txt2){
		alert("Pattern brackets do not match");
	}else{
		a = a.replace(/[(]+/g,' ( ');
		a = a.replace(/[)]+/g,' ) ');
		a = a.replace(/[and]+/g,' and ');
		a = a.replace(/[or]+/g,' or ');
		changeCriteria(a);

		// 겹침 문자 체크
		if(a.replace(/ /gi,'').indexOf("andand") != -1 ||
			a.replace(/ /gi,'').indexOf("oror") != -1 ||
			a.replace(/ /gi,'').indexOf("orand") != -1 ||
			a.replace(/ /gi,'').indexOf("andor") != -1){
			alert("Invaid content in this pattern");
		}else{
			var j = a.match(/and/g);
			if (j != null) {
				j = j.length;
			}else{
				j = 0;
			}
			var k = a.match(/or/g);
			if (k != null) {
				k = k.length;
			}else{
				k = 0;
			}
			if(txt3 != (j+k)){
				alert("Number of conditions in this pattern do not match with the conditions selected in the Criteria Editor");
			}else{
				$("#criteria").val(a);
				$("#criteria-textarea").val(a);
				$("#criteria, #edit-pattern").css("display","block");
				$("#criteria-textarea, #edit-save, #edit-cancel").css("display","none");
			}
		}
	}
}


var createView = function(){
	var ajaxCall =	$.ajax({
		type: "POST",
		url: "section/account/newview",
		success: function(msg){
			$("#work1").append(msg);
			$("#grid-tab ul li.cnt").removeClass("cnt");
			$("#grid-tab ul li:last-child").after('<li class="cnt"><input type="text" id="viewname" style="width:90px; height:23px;"/></li>');
			$(".tab-util").addClass("none");
			$("#grid-util-list").addClass("none");
			$("#grid-util-new").removeClass("none");
		},
		error: function(request, status, error) {
			alert("code:" + request.status + "\n" + "message:" + request.responseText + "\n" + "error:" + error);
		}
	});
}

var changeName = function(){
	var a = $("#grid-tab .cnt label").text();
	activityMenu.activityClose();
}
