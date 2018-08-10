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
$secFilingLink1 = ""; 
$secFilingLink1Title = ""; 


//        $url = "http://ec2-52-41-122-145.us-west-2.compute.amazonaws.com/puppeteer-marketwatch/grab-news.php?stockOrFund=$stockOrFund&symbol=$symbol";

//        $result = curl_get_contents($url);

//        $resultDecoded = json_decode($result, true);

        // now we do the SEC filing 

        $url = "https://www.sec.gov/cgi-bin/browse-edgar?CIK=" . $symbol . "&owner=exclude&action=getcompany&Find=Search"; 
        $result = grabHTML('www.sec.gov', $url); 
        $html = str_get_html($result);

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



      $returnArray = '{"found":"' . 'found' . '",' . '"mwMainHeadlines":{"url":"' . /* $resultDecoded['mw'][0]['link']  */ "" . '","urlTitle":"' . /* $resultDecoded['mw'][0]['headline'] */ "" . '"},' . 
            '"mwPartnerHeadLines":{"url":"' . /* $resultDecoded['other'][0]['link'] */ "" . '","urlTitle":"' . /* $resultDecoded['other'][0]['headline'] */ "" . '"},' . 
            '"secFiling":{"url":"' . $secFilingLink1 . '","urlTitle":"' . $td2 . '"}}'; 

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

      $company_name_array = $html->find('h6'); 

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
          $url = $rss->channel->item{0}->link;
          $urlTitle = $rss->channel->item{0}->title;
        } // if the symbol is found by yahoo finance

    $returnArray = '{"found":"' . $isFound . '",' . '"companyName":"' . $full_company_name . '",' .  '"currentVolume":"' . $currentVolume  . '", "yahooInfo":{"urlTitle":"' . $urlTitle . '","url":"' . $url . '"}}';

    echo $returnArray; 

} // if ($which_website == "yahoo")


?>