function getRSS( url, id, base ){
    if (window.ActiveXObject){
	xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }else if (window.XMLHttpRequest){
        xhr = new XMLHttpRequest();
    }else{
	setError("your browser does not support AJAX");
    }
    
    xhr.open("GET",url,true);
		
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Pragma", "no-cache");
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4){
            if (xhr.status == 200){
                if (xhr.responseText != null){
		    document.getElementById('crossrss-'+id+'-content').innerHTML="";
                    processRSS(xhr.responseXML, id);
                }else{
            	    setError("Failed to receive RSS file from the server - file not found.");
		    return false;
		}
    	    }else{
	        setError("Error code " + xhr.status + " received: " + xhr.statusText);
	    }	
	}else{
	    document.getElementById('crossrss-'+id+'-content').innerHTML="<img src='"+base+"/wp-content/plugins/cross-rss/ajax-loader.gif' />";
	}
    }
    xhr.send(null);
}

function processRSS(rssxml, id){
    if( id == 1 ){
	RSS = new RSS2Channel(rssxml);
	showRSS(RSS, id);
    }else{
	RSS1 = new RSS2Channel(rssxml);
	showRSS(RSS1, id);	
    }
}

function RSS2Channel(rssxml){
    this.title;
    this.link;
    this.description;
    this.language;
    this.copyright;
    this.managingEditor;
    this.webMaster;
    this.pubDate;
    this.lastBuildDate;
    this.generator;
    this.docs;
    this.ttl;
    this.rating;
    this.category;
    this.image;
    /*array of RSS2Item objects*/
    this.items = new Array();
    var chanElement = rssxml.getElementsByTagName("channel")[0];
    var itemElements = rssxml.getElementsByTagName("item");
    for (var i=0; i<itemElements.length; i++){
        Item = new RSS2Item(itemElements[i]);
        this.items.push(Item);
    }

    var properties = new Array("title", "link", "description", "language", "copyright", "managingEditor", "webMaster", "pubDate", "lastBuildDate", "generator", "docs", "ttl", "rating");
    var tmpElement = null;
    for (var i=0; i<properties.length; i++){
        tmpElement = chanElement.getElementsByTagName(properties[i])[0];
        if (tmpElement!= null){
    	    eval("this."+properties[i]+"=tmpElement.childNodes[0].nodeValue");
	}
    }
    this.category = new RSS2Category(chanElement.getElementsByTagName("category")[0]);
    this.image = new RSS2Image(chanElement.getElementsByTagName("image")[0]);
}

function RSS2Category(catElement){
    if (catElement == null){
        this.domain = null;
        this.value = null;
    }else{
	this.domain = catElement.getAttribute("domain");
	this.value = catElement.childNodes[0].nodeValue;
    }
}

function RSS2Image(imgElement){
    if(imgElement == null){
	this.url = null;
	this.link = null;
	this.width = null;
	this.height = null;
	this.description = null;
    }else{
        imgAttribs = new Array("url","title","link","width","height","description");
        for(var i=0; i<imgAttribs.length; i++){
            if(imgElement.getAttribute(imgAttribs[i]) != null){
        	eval("this."+imgAttribs[i]+"=imgElement.getAttribute("+imgAttribs[i]+")");
	    }
	}	
    }
}

function RSS2Item(itemxml){
    /*required properties (strings)*/
    this.title;
    this.link;
    this.description;
    /*optional properties (strings)*/
    this.author;
    this.comments;
    this.pubDate;
    /*optional properties (objects)*/
    this.category;
    this.enclosure;
    this.guid;
    this.source;
    var properties = new Array("title", "link", "description", "author", "comments", "pubDate");
    var tmpElement = null;
    for (var i=0; i<properties.length; i++){
        tmpElement = itemxml.getElementsByTagName(properties[i])[0];
        if(tmpElement != null){
	    eval("this."+properties[i]+"=tmpElement.childNodes[0].nodeValue");
	}
    }
    this.category = new RSS2Category(itemxml.getElementsByTagName("category")[0]);
    this.enclosure = new RSS2Enclosure(itemxml.getElementsByTagName("enclosure")[0]);
    this.guid = new RSS2Guid(itemxml.getElementsByTagName("guid")[0]);
    this.source = new RSS2Source(itemxml.getElementsByTagName("source")[0]);
}

function RSS2Enclosure(encElement)
{
    if (encElement == null){
        this.url = null;
        this.length = null;
        this.type = null;
    }else{
        this.url = encElement.getAttribute("url");
	this.length = encElement.getAttribute("length");
	this.type = encElement.getAttribute("type");
    }
}

function RSS2Guid(guidElement){
    if (guidElement == null) {
        this.isPermaLink = null;
	this.value = null;
    } else {
        this.isPermaLink = guidElement.getAttribute("isPermaLink");
        this.value = guidElement.childNodes[0].nodeValue;
    }
}
													
function RSS2Source(souElement){
    if(souElement == null){
        this.url = null;
        this.value = null;
    } else {
        this.url = souElement.getAttribute("url");
        this.value = souElement.childNodes[0].nodeValue;
    }
}

function showRSS(RSS, id){

    var content = "<ul class='rss-list'>";
    
    for (var i=0; i<RSS.items.length; i++){
	content += '<li class="rss-item">';
	if( RSS.items[i].title != null ){
	    content += '<a target="_blank" href="'+RSS.items[i].link+'">'+RSS.items[i].title+'</a>';
	}else{
	    content += '<a target="_blank" href="'+RSS.items[i].link+'">Untitled</a>';
	}
	if( RSS.items[i].description != null ){
	    content += ' - ' + RSS.items[i].description;
	}
	if( RSS.items[i].pubDate != null ){
	    content += '<br />';
	    content += RSS.items[i].pubDate;
	}
	content += '</li>';
    }
    content += '</ul>';
    document.getElementById('crossrss-' + id + '-content').innerHTML = content;
    return true;
}


function setError(str){
    ediv = document.getElementById('error-div');
    if( ediv ){
	ediv.innerHTML = "str";
	ediv.style.display = "block";
    }	
}

