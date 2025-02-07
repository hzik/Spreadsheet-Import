var kai_elements = [];
var kai_types = [];
var kai_languages = [];
var kai_type = "";
var headers = [];
var table_data = [];
var dataPaires = [];
var env = "";
var mapi = "";
var lang = "";
var newItems = true;

$(document).ready(function() {	
	
	$('#envid, #mapi').on('input', function() {		
		if ($('#envid').val() && $('#mapi').val()) {
			$('#proceed').show(200);
		}
		else {
			$('#proceed').hide(200);
		}
	});
	
	$('#types').on('change', function() {		
		if (this.value) {
			$('.overlay').show(200);
			$('#mapping').html("");
			kai_elements = [];
			kai_type = this.value;
			loadElements(this.value);
		}
		else {			
			$("#language").hide(200);
			$('#mapping').html("");
		}
	});
	
	$('#languages').on('change', function() {	
		if (this.value) {
			$('#import').show(200);
		}
		else {
			$('#import').hide(200);
		}
		lang = this.value;
	});

	let table = jspreadsheet(document.getElementById('spreadsheet'), {
		data: [
			[''],
		],
		columns: [
			{ title:'A', width:50 },
		],
		pagination:30
	});

	$("#proceed").on("click", function() {
				
		$('.overlay').show(200);
		env = $("#envid").val();
		mapi = $("#mapi").val();
		headers = table.headers;
		loadTypes("");
		
		$(".page1").hide(200);
		$(".page2").show(200);
		$(".jexcel").css("pointer-events", "none");
		$(".jexcel td").addClass("readonly");
		$(".jexcel_container").addClass("disabled");
	  
	});	
		
	$("#back").on("click", function() {

		$(".page2").hide(200);
		$(".page1").show(200);
		$(".jexcel").css("pointer-events", "auto");
		$(".jexcel td").removeClass("readonly");
		$(".jexcel_container").removeClass("disabled");		
		
		$('#mapping').html("");
		$('#types').html("<option value=''>Select a content type</a>");

	});
		
	$("#language").on("click", function() {

		$('.overlay').show(200);
		loadLanguages("");
		
		$(".page2").hide(200);
		$(".page3").show(200);

	});	
		
	$("#back_mapping").on("click", function() {

		$(".page3").hide(200);
		$(".page2").show(200);	

	});
	
	$("#import").on("click", function() {
		
		$("#back_mapping").hide(200);
		$("#import").hide(200);
		$("#languages").prop('disabled', 'disabled');
		$("#newItems").prop('disabled', 'disabled');
		$("#console").show(200);
		
		table_data = table.getData(false);
		newItems = $('#newItems').is(":checked");
		importItems();
	});	
	
});

function loadTypes(xc) {
	var url = 'https://manage.kontent.ai/v2/projects/'+env+'/types';
	$.ajax({
		url: url,
		dataType: 'text',		
		beforeSend: function(xhr, settings) { 
			if (xc) {
				xhr.setRequestHeader('X-Continuation',xc);
			}
			xhr.setRequestHeader('Authorization','Bearer '+mapi);
		},
		success: function (data, textStatus, request) {
			data = JSON.parse(data);
			if (data.types.length > 0) {
				processTypes(data.types);
				var xc = request.getResponseHeader('X-Continuation');
				if (xc) {
					loadTypes(xc);
				}
				else {
					showTypeOptions();	
					$('.overlay').hide(200);
				}
			}
			else {
				console.log("no data found");
				$("#msg").html("No data found. Please make sure your environment has at least one content type.");
				$('.overlay').hide(200);
			}
		},
		error:function(jqXHR, textStatus, errorThrown){
			 $("#msg").html("No data found. Please make sure you have correct environment id or correct Management API key.");
			 $('.overlay').hide(200);
		} 
	});	
}

function showMessage(msg) {
	$("#msg").html(msg);
}
				

function processTypes(data) {
	for (var x = 0; x < data.length; x++) {
		kai_types.push(data[x]);	
	}
}

function showTypeOptions() {
	$.each(kai_types, function (i, item) {
		$('#types').append($('<option>', { 
			value: item.codename,
			text : item.name 
		}));
	});
}

function loadElements(type) {
	var url = 'https://manage.kontent.ai/v2/projects/'+env+'/types/codename/'+type;
	$.ajax({
		url: url,
		dataType: 'text',		
		beforeSend: function(xhr, settings) { 
			xhr.setRequestHeader('Authorization','Bearer '+mapi);
		},
		success: function (data, textStatus, request) {
			data = JSON.parse(data);
			if (data.elements.length > 0) {
				processElements(data.elements);	
				showMapping();
				$('.overlay').hide(200);			
			}
			else {
				$("#msg").html("No data found.");
				$('.overlay').hide(200);
			}
		},
		error:function(jqXHR, textStatus, errorThrown){
			 $("#msg").html("No data found.");
			 $('.overlay').hide(200);
		} 
	});	
}

function processElements(data) {	
	var allowedElementTypes = ["date_time", "custom", "number", "rich_text", "text", "url_slug"];
	for (var x = 0; x < data.length; x++) {		
		if (allowedElementTypes.includes(data[x].type)) {
			kai_elements.push(data[x]);
		}
	}
}

function showMapping() {
	$.each(headers, function (i, item) {
		var mapping_item = '<div class="mapping_item">';
		mapping_item += '<div class="element_name">'+item.innerText+'</div>';
		mapping_item += '<div class="arrow">⇢</div>';
		mapping_item += '<select column="'+i+'">';
		mapping_item += '<option value="">Select an element</option>';
		mapping_item += '<option value="%extid%">[external id]</option>';
		mapping_item += '<option value="%itemname%">[item name]</option>';
		$.each(kai_elements, function (j, elem) {
			mapping_item += '<option value="'+elem.codename+'">'+elem.name+' ('+elem.type+')</option>';
		});
		mapping_item += '</select>';
		mapping_item += '</div>';
		$('#mapping').append(mapping_item);
	});
	$("#language").show(200);
}

function loadLanguages(xc) {
	var url = 'https://manage.kontent.ai/v2/projects/'+env+'/languages';
	$.ajax({
		url: url,
		dataType: 'text',		
		beforeSend: function(xhr, settings) { 
			if (xc) {
				xhr.setRequestHeader('X-Continuation',xc);
			}
			xhr.setRequestHeader('Authorization','Bearer '+mapi);
		},
		success: function (data, textStatus, request) {
			data = JSON.parse(data);
			if (data.languages.length > 0) {
				processLanguages(data.languages);
				var xc = request.getResponseHeader('X-Continuation');
				if (xc) {
					loadLanguages(xc);
				}
				else {
					showLanguageOptions();	
					$('.overlay').hide(200);
				}
			}
			else {
				$("#msg").html("No data found. Please make sure your environment has at least one language.");
				$('.overlay').hide(200);
			}
		},
		error:function(jqXHR, textStatus, errorThrown){
			 $("#msg").html("No data found.");
			 $('.overlay').hide(200);
		} 
	});	
}

function processLanguages(data) {
	for (var x = 0; x < data.length; x++) {
		kai_languages.push(data[x]);
	}
}

function showLanguageOptions() {
	$.each(kai_languages, function (i, item) {
		$('#languages').append($('<option>', { 
			value: item.codename,
			text : item.name 
		}));
	});
}

function importItems() {
	var hasExtID = false;
	var extIDIndex = -1;
	var hasItemName = false;
	var itemNameIndex = -1;
	$.each(headers, function (i, item) {
		if ($("select[column='" + i +"']").val()) {
			dataPaires.push([i, $("select[column='" + i +"']").val()]);
			if ($("select[column='" + i +"']").val() == "%extid%") {
				hasExtID = true;
				extIDIndex = i;
			}
			if ($("select[column='" + i +"']").val() == "%itemname%") {
				hasItemName = true;
				itemNameIndex = i;
			}
		}
	});
	importData(hasExtID, extIDIndex, hasItemName, itemNameIndex);
}

function importData(hasExtID, extIDIndex, hasItemName, itemNameIndex) {
	$.each(table_data, function (i, item) {
		var itemName = "";
		var extID = "";
		var randSuf = makeID(8);
		if (hasItemName) {
			itemName = table_data[i][itemNameIndex];
		}
		else {
			itemName = "Untitled item "+randSuf;
		}
		if (hasExtID) {
			extID = table_data[i][extIDIndex];
		}
		else {
			extID = "untitled_item_"+randSuf;
		}
		
		if (newItems) {
			setTimeout(createItem, (777*(i+1)), table_data[i], extID, extIDIndex, itemName, itemNameIndex);
		}
		else {
			setTimeout(createLanguageVariant, (777*(i+1)), table_data[i], extID, extIDIndex, itemName, itemNameIndex);
		}
	});
}

function consoleOutput(msg) {
	$("#console").prepend("<div><span>🠺</span>"+msg+"</div>");
}

function makeID(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * 	charactersLength));
	}
	return result;
}

function createItem(itemData, extID, extIDIndex, itemName, itemNameIndex) {
	
	var url = 'https://manage.kontent.ai/v2/projects/'+env+'/items';
	var data = {
					"name": itemName,
					"type": {
								"codename": kai_type
							},
					"external_id": extID
				};
	$.ajax({
		url: url,
		type: "POST",
		dataType: 'text',
		data: JSON.stringify(data),
		beforeSend: function(xhr, settings) {
			xhr.setRequestHeader('Authorization','Bearer '+mapi);
			xhr.setRequestHeader('content-type','application/json');
		},
		success: function (data) {
			createLanguageVariant(itemData, extID, extIDIndex, itemName, itemNameIndex);
		},
		error:function(jqXHR, textStatus, errorThrown){			
			console.log(jqXHR.responseText);
			consoleOutput("<span class='error'>New item '"+itemName+"' couldn't be created. Check the console for errors.</span>");
		} 
	});	
}

function createLanguageVariant(itemData, extID, extIDIndex, itemName, itemNameIndex) { 
	var createLanguageVariantUrl = 'https://manage.kontent.ai/v2/projects/'+env+'/items/external-id/'+extID+'/variants/codename/'+lang;
	var createLanguageVariantData = {
									"elements": []
									};
									
	$.each(dataPaires, function (i, item) {
		if (item[1] && item[1] != "%extid%" && item[1] != "%itemname%") {
			if (findElementType(item[1]) == "url_slug") {
				createLanguageVariantData.elements.push({
													"element": {
														"codename": item[1]
														},
														"value": itemData[item[0]],
														"mode": "custom"
												});	
			}
			else {	
				createLanguageVariantData.elements.push({
													"element": {
														"codename": item[1]
														},
														"value": itemData[item[0]]
												});				
			}					
		}
	});
	
	$.ajax({
		url: createLanguageVariantUrl,
		type: "PUT",
		dataType: 'text',
		data: JSON.stringify(createLanguageVariantData),
		beforeSend: function(xhr, settings) {
			xhr.setRequestHeader('Authorization','Bearer '+mapi);
			xhr.setRequestHeader('content-type','application/json');
		},
		success: function (data) {
			consoleOutput("Language variant '"+extID+"' in language '"+lang+"' upserted");
		},
		error:function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR.responseText);
			consoleOutput("<span class='error'>Language variant '"+extID+"' in language '"+lang+"' couldn't be userted. Check the console for errors.</span>");
		} 
	});	
}

function findElementType(codename) {
	var type = "";
	$.each(kai_elements, function (j, elem) {
		if (elem.codename  == codename) {
			type = elem.type;
		}
	});
	return type;
}