var griddata = new function() {
	
	this.uploadFile = function(){
		console.log('[fn] datafile.uploadFile');
		
		$("#file").click();
	};
	
	this.checkFile = function(){
		console.log('[fn] datafile.checkFile');
		
		var filename = $("#file").val();
		if (filename !== "") {
			var extension = filename.replace(/^.*\./, '');
			if (extension == filename) {
				extension = '';
			} else {
				extension = extension.toLowerCase();
			}
			switch (extension) {
				case 'csv':
				case 'xls':
				case 'xlsx':
					$("#nextStep").removeClass("none");
					break;
				default:
					alert("Invalid file type. Please upload a .csv file.");
					$("#file").val("");
					$("#nextStep").addClass("none");
			}
			filename = filename.replace(/^.*[\\\/]/, '');
			$("#filename").text(filename);
			$("#uploadArea").addClass("none");
			$("#progressArea").removeClass("none");
			
			var arr = [];
			arr['id'] = 'file';
			arr['type'] = section;
			arr['afterFunc'] = this.nextStep;
			file.upload(arr);
		}
	};
	
	this.nextStep = function(){
		console.log('[fn] datafile.nextStep');
		
		$.ajax({
			type: "POST",
			data: 'filepath='+$('#filepath').val(),
			url: 'section/'+section+'/import_'+section+'_mapping',
			success: function(data){
				$('.step-detail').addClass('none');
				$('.step-detail').eq(1).removeClass('none');
				$('.excelupload').html(data);
				step3();
			}
		});
	};
	
}