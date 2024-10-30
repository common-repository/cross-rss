<?
header("Content-type: application/xml");

if( isset($_REQUEST['rss']) ){

    $l = fopen("./proxy.log", "a+");
    $cache_time = intval($_REQUEST['cache'])?intval($_REQUEST['cache'])*3600:3600;
    $cache_key = md5($_REQUEST['rss']);
    
    $dir = dirname(__FILE__);

    $cache_file = $dir."/cache/".$cache_key;
    if( is_file($cache_file ) ){
	$st = stat($cache_file );
	if( time() - $st['mtime'] < $cache_time  ){
	    readfile($cache_file);
	    $log = date("Y-m-d H:i:s")." ".$cache_file." from cache ";
	    fwrite($l, $log."\n");		    
	    exit();
	}else{
	    $log = date("Y-m-d H:i:s")." ".$cache_file." too old ".$st['mtime']." > ".time()."-".$cache_time." = ".(time()-$cache_time);
	    fwrite($l, $log."\n");	
	}
    }else{
	$log = date("Y-m-d H:i:s")." ".$cache_file." not exists";
	fwrite($l, $log."\n");
    }

    $rss = @file_get_contents(urldecode($_REQUEST['rss']));
    if( $rss ){
	if(is_writable($dir."/cache")){
	    fwrite(fopen($cache_file, "w"), $rss);
	    $log = date("Y-m-d H:i:s")." ".$cache_file." ".$st['mtime']." cache saved";
	}else{
	    print '<?xml version="1.0"?><rss><channel><title>RSS Load Error - '.$dir.'/cache is not writable</title></channel></rss>';
	    $log = date("Y-m-d H:i:s")." ".$cache_file." ".$st['mtime']." ".$dir.'/cache is not writable';
	}
	print $rss;
	fwrite($l, $log."\n");
    }else{
	print '<?xml version="1.0"?><rss><channel><title>RSS Load Error</title></channel></rss>';
    }
}
?>
