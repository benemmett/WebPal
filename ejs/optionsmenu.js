var optionspagenames = ["Get Your Cloud","Background Options","Respect Network","Ad Block Plus","FAQ"];
var optionpages = ["http://emmettglobal.com/","options_wp.html","http://respectnetwork.com/","abp_options.html", "http://emmettglobal.com/faq.php"];


function buildmenu(){
	menuitems = "";
	menuitems += "<div style='text-align:center;width:100%;margin:auto;font-size:16px;margin-bottom:22px;margin-top:10px; color:white;font-family:Verdana, Geneva, sans-serif;'>OPTIONS</div>";
	for ( a = 0; a < optionpages.length ; a++ ) {
		if ( optionpages[a]	 == "tampermonkey_options.html"){
			menuitems += "<a class='menuitems_tm'  style='color:grey !important;font-size:13px;padding-bottom:10px;font-family:Verdana, Geneva, sans-serif;text-align:right;right-padding:5px;cursor:pointer;'>"+optionspagenames[a].toUpperCase()+"</a><br>";
			menuitems += "<span style='font-size:11px'>(will open in new tab)</span><br><br>";
		} else {
			menuitems += "<a class='menuitems' style='color:grey !important;font-size:13px;padding-bottom:10px;font-family:Verdana, Geneva, sans-serif;text-align:right;text-decoration:none;right-padding:5px;cursor:pointer;' rel='"+optionpages[a]+"'>"+optionspagenames[a].toUpperCase()+"</a><br><br>";	
		}	
	
	}
	console.log(menuitems);
	$("#emmettmenu").html(menuitems);
}

buildmenu();


$(".menuitems_tm").click(function(){
 	var newURL = "tampermonkey_options.html";
    chrome.tabs.create({ url: newURL });
});

$(".menuitems").click(function(){
    $("#external").attr('src', this.rel);
});

