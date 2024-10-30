<?php

/*
Plugin Name: Cross-RSS
Plugin URI: http://develop.crossroads-media.org/cross-rss/
Description: List RSS feeds in page or posts.
Author: Balin Alex
Version: 0.5
License: GPL
Author URI: http://www.crossroads-media.org
*/ 

/*
------------------------------------------------------
 ACKNOWLEDGEMENTS
------------------------------------------------------
USAGE:  Add this line to post or page:
[crossrss url=http://www.dominica-weekly.com/rss/ /]
------------------------------------------------------
*/
$site_url =get_option('site_url');
$rss_line = 0;

if( !function_exists("make_seed") ){
    function make_seed(){
	list($usec, $sec) = explode(' ', microtime());
        return (float) $sec + ((float) $usec * 100000);
    }    
}
srand(make_seed());


function cross_rss_parse($content) {

	$content = preg_replace_callback("/\[crossrss ([^]]*)\/\]/i", "cross_rss_call", $content);
	return $content;
}

function cross_rss_call($matches) {
	global $site_url, $rss_line;
	
	$content = '';
	$rss_line++;
	$matches[1] = str_replace(array('&#8221;','&#8243;'), '', $matches[1]);

	preg_match_all('/(\w*)=(.*?) /i', $matches[1], $attr);
	$arguments = array();

	foreach ( (array) $attr[1] as $key => $value ) {
		$arguments[$value] = str_replace('"', "",$attr[2][$key]);
	}

	//now only one argument url is parsed
	if ( !array_key_exists('url', $arguments) ) {
		return '<div style="background-color:#yellow; padding:10px; border: 1px dotted red;">Error: Required parameter "url" is missing!</div>';
		exit;
	}
	
	$id = $rss_line;
	if($id == 1){
	    $content .= '<script language="javascript" src="'.$site_url.'/wp-content/plugins/cross-rss/cross-rss.js"></script>'."\n";		
	    $content .= '<style> @import url("'.$site_url.'/wp-content/plugins/cross-rss/cross-rss.css"); </style>'."\n";	

	}

/*	$content .= '<div class="error-div" id="error-div1"></div>'."\n";
	$content .= '<div class="loader" id="loader'.$id.'"><img src="'.$site_url.'/wp-content/plugins/cross-rss/ajax-loader.gif" /></div>'."\n";
	$content .= '<div class="crossrss" id="crossrss'.$id.'">'."\n";
    	$content .= '<div class="crossrss_title" id="crossrss'.$id.'_title"></div>'."\n";
    	$content .= '<div class="crossrss_link" id="crossrss'.$id.'_link"></div>'."\n";
    	$content .= '<div class="crossrss_description" id="crossrss'.$id.'_description"></div>'."\n";
	$content .= '<a class="crossrss_image_link" id="crossrss'.$id.'_image_link" href=""></a>'."\n";
	$content .= '<div class="crossrss_items" id="crossrss'.$id.'_items"></div>'."\n";
	$content .= '<div class="crossrss_pubDate" id="crossrss'.$id.'_pubDate"></div>'."\n";
	$content .= '<div class="crossrss_copyright" id="crossrss'.$id.'_copyright"></div>'."\n";
	$content .= '</div>'."\n";
*/
	$url = parse_url($arguments['url']);
	$content .= "<div id='crossrss-".$id."'>\n";
	$content .= '<strong class="rss-title"><a href="#crossrss-'.$id.'" onClick="getRSS(\''.$site_url.'/wp-content/plugins/cross-rss/proxy.php?rss='.urldecode($arguments['url']).'\','.$id.', \''.$site_url.'\');">'.($arguments['title']?$arguments['title']:$url['host']).'</a></strong>'."\n";	
	$content .= "<div class='cross-rss-content' id='crossrss-".$id."-content'>\n";	
	$content .= "</div>\n";	
	$content .= "</div>\n";	
/*	
	$content .= '<script language="javascript">'."\n";
	$content .= 'getRSS( "'.$site_url.'/wp-content/plugins/cross-rss/proxy.php?rss='.urldecode($arguments['url']).'",'.$id.' );'."\n";
	$content .= '</script>'."\n";	
*/	
	
	return $content;
}

add_filter('the_content', 'cross_rss_parse');

?>