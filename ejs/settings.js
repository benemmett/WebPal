function showsettings(){
	console.log("showsettings");
	//TINY.box.show({url:'main_options.html',width:900,height:400,opacity:20,topsplit:3});
	TINY.box.show({iframe:'main_options.html',boxid:'frameless',width:950,height:450,fixed:false,maskopacity:40})
}


$("#conf_button").bind('click', showsettings);