<?php 

/* 
oauth_consumer_key: 874c996f1f6ecaa46c65abb115da9912
consumer_secret: 886529f1c9d06729e97b6f511a89b4df
*/

error_reporting(1);

require_once("simple_html_dom.php"); 
//error_reporting(E_ALL);

// header('Content-type: text/html');
if(isset($_GET['checkSec']))
{
  $checkSec=intval($_GET['checkSec']); 
}
if(isset($_GET['cikNumber']))
{
  $cikNumber=$_GET['cikNumber']; 
}
if(isset($_GET['modifiedSymbol']))
{
  $modifiedSymbol=$_GET['modifiedSymbol'];
}
if(isset($_GET['originalSymbol']))
{
  $originalSymbol=$_GET['originalSymbol'];
}
if (isset($_GET['previousCloseString']))
{
  $previousCloseString=$_GET['previousCloseString'];
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
    'User-Agent:brent@heigoldinvestments.com',
    );

//    'User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36',

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
    $companyName = preg_replace('/ SHS.*/', '', $companyName);
    $companyName = preg_replace('/ CORPORATION.*/', ' CORP', $companyName); 

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

function getBigChartsData($symbol, $checkBigCharts)
{
    $bigChartsData = "|"; 

    if ($checkBigCharts == 1)
    {
      $command = escapeshellcmd('python3 ../newslookup/pythonscrape/scrape-bigcharts.py ' . $symbol);
      $bigChartsValues = shell_exec($command);

      $values = explode('|', $bigChartsValues); 

      $bigChartsPercentage = $values[0];
      $bigChartsPercentage = str_replace("%", "", $bigChartsPercentage);
      $bigChartsPercentage = str_replace("-", "", $bigChartsPercentage);
      $bigChartsPrice = $values[1]; 
      $bigChartsPrice = str_replace("$", "", $bigChartsPrice);

      $bigChartsData = $bigChartsPercentage . "|" . $bigChartsPrice; 
    }

    return $bigChartsData; 
}

function saveOrderInfo($originalSymbol, $orderStub, $volumeNotes, $individualNotes)
{


    $servername = "localhost";
    $username = "superuser";
    $password = "heimer27";
    $db = "daytrade"; 
    $mysqli = null;
    $date = date("Y-m-d"); 

    // Check connection
    try {
        $mysqli = new mysqli($servername, $username, $password, $db);
    } catch (mysqli_sql_exception $e) {

    } 

    $mysqli->query("REPLACE INTO orders (symbol, order_stub, volume_notes, individual_notes, created_at) VALUES ('" . $originalSymbol . "', '" . $orderStub . "', '". $volumeNotes . "', '" . $individualNotes . "', CURRENT_TIMESTAMP)");

}

function getStatistics($originalSymbol, $offerPrice, $lowValue, $checkBigCharts, $previousCloseString)
{
    $currentVolume = ""; 
    $averageVolume = "";
    $percentLow = ""; 
    $low = 0.0;

    $etradeAPIData = getEtradeAPIData($originalSymbol);

    $bigChartsData = getBigChartsData($originalSymbol, $checkBigCharts);

    $bigChartsValues = explode('|', $bigChartsData); 
    $bigChartsPercentage = $bigChartsValues[0];
    $bigChartsPrice = $bigChartsValues[1]; 

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
       $premarketLastTrade = floatval($etradeAPIData->extended_hour_last_trade); 
       $prevClose = floatval($etradeAPIData->prev_close);
       if ($prevClose <= 0.00)
       {
          $prevClose = $previousCloseString; 
       }
       $eTradeLowValue = floatval($etradeAPIData->low);

       if ($lowValue == 0.0)
       {
           $low = $eTradeLowValue; 
           $lowValue = $low; 
       }
       else
       {
          // if we are in the pre-market, and therefore ETRADE does not provide the pre-market low: 
          if ($eTradeLowValue == 0.0)
          {
              if ($premarketLastTrade < $lowValue)
              {
                $low = $premarketLastTrade;
                $lowValue = $premarketLastTrade;
              }
              else 
              {
                $low = $lowValue; 
              }
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
         $percentLow = number_format((($prevClose-$low)/$prevClose)*100, 2);  
       }
    }


error_log("final lowValue is " . $lowValue);

    $returnArray = '{"currentVolume":"' . $currentVolume . '", "averageVolume":"'. $averageVolume . '", "percentLow":"' . $percentLow . '", "lowValue":"' . $lowValue . '", "companyName": "' . $companyName . '", "bigChartsPercentage": "' . $bigChartsPercentage .'", "bigChartsPrice": "' . $bigChartsPrice . '"}'; 

    return $returnArray; 
}

$ret = "";
$finalReturn = "";


function produce_XML_object_tree($raw_XML) {
    libxml_use_internal_errors(true);
    try {
        $xmlTree = new SimpleXMLElement($raw_XML);
    } catch (Exception $e) {
        // Something went wrong.
        $error_message = 'SimpleXMLElement threw an exception.';
        foreach(libxml_get_errors() as $error_line) {
            $error_message .= "\t" . $error_line->message;
        }
        trigger_error($error_message);
        return false;
    }
    return $xmlTree;
}

function getStreetInsider($symbol)
{
    $servername = "localhost";
    $username = "superuser";
    $password = "heimer27";
    $db = "daytrade"; 
    $mysqli = null;
    $date = date("Y-m-d"); 
    $streetInsiderTitle = "";
    $streetInsiderLink = ""; 
    $link = null; 
    $query = null; 
    $reScrape = false; 

    // Check connection
    try {
        $link = mysqli_connect($servername, $username, $password, $db) or die($link); 
    } catch (mysqli_sql_exception $e) {

    } 

    $SQL = "SELECT symbol, lastLink, lastTitle, lastUpdated FROM streetinsider WHERE symbol = '" . $symbol . "'"; 
    try 
    {
        $link->set_charset("utf8");
        $query = mysqli_query($link, $SQL);
        if(!$query)
        {
            echo "Error: " . mysqli_error($link);
        }
    } 
    catch (mysqli_sql_exception $e) 
    {
        echo "Error when selecting from database is " . $e->errorMessage() . "<br>"; 
    } 

    $rowCount = mysqli_num_rows($query); 
    $currentTimeInt = strtotime('- 8 hours'); 
    $currentTime = date('Y-m-d H:i:s', $currentTimeInt); 

    // If it's been over 25 minutes since we last scraped, or we haven't scraped it yet (i.e. no rows in the database) 
    // then we re-scrape (i.e. $reScrape = true) 
    if ($rowCount >= 1)
    {
        while ($myRow = mysqli_fetch_assoc($query))
        {
            $lastUpdatedInt = strtotime($myRow['lastUpdated'] . "- 8 hours");
            $lastUpdated = date('Y-m-d H:i:s', $lastUpdatedInt); 
            $timeDiff = ($currentTimeInt - $lastUpdatedInt)/60; 
            // If it's newer than 2 minutes then just use what's stored in the database, because
            // the StreetInsider bot hasn't expired. 
            if ($timeDiff < 15.00)
            {
                $streetInsiderLink = $myRow['lastLink'];
                $streetInsiderTitle = $myRow['lastTitle'];
            }
            else 
            {
                $reScrape = true; 
            }
        }
    }
    else 
    {
        $reScrape = true; 
    }

    if ($reScrape == true)
    {    
        $rssStreetInsider = "https://www.streetinsider.com/freefeed.php?ticker=" . $symbol;
        $xmlStreetInsider=grabHTML('www.streetinsider.com', $rssStreetInsider);
        $xmlFinalObject = produce_XML_object_tree($xmlStreetInsider); 

        $streetInsiderLink = $xmlFinalObject->channel->item{0}->link;
        $streetInsiderTitle = $xmlFinalObject->channel->item{0}->title;

        $streetInsiderLink = mysqli_real_escape_string($link, $streetInsiderLink);
        $streetInsiderTitle = mysqli_real_escape_string($link, $streetInsiderTitle);

        try 
        {
            $link->set_charset("utf8");

            $sqlStatement = "UPDATE streetinsider SET  lastLink = '" . $streetInsiderLink . "', lastTitle = '" . $streetInsiderTitle . "', lastUpdated = NOW() WHERE symbol = '" . $symbol . "'"; 

            $query = mysqli_query($link, $sqlStatement);
            if(!$query)
            {
                error_log("Error: " . mysqli_error($link));
            }
        } 
        catch (mysqli_sql_exception $e) 
        {
            error_log("Error when writing to database is " . $e->errorMessage()); 
        } 

    }


    $returnArray['link'] = $streetInsiderLink; 
    $returnArray['title'] = $streetInsiderTitle; 

    return $returnArray; 

}

function getSEC($originalSymbol, $modifiedSymbol, $companyName, $checkSec, $cikNumber)
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

    $rssSeekingAlpha = simplexml_load_file("https://seekingalpha.com/api/sa/combined/" . $originalSymbol . ".xml");
    $mwMainContentLink1 = $rssSeekingAlpha->channel->item{0}->link;
    $mwMainContentLink1Title = $rssSeekingAlpha->channel->item{0}->title;

    $streetInsider = getStreetInsider($modifiedSymbol);
    $mwPartnerHeadlinesLink1 = $streetInsider['link'];
    $mwPartnerHeadlinesLink1Title = $streetInsider['title']; 

        // now we do the SEC filing 

        $command = escapeshellcmd('python3 ../newslookup/pythonscrape/scrape-sec-gov-single.py ' . $modifiedSymbol . " " . $cikNumber . " " . $companyName);
        $secValues = shell_exec($command);

        $secValuesObject = json_decode($secValues); 

        $secUrl = $secValuesObject->url;
        $secUrlTitle = $secValuesObject->url_title; 


        $returnArray = '{"mwMainHeadlines":{"url":"' . $mwMainContentLink1 . '","urlTitle":"' . $mwMainContentLink1Title . '"},' . 
              '"mwPartnerHeadLines":{"url":"' . $mwPartnerHeadlinesLink1 . '","urlTitle":"' . $mwPartnerHeadlinesLink1Title . '"},' . 
              '"secFiling":{"url":"' . $secUrl . '","urlTitle":"' . $secUrlTitle . '"}}'; 

        return $returnArray;

}

function getYahoo($modifiedSymbol)
{

    $url = "";
    $urlTitle = "";

      $command = escapeshellcmd('python3 ../newslookup/pythonscrape/scrape-yahoo-finance-newscheck-links.py ' . $modifiedSymbol);
      $returnArray = shell_exec($command);

      return $returnArray; 

/*
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


*/

} // if ($which_website == "yahoo")



function getTradeHalts()
{
    $rss_feed = simplexml_load_file("https://www.nasdaqtrader.com/rss.aspx?feed=tradehalts");

    $returnArray['haltstring'] = ""; 
    $returnArray['haltalert'] = 0; 
    $haltSymbolList = array(); 

    $dateTime = new DateTime(); 
    $dateTime->modify('-8 hours'); 
    $currentDate = $dateTime->format("m/d/Y"); 

    foreach ($rss_feed->channel->item as $feed_item) {

      $ns = $feed_item->getNamespaces(true); 
      $child = $feed_item->children($ns["ndaq"]);

      $date = $child->HaltDate; 
      $resumptionTime = $child->ResumptionTradeTime; 
      $symbol = trim($feed_item->title); 
      $reasonCode = trim($child->ReasonCode); 
      $ignoreArray = array(''); 


      $returnArray['haltstring'] .= "symbol is " . $symbol . ", date is " . $date . ", currentDate is " . $currentDate . ", child->ResumptionTradeTime is *" . $resumptionTime . "* and reasonCode is *" . $reasonCode . "* "; 

      if (($date == $currentDate) && ($resumptionTime == ""))
      {
        if (!in_array($symbol, $ignoreArray)) {
            $returnArray['haltalert'] = 1; 
            $returnArray['haltstring'] .= " *********************************** HALT ALERT\n"; 
            array_push($haltSymbolList, $symbol); 
        }

      }
      else 
      {
            $returnArray['haltstring'] .= " NO HALT ALERT\n"; 
      }

    }
    $returnArray['halt_symbol_list'] = json_encode($haltSymbolList); 
    return $returnArray; 
}

if (isset($which_website) && ($which_website == "marketwatch"))
{
  $checkBigCharts = 0; // we're not checking bigCharts first time around 

  $statistics = getStatistics($originalSymbol, $offerPrice, $lowValue, $checkBigCharts, $previousCloseString);
  $statisticsJSON = json_decode($statistics); 

  $companyName = $statisticsJSON->companyName;

  $companyName = createSECCompanyName($companyName);

  $returnLinks = getSEC($originalSymbol, $modifiedSymbol, $companyName, $checkSec, $cikNumber);
  echo $returnLinks;
}
elseif (isset($which_website) && ($which_website == "yahoo"))
{
  $returnLinks = getYahoo($modifiedSymbol);
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
      $modifiedSymbol = $symbol->modifiedSymbol;
      $checkNews = $symbol->checkNews; 
      $lowValue = $symbol->lowValue; 
      $checkBigCharts = $symbol->checkBigCharts; 
      $cikNumber = $symbol->cikNumber; 
      $orderStub = $symbol->orderStub; 
      $volumeNotes = $symbol->volumeNotes; 
      $individualNotes = $symbol->individualNotes; 

      // the previous closing price that we are grabbing from the order stub (i.e. not grabbing it from E*TRADE API)
      $previousCloseString = $symbol->previousCloseString; 

      if (isset($symbol->originalSymbol))
      {
          $originalSymbol = $symbol->originalSymbol; 
      }

      saveOrderInfo($originalSymbol, $orderStub, $volumeNotes, $individualNotes); 

      $returnArray[$index]['statistics'] = getStatistics($originalSymbol, $offerPrice, $lowValue, $checkBigCharts, $previousCloseString);
      $statisticsJSON = json_decode($returnArray[$index]['statistics']); 



      $companyName = $statisticsJSON->companyName;

      $companyName = createSECCompanyName($companyName);

      if ((int) $checkNews == 1)
      {
          $returnArray[$index]['yahoo'] = getYahoo($modifiedSymbol);
          $yahooObject = json_decode($returnArray[$index]['yahoo']); 

          $stockOrFund = $yahooObject->stockOrFund; 

          $returnArray[$index]['marketwatch_sec'] = getSEC($originalSymbol, $modifiedSymbol, $companyName, $checkSec, $cikNumber);
      }

      $returnArray[$index]['symbol'] = $modifiedSymbol;
      if (isset($originalSymbol))
      {
          $returnArray[$index]['originalSymbol'] = $originalSymbol;
      }

      $returnArray[$index]['checkNews'] = $checkNews;

    }

    $tradeHaltsArray = getTradeHalts(); 

    $returnArray['haltstring'] = $tradeHaltsArray["haltstring"]; 
    $returnArray['haltalert'] = $tradeHaltsArray["haltalert"]; 
    $returnArray['halt_symbol_list'] = $tradeHaltsArray['halt_symbol_list']; 

    echo (json_encode($returnArray)); 
}


?>
