

var timerVariable; 
var railroadCrossingPlayed = 0; 
var railroad650 = 0;
var railroad800 = 0;
var railroad900 = 0; 
var railroad1000 = 0;
var railroad1100 = 0;
var railroad1200 = 0;
var railroad1300 = 0;



function getCurrentTime() {
        var date = new Date();
        var hours = getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        time = parseInt(hours + minutes);
        return time;
   };

function getCurrentTimeAMPM() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


function startTimer() {
  var presentTime = document.getElementById('timeLeftSpan').innerHTML;
  var timeArray = presentTime.split(/[:]+/);
  var m = timeArray[0];
  var s = checkSecond((timeArray[1] - 1));
  var time; 
  var time24Hour = get24HourTime(); 

  if(s==59){m=m-1}
    
  time = m + ":" + s; 

  document.getElementById('timeLeftSpan').innerHTML =
    time; 

  if (time == "0:00"){
  	document.getElementById('timeLeftSpan').innerHTML = "2:00";
  	checkAllDivsForNews();
  }
/*
  if ((time24Hour > 650) && (railroad650 == 0))
  {
	playRailroadCrossing();
  	railroad650 = 1;
  }
  if ((time24Hour > 800) && (railroad800 == 0))
  {
	playRailroadCrossing();
  	railroad800 = 1;
  }
  if ((time24Hour > 900) && (railroad900 == 0))
  {
	playRailroadCrossing();
  	railroad900 = 1;
  }
  if ((time24Hour > 1000) && (railroad1000 == 0))
  {
	playRailroadCrossing();
  	railroad1000 = 1;
  }
  if ((time24Hour > 1100) && (railroad1100 == 0))
  {
	playRailroadCrossing();
  	railroad1100 = 1;
  }
  if ((time24Hour > 1200) && (railroad1200 == 0))
  {
	playRailroadCrossing();
  	railroad1200 = 1;
  }
  */

//  console.log(get24HourTime());
  setTimeout(startTimer, 1000);
}


function get24HourTime(){
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var time24Hour = String(hours) + String(minutes);
  return parseInt(time24Hour); 
}


function playRailroadCrossing(){
  var audioRailroad = new Audio('./wav/railroad_crossing_bell.wav');
  audioRailroad.play();

}

function playAirRaidSiren(){
	var audioSiren = new Audio('./wav/tornado-siren.wav');
	audioSiren.play();
}

function playWaterSplash(){
	var waterSplash = new Audio('./wav/water-splash.wav');
	waterSplash.play();
}

function playCarDriveBy(){
	var carDriveBy = new Audio('./wav/car-drive-by.wav');
	carDriveBy.play();
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}

function writeTradeStamp(id)
{

	var orderStub = $("#orderInput" + id).val();
	var orderStubSplit = orderStub.split(" ");
	var price = orderStubSplit[2];
	var percentage = orderStubSplit[3];
	var currentTime = getCurrentTimeAMPM();

	var notes = $("#individualNotesText" + id).val();
	notes = notes + price + " " + percentage + " " + currentTime + " -- ";

	$("#individualNotesText" + id).val(notes);
}

// expand all the divs so that you can see everything 

function expandAll(){

	$(".allDivs").each(function(){
		currentId = $(this).attr("id"); 
 		currentId = currentId.replace("div", ""); 	

		if ($("#upDownArrow" + currentId).attr("src") == "images/downArrow_smaller.jpg")
		{
			$("#upDownArrow" + currentId).attr("src", "images/upArrow_smaller.jpg"); 
			$("#div" + currentId).css("height", "243px");
		}

	}) // all divs each 

}   // function expandAll()

// expand all the divs so that you can see everything 

function collapseAll(){

	$(".allDivs").each(function(){
		currentId = $(this).attr("id"); 
 		currentId = currentId.replace("div", ""); 	

		if ($("#upDownArrow" + currentId).attr("src") == "images/upArrow_smaller.jpg")
		{
			$("#upDownArrow" + currentId).attr("src", "images/downArrow_smaller.jpg");
			$("#div" + currentId).css("height", "28px");
		}

	}) // all divs each 

}   // function expandAll()


function calcPrevClose(currentId)
{
		var orderStub = $("#orderInput" + currentId).val();
    var orderStubSplit = orderStub.split(" ");
    var price = orderStubSplit[3];

    price = price.replace(/\$/g, "");
    thePercentage = orderStub.match(/\((.*)\)/g); 
    thePercentage = thePercentage.toString().replace(/\(/g, ""); 
    thePercentage = thePercentage.toString().replace(/\)/g, ""); 
    thePercentage = thePercentage.toString().replace(/\%/g, ""); 

    prevClose = price/(1- (thePercentage/100)); 

    var newCalculatedPrice = prevClose - ((thePercentage/100)*prevClose)

    $("#prevClose" + currentId).html(prevClose); 
} // end of calcPrevClose 


function reCalcOrderStub(currentId)
{

	var orderStub = $.trim($("#orderInput" + currentId).val()); 
    var orderStubSplit = orderStub.split(" ");
    var numShares = orderStubSplit[1];
    var price = orderStubSplit[2];
    var prevClose = $("#prevClose" + currentId).html();
    var orderType = ""; 

    price = price.replace(/\$/g, "");
    numSharesWithoutCommas = numShares.replace(/,/g, ""); 
    thePercentage = orderStub.match(/\((.*)\)/g); 
    thePercentage = thePercentage.toString().replace(/\(/g, ""); 
    thePercentage = thePercentage.toString().replace(/\)/g, ""); 
    thePercentage = thePercentage.toString().replace(/\%/g, ""); 

	if (thePercentage.length > 4)
	{

    	var newCalculatedPrice = prevClose - ((thePercentage/100)*prevClose); 

		thePercentage = Number(thePercentage);

    	var totalValue = (numSharesWithoutCommas*newCalculatedPrice);

    	var totalValueString = totalValue.toString(); 
    	var positionOfDecimal = totalValueString.indexOf(".");
    	if (positionOfDecimal > -1)
    	{
            	totalValueString = totalValueString.substr(0, positionOfDecimal); 
    	}
    	totalValueString = totalValueString.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ","); 

    	var ctl = document.getElementById("orderInput" + currentId);
    	var startPos = ctl.selectionStart;

		numSharesWithCommas = numShares; 
 		numSharesWithCommas = numSharesWithCommas.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

 		if (newCalculatedPrice > 1.00)
 		{
 			newCalculatedPrice = newCalculatedPrice.toFixed(2); 
 		}
 		else if (newCalculatedPrice < 1.00)
 		{
 			newCalculatedPrice = newCalculatedPrice.toFixed(4);
 		}

	    $("#orderInput" + currentId).val("BUY " + numSharesWithCommas + " $" + newCalculatedPrice + " (" + thePercentage.toFixed(2) + "%) -- $" + totalValueString + orderType); 

	    ctl.setSelectionRange(startPos, startPos); 

    } // if the length of the percentage number is greater than 4, i.e. "35.65" as opposed to "5.65". 

} // end of reCalcOrderStub 

// create a new news search item in the table 

function createNewNewsEntry() {

	// if the #container is empty, then just set the new Id to 1 

	if ($(".allDivs").length == 0)
	{
		newIdNumber = 1; 		
	}
	else 
	{
		highestIdNumber = $(".allDivs").last().attr('id');
		highestIdNumber = highestIdNumber.replace("div", ""); 	
		newIdNumber = parseInt(highestIdNumber) + 1; 
	}
	
	newNewsEntry =  "<div id='div" + newIdNumber + "' class='allDivs'>"; 
	newNewsEntry += "	<div class='symbolInfo'>"; 
	newNewsEntry += "		<div id='orderNumber" + newIdNumber + "' class='orderNumber'>" + newIdNumber + "</div>";
	newNewsEntry += "		<input id='symbol" + newIdNumber + "' class='symbolTextInput'>"; 
	newNewsEntry += "		<input id='orderInput" + newIdNumber + "' class='orderInput'>"; 
 	newNewsEntry += "	 	<div id='prevClose" + newIdNumber + "' class='prevClose'></div>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div class='lowInfo'>"; 
	newNewsEntry += "	<input id='lowValue" + newIdNumber + "' class='lowValue' value='0.0'>";
	newNewsEntry += "		<div id='lowWrapper" + newIdNumber + "' class='lowWrapper'>"; 
	newNewsEntry += "		&nbsp;<span id='low" + newIdNumber + "' class='low'></span>"; 
	newNewsEntry += "		</div>";
	newNewsEntry += "		<input id='lowInput" + newIdNumber + "' class='lowInput' value='9'>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div class='checkForLowWrapper'>";
	newNewsEntry += "&nbsp;<input type='checkbox' id='checkForLow" + newIdNumber + "' class='checkForLow' checked>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div class='checkForNewNewsWrapper'>"; 
 	newNewsEntry += "		&nbsp;<input type='checkbox' id='checkForNewNews" + newIdNumber + "' class='checkForNewNews' checked>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div class='controlButtonDiv'>"; 
	newNewsEntry += "		<button id='controlButton" + newIdNumber + "' class='controlButton' type='button'>Start</button>"; 
	newNewsEntry += " 	</div>"; 
	newNewsEntry += " 	"; 
	newNewsEntry += "	<div id='newsResultsDiv" + newIdNumber + "' class='newsResultsDiv' tabindex='-1'>"; 
	newNewsEntry += " 		<span id='newsStatusLabel" + newIdNumber + "' class='newsStatusLabel' tabindex='-1'>";
	newNewsEntry += "			Status...</span>"; 
	newNewsEntry += " 	</div>"; 
	newNewsEntry += "	<div id='expandContractNews" + newIdNumber + "' class='expandContractNews' tabindex='-1'> "; 
	newNewsEntry += "		<img id='upDownArrow" + newIdNumber + "' class='arrowImages' src='images/downArrow_smaller.jpg' tabindex='-1'> "; 
    newNewsEntry += "	</div> "; 
	newNewsEntry += "	<div id='refresh" + newIdNumber + "' class='refresh' tabindex='-1'>"; 
	newNewsEntry += "		<img class='refreshImage' src='images/refresh_smaller.png' tabindex='-1'>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "   <div id='closeDiv" + newIdNumber + "' class='closeNewsEntry' tabindex='-1'>"; 
	newNewsEntry += "		<span class='closeNewsX' tabindex='-1'>X</span>"; 
	newNewsEntry += "  	</div>"; 
	newNewsEntry += " 	<div id='volumeDiv" + newIdNumber + "' class='volumeDiv' tabindex='-1'>";
	newNewsEntry += " 		<span id='volumeSpan" + newIdNumber + "' class='volumeSpan' tabindex='-1'>V</span>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div class='turnVolumeRedWrapper'>";
 	newNewsEntry += "		&nbsp;<input type='checkbox' id='turnVolumeRed" + newIdNumber + "' class='turnVolumeRed'>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div class='playVolumeSoundWrapper'>";
 	newNewsEntry += "		&nbsp;<input type='checkbox' id='playVolumeSound" + newIdNumber + "' class='playVolumeSound' >";
	newNewsEntry += "   </div>";
	newNewsEntry += " 	<div id='volumeAmountDiv" + newIdNumber + "' class='volumeAmountDiv' tabindex='-1'>";
	newNewsEntry += "	 	<input id='volume30DayInput" + newIdNumber + "' class='volume30DayInput' value='0'>";
	newNewsEntry += " 		<input id='volumeRatio" + newIdNumber + "' class='volumeRatio' value='2'>";
	newNewsEntry += "		<span id='volumeAmountSpan" + newIdNumber + "' class='volumeAmountSpan' tabindex='-1'></span>";
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div id='importantDiv" + newIdNumber + "' class='importantDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='importantSpan' tabindex='-1'>!</span>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div id='highRiskDiv" + newIdNumber + "' class='highRiskDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='highRiskSpan' tabindex='-1'>H</span>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div id='reverseSplitDiv" + newIdNumber + "' class='reverseSplitDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='reverseSplitSpan' tabindex='-1'>R</span>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div id='offeringDiv" + newIdNumber + "' class='offeringDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='offeringSpan' tabindex='-1'>O</span>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<input id='offerPrice" + newIdNumber + "' class='offerPrice'>";
	newNewsEntry += " 	<div class='newsContainer'>"; 
	newNewsEntry += "		<div class='symbolCheckBox' tabindex='-1'>"
	newNewsEntry +=	"			<span class='symbolCheckBoxLabel'>" 
	newNewsEntry += "				<input type='checkbox' id='stripLastCharacterCheckbox" + newIdNumber + "' value='1' checked='checked'>Trunc the 5th 'W/R/Z' char, '.WS' '.PD', etc...'"; 
	newNewsEntry += "			</span> "; 
	newNewsEntry += "			&nbsp;";
 	newNewsEntry += "			Avg Vol: <input type='text' id='avgVolume" + newIdNumber + "' class='avgVolume'>"; 
	newNewsEntry += "			<input type='checkbox' id='checkVolume" + newIdNumber + "' value='1'>Check Vol";
	newNewsEntry += "			<input type='checkbox' class='checkPK' id='checkPK" + newIdNumber + "' value='1'>PK";
	newNewsEntry += "			<input type='checkbox' class='checkBB' id='checkBB" + newIdNumber + "' value='1'>BB"; 
	newNewsEntry += "			<button class='copyOrderToClipboard' id='copyOrderToClipboard" + newIdNumber + "' type='button'>Copy</button>";
	newNewsEntry += "		</div>"; 
	newNewsEntry += "		<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += " 			<span class='storedLinkLabel' tabIndex='-1'>Original Yahoo Link:</span> "; 
	newNewsEntry += " 			<div id='storedYahooLink" + newIdNumber + "' class='storedLink' tabIndex='-1'></div> "; 
	newNewsEntry += " 		</div> "; 
	newNewsEntry += " 		<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += "			<span class='storedLinkLabel' tabindex='-1'>Original Marketwatch Main Link:</span> "; 
	newNewsEntry += " 			<div id='storedMarketWatchMainLink" + newIdNumber + "' class='storedLink' tabindex='-1'></div> "; 
	newNewsEntry += " 		</div> "; 
	newNewsEntry += " 		<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += " 			<span class='storedLinkLabel' tabindex='-1'>Original Marketwatch Other News Link:</span> "; 
	newNewsEntry += " 			<div id='storedMarketWatchPartnerLink" + newIdNumber + "' class='storedLink' tabindex='-1'></div> "; 
	newNewsEntry += " 		</div> 	"; 
	newNewsEntry += "	 	<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += "			<span class='storedLinkLabel' tabindex='-1'>SEC Filing Link:</span> "; 
	newNewsEntry += " 			<div id='storedSECFilingLink" + newIdNumber + "' class='storedLink' tabindex='-1'></div> "; 
	newNewsEntry += "  		</div> 	"; 
	newNewsEntry += "	 	<div class='individualNotesDiv' tabindex='-1'>";
	newNewsEntry += "			<span class='individualNotesLabel' tabindex='-1'>Notes:</span>";
	newNewsEntry += "			&nbsp;<input type='text' id='individualNotesText" + newIdNumber + "' class='individualNotesText'>";
	newNewsEntry += "           <input type='checkbox' id='earningsLossCheckbox" + newIdNumber + "' class='earningsLossCheckbox'  value='0'>Earnings Loss"; 
	newNewsEntry += "			<input type='text' id='fullOrder" + newIdNumber + "' class='fullOrder'>";  
	newNewsEntry += "	 	</div>";
	newNewsEntry += "    </div>";
	newNewsEntry += " 	 <div id='chartDiv" + newIdNumber + "' class='chartDiv'>"; 
	newNewsEntry += "	 </div>";
	newNewsEntry += "</div>";

//  	alert(newNewsEntry); 	

	$("#container").append(newNewsEntry);

}  // end of function crateNewNewsEntry


// Function storeOriginalStateOfNews.  If whichSite is "yahooFinance", 
// then we make an ajax call to the proxy, which will return a string containing 
// the first link in the yahoo finance news table.
//
// If whichSite is "marketWatch", then we make an ajax call to the proxy, 
// which will return 3 strings, one string for each marketwatch table 
// (the marketwatch main content table, the marketwatch partner headlines table, 
// and the marketwatch pr headlines table).

function storeOriginalStateOfNews(currentSymbol, currentId){

var yahooFound = "";     		// was the symbol even found on the yahoo website? 
var yahooCompanyName = "";      // the company name parsed out of the yahoo page
var yahooFirstLink = ""; 		// the url of the first news link in the table 
var stockOrFund = "";           // is the symbol a stock or an ETF?
var etfStringLocation; 
var marketWatchFond = "";		// was the symbol even found on the Marketwatch website? 
var mwMainContentLink1 = ""; 
var mwMainContentLink1Title = "";  
var mwPartnerHeadlinesLink1 = ""; 
var mwPartnerHeadlinesLink1Title = ""; 
var secFilingLink1 = "";
var secFilingLink1Title = "";

	// set the status bar 

	$("#newsStatusLabel" + currentId).html("Looking up symbol...")



	$.ajax({
	   	url: "newsproxy.php",
	   	data: {symbol: currentSymbol,
	   		which_website: "yahoo", 
	   		host_name: "finance.yahoo.com"} , 
		async: false,	   		
	   	dataType: 'json',
	   	success:  function (data) {
console.log("Yahoo Finance Data is: "); 
console.log(data); 
	   			yahooFirstLink = data.yahooInfo.url;
	   			yahooFirstLink = yahooFirstLink.replace(/&amp;/g, '&');    			
	   			yahooFirstLinkTitle = data.yahooInfo.urlTitle; 
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/ *(?:&.*;)+ */, ' ');
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#xD;&#xA;/g, '');  				
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&apos;/g, "'"); 
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#x27;/g, "'"); 
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&amp;/g, '&'); 
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#x2019;/g, "’"); 
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#x2014;/g, "—");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#x2B;/g, "+");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#xD;&#xA;/g, "");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#x20AC;/g, "€");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#39;/g, "'");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#xA0;/g, " ");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#xE0;/g, "à");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#x2018;/g, "‘");
				yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&#xE9;/g, "é");

    	}, // end of yahoo success function
    	error: function(XMLHttpRequest, textStatus, errorThrown) {
console.log("Error in retrieving Yahoo Finance data, error is: "); 
console.log(errorThrown); 
console.log("XMLHttpRequest is: ");
console.log(XMLHttpRequest);
  		}
	});  // end of ajax call for yahoo finance   

 	$.ajax({
	    url: "newsproxy.php",
	    data: {symbol: currentSymbol,
	    	   which_website: "marketwatch", 
	    	   host_name: "www.marketwatch.com"} , 
		async: false,	    	   
	    dataType: 'json',
	    success:  function (data) {
console.log("Marketwatch/SEC data is: "); 
console.log(data); 


				mwMainContentLink1 = data.mwMainHeadlines.url; 
				mwMainContentLink1 = mwMainContentLink1.replace(/&amp;/g, '&');
				mwMainContentLink1Title = data.mwMainHeadlines.urlTitle; 
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/ *(?:&.*;)+ */, ' ');
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#xD;&#xA;/g, '');  
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&apos;/g, "'"); 
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#x27;/g, "'"); 
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&amp;/g, '&'); 
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#x2019;/g, "’"); 
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#x2014;/g, "—"); 
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#x2B;/g, "+"); 
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#xD;&#xA;/g, "");
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#x20AC;/g, "€");
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#39;/g, "'");
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#xA0;/g, " ");	
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#xE0;/g, "à");
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#x2018;/g, "‘");
				mwMainContentLink1Title = mwMainContentLink1Title.replace(/&#xE9;/g, "é");


				mwPartnerHeadlinesLink1 = data.mwPartnerHeadLines.url; 
				mwPartnerHeadlinesLink1 = mwPartnerHeadlinesLink1.replace(/&amp;/g, '&'); 
				mwPartnerHeadlinesLink1Title = data.mwPartnerHeadLines.urlTitle;
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/ *(?:&.*;)+ */, ' ');
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#xD;&#xA;/g, '');  	
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&apos;/g, "'"); 
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#x27;/g, "'"); 
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&amp;/g, '&'); 
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#x2019;/g, "’");
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#x2B;/g, "+");
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#xD;&#xA;/g, "");
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#x20AC;/g, "€");
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#39;/g, "'");
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#xA0;/g, " ");	
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#xE0;/g, "à");
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#x2018;/g, "‘");
				mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&#xE9;/g, "é");

				secFilingLink1 = data.secFiling.url; 
				secFilingLink1 = secFilingLink1.replace(/&amp;/g, '&'); 
				secFilingLink1Title = data.secFiling.urlTitle;
				secFilingLink1Title = secFilingLink1Title.replace(/&#xD;&#xA;/g, '');  				

 				// yahoo main 

				if (yahooFirstLinkTitle != "")
				{
					$("#storedYahooLink" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + "</a>");
				}
				else
				{
					$("#storedYahooLink" + currentId).html("No news");
				}

				// marketwatch main

				if (mwMainContentLink1Title != "")
				{
					$("#storedMarketWatchMainLink" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + "</a>");
				} 
				else
				{
					$("#storedMarketWatchMainLink" + currentId).html("No news");
				}

				// marketwatch partner headlines 

				if (mwPartnerHeadlinesLink1Title != "")
				{			
					$("#storedMarketWatchPartnerLink" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + "</a>"); 
				}
				else
				{
					$("#storedMarketWatchPartnerLink" + currentId).html("No news"); 
				}

				if (secFilingLink1 != "")
				{
					$("#storedSECFilingLink" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + "</a>"); 		
				}
				else
				{
					$("#storedSECFilingLink" + currentId).html("No news");
				}

				// change the value of the control button to "Stop"

				$("#newsStatusLabel" + currentId).html("News links stored...");

				$("#controlButton" + currentId).html("Stop"); 



	   	} // end of marketwatch success function 

	}); // end of ajax call to Marketwatch   

}  // end of function storeOriginalStateOfNews 



// check a single div for new news and update chart 

function checkIndividualDivForNews(divId)
{

		currentSymbol = currentSymbol.toUpperCase(); 		
		currentSymbol = $.trim($("#symbol" + divId).val()); 

   		var original_symbol = currentSymbol; 
   		var symbol;
   		var positionOfPeriod; 

   		positionOfPeriod = original_symbol.indexOf(".");

		// take out the 5th "W/R/Z" for symbols like CBSTZ. 


   		if ( $("#stripLastCharacterCheckbox" + currentId).prop('checked') && (positionOfPeriod > -1) )
   		{
   			// if any stocks have a ".PD" or a ".WS", etc... 

			symbol = original_symbol.substr(0, positionOfPeriod); 
   		}
   		else if ( $("#stripLastCharacterCheckbox" + currentId).prop('checked') && (original_symbol.length == 5) )
   		{
   			symbol = original_symbol.slice(0,-1); 
   		}
   		else
   		{
			symbol = original_symbol;    		
		}

        original_symbol = original_symbol.replace(/\.p\./gi, ".P"); 		

 		if (currentSymbol != "")
		{

			var yahooFirstLink = ""; 
			var yahooFirstLinkTitle = "";
			var yahooCompanyName = ""; 
			var stockOrFund = ""; 
			var mwMainContentLink1 = ""; 
			var mwMainContentLink1Title = "";
			var mwPartnerHeadlinesLink1 = ""; 
			var mwPartnerHeadlinesLink1Title = "";
			var newsFlag = false; 

			$("#div" + currentId).css("background-color", "#00FF00"); 			
			
			$("#newsStatusLabel" + currentId).html("Checking back for news/updating chart...")
			$.ajax({
		   		url: "newsproxy.php",
	   			data: {symbol: symbol,
			   		which_website: "yahoo"} , 
				async: false,	   		
	   			dataType: 'json',
	   			success:  function (data) {
	   					yahooFirstLink = data.yahooInfo.url;
	   					yahooFirstLink = yahooFirstLink.replace(/&amp;/g, '&'); 
		   				yahooFirstLinkTitle = data.yahooInfo.urlTitle; 
					    yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/ *(?:&.*;)+ */, ' ');
						yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&apos;/g, "'"); 

    			}  // end of yahoo success function
			});  // end of ajax call for yahoo finance  

	 		$.ajax({
		    	url: "newsproxy.php",
	    		data: {symbol: symbol,
	    	   		stockOrFund: stockOrFund, 	    			
		    	   	which_website: "marketwatch"} , 
				async: false,	    	   
	    		dataType: 'json',
	    		success:  function (data) {

					mwMainContentLink1 = data.mwMainHeadlines.url; 
					mwMainContentLink1 = mwMainContentLink1.replace(/&amp;/g, '&'); 
					mwMainContentLink1Title = data.mwMainHeadlines.urlTitle; 
					mwMainContentLink1Title = mwMainContentLink1Title.replace(/ *(?:&.*;)+ */, ' ');
					mwMainContentLink1Title = mwMainContentLink1Title.replace(/&apos;/g, "'"); 

					mwPartnerHeadlinesLink1 = data.mwPartnerHeadLines.url; 
					mwPartnerHeadlinesLink1 = mwPartnerHeadlinesLink1.replace(/&amp;/g, '&'); 
					mwPartnerHeadlinesLink1Title = data.mwPartnerHeadLines.urlTitle;

					mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/ *(?:&.*;)+ */, ' ');
					mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/&apos;/g, "'"); 

					secFilingLink1 = data.secFiling.url; 
					secFilingLink1 = secFilingLink1.replace(/&amp;/g, '&'); 
					secFilingLink1Title = data.secFiling.urlTitle;
					secFilingLink1Title = secFilingLink1Title.replace(/ *(?:&.*;)+ */, ' ');
					secFilingLink1Title = secFilingLink1Title.replace(/&apos;/g, "'"); 

/*  Not sure if I still want this, so I'll just keep it here in the mean time 

   					currentVolume = data.currentVolume; 
   					averageVolume = data.averageVolume; 
   					percentLow = parseFloat(data.percentLow); 

console.log("percentLow is " + percentLow);
console.log("currentVolume is " + currentVolume); 

					$("#low" + currentId).html(percentLow);

					var orderInput = $("#orderInput" + currentId).val(); 
					var myRegexp = /\((.*?)\)/g; 
					var match = myRegexp.exec(orderInput);

					if (match != null)
					{
						var lowInput = parseFloat($("#lowInput" + currentId).val());
						var currentPercentage = match[1];
						currentPercentage = currentPercentage.replace("%", ""); 	
						currentPercentage = parseFloat(currentPercentage);
						var currentMinusLow = currentPercentage - lowInput;

						if ((currentMinusLow) < percentLow)
						{
							$("#lowWrapper" + currentId).css("background-color", "#FFA500");
							globalCloseToCurrentLow = true;
						}
						else
						{
							$("#lowWrapper" + currentId).css("background-color", "#EBEBE0");
						}
					}
*/     


	 			// if we bring back a yahoo link 
	 			if (yahooFirstLinkTitle != "")
 				{
	 				// then if there was currently no news stored, 
 					if ($("#storedYahooLink" + currentId).html() == "No news")     
		 				{
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
							$("#controlButton" + currentId).html("Start"); 
							newsFlag = true; 

	 					}  // or what just came back is different than what was previously stored
 						else if (yahooFirstLinkTitle != $("#storedYahooLink" + currentId).find("a:first").text()) 
 						{
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
							$("#controlButton" + currentId).html("Start"); 						
							newsFlag = true; 
	 					}

 				}  // if we bring back a yahoo link 

	 			// if we bring back a marketwatch main table link 
 				if (mwMainContentLink1Title != "")
 				{
	 				if ($("#storedMarketWatchMainLink" + currentId).html() == "No news")
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
						$("#controlButton" + currentId).html("Start"); 						 					
						newsFlag = true; 					
 					}
 					else if (mwMainContentLink1Title != $("#storedMarketWatchMainLink" + currentId).find("a:first").text()) 
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 
 					}

 				}  // if we bring back a marketwatch main link  

 				// if we bring back a marketwatch partner headlines link 
 				if (mwPartnerHeadlinesLink1Title != "")
 				{
					if ($("#storedMarketWatchPartnerLink" + currentId).html() == "No news")
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (mwPartnerHeadlinesLink1Title != $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text()) 
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}

 				} // if we bring back a marketwatch partner headlines link 

 				// if we bring back a marketwatch PR headlines link 
				if (secFilingLink1Title != "") 
				{
					if ($("#storedSECFilingLink" + currentId).html() == "No news")
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (secFilingLink1Title != $("#storedSECFilingLink" + currentId).find("a:first").text()) 
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}

				} // if we bring back a marketwatch PR headlines link 

				$("#div" + currentId).css("background-color", "#ADAD85"); 

				if (newsFlag == false)
				{				
					var timeStamp = getCurrentTimeAMPM();
	 				$("#newsStatusLabel" + currentId).html("No new news..." + timeStamp);
 				}

	   			}  // end of marketwatch success function 
			}); // end of ajax call to Marketwatch 

			$("#chartDiv" + currentId).html("");
			$("#chartDiv" + currentId).html("<img style='max-width:100%; max-height:100%;' src='http://bigcharts.marketwatch.com/kaavio.Webhost/charts/big.chart?nosettings=1&symb=" + original_symbol + "&uf=0&type=2&size=2&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=4&rand=" + Math.random() + "&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1'>");

		} // if (currentSymbol != "")

} // checkIndividualDivForNews()


// go through each news div and check for any new news

function checkAllDivsForNews()
{

	var symbolArray =  [];

	$(".allDivs").each(function(){

		var ticker; 
		var currentId = $(this).attr("id"); 
 		var currentId = currentId.replace("div", "");
 		var checkNews = $("#checkForNewNews" + currentId).is(':checked')? "1": "0";
		var lowValue = $.trim($("#lowValue" + currentId).val()); 

		var originalSymbol = $.trim($("#symbol" + currentId).val()); 
		var offerPrice = $.trim($("#offerPrice" + currentId).val());

		if (originalSymbol.length == 5)
		{
			ticker = originalSymbol.slice(0,-1); 
		}
		else
		{
			ticker = originalSymbol;    		
		}

		symbolArray.push({
			"ticker": ticker, 
			"originalSymbol" : originalSymbol,
			"offerPrice" : offerPrice, 
			"checkNews" : checkNews, 
			"idNumber": currentId, 
			"lowValue": lowValue
		});

	}); // allDivs.each()




	var globalNewsFlag = false;
	var globalCloseToCurrentLow = false;
	var globalVolumeAlert = false;

	console.log("Inside checkAllDivsForNews, before calling AJAX.  Symbol array is: "); 
	console.log(symbolArray);

	$.ajax({
   		url: "newsproxy.php",
			data: {symbols: JSON.stringify(symbolArray)}, 
		async: true,	   		
			dataType: 'json',
			success:  function (data) {

			console.log("returned data is: "); 
			console.log(data);

				$.each(data, function(index,item) {

					var yahooFirstLink = ""; 
					var yahooFirstLinkTitle = "";
					var yahooCompanyName = ""; 
					var stockOrFund = ""; 
					var mwMainContentLink1 = ""; 
					var mwMainContentLink1Title = "";
					var mwPartnerHeadlinesLink1 = ""; 
					var mwPartnerHeadlinesLink1Title = "";
					var secFilingLink1 = "";
					var secFilingLink1Title = "";

					var currentVolume = 0;
					var averageVolume = 0; 
					var averageVoulme30Day = 0;
					var volumeRatio = 0.0;
					var percentLow = 0.0;
					var offerPrice = 0.0;

					var newsFlag = false; 

					currentId = index; 
					console.log("****" + $("#symbol" + currentId).val() + " checkNews is " + item.checkNews);
					console.log(item);

					if (item.hasOwnProperty('yahoo'))
					{
						console.log("yahoo news was brought back");
						yahooData = JSON.parse(item.yahoo);
	   					yahooFound = yahooData.found; 
   						yahooCompanyName = yahooData.companyName; 
   						yahooFirstLink = yahooData.yahooInfo.url;
	   					yahooFirstLink = yahooFirstLink.replace(/&amp;/g, '&'); 
	   					yahooFirstLinkTitle = yahooData.yahooInfo.urlTitle; 
						yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/ *(?:&.*;)+ */, ' ');
						yahooFirstLinkTitle = yahooFirstLinkTitle.replace(/&apos;/g, "'"); 
					}

					if (item.hasOwnProperty('marketwatch_sec'))
					{
						console.log("marketwatch news was brought back");
						mktWatchSECData = JSON.parse(item.marketwatch_sec); 
						mwMainContentLink1 = mktWatchSECData.mwMainHeadlines.url; 
						mwMainContentLink1 = mwMainContentLink1.replace(/&amp;/g, '&'); 
						mwMainContentLink1Title = mktWatchSECData.mwMainHeadlines.urlTitle;
						mwMainContentLink1Title = mwMainContentLink1Title.replace(/ *(?:&.*;)+ */, ' ');
						mwMainContentLink1Title = mwMainContentLink1Title.replace(/&apos;/g, "'"); 

						mwPartnerHeadlinesLink1 = mktWatchSECData.mwPartnerHeadLines.url; 
						mwPartnerHeadlinesLink1 = mwPartnerHeadlinesLink1.replace(/&amp;/g, '&'); 
						mwPartnerHeadlinesLink1Title = mktWatchSECData.mwPartnerHeadLines.urlTitle;
						mwPartnerHeadlinesLink1Title = mwPartnerHeadlinesLink1Title.replace(/ *(?:&.*;)+ */, ' ');

						secFilingLink1 = mktWatchSECData.secFiling.url; 
						secFilingLink1 = secFilingLink1.replace(/&amp;/g, '&'); 
						secFilingLink1Title = mktWatchSECData.secFiling.urlTitle;
					}

					statisticsData = JSON.parse(item.stastistics);
   					currentVolume = statisticsData.currentVolume; 
   					averageVolume = statisticsData.averageVolume; 

console.log("averageVolume30Day before parsing out comments is: " + $("#volume30DayInput" + currentId).val().toString());
   					averageVolume30Day = parseInt($("#volume30DayInput" + currentId).val().toString().replace(/\,/g,""));
   					volumeRatio = parseFloat($("#volumeRatio" + currentId).val());
   					percentLow = parseFloat(statisticsData.percentLow); 
   					lowValue = parseFloat(statisticsData.lowValue);

console.log("averageVolume30Day is " + averageVolume30Day); 
console.log("volumeRatio is " + currentId); 
console.log("averageVolume30Day*volumeRatio is " + averageVolume30Day*volumeRatio); 
console.log("currentVolume is " + currentVolume); 

					$("#low" + currentId).html(percentLow);
					$("#lowValue" + currentId).val(lowValue);

					var orderInput = $("#orderInput" + currentId).val(); 
					var myRegexp = /\((.*?)\)/g; 
					var match = myRegexp.exec(orderInput);

					if (match != null)
					{
						$("#volumeAmountSpan" + currentId).html(currentVolume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

						if ($("#turnVolumeRed" + currentId).is(':checked'))
						{
							if (parseInt(currentVolume) > (averageVolume30Day*volumeRatio))
							{
								$("#volumeAmountDiv" + currentId).css("background-color", "rgb(255, 0, 0)"); 
								$("#volumeDiv" + currentId).css("background-color", "rgb(255, 0, 0)"); 
							}
							else
							{	
								$("#volumeDiv" + currentId).css("background-color", "#EBEBE0");	
								$("#volumeAmountDiv" + currentId).css("background-color", "#EBEBE0");	
							}
						}
						else
						{
							$("#volumeDiv" + currentId).css("background-color", "#EBEBE0");	
							$("#volumeAmountDiv" + currentId).css("background-color", "#EBEBE0");	
						}

						if ($("#playVolumeSound" + currentId).is(':checked'))
						{
							if (parseInt(currentVolume) > (averageVolume30Day*volumeRatio))
							{
								globalVolumeAlert = true;
							}
						}

						var lowInput = parseFloat($("#lowInput" + currentId).val());
						var currentPercentage = match[1];
						currentPercentage = currentPercentage.replace("%", ""); 	
						currentPercentage = parseFloat(currentPercentage);
						var currentMinusLow = currentPercentage - lowInput;

						if ((currentMinusLow) < percentLow)
						{
							$("#lowWrapper" + currentId).css("background-color", "#FFA500");
							if ($("#checkForLow" + currentId).is(':checked'))
							{
								globalCloseToCurrentLow = true;
							}
						}
						else
						{
							$("#lowWrapper" + currentId).css("background-color", "#EBEBE0");
						}
					}

		 			if (
		 				   (yahooFirstLinkTitle != "") 
		 				&& (yahooFirstLinkTitle.toLowerCase().search("midday movers") == -1)
		 				)
	 					{
							console.log("yahooFirstLinkTitle.toLowerCase() is " + yahooFirstLinkTitle.toLowerCase());
			 				// then if there was currently no news stored, 
	 						if ($("#storedYahooLink" + currentId).html() == "No news")     
				 				{
									$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
	 								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
									$("#controlButton" + currentId).html("Start"); 
									newsFlag = true; 

		 						}  // or what just came back is different than what was previously stored
	 							else if (yahooFirstLinkTitle != $("#storedYahooLink" + currentId).find("a:first").text()) 
	 							{
									var storedLinkYahooTitle = $("#storedYahooLink" + currentId).find("a:first").text();
									console.log("yahooFirstLinkTitle is *" + yahooFirstLinkTitle + "*");
									console.log("storedLinkYahooTitle is *" + storedLinkYahooTitle + "*");

									$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
	 								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
									$("#controlButton" + currentId).html("Start"); 						
									newsFlag = true; 
		 						}

	 					}  // if we bring back a yahoo link 

		 			// if we bring back a marketwatch main table link 
	 				if (
	 					   (mwMainContentLink1Title != "") 
	 					&& (mwMainContentLink1Title.toLowerCase().search("midday movers") == -1)
	 					)
	 					{
							console.log("mwMainContentLink1Title.toLowerCase() is " + mwMainContentLink1Title.toLowerCase());
			 				if ($("#storedMarketWatchMainLink" + currentId).html() == "No news")
	 						{
								$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
								$("#controlButton" + currentId).html("Start"); 						 					
								newsFlag = true; 					
	 						}
	 						else if (mwMainContentLink1Title != $("#storedMarketWatchMainLink" + currentId).find("a:first").text()) 
	 						{

								var storedLinkMWTitle = $("#storedMarketWatchMainLink" + currentId).find("a:first").text(); 
								console.log("storedLinkMWTitle is *" + storedLinkMWTitle + "*");
								console.log("mwMainContentLink1Title is *" + mwMainContentLink1Title + "*");

								$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
								$("#controlButton" + currentId).html("Start"); 						 					 					
								newsFlag = true; 
	 						}

	 					}  // if we bring back a marketwatch main link  

	 				// if we bring back a marketwatch partner headlines link 
	 				if (
	 					   (mwPartnerHeadlinesLink1Title != "")  
	 					&& (mwMainContentLink1Title.toLowerCase().search("midday movers") == -1)
	 					)
	 					{
							console.log("mwMainContentLink1Title.toLowerCase() is " + mwMainContentLink1Title.toLowerCase());

							if ($("#storedMarketWatchPartnerLink" + currentId).html() == "No news")
	 						{	
								var storedLinkMWPartnerTitle = $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text(); 
								console.log("storedMarketWatchPartnerLink is *No news*");
								console.log("mwPartnerHeadlinesLink1Title is *" + mwPartnerHeadlinesLink1Title + "*");
								$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
								$("#controlButton" + currentId).html("Start"); 						 					 					
								newsFlag = true; 					
	 						}
	 						else if (mwPartnerHeadlinesLink1Title != $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text()) 
	 						{
								var storedLinkMWPartnerTitle = $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text(); 
								console.log("storedMarketWatchPartnerLink is *" + storedLinkMWPartnerTitle + "*");
								console.log("mwPartnerHeadlinesLink1Title is *" + mwPartnerHeadlinesLink1Title + "*");
								$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
								$("#controlButton" + currentId).html("Start"); 						 					 					
								newsFlag = true; 					
	 						}

	 					} // if we bring back a marketwatch partner headlines link 

	 				// if we bring back a marketwatch PR headlines link 
					if (secFilingLink1Title != "") 
					{
						if ($("#storedSECFilingLink" + currentId).html() == "No news")
	 					{
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
							console.log("storedSECFilingLink is *no news*");
							console.log("secFilingLink1Title is *" + mwPartnerHeadlinesLink1Title + "*");
							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a>");
							$("#controlButton" + currentId).html("Start"); 						 					 					
							newsFlag = true; 					
	 					}
	 					else if (secFilingLink1Title != $("#storedSECFilingLink" + currentId).find("a:first").text()) 
	 					{
							var storedSECFilingLinkTitle = $("#storedSECFilingLink" + currentId).find("a:first").text(); 
							console.log("storedSECFilingLink is " + storedSECFilingLinkTitle);
							console.log("secFilingLink1Title is *" + secFilingLink1Title + "*");
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a>");
							$("#controlButton" + currentId).html("Start"); 						 					 					
							newsFlag = true; 					
	 					}

					} // if we bring back a marketwatch or SEC

					$("#div" + currentId).css("background-color", "#ADAD85"); 

					if ($("#checkForNewNews" + currentId).is(':checked'))
					{
						if (newsFlag == false)
						{				
							var timeStamp = getCurrentTimeAMPM();
	 						$("#newsStatusLabel" + currentId).html("No new news..." + timeStamp);
							$("#newsResultsDiv" + currentId).css("background-color", "#EBEBE0"); 
	 					}
	 					else 
	 					{
		 					globalNewsFlag = true; 
	 					}
						newsFlag = false; 
					}

				console.log("------------------------------------------------------");

				});  // $.each 

				if (globalNewsFlag == true)
				{
					playAirRaidSiren();
				}

				if (globalCloseToCurrentLow == true)
				{
					playWaterSplash(); 
				}

				if (globalVolumeAlert == true)
				{
					playCarDriveBy();
				}

			}  // end of yahoo success function
	});  // end of ajax call for yahoo finance  

} // checkAllDivsForNews() 


// the timer 

function timedCount()
{

/*	timerVariable = setInterval(function () {
	checkAllDivsForNews(); 
	}, 0);     */

    checkAllDivsForNews(); 

}  // timedCount() 



// initialize function

$(function () {

startTimer(); 

// expand all divs

$("#expandAllButton").click(function(){

	expandAll();

}); // addSymbolButton.click 


// colllapse  all divs

$("#collapseAllButton").click(function(){

	collapseAll();

}); // addSymbolButton.click 



// the large "Add Symbol" button click

$("#addSymbolButton").click(function(){

	createNewNewsEntry();

}); // addSymbolButton.click 

// the large "Add Symbol" button click

$("#add_and_start_button").click(function(){

	new_symbol = $("#add_and_start_text").val().trim();

	if (new_symbol == "")
	{
		alert("Please type in a symbol");
	}
	else
	{
		createNewNewsEntry();
		highestIdNumber = $(".allDivs").last().attr('id');
		highestIdNumber = highestIdNumber.replace("div", ""); 	
		$("#symbol" + highestIdNumber).val(new_symbol)
		$("#add_and_start_text").val("");	
		document.getElementById('controlButton' + highestIdNumber).click();
	}

}); // add_and_start_button.click 


$( "#add_and_start_text" ).keyup(function(){

	symbol = $.trim($(this).val());

	if (symbol.length > 7)
	{
		alert("Check symbol for accuracy"); 
	}

	$(".symbolTextInput").each(function()
	{
		if ($(this).val() == symbol)
		{
			alert("You already have an order placed for " + symbol);
			$("#add_and_start_text").val("");
		}
	}); 

	var notChasingArray = [];
    $.each($('#notChasing').val().split(/\n/), function(i, line){
		var wordArray = line.split(/ /);
		if (wordArray[0] == symbol)
		{
			alert(line);
			$("#add_and_start_text").val("");
		}

    });

});  // when you past the order into the orderInput text field.





// the large "Start/Stop Timer" button click

$("#startStopTimerButton").click(function(){

//	if ( $(this).html() == "Start Timer" )
//	{
//		$(this).html("Stop Timer"); 
		timedCount(); 	
//	}
//	else
//	{
//		$(this).html("Start Timer"); 
//		clearInterval(timerVariable); 
//	}

}); // startStopTimerButton.click 


$("#printButton").click(function(){

	var finalString = ""; 

			$(".allDivs").each(function()
			{

				var currentId = $(this).attr("id"); 
 				var currentId = currentId.replace("div", "");
 				var symbol = $("#symbol" + currentId).val(); 
 				var orderInput = $("#orderInput" + currentId).val();
 				var indiviualNotes = $("#individualNotesText" + currentId).val();

 				finalString += "*** " + symbol + " " + orderInput + "\n" + indiviualNotes + "\n\n";
			}); 

	window.confirm(finalString); 
}); 


// the "Start" button click

$(document.body).on('click', ".controlButton", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("controlButton", ""); 

	if ($(this).html() == "Start")
	{	

		$("#newsResultsDiv" + currentId).css("background-color", "#EBEBE0");		
		$("#newsStatusLabel" + currentId).html("Status...")		
		currentSymbol = $.trim($("#symbol" + currentId).val()); 
		currentSymbol = currentSymbol.toUpperCase(); 
		if (currentSymbol == "")
		{
			alert("Please type in a symbol");
		}
		else 
		{
   			var original_symbol = currentSymbol; 
   			var symbol;
   			var positionOfPeriod; 

   			positionOfPeriod = original_symbol.indexOf(".");
   			stringLength = original_symbol.length; 

			$("#chartDiv" + currentId).html("");
			$("#storedYahooLink" + currentId).html("");
			$("#storedMarketWatchMainLink" + currentId).html("");			
			$("#storedMarketWatchPartnerLink" + currentId).html("");
			$("#storedMarketWatchPRLink" + currentId).html("");

		   	// take out the 5th "W/R/Z" for symbols like CBSTZ. 


  			if ( $("#stripLastCharacterCheckbox" + currentId).prop('checked') && (positionOfPeriod > -1) )
   			{
   				// if any stocks have a ".PD" or a ".WS", etc... 

				symbol = original_symbol.substr(0, positionOfPeriod); 
   			}
   			else if ( $("#stripLastCharacterCheckbox" + currentId).prop('checked') && (original_symbol.length == 5) )
   			{
   				symbol = original_symbol.slice(0,-1); 
   			}
    		else
   			{
				symbol = original_symbol;    		
		   	}

			storeOriginalStateOfNews(symbol, currentId); 

			original_symbol = original_symbol.replace(/\.p\./gi, ".P"); 

			$("#chartDiv" + currentId).html("<img style='max-width:100%; max-height:100%;' src='http://bigcharts.marketwatch.com/kaavio.Webhost/charts/big.chart?nosettings=1&symb=" + original_symbol + "&uf=0&type=2&size=2&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=4&rand=" + Math.random() + "&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1'>");

//			$("#startStopTimerButton").show();			
// 			timedCount();
		}
	}
	else if ($(this).html() == "Stop")
	{
		$("#newsStatusLabel" + currentId).removeClass("hasNews");
		$("#newsStatusLabel" + currentId).html("Status..."); 	
 		$(this).html("Start");
	}

});  // when the user clicks the "start" button

// clicking on the up/down arrows to expand/contract the area which 
// displays the news links 


$(document.body).on('click', ".expandContractNews", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("expandContractNews", ""); 

	if ($("#upDownArrow" + currentId).attr("src") == "images/downArrow_smaller.jpg")
	{
		$("#upDownArrow" + currentId).attr("src", "images/upArrow_smaller.jpg")
		$("#div" + currentId).css("height", "243px");
	}
	else
	{
		$("#upDownArrow" + currentId).attr("src", "images/downArrow_smaller.jpg")
		$("#div" + currentId).css("height", "28px"); 	 	
	}	
});  // on clicking expand/contract news 


// clicking on the circular button will check for new news & refresh chart. 

$(document.body).on('click', ".refresh", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("refresh", ""); 

// 	if ($("#controlButton" + currentId).html() == "Stop")
//	{
		checkIndividualDivForNews(currentId); 
//	}
});  // end of click refresh button


$(document.body).on('click', ".closeNewsEntry", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("closeDiv", ""); 

	$("#div" + currentId).remove();    

});  // end of close news "X" click function

$(document.body).on('click', ".importantDiv", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("importantDiv", ""); 

    if ($("#importantDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
    {  
			$("#importantDiv" + currentId).css("background-color", "rgb(255, 0, 0)"); 
    } 
    else 
    {
    		$("#importantDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    }	
});  // on clicking important box with the "!"

$(document.body).on('click', ".offeringDiv", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("offeringDiv", ""); 

    if ($("#offeringDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
    {  
			$("#offeringDiv" + currentId).css("background-color", "rgb(0, 249, 255)"); 
    } 
    else 
    {
    		$("#offeringDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    }	
});  // on clicking offering box with the "O"

$(document.body).on('click', ".highRiskDiv", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("highRiskDiv", ""); 

    if ($("#highRiskDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
    {  
			$("#highRiskDiv" + currentId).css("background-color", "rgb(0, 255, 0)"); 
    } 
    else 
    {
    		$("#highRiskDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    }	
});  // on clicking high risk box with the "H"

$(document.body).on('click', ".reverseSplitDiv", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("reverseSplitDiv", ""); 

    if ($("#reverseSplitDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
    {  
			$("#reverseSplitDiv" + currentId).css("background-color", "rgb(255, 165, 0)"); 
    } 
    else 
    {
    		$("#reverseSplitDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    }	
});  // on clicking offering box with the "O"

$(document.body).on('click', ".checkPK", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("checkPK", ""); 

 	if ($(this).is(':checked'))
 	{
		$("#symbol" + currentId).css("background-color", "rgb(255,192,203)"); 
		$("#orderInput" + currentId).css("background-color", "rgb(255,192,203)"); 
	}
	else
	{
		$("#symbol" + currentId).css("background-color", "rgb(255,255,255)"); 
		$("#orderInput" + currentId).css("background-color", "rgb(255,255,255)"); 
	}

});  // Highlight pink sheet orders pink.

$(document.body).on('click', ".checkBB", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("checkBB", ""); 

 	if ($(this).is(':checked'))
 	{
		$("#symbol" + currentId).css("background-color", "rgb(255, 207, 158)"); 
		$("#orderInput" + currentId).css("background-color", "rgb(255, 207, 158)"); 
 	}
 	else
 	{
		$("#symbol" + currentId).css("background-color", "rgb(255, 255, 255)"); 
		$("#orderInput" + currentId).css("background-color", "rgb(255, 255, 255)"); 
 	}
});  // Highlight BB orders orange.

$(document.body).on('click', ".copyOrderToClipboard", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("copyOrderToClipboard", ""); 

 	$("#fullOrder" + currentId).val($("#symbol" + currentId).val() + " " + $("#orderInput" + currentId).val());

  	var copyTextarea = $("#fullOrder" + currentId);
console.log("Full order's value is " + copyTextarea.val());
  	copyTextarea.select();
  	try 
  	{
	    var successful = document.execCommand('copy');
	    var msg = successful ? 'successful' : 'unsuccessful';
		console.log('Copying text command was ' + msg);
	    alert($("#fullOrder" + currentId).val() + " succesfully copied");
  	} 
  	catch (err) 
  	{
	    alert('Order did not succesfully copy');
    	console.log('Order did not succesfully copy');
  	}

	writeTradeStamp(currentId);

});  // Copy current order to clipboard 


$(document.body).on('paste', ".orderInput", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("orderInput", ""); 
	var percentage;
	var orderStub;
	var symbol;

	setTimeout(
		function() 
		{
		    orderStub = $.trim($("#orderInput" + currentId).val());
    		var orderStubSplit = orderStub.split(" ");
    		var percentage = orderStubSplit[4];
    		symbol = orderStubSplit[0];

    		percentage = percentage.toString().replace(/\(/g, ""); 
    		percentage = percentage.toString().replace(/\)/g, ""); 
    		percentage = percentage.toString().replace(/\%/g, ""); 

			$(".symbolTextInput").each(function()
			{
				if ($(this).val() == symbol)
				{
					alert("You already have an order placed for " + symbol);
					$("#orderInput" + currentId).val("");
				}
			}); 

/*
			// prompt to check for volume.  not necessary for now 
    		if (percentage < 35.00)
    		{
				if (confirm(symbol + ': Percentage is ' + percentage + '. Do you want to check for volume?')) 
				{
					$("#checkVolume" + currentId).prop( "checked", true );
					$("#avgVolume" + currentId).val("80,000");
				} 
				else 
				{
    			// Do nothing!
				}
			}
*/

    		if (percentage >= 34.00)
    		{
				$("#orderInput" + currentId).css("background-color", "#FFFFFF"); 
				$("#symbol" + currentId).css("background-color", "#FFFFFF");     			
    		}
    		else 
    		{
				$("#orderInput" + currentId).css("background-color", "#CCE6FF"); 
				$("#symbol" + currentId).css("background-color", "#CCE6FF");
				$("#playVolumeSound" + currentId).prop('checked', true); 
				$("#turnVolumeRed" + currentId).prop('checked', true);
    		}

	     	calcPrevClose(currentId);    	
    		orderStub = orderStub.replace(/(.*)BUY/, "BUY"); 
			$("#orderInput" + currentId).val(orderStub);    	

			if ($.trim($("#symbol" + currentId).val()) == "")
			{
				$("#symbol" + currentId).val(symbol);
				$("#controlButton" + currentId).click();
			}

			writeTradeStamp(currentId);

		}, 200
		);

});  // when you past the order into the orderInput text field.

$(document.body).on('keyup', ".orderInput", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("orderInput", ""); 

//	orderString = $("#orderInput" + currentId).val();

	var orderStub = $.trim($(this).val());
    var orderStubSplit = orderStub.split(" ");
//    var secondWord = orderStubSplit[1];
    var firstWord = orderStubSplit[0];

//    if (secondWord == "BUY")
//    {
/*     	calcPrevClose(currentId);    	
    	orderString = orderString.replace(/(.*)BUY/, "BUY"); 
		$("#orderInput" + currentId).val(orderString);    	*/
//    }
    //else 
    //{
    	if (firstWord == "BUY")
    	{
    		reCalcOrderStub(currentId); 
    	}
    //}

// 	reCalcOrderStub(currentId); 

});  // when you past the order into the orderInput text field.

$(document.body).on('keyup', ".symbolTextInput", function(){
       
	currentId = $(this).attr("id"); 
	currentId = currentId.replace("symbol", ""); 

	currentSymbol = $("#symbol" + currentId).val();

	if (currentSymbol.length > 7)
	{
		alert("Check symbol for accuracy"); 
	}

});  // when you past the order into the orderInput text field.


$(document.body).on('keyup', ".avgVolume", function(){
       
	currentId = $(this).attr("id"); 
	currentId = currentId.replace("avgVolume", ""); 

	avgVolume = $("#avgVolume" + currentId).val();
	avgVolume = avgVolume.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	$(this).val(avgVolume);

//	alert("number is " + avgVolume);

/*
	if (currentSymbol.length > 7)
	{
		alert("Check symbol for accuracy"); 
	}  */

});  // when you past the order into the orderInput text field.


});  // end of init function