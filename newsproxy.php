<?php 

/* 
oauth_consumer_key: 874c996f1f6ecaa46c65abb115da9912
consumer_secret: 886529f1c9d06729e97b6f511a89b4df
*/

require_once("simple_html_dom.php"); 
//error_reporting(E_ALL);

// header('Content-type: text/html');
if(isset($_GET['symbol']))
{
  $symbol=$_GET['symbol'];
}
if (isset($_GET['offerPrice']))
{
  $offerPrice=$_GET['offerPrice'];
}
if(isset($_GET['host_name']))
{
  $host_name=$_GET['host_name'];
}
if(isset($_GET['which_website']))
{
  $which_website=$_GET['which_website'];
}
if(isset($_GET['google_keyword_string']))
{
  $google_keyword_string = $_GET['google_keyword_string'];
}
if(isset($_GET['symbols']))
{
  $symbols=$_GET['symbols']; 
}

fopen("cookies.txt", "w");

function curl_get_contents($url)
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

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

function calculatePercentLow($previousClose, $low)
{

}

function getETradeAPIData($symbol)
{
    $url = $_SERVER['SERVER_NAME'] . '/newslookup/yesterday_close.php?symbol=' . $symbol;
    $eTradeObject = curl_get_contents($url);

    return json_decode($eTradeObject); 
}

$ret = "";
$finalReturn = "";


function getMarketwatch($symbol, $offerPrice)
{

$entireMarketwatchPage = "";
$finalReturn = "";
$mwMainContentLink1 = ""; 
$mwMainContentLink1Title = ""; 
$mwPartnerHeadlinesLink1 = ""; 
$mwPartnerHeadlinesLink1Title = "";
$secFilingLink1 = ""; 
$secFilingLink1Title = ""; 
$stockOrFund = "stock"; 
$percentLow = "";
$currentVolume = "";
$averageVolume = ""; 

        $etradeAPIData = getEtradeAPIData($symbol);

        if ($etradeAPIData != null)
        {
          $companyName = $etradeAPIData->company_name; 
           if (preg_match('/ etf /i', $company_name))
           {
              $stockOrFund = "fund";
           }
           $currentVolume = $etradeAPIData->total_volume; 
           $averageVolume = $etradeAPIData->ten_day_volume; 
           $previousClose = floatval($etradeAPIData->prev_close);
           $low = floatval($etradeAPIData->low); 

           if (trim($offerPrice) != "")
           {
             $offerPrice = floatval($offerPrice);
             $percentLow = number_format((($offerPrice-$low)/$offerPrice)*100, 2);  
           }
           else
           {
             $percentLow = number_format((($previousClose-$low)/$previousClose)*100, 2);  
           }
        }

        $url = "https://www.marketwatch.com/investing/$stockOrFund/$symbol"; 

        $results = grabHTML("www.marketwatch.com", $url);

        if ($results != "")
        {
            $results = str_replace(PHP_EOL, '', $results);
            $results = preg_replace('/<head>(.*)<\/head>/', "", $results);

            preg_match('/<div class="article__content">(.*)<\/div>/', $results, $arrayMatch);

            $batchString = $arrayMatch[0];

            preg_match_all('/<div class="article__content">(.*?)<\/div>/', $batchString, $individualArticleDiv);

            $finalArray = array();

            foreach ($individualArticleDiv[0] as $articleDiv)
            {
                $articleStruct = array();

                preg_match('/href="(.*?)"/', $articleDiv, $linksArray);
                $articleStruct['link'] = $linksArray[1];
                preg_match('/<a.*>(.*?)<\/a>/', $articleDiv, $headlinesArray);
                $articleStruct['headline'] = $headlinesArray[1];
                preg_match('/data-est="(.*?)"/', $articleDiv, $timeStampArray);
                $timeStamp = $timeStampArray[1];
                preg_match('/article__timestamp">(.*?)<\/li>/', $articleDiv, $dateStringArray);
                $articleStruct['date'] = $dateStringArray[1];

                $timeStampInt = strtotime($timeStamp);

                if ($articleStruct['link'] != "")
                {
                    $finalArray[$timeStampInt] = $articleStruct; 
                }
            }

            krsort($finalArray);

            $firstMarketwatchArticle = reset($finalArray);
            $mwMainContentLink1 = $firstMarketwatchArticle['link']; 
            $mwMainContentLink1Title = $firstMarketwatchArticle['headline']; 
            $mwMainContentLink1Title = str_replace('"', "", $mwMainContentLink1Title);
            $mwMainContentLink1Title = str_replace('&quot;', "", $mwMainContentLink1Title);
        }

        // now we do the SEC filing 

        $url = "https://www.sec.gov/cgi-bin/browse-edgar?CIK=" . $symbol . "&owner=exclude&action=getcompany&Find=Search"; 
        $result = grabHTML('www.sec.gov', $url); 
        $html = str_get_html($result);

        if (preg_match('/No matching Ticker Symbol/i', $html))
        {
                  $returnArray = '{"currentVolume":"' . $currentVolume . '", "averageVolume":"'. $averageVolume . '", "percentLow":"' . $percentLow . '", "offerPrice":"' . $offerPrice . '", "mwMainHeadlines":{"url":"' . $mwMainContentLink1 . '","urlTitle":"' . $mwMainContentLink1Title . '"},' . 
                      '"mwPartnerHeadLines":{"url":"' . "" . '","urlTitle":"' . "" . '"},' . 
                      '"secFiling":{"url":"","urlTitle":""}}'; 
        }
        else
        {
            $tableRow1 = $html->find('.tableFile2 tbody tr'); 

            $row = str_get_html($tableRow1[1]);
            $td = $row->find('td'); 
            $linkTd = $td[1]->find('a');  

            $td0 = $td[0]; 
            $td2 = $td[2]->plaintext;

            $td2 = preg_replace('/Acc-no.*MB/', '', $td2);
            $td2 = preg_replace('/Acc-no.*KB/', '', $td2);
            $td2 = trim($td2);

            $firstLink  = 'https://www.sec.gov' . $linkTd[0]->href; 
            $firstLinkResults = grabHTML('www.sec.gov', $firstLink); 
            $html2 = str_get_html($firstLinkResults);
            $tableRow2 = $html2->find('tr'); 
            $td2nd = $tableRow2[1]->find('td'); 
            $a2 = $td2nd[2]->find('a');
            $secFilingLink1 = 'https://www.sec.gov' . $a2[0]->href;
            $secFilingLink1 = trim($secFilingLink1);

            $returnArray = '{"currentVolume":"' . $currentVolume . '", "averageVolume":"'. $averageVolume . '", "percentLow":"' . $percentLow . '", "offerPrice":"' . $offerPrice . '", "mwMainHeadlines":{"url":"' . $mwMainContentLink1 . '","urlTitle":"' . $mwMainContentLink1Title . '"},' . 
                  '"mwPartnerHeadLines":{"url":"' . "" . '","urlTitle":"' . "" . '"},' . 
                  '"secFiling":{"url":"' . $secFilingLink1 . '","urlTitle":"' . $td2 . '"}}'; 

        }

        return $returnArray;

}

function getYahoo($symbol)
{

$ret = "";
$url = "";
$urlTitle = "";
$full_company_name = "";
$currentVolume = "";
$stockOrFund = "";


    // grab the news 

      $rss = simplexml_load_file("http://feeds.finance.yahoo.com/rss/2.0/headline?s=$symbol&region=US&lang=en-US");

        if (preg_match('/RSS feed not found/i', $rss->channel->item{0}->title))
        {   // the symbol was not found by yahoo finance 
          $url = "";
          $urlTitle = "";
        }
        else
        {
          $url = $rss->channel->item{0}->link;
          $urlTitle = $rss->channel->item{0}->title;
          $urlTitle = str_replace('"', "", $urlTitle);
          $urlTitle = str_replace('&quot;', "", $urlTitle);
        } // if the symbol is found by yahoo finance

      $returnArray = '{"yahooInfo":{"urlTitle":"' . $urlTitle . '","url":"' . $url . '"}}';

    return $returnArray; 

} // if ($which_website == "yahoo")


if (isset($which_website) && ($which_website == "marketwatch"))
{
  $returnLinks = getMarketwatch($symbol, $offerPrice);
  echo $returnLinks;
}
elseif (isset($which_website) && ($which_website == "yahoo"))
{
  $returnLinks = getYahoo($symbol);
  echo $returnLinks;
}
elseif ($symbols != null)
{
    $returnArray = array(); 
    $symbols = json_decode($symbols);

    foreach ($symbols as $symbol)
    {

      $offerPrice = $symbol->offerPrice;
      $index = $symbol->idNumber;
      $symbol = $symbol->symbol;

      if (isset($symbol->originalSymbol))
      {
          $originalSymbol = $symbol->originalSymbol; 
      }

      $returnArray[$index]['yahoo'] = getYahoo($symbol);
      $yahooObject = json_decode($returnArray[$index]['yahoo']); 

      $stockOrFund = $yahooObject->stockOrFund; 

      $returnArray[$index]['marketwatch_sec'] = getMarketwatch($symbol, $offerPrice);

      $returnArray[$index]['symbol'] = $symbol;
      if (isset($originalSymbol))
      {
          $returnArray[$index]['originalSymbol'] = $originalSymbol;
      }
    }

    echo (json_encode($returnArray));
}


?>