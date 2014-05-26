//initate db stuff. 
	var db = openDatabase("webpalStorage", "1.0", "webpalStorage", 200000);
	var createStatement = "CREATE TABLE IF NOT EXISTS Blocked_Elements (Blocked_Element_Id INTEGER PRIMARY KEY AUTOINCREMENT, Blocked_Element_Url TEXT, Blocked_Element_Parent_Url TEXT, Timestamp TEXT)";
	var createTopSites = "CREATE TABLE IF NOT EXISTS Top_Sites(Top_Site_Id  INTEGER PRIMARY KEY AUTOINCREMENT, Top_Site_Url TEXT, Top_Site_Title TEXT, Top_Site_Image BLOB, Source TEXT)";
	var insertTopSitesStmt = "INSERT INTO Top_Sites(Top_Site_Url, Top_Site_Title, Source) VALUES (?,?,?)";
	
	function onError(tx, error) {
		console.log(error.message);
	}

	function createTable() { 
		db.transaction(function(tx) {
			tx.executeSql(createStatement, [], onError);
		});
	}
	
	function createTopSiteTable() { 
		db.transaction(function(tx) {
			tx.executeSql(createTopSites, [], onError);
		});
	}
	

function insertTopSite(url, title, source) {
			db.transaction(function(tx) {
				tx.executeSql(insertTopSitesStmt, [url, title,source],onError);
			});
	}


function firstInsert(mostVisitedURLs) {
		for (var i = 0; i < 8; i++) {
				insertTopSite(mostVisitedURLs[i].url, mostVisitedURLs[i].title,"System");
				console.log(mostVisitedURLs[i].url);
		}	
}





function onInstall() {
	createTable();
	createTopSiteTable();
	chrome.topSites.get(firstInsert);
    console.log("Extension Installed");
    // setup background image for newtab page. 
    localStorage.setItem("newTabBkImg", "../backgrounds/squairy_light.png");
    localStorage.setItem("emmettCounter","");
  }

  function onUpdate() {
    console.log("Extension Updated");
  }

  function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
  }

  // Check if the version has changed.
  var currVersion = getVersion();
  var prevVersion = localStorage['version']
  if (currVersion != prevVersion) {
    // Check if we just installed this extension.
    if (typeof prevVersion == 'undefined') {
      onInstall();
    } else {
      onUpdate();
    }
    localStorage['version'] = currVersion;
  }





//db stuff
	
	//var createTopTabStmt = "CREATE TABLE IF NOT EXISTS TopTabs (TopTab_Id INTEGER PRIMARY KEY AUTOINCREMENT, TopTabCapture BLOB, TopTab_Parent_Url TEXT, Timestamp TEXT)";
	//var insertTopTabStmt = "INSERT INTO TopTabs(TopTabCapture, TopTab_Parent_Url, Timestamp) VALUES (?,?,?)";
	var updateTopTabStmt = "UPDATE Top_Sites SET Top_Site_Image =? where Top_Site_Title = ?  ";
	var insertTopTabStmt = "INSERT into Top_Sites ( Top_Site_Url, Top_Site_Title, Top_Site_Image, Source) VALUES (?,?,?,?)";
	var createStatement = "CREATE TABLE IF NOT EXISTS Blocked_Elements (Blocked_Element_Id INTEGER PRIMARY KEY AUTOINCREMENT, Blocked_Element_Url TEXT, Blocked_Element_Parent_Url TEXT, Timestamp TEXT)";
	var insertStatement = "INSERT INTO Blocked_Elements(Blocked_Element_Url, Blocked_Element_Parent_Url, Timestamp) VALUES (?,?,?)";
	var db = openDatabase("webpalStorage", "1.0", "webpalStorage", 200000);
	//createTable();

	function onError(tx, error) {
		console.log(error);
	}

	function insertRecord(url, parent_url) {
		if (url != null){
			db.transaction(function(tx) {
				console.dir("url:"+url);
				console.dir("parent_url:"+parent_url);
				timestamp = +new Date;
				//console.log("url: "+Tea.encrypt(url,"FUTEmmett"));
				tx.executeSql(insertStatement, [Tea.encrypt(url,"FUTEmmett"), Tea.encrypt(url,"FUTEmmett"), timestamp]);
			});
		}
	}
	


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
     console.log(request);           
     //insertRecord(request.url, request.parent_url); -- disable entering a new record for each blocked tracker. Data is not really interesting. 
  });


    function updateThumbnail(a, b) {
        setTimeout(function () {
            try {
                chrome.tabs.captureVisibleTab(null, {
                    format: "png"
                }, function (f) {
                    var h = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
                    var d = h.getContext("2d");
                    var g = document.createElement("img");
                    g.onload = function () {
                        try {
                            resized_width = 460;
                            quality = 0.65;
                            if (localStorage["options.thumbnailQuality"] == "low") {
                                resized_width = 360;
                                quality = 0.65
                            }
                            if (localStorage["options.thumbnailQuality"] == "high") {
                                resized_width = 720;
                                quality = 0.65
                            }
                            resized_height = Math.ceil((resized_width / g.width) * g.height);
                            h.width = resized_width;
                            h.height = resized_height;
                            d.drawImage(g, 0, 0, resized_width, resized_height);
                            db.transaction(function(tx) {
								timestamp = +new Date;
								//digican = c.toDataURL();
								tx.executeSql(updateTopTabStmt, [h.toDataURL("image/jpeg", quality),a]);
								//console.log(digican);
								console.log("updated tabCapture - *************************************************** start ***********");
								console.log("a: "+a);
								console.log("updated tabCapture - *************************************************** end ***********");
							});
                            g = null;
                        } catch (i) {
                            console.log(i);
                        }
                    };
                    g.src = f;
                })
            } catch (c) {
                console.log(c);
            }
        }, b)
    }

function makeThumbnail(a, b, t) {
        setTimeout(function () {
            try {
                chrome.tabs.captureVisibleTab(null, {
                    format: "png"
                }, function (f) {
                    var h = document.createElementNS("http://www.w3.org/1999/xhtml", "html:canvas");
                    var d = h.getContext("2d");
                    var g = document.createElement("img");
                    g.onload = function () {
                        try {
                            resized_width = 460;
                            quality = 0.65;
                            if (localStorage["options.thumbnailQuality"] == "low") {
                                resized_width = 360;
                                quality = 0.65
                            }
                            if (localStorage["options.thumbnailQuality"] == "high") {
                                resized_width = 720;
                                quality = 0.65
                            }
                            resized_height = Math.ceil((resized_width / g.width) * g.height);
                            h.width = resized_width;
                            h.height = resized_height;
                            d.drawImage(g, 0, 0, resized_width, resized_height);
                            
                            db.transaction(function(tx) {
								timestamp = +new Date;
								//digican = c.toDataURL();
								tx.executeSql(insertTopTabStmt, [a,b,h.toDataURL("image/jpeg", quality),"User"]);
								//console.log(digican);
								console.log("inserted  &&&&&&&&&&  USER &&&&&&&&&&&&&&&  tabCapture - *************************************************** end ***********");
							});
                            g = null;
                        } catch (i) {
                            console.log(i);
                        }
                    };
                    g.src = f;
                })
            } catch (c) {
                console.log(c);
            }
        }, t)
    }



var title = "Add Page to Web Pal Home Page";
chrome.contextMenus.create({"title":title, 'contexts': ['all'],"onclick": genericOnClick});


  

function genericOnClick(info,tab,title){
	console.log("INFO:************************************************" );
	console.log(info.pageUrl);
	console.log("TAB:************************************************" );
	console.log(info);
	console.log("TITLE:************************************************" );
	console.log(tab.title);
	console.log("END TITLE:************************************************" );
	//console.log(title);
	// get page Title. 
	makeThumbnail(info.pageUrl,tab.title, 1000);
}

chrome.tabs.onUpdated.addListener(function (a) {
    var gt = localStorage.getItem("urlNewThumb");
    console.log(gt);
    var gtt = localStorage.getItem("urlNewThumbTitle");
    console.log(gtt);
   
});



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (tab.status == "complete"){
		console.log("------------------------");
		console.log(tab.title);
		var gtt = localStorage.getItem("urlNewThumbTitle");
		//console.log("this is st: "+st);
		//localStorage.setItem("emmettCounter",st);
   	 	console.log(gtt);
   	 	if ( tab.title == gtt ) {
   	 		updateThumbnail(tab.title, 100);
   	 		localStorage.setItem("urlNewThumbTitle", "");
   	 	}
		console.log("------------------------");
		
	}
}); 

chrome.tabs.onActivated.addListener(function(activeInfo) {
}); 















