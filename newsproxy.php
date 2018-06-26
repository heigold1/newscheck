<?php 

/* 
oauth_consumer_key: 874c996f1f6ecaa46c65abb115da9912
consumer_secret: 886529f1c9d06729e97b6f511a89b4df
*/

include 'config.php';

require_once("simple_html_dom.php"); 
error_reporting(0);



// header('Content-type: text/html');
$symbol=$_GET['symbol'];
$host_name=$_GET['host_name'];
$which_website=$_GET['which_website'];
$stockOrFund=$_GET['stockOrFund']; 
$google_keyword_string = $_GET['google_keyword_string'];

// $html_return=file_get_contents($url);

// fwrite( $file, "stockOrFund is " . $stockOrFund);

// fwrite( $file, "which_website is  " . $which_website);

fopen("cookies.txt", "w");




function grabHTML($function_host_name, $url)
{

$ch = curl_init();
$header=array('GET /1575051 HTTP/1.1',
    "Host: $function_host_name",
    'Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language:en-US,en;q=0.8',
    'Cache-Control:max-age=0',
    'Connection:keep-alive',
    'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',
    );

    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT, 300);
    curl_setopt( $ch, CURLOPT_COOKIESESSION, true );

//    curl_setopt($ch, CURLOPT_USERPWD, "heigold1:heimer27");
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    curl_setopt($ch,CURLOPT_COOKIEFILE,'cookies.txt');
    curl_setopt($ch,CURLOPT_COOKIEJAR,'cookies.txt');
    curl_setopt($ch,CURLOPT_HTTPHEADER,$header);

    curl_setopt($ch, CURLOPT_VERBOSE, true);
    curl_setopt($ch, CURLOPT_STDERR,$f = fopen(__DIR__ . "/error.log", "w+"));


    $returnHTML = curl_exec($ch); 

if($errno = curl_errno($ch)) {
    $error_message = curl_strerror($errno);
    echo "cURL error ({$errno}):\n {$error_message}";
}   
   curl_close($ch);
    return $returnHTML; 


 

} // end of function grabHTML

$ret = "";
$finalReturn = "";

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

      $url="https://$host_name/investing/$stockOrFund/$symbol";

      $result = grabHTML($host_name, $url); 

      $result = str_replace ('href="/', 'href="https://www.marketwatch.com/', $result);  
      $result = str_replace ('heigoldinvestments.com', 'marketwatch.com', $result); 
      $result = str_replace ('localhost', 'www.marketwatch.com', $result); 

      $html = str_get_html($result);

      if (($pos = strpos($html, "<html><head><title>Object moved") > -1) && 
          ($stockOrFund == "stock"))
          {
              $url="https://$host_name/investing/fund/$symbol";
              $result = grabHTML($host_name, $url); 
          }
      else if (($pos = strpos($html, "<html><head><title>Object moved") > -1) && 
          ($stockOrFund == "fund"))
          {
              $url="https://$host_name/investing/stock/$symbol";
              $result = grabHTML($host_name, $url); 
          }

      $result = str_replace ('href="/', 'href="https://www.marketwatch.com/', $result);  
      $result = str_replace ('heigoldinvestments.com', 'marketwatch.com', $result); 
      $result = str_replace ('localhost', 'www.marketwatch.com', $result); 
      $result = preg_replace('/ etf/i', '<span style=\'background-color:red; color:black\'><b> &nbsp;ETF</b>&nbsp;</span>', $result);
      $result = preg_replace('/ etn/i', '<span style=\'background-color:red; color:black\'><b> &nbsp;ETN</b>&nbsp;</span>', $result);
      $result = str_replace ('a href', 'a onclick="return openPage(this.href)" href', $result);  


      $html = str_get_html($result);

        if (preg_match('/<title>Object moved<\/title>/i', $html))
        {
          $isFound = "notFound"; 
        }
        else 
        {
          $isFound = "found"; 

          $ret = $html->find('.j-tabPanes'); 

          $firstNewsGroup = str_get_html($ret[0]);
          $secondNewsGroup = str_get_html($ret[1]);

          $firstNewsGroupArticleContent = $firstNewsGroup->find('.article__content');

          $firstNewsGroupFirstLinkHTML = str_get_html($firstNewsGroupArticleContent[0]);

          $firstNewsGroupLink = $firstNewsGroupFirstLinkHTML->find('a'); 

          $mwMainContentLink1 = $firstNewsGroupLink[0]->href;
          $mwMainContentLink1Title = $firstNewsGroupLink[0]->innertext;

          // Other News
          $secondNewsArray = array();
          $secondNewsGroupArticleContent = $secondNewsGroup->find('.article__content');

          foreach ($secondNewsGroupArticleContent as $article)
          {
            $articleContent = str_get_html($article);
            $dateTime = $articleContent->find('li.article__timestamp');
            $dateTimeSpan = '<span style=\'font-size: 10px;\'>' . $dateTime[0]->text() . "</span>"; 
            $headline = $articleContent->find('.article__headline');
            $headline = preg_replace('/h3/', 'span', $headline); 
            $timeStamp = preg_match('/data-est=\"(.*)\" class/', $dateTime[0], $timeStampMatches);
            $timeInteger = strtotime($timeStampMatches[1]);
            $secondNewsArray[$timeInteger] = $headline[0];
          }
          krsort($secondNewsArray);

          reset($secondNewsArray);
          $first_key = key($secondNewsArray);

          $secondNewsGroupFirstLinkHTML = str_get_html($secondNewsArray[$first_key]);

          $secondNewsGroupLink = $secondNewsGroupFirstLinkHTML->find('a'); 

          $mwPartnerHeadlinesLink1 = $secondNewsGroupLink[0]->href; 
          $mwPartnerHeadlinesLink1Title = $secondNewsGroupLink[0]->innertext;
        }    

      $returnArray = '{"found":"' . $isFound . '",' . '"mwMainHeadlines":{"url":"' . $mwMainContentLink1 . '","urlTitle":"' . $mwMainContentLink1Title . '"},' . 
            '"mwPartnerHeadLines":{"url":"' . $mwPartnerHeadlinesLink1 . '","urlTitle":"' . $mwPartnerHeadlinesLink1Title . '"},' . 
            '"mwPRHeadLines":{"url":"' . $mwPRHeadlinesLink1 . '","urlTitle":"' . $mwPRHeadlinesLink1Title . '"}}'; 

    echo $returnArray; 
}
else if ($which_website == "yahoo")
{

$isFound = ""; 
$ret = "";
$url = "";
$urlTitle = "";

      $url = "https://finance.yahoo.com/quote/$symbol?p=$symbol";
      $html = file_get_html($url);

//      $ret = $html->find('#yfncsumtab');   

      $company_name_array = $html->find('h6'); 

//echo "HTML IS " . $html; 

      if (preg_match('/content\=\"symbol lookup/i', $html))
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


    // grab the news 

      $rss = simplexml_load_file("http://feeds.finance.yahoo.com/rss/2.0/headline?s=$symbol&region=US&lang=en-US");

        if (preg_match('/RSS feed not found/i', $rss->channel->item{0}->title))
        {   // the symbol was not found by yahoo finance 
          $url = "";
          $urlTitle = "";
        }
        else
        {
//          $returnWithStrippedTags = preg_replace($patterns = array("/<img[^>]+\>/i", "/<embed.+?<\/embed>/im", "/<iframe.+?<\/iframe>/im", "/<script.+?<\/script>/im"), $replace = array("", "", "", ""), $ret[0]);
          $url = $rss->channel->item{0}->link;
          $urlTitle = $rss->channel->item{0}->title;
        } // if the symbol is found by yahoo finance



    $returnArray = '{"found":"' . $isFound . '",' . '"companyName":"' . $full_company_name . '",' .  '"currentVolume":"' . $currentVolume  . '", "yahooInfo":{"urlTitle":"' . $urlTitle . '","url":"' . $url . '"}}';

    echo $returnArray; 
//        JSON string 

} // if ($which_website == "yahoo")


?>