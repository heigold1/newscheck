<?php 

/* 
oauth_consumer_key: 874c996f1f6ecaa46c65abb115da9912
consumer_secret: 886529f1c9d06729e97b6f511a89b4df
*/

error_reporting(1);

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

function createSECCompanyName($companyName)
{
    $companyName = preg_replace('/ INC.*/', '', $companyName);
    $companyName = preg_replace('/ HLDG.*/', '', $companyName);
    $companyName = preg_replace('/ COM.*/', '', $companyName);
    $companyName = preg_replace('/ LTD.*/', '', $companyName);
    $companyName = preg_replace('/ NEW.*/', '', $companyName);

    $companyNameArray = explode(" ", $companyName);
    $arrayLength = count($companyNameArray);

    if ($arrayLength == 1)
    {
        return $companyName;
    }
    else
    {

        // build out the "outlook+theraputics"
        $returnCompanyName = "";
        for ($i = 0; $i < $arrayLength; $i++) {
            $returnCompanyName .= $companyNameArray[$i];
            if ($i + 1 < $arrayLength)
            {
               $returnCompanyName .= "+";
            }
        }

        return $returnCompanyName; 
    }
}


function getETradeAPIData($symbol)
{
    $url = $_SERVER['SERVER_NAME'] . '/newslookup/yesterday_close.php?symbol=' . $symbol;
    $eTradeObject = curl_get_contents($url);

    return json_decode($eTradeObject); 
}


function getStatistics($symbol, $offerPrice, $lowValue)
{
    $currentVolume = ""; 
    $averageVolume = "";
    $percentLow = ""; 
    $low = 0.0;

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
       $lastTrade = floatval($etradeAPIData->last_trade);
       $previousClose = floatval($etradeAPIData->prev_close);
       $eTradeLowValue = floatval($etradeAPIData->low);

       if ($lowValue == 0.0)
       {
           $low = $eTradeLowValue; 
           $lowValue = $low; 
       }
       else
       {
          // if we are in the pre-market, and therefore ETRADE does not provide the pre-market low: 
          if ($etradeAPIData->low == 0.0)
          {
// echo "etradeAPIData->low == 0.0 <br>"; 
              if ($lastTrade < $lowValue)
              {
// echo "etradeAPIData->low == 0.0 and lastTrade (" . $lastTrade . ") < lowValue (" . $lowValue . ") <br>";
                $low = $lastTrade;
                $lowValue = $lastTrade;
              }
              else 
              {
// echo "lastTrade is " . $lastTrade . " and lowValue is " . $lowValue . "<br>";
                $low = $lowValue; 
              }
// die();
          }
          else
          {
              // we are no longer in the pre-market, and so ETRADE is providing us with the pre-market low.
              if ($eTradeLowValue < $lowValue)
              {
                $low = $eTradeLowValue; 
                $lowValue = $eTradeLowValue; 
              }
              else 
              {
                $low = $lowValue;
              }
          }
       }

       // if the company put out an additional public offering
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

    $returnArray = '{"currentVolume":"' . $currentVolume . '", "averageVolume":"'. $averageVolume . '", "percentLow":"' . $percentLow . '", "lowValue":"' . $lowValue . '", "companyName": "' . $companyName . '"}'; 

//echo "returnArray is " . $returnArray . "*"; 
//die();


    return $returnArray; 
}

$ret = "";
$finalReturn = "";


function getMarketwatch($symbol, $companyName)
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

        $url = "https://www.marketwatch.com/investing/$stockOrFund/$symbol"; 

        $results = grabHTML("www.marketwatch.com", $url);

        if ($results != "")
        {
            $html = str_get_html($results);

            $jtabPanes1 = $html->find('div[class="j-tabPanes"]', 0); 
            $jtabPanes1Html = str_get_html($jtabPanes1); 
            $articles = $jtabPanes1Html->find('div[class="article__content"]');
            if ($articles != "")
            {
                $articleStructArray = array();

                foreach ($articles as $article)
                {
                    $articleLink = "";
                    $articleTitle = ""; 
                    $articleHtml = str_get_html($article); 
                    $articleStruct = array();

                    $articleAnchor = $articleHtml->find('a', 0);  

                    if ($articleAnchor == "")
                    {
                        $span = $articleHtml->find('span.link', 0);
                        $articleTitle = strip_tags($span); 
                    }
                    else
                    {
                        $articleLink = $articleAnchor->href; 
                        $articleTitle = strip_tags($articleAnchor); 
                    }

                    $articleTimestamp = $articleHtml->find('li.article__timestamp', 0);
                    $dateTimeStamp = $articleTimestamp->{'data-est'}; 
                    $dateTimeStampLongDate = $articleTimestamp->innertext; 
                    $longDateInt = strtotime($dateTimeStamp);
//                    $dateTimeInt = strtotime($dateTimeStamp);
                    $articleStruct['link'] = $articleLink; 
                    $articleStruct['title'] = $articleTitle;
                    $articleStruct['date'] = $dateTimeStamp; 
//                    $articleStructArray[$dateTimeInt] = $articleStruct; 
                    $articleStructArray[$longDateInt] = $articleStruct; 
                }

                krsort($articleStructArray);

                $firstArticle = reset($articleStructArray);
                $mwMainContentLink1 = $firstArticle['link'];
                $mwMainContentLink1Title = $firstArticle['title'];
            }

            $jtabPanes2 = $html->find('div[class="j-tabPanes"]', 1); 
            $jtabPanes2Html = str_get_html($jtabPanes2); 

            $articles = $jtabPanes2Html->find('div[class="article__content"]');
            if ($articles != "")
            {

                $articleStructArray = array();

                foreach ($articles as $article)
                {
                    $articleLink = "";
                    $articleTitle = ""; 
                    $articleHtml = str_get_html($article); 
                    $articleStruct = array();

                    $articleAnchor = $articleHtml->find('a', 0);  

                    if ($articleAnchor == "")
                    {
                      $span = $articleHtml->find('span.link', 0);
                      $articleTitle = strip_tags($span); 
                    }
                    else
                    {
                      $articleLink = $articleAnchor->href; 
                      $articleTitle = strip_tags($articleAnchor); 
                    }

                    $articleTimestamp = $articleHtml->find('li.article__timestamp', 0);
                    $dateTimeStamp = $articleTimestamp->{'data-est'}; 
                    $dateTimeStampLongDate = $articleTimestamp->innertext; 
                    $longDateInt = strtotime($dateTimeStamp);
//                    $dateTimeInt = strtotime($dateTimeStamp);
                    $articleStruct['link'] = $articleLink; 
                    $articleStruct['title'] = $articleTitle;
                    $articleStruct['date'] = $dateTimeStamp; 
//                    $articleStructArray[$dateTimeInt] = $articleStruct; 
                    $articleStructArray[$longDateInt] = $articleStruct; 
                }

                krsort($articleStructArray);

                $firstArticle = reset($articleStructArray);
                $mwPartnerHeadlinesLink1 = $firstArticle['link'];
                $mwPartnerHeadlinesLink1Title = $firstArticle['title'];
            }
        }

        // now we do the SEC filing 

        $url = "https://www.sec.gov/cgi-bin/browse-edgar?CIK=" . $symbol . "&owner=exclude&action=getcompany&Find=Search"; 
        $result = grabHTML('www.sec.gov', $url); 
        
        if (preg_match('/No matching Ticker Symbol/i', $result))
        {

            $url = "https://www.sec.gov/cgi-bin/browse-edgar?company=" . $companyName . "&owner=include&action=getcompany"; 
/*
echo "no matching ticker symbol "; 
echo "url is now " . $url . " ***** "; 
*/
            $result = grabHTML('www.sec.gov', $url); 



            if (
              preg_match('/No matching companies/i', $result) || 
              preg_match('/Companies with names matching/', $result)
            )
            {

                  $returnArray = '{"mwMainHeadlines":{"url":"' . $mwMainContentLink1 . '","urlTitle":"' . $mwMainContentLink1Title . '"},' . 
                      '"mwPartnerHeadLines":{"url":"' . $mwPartnerHeadlinesLink1 . '","urlTitle":"' . $mwPartnerHeadlinesLink1Title . '"},' . 
                      '"secFiling":{"url":"---","urlTitle":"NO SEC"}}'; 

                  return $returnArray;
            }
        }

        $html = str_get_html($result);
/*
echo "inside getMarketwatch/SEC, the SEC html is now: " . $html;
die(); 
*/
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

        $returnArray = '{"mwMainHeadlines":{"url":"' . $mwMainContentLink1 . '","urlTitle":"' . $mwMainContentLink1Title . '"},' . 
              '"mwPartnerHeadLines":{"url":"' . $mwPartnerHeadlinesLink1 . '","urlTitle":"' . $mwPartnerHeadlinesLink1Title . '"},' . 
              '"secFiling":{"url":"' . $secFilingLink1 . '","urlTitle":"' . $td2 . '"}}'; 



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
  $statistics = getStatistics($symbol, $offerPrice, $lowValue);
  $statisticsJSON = json_decode($statistics); 

  $companyName = $statisticsJSON->companyName;
  $companyName = createSECCompanyName($companyName);
  
  $returnLinks = getMarketwatch($symbol, $companyName);
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
      $ticker = $symbol->ticker;
      $checkNews = $symbol->checkNews; 
      $lowValue = $symbol->lowValue; 

      if (isset($symbol->originalSymbol))
      {
          $originalSymbol = $symbol->originalSymbol; 
      }

      $returnArray[$index]['stastistics'] = getStatistics($ticker, $offerPrice, $lowValue);
      $statisticsJSON = json_decode($returnArray[$index]['stastistics']); 
      $companyName = $statisticsJSON->companyName;
      $companyName = createSECCompanyName($companyName);

      if ((int) $checkNews == 1)
      {
          $returnArray[$index]['yahoo'] = getYahoo($ticker);
          $yahooObject = json_decode($returnArray[$index]['yahoo']); 

          $stockOrFund = $yahooObject->stockOrFund; 

          $returnArray[$index]['marketwatch_sec'] = getMarketwatch($ticker, $companyName);
      }

      $returnArray[$index]['symbol'] = $ticker;
      if (isset($originalSymbol))
      {
          $returnArray[$index]['originalSymbol'] = $originalSymbol;
      }

      $returnArray[$index]['checkNews'] = $checkNews;

    }

    echo (json_encode($returnArray)); 
}


?>
