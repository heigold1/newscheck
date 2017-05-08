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

        if (preg_match('/<title>Object moved<\/title>/i', $html))
        {
          $isFound = "notFound"; 
        }
        else 
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


//      $url="http://$host_name/q/h?s=$symbol+Headlines"; 

      $url = "https://finance.yahoo.com/quote/$symbol?p=$symbol";
      $html = file_get_html($url);

//      $ret = $html->find('#yfncsumtab');   

      $company_name_array = $html->find('h6'); 

      if (preg_match('/\"NOT_FOUND\"\:\"Not Found\"/i', $html))
      {
          $isFound = "notFound"; 
      }
      else 
      {
          $isFound = "found";
      }


      $companyNameArray = $html->find('h1');
      $full_company_name = $companyNameArray[0]; 
      $full_company_name = preg_replace('/\sclass.*\">/', '>', $full_company_name);
      $full_company_name = preg_replace('/<h1.*\">/', "", $full_company_name);
      $full_company_name = preg_replace('/<\/h1>/', "", $full_company_name); 

      $tableDataArray = $html->find('div#quote-summary div table tbody tr td');
      $currentVolume = $tableDataArray[13];
      $currentVolume = preg_replace('/<td class(.*)\">/', '', $currentVolume);  
      $currentVolume = preg_replace('/<\/td>/', '', $currentVolume);
      $currentVolume = preg_replace('/<\/span>/', '', $currentVolume);   

      	// if the stock is found by yahoo finance

      $rss = simplexml_load_file("http://feeds.finance.yahoo.com/rss/2.0/headline?s=$symbol&region=US&lang=en-US");

       	if (preg_match('/RSS feed not found/i', $rss->channel->item{0}->title))
        {   // the symbol was not found by yahoo finance 
          $url = "";
          $urlTitle = "";
        }
        else
       	{
//      		$returnWithStrippedTags = preg_replace($patterns = array("/<img[^>]+\>/i", "/<embed.+?<\/embed>/im", "/<iframe.+?<\/iframe>/im", "/<script.+?<\/script>/im"), $replace = array("", "", "", ""), $ret[0]);
          $url = $rss->channel->item{0}->link;
  				$urlTitle = $rss->channel->item{0}->title;
    		} // if the symbol is found by yahoo finance

		// now we retrieve the current volume

   	

/*		$returnArray = json_encode(array("found"=>$isFound, 
										 "yahooInfo"=>array("urlTitle"=>$urlTitle, "url"=>$url)
										 ), JSON_UNESCAPED_SLASHES); */ 

//		$returnArray = '{"found":"' . $isFound . '",' . '"companyName":"' . $full_company_name[0] . '",' . '"yahooInfo":{"urlTitle":"' . $urlTitle . '","url":"' . $url . '"}}';

		$returnArray = '{"found":"' . $isFound . '",' . '"companyName":"' . $full_company_name . '",' .  '"currentVolume":"' . $currentVolume  . '", "yahooInfo":{"urlTitle":"' . $urlTitle . '","url":"' . $url . '"}}';

		echo $returnArray; 

} // if $which_website = 'yahoo'




//          fwrite($file, $tempFinalReturn);
// 	echo(json_encode("test ")); 

// fclose( $file );

?>