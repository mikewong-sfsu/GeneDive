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
	if($("#"+ tabId).length){//id exists{
		let id = tabId.split("_");
		if(id.length == 3){
			var num = id[2];
			tabId = tabId + "_" + (parseInt(num) + 1);
			tabName[1] = tabName[1] + " " + (parseInt(num) + 1);
	
		}else{
			tabId = tabId + "_1";
			tabName[1] = tabName[1] + " 1";
	
		}
        }	

        $('.nav-tabs').append('<li><a style="padding:0px" href="#' + tabId + '"><button class="close closeTab" type="button" >×</button>' 
		+ tabName[0] + '/' + tabName[1] + '  </a></li>');
        $('.tab-content').append('<div class="tab-pane" id="' + tabId + '" style="width:100%;height:90%"></div>');
	loadNewTab(tabId); //to load div contents 
        $(this).tab('show');
	$currentTabHash = tabId;
        showTab();
	saveCode(tabName);
	testCode();
	navigateToAPIDocs();
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
    divTag.append('<button style="margin-top:10px;margin-bottom:10px" class="btn_save" > Save and Refresh </button> ');
    divTag.append('<button style="margin-top:10px;margin-bottom:10px" class="btn_test" > Test Code </button> ');
    divTag.append('<button style="margin-top:10px;margin-bottom:10px" class="btn_help" > Help </button> '); 
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
    	lint: { esversion: 6 },
    	height:"auto",
    	autoCloseBrackets: true
    	});
    //editor.setOption("lint",true);
    $cmInstances[id].setSize("100%", "100%");
    $cmInstances[id].refresh();
    $cmInstances[id].foldCode(CodeMirror.Pos(0, 0));
    //check duplicates
    loadDivSelector = duplicateInstance(loadDivSelector);
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

function duplicateInstance(id){
    //checking duplicate datasource API combination
    let checkId = id.split("_");
    //duplicate entries
    if(checkId.length == 3){
	checkId.pop();
    }
    return checkId.join("_");


}

function saveCode(identifier){
identifier[1] = identifier[1].replace(/[0-9]/g, '').trim();
$( ".btn_save" ).on('click',function() {
	//check dupliactes
	let id = duplicateInstance($currentTabHash);
	let instance = $cmInstances[$currentTabHash+'_editor'];
	$.ajax({
     		url:"/datasource/edit/update.php",
     		type:"POST",
     		dataType:'html',
     		data:{code : instance.getValue(), plugin_id:"ds_" + id }
   	}).done((msg) => { 
		alertify.alert("Code updated successfully",identifier[1] + ' for ' +  identifier[0] +' Updated successfully. The session will be refreshed to apply the new changes.', () =>location.reload());
	}).fail((e) => {alertify.alert("", e)});

});
}
function testCode(){
$( ".btn_test" ).on('click',function() {
	//validation check only on available test data
	if( !GeneDive.interactions || GeneDive.interactions.length == 0){
		console.log("interactions:", GeneDive.interactions);
		alertify.alert("Test Plugin Code","No interaction data available for testing!");
	}
	//test code live against data in editor
	var instance = $cmInstances[$currentTabHash+'_editor'];
	var editedCode = instance.getValue();
	let ds_id = $currentTabHash.split("_")[0];
	//check duplicate instance
	let id = duplicateInstance($currentTabHash);
	//create temporary instance of edited value
	editedCode += 'var newInstance = new ds_'+ id + '("'+ GeneDive.datasource.dsmap[ds_id].short_id + '", GeneDive.interactions);';
	try{
		//evaluate the code
		eval(editedCode);
		//for Add column plugin
		if(GeneDive.tableview && ($currentTabHash.includes("sum") || $currentTabHash.includes("det"))){
			//temporarily replace object instance in objectMap of genedive table view
		 	let oldInstance = GeneDive.tableview.objectMap.get(ds_id);
		
			//if editing the detailview
			if(GeneDive.tableview instanceof TableDetail && $currentTabHash.includes("det")){
				testAddColumnCode(ds_id,newInstance, oldInstance)
			}
			//if editing the summaryview
			else if((GeneDive.tableview instanceof TableSummaryGene || 
				GeneDive.tableview instanceof TableSummaryArticle ) &&
				$currentTabHash.includes("sum")){
				//Edit the summary view
				testAddColumnCode(ds_id,newInstance, oldInstance)

			}
		}
		//if Adding new filter
		if($currentTabHash.includes("filter")){
			//get instance of the filter object map
			let oldInstance = GeneDive.textfilter.objectMap.get(ds_id);
			testAddFilter(ds_id,newInstance,oldInstance);
		}
		//if adding new highlight
		if($currentTabHash.includes("highlight")){
			//get instance of the highlight object  map
			let oldInstance = GeneDive.highlighter.objectMap.get(ds_id);
			console.log("in highlighter test");
			testAddHighlight(ds_id,newInstance,oldInstance);
		}

	}
	catch(e){
		alertify.alert("Error in code!","error:" + e);
	}	
});

}
function navigateToAPIDocs(){
$( ".btn_help").on('click', function() {
	window.open('/static/genedive/plugin/APIdocs.html','_blank');
});
}

function testAddColumnCode(ds_id, newInstance, oldInstance){
	GeneDive.tableview.objectMap.set(ds_id,newInstance);
	//redraw the table view
	$('#result-table').empty();
	GeneDive.tableview.drawHeaders();
	GeneDive.tableview.drawBody();
	GeneDive.tableview.initEditTable();
	//reset the value back to old value to maintain default behaviour
	GeneDive.tableview.objectMap.set(ds_id,oldInstance);
}

function testAddFilter(ds_id,newInstance,oldInstance){
	//replace filter object map with the new filter class file
	GeneDive.textfilter.objectMap.set(ds_id,newInstance);
	GeneDive.filterInteractions();
	//GeneDive.filtrate = GeneDive.textfilter.filterInteractions(GeneDive.interactions);

}

function testAddHighlight(ds_id,newInstance,oldInstance){
	//replace filter object map with the new filter class file
	GeneDive.highlighter.objectMap.set(ds_id,newInstance);
	GeneDive.highlightInteractions();
	//GeneDive.filtrate = GeneDive.textfilter.filterInteractions(GeneDive.interactions);

}





