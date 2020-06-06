class Plugin {
	constructor(){
		$( "#apply-plugin" ).click(() => {
			this.addPluginDialog();
	});

	}

	createDropdowns(id, label, options){
		let div = $('<div>',{'class':'form-group'});
		let dropdown_label = $('<label>',{'class':'col-sm-4 col-form-label'}).text(label);
		let dropdown_div = $('<div>',{'class':'col-sm-6'});
		let dropdown = $('<select>', {'id':id, 'class':'form-control'});
		$.each( options, (k,v) => {
			dropdown.append($("<option>").attr('value',k).text(v));
		});
		dropdown_div.append(dropdown);
		div.append(dropdown_label);
		div.append(dropdown_div);
		return div;
	}
	
	addPluginDialog(){

		let dialog = $('<div>');
		let dialogForm = $('<div>').css('overflow','auto');
		let ds_option = {};
		for(let i of GeneDive.datasource.dslist){
			if(i.hasOwnProperty('short_id'))
			ds_option[i.id] = i.name;
		}
		dialogForm.append(this.createDropdowns("ds_dropdown", "Select Data sources", ds_option));
		dialogForm.append($('<br>'));
		let optionList = {"_sum":"Add Summary Column",
				"_det":"Add Detail Column",
				"_filter": "Add Filter",
				"highlight" :"Add Highlighter"};
		dialogForm.append(this.createDropdowns("plugin_option","Select Custom Plugin",optionList));

		dialog.append('<p>User may add custom behaviour on user-defined data sources. Select the plugin for data source to be edited</p>'); 
		dialog.append(dialogForm);
		alertify.confirm('Add Custom Behaviour with GeneDive Plugins', 
			$('<div>').append(dialog).html(),
			() => { 
				let id = $('#ds_dropdown').val() + $('#plugin_option').val();
				registerAddPluginEvent($('#ds_dropdown option:selected'), $('#plugin_option option:selected')); 
			}
                , function(){ alertify.error('Cancel')});
	}

}
