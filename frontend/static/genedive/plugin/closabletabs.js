////Include code mirror scripts

var currentTabHash;
var composeCount = 0;
$cmInstances = {};

//initilize tabs
$(() => {
    //when ever any tab is clicked this method will be call
    $("#bottomPanel").on("click", "a", function (e) {
        e.preventDefault();
	//show the clicked tab    
        $(this).tab('show');
        $currentTabHash = $(this)[0].hash.slice(1);
	showTab();
    });
    registerCloseEvent();
    
});

//dynamically add tabs
function registerAddPluginEvent(datasource, plugin) {
	let tabId = datasource.val() + plugin.val();
	let tabName = [ datasource.text(),plugin.text()];
        $('.nav-tabs').append('<li><a style="padding:0px" href="#' + tabId + '"><button class="close closeTab" type="button" >×</button>' 
		+ datasource.text() + '/' + plugin.text() + '  </a></li>');
        $('.tab-content').append('<div class="tab-pane" id="' + tabId + '" style="width:100%;height:90%"></div>');
	loadNewTab(tabId); //to load div contents 
        $(this).tab('show');
	$currentTabHash = tabId;
	console.log("value in currentTab: on create new tab", $currentTabHash);
        showTab();
	saveEditor(tabName);
	testEditor();
        registerCloseEvent();

}
//shows tab contents
function showTab() {
    $('#bottomPanel a[href="#' + $currentTabHash + '"]').tab('show');
}

//register close event
function registerCloseEvent() {
    $(".closeTab").click(function () {
        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        $(this).parent().parent().remove(); //remove li of tab
	$(tabContentId).remove(); //remove respective tab content
	//display the last tab as active
	$('#bottomPanel a:last').tab('show');
	window.location.hash = "";
    });
}

//This function will create a new tab here and it will load the url content in tab content div.
function loadNewTab(loadDivSelector) {
    let id = loadDivSelector + '_editor';
    let divTag = $('<div>',{'class':'container'}).css({'width':'100%','height':'100%'});
    let editorHTML = $('<div>', {'id':id}).css({'border':'1px solid #DDD','height':'100%','position':'relative'});
    divTag.append('<button style="margin:10px;" class="btn_save" > Save Code </button> ');
    divTag.append('<button style="margin:10px;" class="btn_test" > Test Code </button> ');
    divTag.append(editorHTML);
    $('#' + loadDivSelector).append(divTag);
    //initialize code mirror instance
    $cmInstances[id] = new CodeMirror(document.getElementById(id), {
	mode: "javascript",
    	indentUnit: 4,
    	lineNumbers: true,
    	lineWrapping: true,
	extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor());
    	}},
    	foldGutter: true,
    	gutters: ["CodeMirror-lint-markers","CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    	lint: true,
    	height:"auto",
    	autoCloseBrackets: true
    	});
    //editor.setOption("lint",true);
    $cmInstances[id].setSize("100%", "100%");
    $cmInstances[id].refresh();
    $cmInstances[id].foldCode(CodeMirror.Pos(0, 0));
    //populate the editor
    $.ajax({
    method: "POST",
    url: "/datasource/edit/import.php",
    data: { ds_id: "ds_" +  loadDivSelector},
  }).done(function(msg){
	  let code = msg.toString();
	  $cmInstances[id].setValue(code);
  });
}


function saveEditor(identifier){
$( ".btn_save" ).on('click',function() {
	console.log("currentTab value on save button click", $currentTabHash);
	console.log("cm instances:",$cmInstances);
	let instance = $cmInstances[$currentTabHash+'_editor'];
	$.ajax({
     		url:"/datasource/edit/update.php",
     		type:"POST",
     		dataType:'html',
     		data:{code : instance.getValue(), plugin_id:"ds_" + $currentTabHash }
   	}).done(function(msg){ alertify.alert(identifier[1] + ' for ' +  identifier[0] +' Updated successfully');});
});

}
function testEditor(){
$( ".btn_test" ).on('click',function() {
	let instance = $cmInstances[$currentTabHash+'_editor'];
	let div = $('<div>').css({'overflow':'auto'});
	let testTable = $('#result-table').clone();
	div.append(testTable);

	alertify.alert($('<div>').append(div).html());
	/*$.ajax({
     		url:"/datasource/edit/update.php",
     		type:"POST",
     		dataType:'html',
     		data:{code : instance.getValue(), plugin_id:"ds_" + $currentTabHash }
   	}).done(function(msg){ alertify.alert("Updated successfully");});
	*/
});

}




