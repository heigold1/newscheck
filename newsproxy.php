<?php 

require_once("simple_html_dom.php"); 
error_reporting(0); 

$filename = "test.txt";
$file = fopen( $filename, "w" );
if( $file == false )
{
   echo ( "Error in opening new file" );
   exit();
}

// convert the returning json arrays into UTF-8.

function utf8ize($d) {
    if (is_array($d)) {
        foreach ($d as $k => $v) {
            $d[$k] = utf8ize($v);
        }
    } else if (is_string ($d)) {
        return utf8_encode($d);
    }
    return $d;
}

$symbol=$_GET['symbol'];
$host_name=$_GET['host_name'];
$which_website=$_GET['which_website'];
$stockOrFund=$_GET['stockOrFund']; 

fwrite($file, $symbol . " is a " . $stockOrFund);

fopen("cookies.txt", "w");

function grabHTML($host_name, $url)
{
$ch = curl_init();

$header=array('GET /1575051 HTTP/1.1',
    "Host: $host_name",
    'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language:en-US,en;q=0.8',
    'Cache-Control:max-age=0',
    'Connection:keep-alive',
    'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
    );

    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,0);
    curl_setopt( $ch, CURLOPT_COOKIESESSION, true );

    curl_setopt($ch,CURLOPT_COOKIEFILE,'cookies.txt');
    curl_setopt($ch,CURLOPT_COOKIEJAR,'cookies.txt');
    curl_setopt($ch,CURLOPT_HTTPHEADER,$header);
     return curl_exec($ch); 
//    $result=curl_exec($ch);
//    curl_close($ch);

} // end of function grabHTML

if ($which_website == "marketwatch")
{

$isFound = ""; 
$entireMarketwatchPage = "";
$finalReturn = "";
$mwMainContentLink1 = ""; 
$mwMainContentLink1Title = ""; 
$mwPartnerHeadlinesLink1 = ""; 
$mwPartnerHeadlinesLink1Title = "";
$mwPRHeadlinesLink1 = ""; 
$mwPRHeadlinesLink1Title = ""; 

      $url="http://$host_name/investing/$stockOrFund/$symbol/news";
      $result = grabHTML($host_name, $url); 
      $result = str_replace ('href="/', 'href="http://www.marketwatch.com/', $result);  
      $result = str_replace ('heigoldinvestments.com', 'marketwatch.com', $result); 
      $result = str_replace ('localhost', 'www.marketwatch.com', $result); 

      $html = str_get_html($result);

// 	  $positionText = strpos($html, "Object moved to"); 

      if (($pos = strpos($html, "<html><head><title>Object moved") > -1) && 
          ($stockOrFund == "stock"))
          {
              $url="http://$host_name/investing/fund/$symbol/news";
              $result = grabHTML($host_name, $url); 
          }
      else if (($pos = strpos($html, "<html><head><title>Object moved") > -1) && 
          ($stockOrFund == "fund"))
          {
              $url="http://$host_name/investing/stock/$symbol/news";
              $result = grabHTML($host_name, $url); 
          }

      $html = str_get_html($result);
 fwrite($file, "html results " . $html);

      	// if the stock is found by marketwatch.  If the html string returned 
		// contains "Object moved to", that means the symbol wasn't found.

// fwrite($file, "html results for " . $symbol . " is " . $html);

       	if (strpos($html, "<h1>500</h1>") == 0)
       	{

       		$isFound = "found";

      		$full_company_name = $html->find('#instrumentname'); 
		    $entireMarketwatchPage = $html->find('#maincontent'); 

		    // get the most recent link from the first main marketwatch headlines 
		    // table 

		    $mainMWHeadlines = $html->find('#mwheadlines'); 
			$linkTag = $mainMWHeadlines[0]->find('a');
			$firstLinkInResults = $linkTag[0]; 
			$mwMainContentLink1 = trim($firstLinkInResults->href); 
			$mwMainContentLink1 = str_replace ('"', '\"', $mwMainContentLink1);  
			$mwMainContentLink1Title = $firstLinkInResults->innertext;
			$mwMainContentLink1Title = str_replace ('"', '\"', $mwMainContentLink1Title);  			

		    // get the most recent link from the first marketwatch PARTNER 
		    // headlines table 

		    $mwPartnerHeadlinesTable = $html->find('#partnerheadlines'); 
			$linkTag = $mwPartnerHeadlinesTable[0]->find('a');
			$firstLinkInResults = $linkTag[0]; 
			$mwPartnerHeadlinesLink1 = trim($firstLinkInResults->href); 
			$mwPartnerHeadlinesLink1 = str_replace ('"', '\"', $mwPartnerHeadlinesLink1);  			
			$mwPartnerHeadlinesLink1Title = $firstLinkInResults->innertext;
			$mwPartnerHeadlinesLink1Title = str_replace ('"', '\"', $mwPartnerHeadlinesLink1Title);  						

		    // get the most recent link from the first marketwatch 
		    // PR headlines table 

		    $mwPRHeadlinesTable = $html->find('#prheadlines'); 
			$linkTag = $mwPRHeadlinesTable[0]->find('a');
			$firstLinkInResults = $linkTag[0]; 
			$mwPRHeadlinesLink1 = trim($firstLinkInResults->href); 
			$mwPRHeadlinesLink1 = str_replace ('"', '\"', $mwPRHeadlinesLink1);				
			$mwPRHeadlinesLink1Title = $firstLinkInResults->innertext;
			$mwPRHeadlinesLink1Title = str_replace ('"', '\"', $mwPRHeadlinesLink1Title);  									

		} // if the stock is found by marketwatch
		else 
		{
			$isFound = "notFound"; 
		}

		// return everything in the a final json object.

/*		$returnArray = json_encode(array("found"=>$isFound, 
										 "mwMainHeadlines"=>array("url"=>$mwMainContentLink1, "urlTitle"=>$mwMainContentLink1Title), 
										 "mwPartnerHeadLines"=>array("url"=>$mwPartnerHeadlinesLink1, "urlTitle"=>$mwPartnerHeadlinesLink1Title), 
										 "mwPRHeadLines"=>array("url"=>$mwPRHeadlinesLink1, "urlTitle"=>$mwPRHeadlinesLink1Title), 										 
										),JSON_UNESCAPED_SLASHES); */


		// json_encode doesn't work on my server, so I'll just manually encode the json object.

		$returnArray = '{"found":"' . $isFound . '",' . '"mwMainHeadlines":{"url":"' . $mwMainContentLink1 . '","urlTitle":"' . $mwMainContentLink1Title . '"},' . 
						'"mwPartnerHeadLines":{"url":"' . $mwPartnerHeadlinesLink1 . '","urlTitle":"' . $mwPartnerHeadlinesLink1Title . '"},' . 
						'"mwPRHeadLines":{"url":"' . $mwPRHeadlinesLink1 . '","urlTitle":"' . $mwPRHeadlinesLink1Title . '"}}'; 

// 		fwrite($file, "right after json_encode.  array is " . $returnArray); 

		echo $returnArray; 
     
}
else if ($which_website == "yahoo")
{

$isFound = ""; 
$ret = "";
$url = "";
$urlTitle = "";

      $url="http://$host_name/q/h?s=$symbol+Headlines"; 
      $result = grabHTML($host_name, $url); 
      $result = str_replace ('href="/', 'href="http://finance.yahoo.com/', $result);  
      $result = str_replace ('heigoldinvestments.com', 'marketwatch.com', $result); 
      $result = str_replace ('localhost', 'www.marketwatch.com', $result); 

      $html = str_get_html($result);  
      $ret = $html->find('#yfncsumtab');   

      $full_company_name = $html->find('div#yfi_rt_quote_summary div div h2'); 

      	// if the stock is found by yahoo finance

       	if ($ret[0] != "")
       	{
       		$isFound = "found";
      		$returnWithStrippedTags = preg_replace($patterns = array("/<img[^>]+\>/i", "/<embed.+?<\/embed>/im", "/<iframe.+?<\/iframe>/im", "/<script.+?<\/script>/im"), $replace = array("", "", "", ""), $ret[0]);

			if (strpos($returnWithStrippedTags, '<a') == 0)
			{
				$url = ""; 
			}
			else
			{	// else parse the http:// url from the first <a tag, 
				$linkTag = $ret[0]->find('a');
				$firstLinkInResults = $linkTag[0]; 
				$url = trim($firstLinkInResults->href); 
				$url = str_replace ('"', '\"', $url);
				$urlTitle = $firstLinkInResults->innertext;
				$urlTitle = str_replace ('"', '\"', $urlTitle);
			}
		} // if the symbol is found by yahoo finance
		else 
		{   // the symbol was not found by yahoo finance 
			$isFound = "notFound"; 
		}

		// now we retrieve the current volume

		$url="http://$host_name/q?s=$symbol&ql=1"; 
      	$result = grabHTML($host_name, $url); 		
      	$html = str_get_html($result);  
      	$tableDataArray = $html->find('.yfnc_tabledata1');
      	$currentVolume = $tableDataArray[9];
      	$currentVolume = preg_replace('/<td class="(.*)">/', '', $currentVolume);  
      	$currentVolume = preg_replace('/<\/td>/', '', $currentVolume);
      	$currentVolume = preg_replace('/<\/span>/', '', $currentVolume);      	

/*		$returnArray = json_encode(array("found"=>$isFound, 
										 "yahooInfo"=>array("urlTitle"=>$urlTitle, "url"=>$url)
										 ), JSON_UNESCAPED_SLASHES); */ 

//		$returnArray = '{"found":"' . $isFound . '",' . '"companyName":"' . $full_company_name[0] . '",' . '"yahooInfo":{"urlTitle":"' . $urlTitle . '","url":"' . $url . '"}}';

		$returnArray = '{"found":"' . $isFound . '",' . '"companyName":"' . $full_company_name[0] . '",' .  '"currentVolume":"' . $currentVolume  . '", "yahooInfo":{"urlTitle":"' . $urlTitle . '","url":"' . $url . '"}}';

		echo $returnArray; 

} // if $which_website = 'yahoo'




//          fwrite($file, $tempFinalReturn);
// 	echo(json_encode("test ")); 

// fclose( $file );

?>