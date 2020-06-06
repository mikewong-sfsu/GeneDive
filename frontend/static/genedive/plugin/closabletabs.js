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
        $currentTabHash = $(this)[0].hash;
	showTab();
    });
    registerCloseEvent();
    
});

//dynamically add tabs
function registerAddPluginEvent(tabId) {
        $('.nav-tabs').append('<li><a style="padding:0px" href="#' + tabId + '"><button class="close closeTab" type="button" >×</button> TabName </a></li>');
        $('.tab-content').append('<div class="tab-pane" id="' + tabId + '" style="width:100%;height:90%"></div>');
	loadNewTab(tabId); //to load div contents 
        $(this).tab('show');
	$currentTabHash = tabId;
        showTab();
	saveEditor();
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
    });
}

//This function will create a new tab here and it will load the url content in tab content div.
function loadNewTab(loadDivSelector) {
    let id = loadDivSelector + '_editor';
    let divTag = $('<div>',{'class':'container'}).css({'width':'100%','height':'100%'});
    let editorHTML = $('<div>', {'id':id}).css({'border':'1px solid #DDD','height':'100%','position':'relative'});
    divTag.append('<button style="margin:10px;" class="btn_save" id="savePluginCode"> Save Code </button> ');
    divTag.append('<button style="margin:10px;" class="btn_test" id="testPluginCode"> Test Code </button> ');
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


function saveEditor(){
$( "#savePluginCode" ).on('click',function() {
	let instance = $cmInstances[$currentTabHash+'_editor'];
	$.ajax({
     		url:"/datasource/edit/update.php",
     		type:"POST",
     		dataType:'html',
     		data:{code : instance.getValue(), plugin_id:"ds_" + $currentTabHash }
   	}).done(function(msg){ alertify.alert("Updated successfully"); alert("mg",msg);});
});

}
function testEditor(){
$( "#testPluginCode" ).on('click',function() {
	let instance = $cmInstances[$currentTabHash+'_editor'];

	let testTable = $('.table-wrapper').clone().css({ 'overflow': 'auto'});
	let div = $('<div>').empty().append(testTable);
//	let testTable = $('.table-wrapper').clone(true,true);
	//div.empty().append(testTable);
	alertify.alert(div.html());
	/*$.ajax({
     		url:"/datasource/edit/update.php",
     		type:"POST",
     		dataType:'html',
     		data:{code : instance.getValue(), plugin_id:"ds_" + $currentTabHash }
   	}).done(function(msg){ alertify.alert("Updated successfully");});
	*/
});

}




