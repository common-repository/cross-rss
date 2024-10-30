Install
Unpack ZIP file, place folder cross-rss with all files to wp-content/plugins dir. Go to WordPress Admin Plugins sections and activate Cross-RSS 0.5 plugin
Set chmod 777 to wp-content/plugins/cross-rss/cache (make writable by webserver scripts)
Set chmod 666 to wp-content/plugins/cross-rss/proxy.log (make writable by webserver scripts)

Usage
When create page or blog just place line: [crossrss url=http://example.com/file.rss /] Where http://example.com/file.rss is a full URL to RSS you want to view on your WordPress page

Changes
0.5 - Changed CSS file (now is used UL,LI)
    - Fixing the error in cache
    - show RSS feed on click

0.4 - Parsing multiply lines, in CSS change id to classes
    - Fixing bag with write to cache

0.3 - Adding Ajax loading image. You can set your image, simple replace ajax-load.gif 

0.2 - Adding file proxy.php and disk cache of RSS files, with 
    - Now rss loaded with url /wp-content/plugins/cross-rss/proxy.php?rss=http://domain/file.rss&cache=1 where cache param in hours

0.1 First release