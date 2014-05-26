var icons = ["site_icons/1_google.png","site_icons/2_hhbs.jpg","site_icons/3_twitter.png","site_icons/4_msn.png","site_icons/5_wikipedia.png","site_icons/6_youtube.png","site_icons/7_ebay.png","site_icons/8_amazon.png","site_icons/9_yahoo.png"];
var iconsites = ["http://www.google.com","http://www.helpinghandsbringsunshine.org/", "http://twitter.com", "http://www.msn.com", "http://www.wikipedia.com", "http://www.youtube.com", "http://www.ebay.com", "http://www.amazon.com", "http://www.yahoo.com"];
var counter = 1;
var db = window.openDatabase("webpalStorage", "1.0", "webpalStorage", 200000);

$(document).ready(function () {
	//rssparser();
    //displayTopSite();
    setbackground();
    initDatabase();
    
});

var TopSitesArray = [];
var TopSitesTitlesArray = [];
var TopSitesThumbArray = [];
var TopSitesIDArray = [];
var tilesArray = [];


var counter = 0;

function buildPopupDom(mostVisitedURLs) {
	var popupDiv = $('#mostVisited_div');
	console.log( "TopSitesArray.length:" + TopSitesArray.length);
	for (var i = 0; i < TopSitesArray.length; i++) {
		tilesArray.push("main_tile_"+i);
		var bk = 'no';
		if (counter != 3) {
			var tile = "<div class='tile' style='float:left;' id='main_tile_"+i+"'>";
		} else {
			var tile = "<div class='tile' id='main_tile_"+i+"'>";
		}
		tile += "<div class='tile_inner' id='tile_inner"+TopSitesIDArray[i]+"' ";
		if ( TopSitesThumbArray[i] != null ){
			tile += "style='background-image:url(" + TopSitesThumbArray[i] + ");background-size:180px;background-repeat:no-repeat;background-position:center;'";
			bk = 'yes';
		}
		tile +=  "><div class='tile_hover_class' ><img src='images/delete.png' width='16px'></div>";
		if (bk == 'no'){
			tile +=  "<div class='tile_favicon' style='color:grey;'>Please click on the tile and let the page finish loading to capture a preview.</div>	";	
		}
		tile +=  "</div><div class='tile_favicon'><img src='chrome://favicon/"+TopSitesArray[i]+ "'></div><div class='tile_title'>"+TopSitesTitlesArray[i].substring(0,21) + "</div></div>";
		console.log(tile);
		
		if (counter == 2){
			counter = -1;
			tile += "<div style='clear:both;'>";
		} else {
			counter++;
		}
		console.log(tile);
		$("#mostVisited_div").append(tile);
	}
	$(".tile").click(function(){
		console.log($.inArray(this.id, tilesArray));
		localStorage.setItem("urlNewThumb", TopSitesArray[$.inArray(this.id, tilesArray)]);
		localStorage.setItem("urlNewThumbTitle", TopSitesTitlesArray[$.inArray(this.id, tilesArray)]);
		document.location.href=TopSitesArray[$.inArray(this.id, tilesArray)];
	});
	$(".tile_hover_class").click(function( event ){
		event.stopPropagation();
		
		var grandparentid = $(this).parent().parent().attr('id');
  		var parentid = $(this).parent().attr('id');
  		
  		var tid = parentid.replace('tile_inner','');
  		
		var r=confirm("Are you sure you want to remove this tile?");
		if (r==true){
  			//take out from the db. 
  			tmStorage.transaction(
				function (transaction) {
					transaction.executeSql("DELETE from Top_Sites where Top_Site_Id="+tid+" ;", []);
				}
			);
  			$("#"+grandparentid).remove();	
  		} 
	});
}
	
	


function initDatabase() {
	try {
		if (!window.openDatabase) {
			alert('Local Databases are not supported by your browser. ');
		} else {
			var shortName = 'webpalStorage';
		    var version = '1.0';
		    var displayName = 'webpalStorage';
		    var maxSize = 100000; // in bytes
		    tmStorage = openDatabase(shortName, version, displayName, maxSize);
			
			getAllTopSitesDefault();
			getAllTopSitesUser();
			selectAll();
			
		}
	} catch(e) {
		if (e == 2) {
			console.log("Invalid database version.");
		} else {
			console.log("Unknown error "+ e +".");
		}
		return;
	} 
}

function selectAll(){ 
	tmStorage.transaction(
		function (transaction) {
			transaction.executeSql("SELECT Count(*) as totbe from Blocked_Elements ;", [], totTrackers, errorHandler);
		}
	);	
}

function getAllTopSitesDefault(){
	tmStorage.transaction(
		function (transaction){
			transaction.executeSql("SELECT * from Top_Sites where Source='System' limit 8 ;",[],topSitesDB, errorHandler);
		}
	)
}

function getAllTopSitesUser(){
	tmStorage.transaction(
		function (transaction){
			transaction.executeSql("SELECT * from Top_Sites where Source = 'User';",[],topSitesDB, errorHandler);
		}
	)
}
	
function totTrackers(transaction, results){
		var st = localStorage.getItem("stats_total");
		var o = jQuery.parseJSON(st);
		console.log("########################################");
		console.log("abp total: "+o.blocked);
		console.log("########################################");
		if (o.blocked !="undefined"){
			$("#odometer").html(o.blocked);
		} else {
			$("#odometer").html("0");
		}
		console.log("total trackers:"+results.rows.item(0).totbe);
		//console.log(results.rows.item(0).totbe);
}
	
function errorHandler(transaction, error){
	if (error.code==1){
	} else {
		console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
	}
	return false;
}

function nullDataHandler(){
	console.log("SQL Query Succeeded");
}

var q = 1;
function topSitesDB(transaction, results){
	console.log(transaction);
	for ( m = 0; m < results.rows.length; m++){
		console.log ( m +":"+results.rows.item(m).Top_Site_Url); 
		console.log($.inArray(results.rows.item(m).Top_Site_Url, TopSitesArray)) ;
		console.log(results.rows.item(m).Top_Site_Image);
		if ($.inArray(results.rows.item(m).Top_Site_Url, TopSitesArray) == -1 ){
				TopSitesArray.push(results.rows.item(m).Top_Site_Url);
				TopSitesThumbArray.push(results.rows.item(m).Top_Site_Image);
				TopSitesTitlesArray.push(results.rows.item(m).Top_Site_Title);
				TopSitesIDArray.push(results.rows.item(m).Top_Site_Id);
		}
	}	
	console.log(TopSitesArray) ;
	console.log(TopSitesThumbArray) ;
	//console.log(results.rows.item);
	q++;
	console.log(" TTTTTTTTTTTTTTTTTT   This is q:" +q);
	if (q == 3) {	
		chrome.topSites.get(buildPopupDom);
	}	
}



function onAnchorClick(event) {
	chrome.tabs.create({ url: event.srcElement.href });
	return false;
}

function remove(){
	alert("need to remove this guy");
	return false();
}


function rssparser(){
	//var rssurl = "http://customercommons.org/feed/"; 
	var rssArray = [];
	var counter = 0;
	$.get(rssurl, function(data) {
    	var $xml = $(data);
    	$xml.find("item").each(function() {
        	var $this = $(this),
            	item = {
                	title: $this.find("title").text(),
                	link: $this.find("link").text(),
                	description: $this.find("description").text(),
                	pubDate: $this.find("pubDate").text(),
                	author: $this.find("author").text()
        		}
        	console.dir(item);
        	itemdetail = "<span style='font-family:arial;font-size:11px;'><b style='font-size:11px;text-align:left;'><a href='"+item.link+"'>"+item.title+"</b></a><br></span>";
        	itemdetail += "<span style='font-size:11px;'>"+item.pubDate+" - "+item.author+"<br>"+item.description+"<hr style='border:1px;width:80%;'></span>";
        	//$("#newsitem_"+counter).css({'font-style':'arial','font-size':'11px'});
        	$("#rss").append(itemdetail);
        	
    	});
	});
}	


function setbackground(){
	bkimg = localStorage.getItem("newTabBkImg");	
	$('body').css('background-image', 'url(' + bkimg + ')');
}


