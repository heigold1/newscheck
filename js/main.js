

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
        var hours = date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

        time = hours.toString() + minutes.toString();
        time = parseInt(time); 
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
  var timeArray = presentTime.split(/[:]+/)
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

function playCancelTrades(){
  var audioRailroad = new Audio('./wav/cancel-existing-trades.mp3');
  audioRailroad.play();
}

function playSymbolNotFoundInList(){
  var audioRailroad = new Audio('./wav/symbol_not_found_in_list.wav');
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

function playCancelHighRiskTrades(){
	var carDriveBy = new Audio('./wav/cancel-high-risk-trades.mp3');
	carDriveBy.play();
}

function playOrderHasHaltedStock(){
	var playHaltedStock = new Audio('./wav/order-has-halted-stock.wav');
	playHaltedStock.play();
}

function playBigCharts(){
	var playHaltedStock = new Audio('./wav/big-charts-mild.wav');
	playHaltedStock.play();
}

function playFailedToGetPreviousClose(){
	var playFailedToGetPreviousClose = new Audio('./wav/failed-to-get-previous-close.mp3');
	playFailedToGetPreviousClose.play(); 
}

function playCheckTradeHalts(){
	var playCheckTradeHalts = new Audio('./wav/check-trade-halts.mp3');
	playCheckTradeHalts.play(); 
}

function checkSecond(sec) {
  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
  if (sec < 0) {sec = "59"};
  return sec;
}

// Grab the previous close price from the order string 

function getPreviousCloseString(currentId)
{
		var orderStub = $("#orderInput" + currentId).val();
		var symbol = $("#symbol" + currentId).val();  

		try {
				var orderStringSplit = orderStub.split(" "); 
  			var previousCloseString = orderStringSplit[5]; 
  			previousCloseString = parseFloat(previousCloseString.replace("$", "")); 

  			return previousCloseString; 

		} catch (error) {
  		console.error("Failed to get previous close", error.message);
			playFailedToGetPreviousClose(); 
			return 0.00; 
		}
}

function calculateBigChartsDifference(currentId, bigChartsPrice)
{
		var orderStub = $("#orderInput" + currentId).val(); 
		var orderStubSplit = orderStub.split(" ");
		var price = orderStubSplit[2];
		price = parseFloat(price.replace("$", "")); 
		bigChartsPrice = parseFloat(bigChartsPrice); 

		var difference = ((bigChartsPrice - price)/bigChartsPrice)*100; 

		difference = difference.toFixed(2); 

		return difference; 
}


function writeTradeStamp(id, type = "") 
{

	var orderStub = $("#orderInput" + id).val();
	var orderStubSplit = orderStub.split(" ");
	var price = orderStubSplit[2];
	var percentage = orderStubSplit[3];
	var currentTime = getCurrentTimeAMPM();

	var notes = $("#individualNotesText" + id).val();
	notes = notes + price + " " + percentage + " " + currentTime + " " + type + " -- ";

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
			$("#div" + currentId).css("height", "270px");
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

	    $("#orderInput" + currentId).val("BUY " + numSharesWithCommas + " $" + newCalculatedPrice + " (" + thePercentage.toFixed(2) + "%) -- " + orderStubSplit[5] + orderType); 

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
	newNewsEntry += "   <div id='cikNumber" + newIdNumber + "' class='cikNumber'></div>"; 
	newNewsEntry += "   <div id='recovery" + newIdNumber + "' class='recovery'></div>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div class='lowInfo'>"; 
	newNewsEntry += "	<input id='lowValue" + newIdNumber + "' class='lowValue' value='0.0'>";
	newNewsEntry += "		<div id='lowWrapper" + newIdNumber + "' class='lowWrapper'>"; 
	newNewsEntry += "		&nbsp;<span id='low" + newIdNumber + "' class='low'></span>"; 
	newNewsEntry += "		</div>";
	newNewsEntry += "		<input id='lowInput" + newIdNumber + "' class='lowInput' value='3'>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div class='checkForLowWrapper'>";
	newNewsEntry += "&nbsp;<input type='checkbox' id='checkForLow" + newIdNumber + "' class='checkForLow' checked>";
	newNewsEntry += "	</div>";
  newNewsEntry += "&nbsp;<div class='bigChartsInfo'>"; 
  newNewsEntry += "&nbsp;<input type='checkbox' id='checkForBigCharts" + newIdNumber + "' class='checkForBigCharts' checked>"; 
	newNewsEntry += "  <div id='bigChartsWrapper" + newIdNumber+ "' class='bigChartsWrapper'>"; 
  newNewsEntry += "		 &nbsp;<span id='bigChartsPercentageMain" + newIdNumber + "' class='bigChartsPercentageMain'></span>"; 
	newNewsEntry += "		</div>"; 
	newNewsEntry += "</div>"; 
	newNewsEntry += "	<div class='checkForNewNewsWrapper'>"; 
 	newNewsEntry += "		&nbsp;<input type='checkbox' id='checkForNewNews" + newIdNumber + "' class='checkForNewNews' checked>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div class='controlButtonDiv'>"; 
	newNewsEntry += "		<button id='controlButton" + newIdNumber + "' class='controlButton' type='button'>Start</button>"; 
	newNewsEntry += " 	</div>"; 
	newNewsEntry += " 	<div id='noNewsDiv" + newIdNumber + "' class='noNewsDiv' tabindex='-1'>";  
	newNewsEntry += " 			<span class='noNewsSpan' tabindex='-1'>NN</span>"; 
  newNewsEntry += "		</div>"; 
	newNewsEntry += "	<div id='haltDiv" + newIdNumber + "' class='haltDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='haltSpan' tabindex='-1'>H</span>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div id='newsResultsDiv" + newIdNumber + "' class='newsResultsDiv' tabindex='-1'>"; 
	newNewsEntry += " 		<span id='newsStatusLabel" + newIdNumber + "' class='newsStatusLabel' tabindex='-1'>";
	newNewsEntry += "			Status...</span>"; 
	newNewsEntry += " 	</div>"; 
	newNewsEntry += "	<div id='expandContractNews" + newIdNumber + "' class='expandContractNews' tabindex='-1'> "; 
	newNewsEntry += "		<img id='upDownArrow" + newIdNumber + "' class='arrowImages' src='images/downArrow_smaller.jpg' tabindex='-1'> "; 
  newNewsEntry += "	</div> "; 

/*
Not using the individual refresh anymore but I'll keep it here just in case 
	newNewsEntry += "	<div id='refresh" + newIdNumber + "' class='refresh' tabindex='-1'>"; 
	newNewsEntry += "		<img class='refreshImage' src='images/refresh_smaller.png' tabindex='-1'>"; 
	newNewsEntry += "	</div>"; 
*/
	newNewsEntry += "   <div id='closeDiv" + newIdNumber + "' class='closeNewsEntry' tabindex='-1'>"; 
	newNewsEntry += "		<span class='closeNewsX' tabindex='-1'>X</span>"; 
	newNewsEntry += "  	</div>"; 
	newNewsEntry += "	<div class='turnVolumeRedWrapper'>";
 	newNewsEntry += "		&nbsp;<input type='checkbox' id='turnVolumeRed" + newIdNumber + "' class='turnVolumeRed'>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div class='playVolumeSoundWrapper'>";
 	newNewsEntry += "		&nbsp;<input type='checkbox' id='playVolumeSound" + newIdNumber + "' class='playVolumeSound' >";
	newNewsEntry += "   </div>";
	newNewsEntry += " 	<div id='volumeAmountDiv" + newIdNumber + "' class='volumeAmountDiv' tabindex='-1'>";
	newNewsEntry += "	 	<input id='volume30DayInput" + newIdNumber + "' class='volume30DayInput' value='0'>";
	newNewsEntry += " 		<input id='volumeRatio" + newIdNumber + "' class='volumeRatio' value='4.5'>";
	newNewsEntry += "		<span id='volumeAmountSpan" + newIdNumber + "' class='volumeAmountSpan' tabindex='-1'></span>";
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div id='importantDiv" + newIdNumber + "' class='importantDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='importantSpan' tabindex='-1'>!</span>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div id='highRiskValueDiv" + newIdNumber + "' class='highRiskValueDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span id='highRiskValueSpan" + newIdNumber + "' class='highRiskValueSpan' tabindex='-1'></span>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div id='lowVolumeDiv" + newIdNumber+ "' class='lowVolumeDiv' tabindex='-1'>";
	newNewsEntry += "		<span class='lowVolumeSpan' tabindex='-1'>L</span>"; 
	newNewsEntry += "	</div>";
	newNewsEntry += "	<div id='offeringDiv" + newIdNumber + "' class='offeringDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='offeringSpan' tabindex='-1'>O</span>";
	newNewsEntry += "	</div>";
	newNewsEntry += "	<input id='offerPrice" + newIdNumber + "' class='offerPrice'>";
	newNewsEntry += " 	<div class='newsContainer'>"; 
	newNewsEntry += "		<div class='symbolCheckBox' tabindex='-1'>"
	newNewsEntry +=	"			<span class='symbolCheckBoxLabel'>" 
	newNewsEntry += "				<input type='checkbox' id='stripLastCharacterCheckbox" + newIdNumber + "' value='1' checked='checked'>Trunc 'W/R/Z', '.WS' '.PD''"; 
	newNewsEntry += "			</span> "; 
	newNewsEntry += "			&nbsp;";
	newNewsEntry += "			<input type='checkbox' class='checkPK' id='checkPK" + newIdNumber + "' value='1'>PK";
	newNewsEntry += "			<input type='checkbox' class='checkBB' id='checkBB" + newIdNumber + "' value='1'>BB"; 
	newNewsEntry += "			<button class='copyOrderToClipboard' id='copyOrderToClipboard" + newIdNumber + "' type='button'>Copy</button>";
	newNewsEntry += " 		<div class='downButtonDiv'>"; 
	newNewsEntry += "				<button id='downButton" + newIdNumber + "' class='downButton' type='button'>D</button>"; 
	newNewsEntry += "			</div>"; 
	newNewsEntry += "			<div class='doubleButtonDiv'>"; 
	newNewsEntry += "				<button id='doubleButton" + newIdNumber + "' class='doubleButton' type='button'>DOU</button>"; 
	newNewsEntry += "			</div>"; 
	newNewsEntry += "			&nbsp;<div class='lowSeparation'>"
	newNewsEntry += "				<button id='lowSeparation" + newIdNumber + "' class='lowSeparation' type='button'>L</button>"; 
	newNewsEntry += "			</div>";
	newNewsEntry += "			<div class='bigChartsSeparation'>"; 
  newNewsEntry += "				<button id='bigChartsSeparation" + newIdNumber + "' class='bigChartsSeparation' type='button'>B</button>"; 
	newNewsEntry += "			</div>";
//	newNewsEntry += "			&nbsp; <button class='emailOrder' id='emailOrder" + newIdNumber + "' type='button'>Email</button>"; 
	newNewsEntry += "           &nbsp; <button class='bigCharts' id='getBigCharts" + newIdNumber + "' type='button'>BigChrt</button>"; 
  newNewsEntry += "     <span id='bigchartsLink" + newIdNumber + "' tabIndex='-1'>..</span> "	; 
	newNewsEntry += "           $<span class='bigChartsLast' id='bigChartsLast" + newIdNumber + "' tabindex='-1'>0.0</span> (<span class='bigChartsPercentage' +  id='bigChartsPercentage" + newIdNumber + "' tabindex='-1'>0.0</span>%)"; 
	newNewsEntry += "           <span class='bigChartsTime' id='bigChartsTime" + newIdNumber + "' tabindex='-1'></span>" 	
	newNewsEntry += "		</div>"; 
	newNewsEntry += "		<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += " 			<span class='storedLinkLabel' tabIndex='-1'>Yahoo:</span> "; 
	newNewsEntry += " 			<div id='storedYahooLink" + newIdNumber + "' class='storedLink' tabIndex='-1'></div> "; 
	newNewsEntry += " 		</div> "; 
	newNewsEntry += " 		<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += "			<span class='storedLinkLabel' tabindex='-1'>Seeking Alpha:</span> "; 
	newNewsEntry += " 			<div id='storedMarketWatchMainLink" + newIdNumber + "' class='storedLink' tabindex='-1'></div> "; 
	newNewsEntry += " 		</div> "; 
	newNewsEntry += " 		<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += " 			<span class='storedLinkLabel' tabindex='-1'>Street Insider:</span> "; 
	newNewsEntry += " 			<div id='storedMarketWatchPartnerLink" + newIdNumber + "' class='storedLink' tabindex='-1'></div> "; 
	newNewsEntry += " 		</div> 	"; 
	newNewsEntry += "	 	<div class='newsLinks' tabindex='-1'> "; 
	newNewsEntry += "			<span class='storedLinkLabel' tabindex='-1'>SEC Filing Link:</span> "; 
	newNewsEntry += " 			<div id='storedSECFilingLink" + newIdNumber + "' class='storedLink' tabindex='-1'></div> "; 
	newNewsEntry += "  		</div> 	"; 
	newNewsEntry += "	 	<div class='volumeNotesDiv' tabindex='-1'>";
	newNewsEntry += "			<span class='volumeNotesLabel' tabindex='-1'>Notes:</span>";
	newNewsEntry += "			&nbsp;<input type='text' id='volumeNotesText" + newIdNumber + "' class='volumeNotesText'>";
	newNewsEntry += "		  <button id='tierOneButton" + newIdNumber + "' type='button' class='tierOneButton'>1</button>"; 
	newNewsEntry += "		  <button id='tierTwoButton" + newIdNumber + "' type='button' class='tierTwoButton'>2</button>"; 
	newNewsEntry += "		  <button id='tierThreeButton" + newIdNumber + "' type='button' class='tierThreeButton'>3</button>"; 
	newNewsEntry += "	 	</div>";
	newNewsEntry += "	 	<div class='individualNotesDiv' tabindex='-1'>";
	newNewsEntry += "			<span class='individualNotesLabel' tabindex='-1'>Notes:</span>";
	newNewsEntry += "			&nbsp;<textarea id='individualNotesText" + newIdNumber + "' class='individualNotesText'></textarea>";
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

function storeOriginalStateOfNews(originalSymbol, modifiedSymbol, currentId, previousCloseString){

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
var checkSec = $("#checkbox-sec").is(":checked")?"1":"0";
var cikNumber = $("#cikNumber" + currentId).html(); 

	// set the status bar 

	$("#newsStatusLabel" + currentId).html("Looking up symbol...")

	$.ajax({
	   	url: "newsproxy.php",
	   	data: {modifiedSymbol: modifiedSymbol,
	   		which_website: "yahoo", 
	   		host_name: "finance.yahoo.com"} , 
		async: false,	   		
	   	dataType: 'json',
	   	success:  function (data) {
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
  		}
	});  // end of ajax call for yahoo finance   

 	$.ajax({
	    url: "newsproxy.php",
	    data: {modifiedSymbol: modifiedSymbol,
	    			originalSymbol: originalSymbol, 
						previousCloseString: previousCloseString, 
	    	   which_website: "marketwatch", 
	    	   host_name: "www.marketwatch.com",
	    	 	 checkSec: checkSec,
	    	 	 cikNumber: cikNumber} , 
		async: false,	    	   
	    dataType: 'json',
	    success:  function (data) {

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

				$("#bigchartsLink" + currentId).html("<a target='_blank' href='https://digital.fidelity.com/prgw/digital/research/quote/dashboard/summary?symbol=" + originalSymbol + "&rand=" + Math.random() + "'>..</a>"); 

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
			var checkSec = $("#checkbox-sec").is(":checked")?"1":"0";

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
		    	   	which_website: "marketwatch",
		    	   	checkSec: checkSec} , 
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

	 			// if we bring back a yahoo link 
	 			if (yahooFirstLinkTitle != "")
 				{
	 				// then if there was currently no news stored, 
 					if ($("#storedYahooLink" + currentId).html() == "No news")     
		 				{
							$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a> - " + getCurrentTimeAMPM());
							$("#controlButton" + currentId).html("Start"); 
							newsFlag = true; 

	 					}  // or what just came back is different than what was previously stored
 						else if (yahooFirstLinkTitle != $("#storedYahooLink" + currentId).find("a:first").text()) 
 						{
							$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a> - " + getCurrentTimeAMPM());
							$("#controlButton" + currentId).html("Start"); 						
							newsFlag = true; 
	 					}

 				}  // if we bring back a yahoo link 

	 			// if we bring back a marketwatch main table link 
 				if (mwMainContentLink1Title != "")
 				{
	 				if ($("#storedMarketWatchMainLink" + currentId).html() == "No news")
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - Seeking Alpha</a> - " + getCurrentTimeAMPM());
						$("#controlButton" + currentId).html("Start"); 						 					
						newsFlag = true; 					
 					}
 					else if (mwMainContentLink1Title != $("#storedMarketWatchMainLink" + currentId).find("a:first").text()) 
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - Seeking Alpha</a> - " + getCurrentTimeAMPM());
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 
 					}

 				}  // if we bring back a marketwatch main link  

 				// if we bring back a marketwatch partner headlines link 
 				if (mwPartnerHeadlinesLink1Title != "")
 				{
					if ($("#storedMarketWatchPartnerLink" + currentId).html() == "No news")
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - Street Insider</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (mwPartnerHeadlinesLink1Title != $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text()) 
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - Street Insider</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}

 				} // if we bring back a marketwatch partner headlines link 

 				// if we bring back a SEC headlines link 
				if (secFilingLink1Title != "") 
				{
					if ($("#storedSECFilingLink" + currentId).html() == "No news")
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a> - " + getCurrentTimeAMPM());
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (secFilingLink1Title != $("#storedSECFilingLink" + currentId).find("a:first").text()) 
 					{
						$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a> - " + getCurrentTimeAMPM());
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
			$("#chartDiv" + currentId).html("<img style='max-width:100%; max-height:100%;' src='https://api.wsj.net/api/kaavio/charts/big.chart?nosettings=1&symb=" + originalSymbol + "&uf=0&type=2&size=2&style=320&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=4&rand=" + Math.random() + "&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1'>");

		} // if (currentSymbol != "")

} // checkIndividualDivForNews()


// go through each news div and check for any new news

function checkAllDivsForNews()
{

	var symbolArray =  [];
	var symbolNotFound = false; 
	var checkSec = $("#checkbox-sec").is(":checked")?"1":"0";

	$(".allDivs").each(function(){

		currentId = $(this).attr("id"); 
		var currentId = currentId.replace("div", "");
		var checkNews = $("#checkForNewNews" + currentId).is(':checked')? "1": "0";
		var newsLabel = $("#newsStatusLabel" + currentId).html();
		var textFound = newsLabel.search("Looking up symbol"); 

		if ((checkNews == 1) && (textFound != -1))
		{
			symbolNotFound = true; 
		}
	}); // allDivs.each()

	if (symbolNotFound == true)
	{
		playSymbolNotFoundInList(); 
		return; 	
	}

	$(".allDivs").each(function(){

		var modifiedSymbol; 
		var currentId = $(this).attr("id"); 
 		var currentId = currentId.replace("div", "");
 		var checkNews = $("#checkForNewNews" + currentId).is(':checked')? "1": "0";
		var lowValue = $.trim($("#lowValue" + currentId).val()); 
		var lowValuePercentage = $("#low" + currentId).html(); 
		var cikNumber= $.trim($("#cikNumber" + currentId).html()); 
    var checkBigCharts; 

		// We don't start checking BigCharts until 6:50 AM, 650 
		if (getCurrentTime() > 700)
		{
    	checkBigCharts = $("#checkForBigCharts" + currentId).is(':checked')? "1": "0";
    }
    else 
    {
    	checkBigCharts = 0; 
    }

    var previousCloseString = getPreviousCloseString(currentId); 
		var originalSymbol = $.trim($("#symbol" + currentId).val()); 
		var offerPrice = $.trim($("#offerPrice" + currentId).val());
		var positionOfPeriod = originalSymbol.indexOf(".");	
		var orderStub = $("#orderInput" + currentId).val();		
		var volumeNotes = $("#volumeNotesText" + currentId).val();
		var individualNotes = $("#individualNotesText" + currentId).val();

    if (positionOfPeriod > -1)
    {
        // if any stocks have a ".PD" or a ".WS", etc... 
        modifiedSymbol = originalSymbol.substr(0, positionOfPeriod); 
    }
		else if (originalSymbol.length == 5)
		{
			modifiedSymbol = originalSymbol.slice(0,-1); 
		}
		else
		{
			modifiedSymbol = originalSymbol;    		
		}

		symbolArray.push({
			"modifiedSymbol": modifiedSymbol, 
			"originalSymbol" : originalSymbol,
			"offerPrice" : offerPrice, 
			"checkNews" : checkNews, 
			"idNumber": currentId, 
			"lowValue": lowValue, 
			"lowPercentage" : lowValuePercentage, 
			"checkBigCharts": checkBigCharts, 
			"cikNumber": cikNumber, 
			"previousCloseString": previousCloseString, 
			"orderStub": orderStub, 
			"volumeNotes": volumeNotes, 
			"individualNotes": individualNotes 
		});

	}); // allDivs.each()




	var globalNewsFlag = false;
	var globalCloseToCurrentLow = false;
	var globalCancelHighRiskTrades = false; 
	var globalVolumeAlert = false;
	var globalBigChartsAlert = false; 

console.log("************************************"); 
console.log("symbolArray going to the back end is:");
console.log(symbolArray); 

	$.ajax({
   		url: "newsproxy.php",
			data: {symbols: JSON.stringify(symbolArray), 
						 checkSec: checkSec}, 
		async: true,	   		
			dataType: 'json',
			success:  function (data) {

				if ((data.newHalts == 1) && $("#checkbox-check-halts").is(":checked"))
				{
						playCheckTradeHalts(); 
				}

				var haltSymbolList = data.halt_symbol_list; 

				delete data.haltstring;
				delete data.halt_symbol_list; 

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

					var currentSymbol = $("#symbol" + currentId).val(); 

					// here we check if the current symbol (with no news and the "halt" button not checked) matches any halted symbols 
					// for non-news stocks, then we need to alert. 

					if (
						haltSymbolList.includes(currentSymbol) && 
						($("#noNewsDiv" + currentId).css("background-color") == "rgb(255, 161, 161)" ) && 
						 ($("#haltDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
						)
					{
						playOrderHasHaltedStock(); 
						$("#div" + currentId).css("background-color", "rgb(255, 0, 0)"); 
					}

					if (item.hasOwnProperty('yahoo'))
					{
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

					if (item.statistics && item.statistics !== "undefined") {
					    statisticsData = JSON.parse(item.statistics);
					} else {
					    console.warn("Skipping item with no statistics:", item);
					    return; // or continue;
					}

   				currentVolume = statisticsData.currentVolume; 
   				averageVolume = statisticsData.averageVolume; 
   					
   				bigChartsPercentage = statisticsData.bigChartsPercentage; 
   				bigChartsPrice = statisticsData.bigChartsPrice; 


   				if (bigChartsPercentage == "ERR")
   				{
   					bigChartsPercentage = "GT 0"; 
   				}

   				averageVolume30Day = parseInt($("#volume30DayInput" + currentId).val().toString().replace(/\,/g,""));
   				volumeRatio = parseFloat($("#volumeRatio" + currentId).val());
   				percentLow = parseFloat(statisticsData.percentLow); 
   				lowValue = parseFloat(statisticsData.lowValue);

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
							}
							else
							{	
								$("#volumeAmountDiv" + currentId).css("background-color", "#EBEBE0");	
							}
						}
						else
						{
							$("#volumeAmountDiv" + currentId).css("background-color", "#EBEBE0");	
						}

						if ($("#playVolumeSound" + currentId).is(':checked'))
						{
							if (parseInt(currentVolume) > (averageVolume30Day*volumeRatio))
							{
								globalVolumeAlert = true;
							}
						}

						var dateObj = new Date(); 
						var hours = dateObj.getHours(); 
						var minutes = dateObj.getMinutes();
						if (minutes < 10)
						{
							minutes = "0" + minutes.toString(); 
						}
						var currentTime = hours.toString().concat(minutes); 
						currentTime = parseInt(currentTime); 

						var highRiskValue = parseInt(document.getElementById('highRiskValueSpan' + currentId).innerHTML);

						var currentPercentage = match[1];
						currentPercentage = currentPercentage.replace("%", ""); 	
						currentPercentage = parseFloat(currentPercentage);

						if ( 
									($("#highRiskValueDiv" + currentId).css("background-color") === "rgb(0, 255, 0)")
 									&& (currentTime > 800)
							)
						{
							  globalCancelHighRiskTrades = true; 
						}

						var lowInput = parseFloat($("#lowInput" + currentId).val());
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

						var bigChartsDifference = calculateBigChartsDifference(currentId, bigChartsPrice); 

						// We don't start checking BigCharts until 7:00 AM

						var orderStub = $("#orderInput" + currentId).val();
						var orderStringSplit = orderStub.split(" "); 
  					var previousClose = orderStringSplit[5]; 
  					previousClose = parseFloat(previousClose.replace("$", "")); 

						if (getCurrentTime() > 652)
						{
								if ($("#checkForBigCharts" + currentId).is(':checked'))
								{
									if (bigChartsPercentage == "NF")
   								{
   				  				$("#bigChartsPercentageMain" + currentId).html("NOT FOUND"); 
   								}
   								else
   								{
											var currentBigChartsString = $("#bigChartsPercentageMain" + currentId).html(); 
											var currnentBigChartsValues = currentBigChartsString.split(" "); 
											var currentBigChartsPrice = currnentBigChartsValues[0]; 
											currentBigChartsPrice = currentBigChartsPrice.replace("$", ""); 
											currentBigChartsPrice = parseFloat(currentBigChartsPrice); 

											if ((bigChartsPrice < currentBigChartsPrice) || isNaN(currentBigChartsPrice))
											{
   												$("#bigChartsPercentageMain" + currentId).html("$" + bigChartsPrice + " (" + bigChartsPercentage + "%) (" + bigChartsDifference + ")"); 												
											}
   								}

   								if ((previousClose < 1.00) && ((bigChartsDifference < 11.5) && (bigChartsDifference > 0))) 
   								{
   									$("#bigChartsWrapper" + currentId).css("background-color", "#FFA1A1");
										globalBigChartsAlert = true;
   								}
   								else if (((bigChartsDifference) < 9.50)	&& (bigChartsDifference > 0))
									{
										$("#bigChartsWrapper" + currentId).css("background-color", "#FDC7C7");
										globalBigChartsAlert = true;
									}
									else
									{
										$("#bigChartsWrapper" + currentId).css("background-color", "#EBEBE0");
									}
								}
								else
								{
									$("#bigChartsWrapper" + currentId).css("background-color", "#EBEBE0");
   								$("#bigChartsPercentageMain" + currentId).html(""); 
								}
						}

					}

		 			if (
		 				   (yahooFirstLinkTitle != "") 
		 				&& (yahooFirstLinkTitle.toLowerCase().search("midday movers") == -1)
		 				)
	 					{
			 				// then if there was currently no news stored, 
	 						if ($("#storedYahooLink" + currentId).html() == "No news")     
				 				{
									$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
	 								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a> - " + getCurrentTimeAMPM());
									if ($("#controlButton" + currentId).html().toString() == 'Stop')
									{
// 									 	$("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
									}	
									$("#controlButton" + currentId).html("Start"); 
									newsFlag = true; 

		 						}  // or what just came back is different than what was previously stored
	 							else if (yahooFirstLinkTitle != $("#storedYahooLink" + currentId).find("a:first").text()) 
	 							{
									var storedLinkYahooTitle = $("#storedYahooLink" + currentId).find("a:first").text();

									$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
	 								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a> - " + getCurrentTimeAMPM());
									if ($("#controlButton" + currentId).html().toString() == 'Stop')
									{
//									 	$("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
									}	
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
			 				if ($("#storedMarketWatchMainLink" + currentId).html() == "No news")
	 						{
								$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - Seeking Alpha</a> - " + getCurrentTimeAMPM());
								if ($("#controlButton" + currentId).html().toString() == 'Stop')
								{
//								 	$("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
								}							
								$("#controlButton" + currentId).html("Start"); 						 					
								newsFlag = true; 					
	 						}
	 						else if (mwMainContentLink1Title != $("#storedMarketWatchMainLink" + currentId).find("a:first").text()) 
	 						{

								var storedLinkMWTitle = $("#storedMarketWatchMainLink" + currentId).find("a:first").text(); 

								$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - Seeking Alpha</a> - " + getCurrentTimeAMPM());
								if ($("#controlButton" + currentId).html().toString() == 'Stop')
								{
//								 	$("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
								}							
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
							if ($("#storedMarketWatchPartnerLink" + currentId).html() == "No news")
	 						{	
								var storedLinkMWPartnerTitle = $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text(); 
								$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - Street Insider</a> - " + getCurrentTimeAMPM());
								if ($("#controlButton" + currentId).html().toString() == 'Stop')
								{
//									 $("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
								}							
								$("#controlButton" + currentId).html("Start"); 						 					 					
								newsFlag = true; 					
	 						}
	 						else if (mwPartnerHeadlinesLink1Title != $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text()) 
	 						{
								var storedLinkMWPartnerTitle = $("#storedMarketWatchPartnerLink" + currentId).find("a:first").text(); 
								$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
								$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - Street Insider</a> - " + getCurrentTimeAMPM());
								if ($("#controlButton" + currentId).html().toString() == 'Stop')
								{
//								 	$("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
								}							
								$("#controlButton" + currentId).html("Start"); 						 					 					
								newsFlag = true; 					
	 						}

	 					} // if we bring back a marketwatch partner headlines link 

	 				// if we bring back a SEC link 
					if ((secFilingLink1Title != "") && (secFilingLink1Title != "NO SEC"))
					{
						if ($("#storedSECFilingLink" + currentId).html() == "No news")
	 					{
							$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a>");
							if ($("#controlButton" + currentId).html().toString() == 'Stop')
							{
//								 $("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
							}							
							$("#controlButton" + currentId).html("Start"); 						 					 					
							newsFlag = true; 					
	 					}
	 					else if (secFilingLink1Title != $("#storedSECFilingLink" + currentId).find("a:first").text()) 
	 					{
							var storedSECFilingLinkTitle = $("#storedSECFilingLink" + currentId).find("a:first").text(); 
							$("#newsResultsDiv" + currentId).css("background-color", "#FFA1A1"); 
							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + secFilingLink1 + "'>" + secFilingLink1Title + " - SEC</a>");
							if ($("#controlButton" + currentId).html().toString() == 'Stop')
							{
//								 $("#newsStatusLabel" + currentId).append(" - " + getCurrentTimeAMPM()); 
							}							
							$("#controlButton" + currentId).html("Start"); 						 					 					
							newsFlag = true; 					
	 					}

					} // if we bring back a marketwatch or SEC

// 					$("#div" + currentId).css("background-color", "#ADAD85"); 

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

				});  // $.each 

				if (globalNewsFlag == true)
				{
					playAirRaidSiren();
				}

				if (globalCloseToCurrentLow == true)
				{
					playWaterSplash(); 
				}

				if (globalCancelHighRiskTrades == true)
				{
					playCancelHighRiskTrades(); 
				}

				if (globalVolumeAlert == true)
				{
					playCarDriveBy();
				}

				if (globalBigChartsAlert == true)
				{
					playBigCharts(); 
				}

			}  // end of yahoo success function
	});  // end of ajax call for yahoo finance  

} // checkAllDivsForNews() 


// the timer 

function timedCount()
{

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

	playCancelTrades(); 
	var finalString = ""; 

			$(".allDivs").each(function()
			{

				var currentId = $(this).attr("id"); 
 				var currentId = currentId.replace("div", "");
 				var symbol = $("#symbol" + currentId).val(); 
 				var orderInput = $("#orderInput" + currentId).val();
 				var indiviualNotes = $("#individualNotesText" + currentId).val();
 				var lowValue = $("#lowValue" + currentId).val(); 
 				var lowValuePercentage = $("#low" + currentId).html(); 
 				var highRiskSpike = $("#highRiskValueDiv" + currentId).text(); 
				var offering = $("#offerPrice" + currentId).val(); 
				var volumeNotes = $("#volumeNotesText" + currentId).val(); 


 				highRiskSpike = highRiskSpike.trim(); 

 				if (highRiskSpike != "")
 				{
 					highRiskSpike = "<br>-- HIGH RISK: " + highRiskSpike + "%"; 
 				}

 				if (offering != "")
 				{
 					offering = "<br>-- OFFERING at $" + offering; 
 				}


 				finalString += "DON'T FORGET TO CANCEL YOUR TRADES<br><br>" +  symbol + " " + orderInput + "<br>-- Low was " + lowValue + " (" + lowValuePercentage +  "%) " + highRiskSpike + offering +  "<br>-- ORDER STAMPS: " + indiviualNotes + "<br>-- NOTES: " + volumeNotes + "<br><br>*****************************<br><br>";

			}); 

	
			$("#print-orders-inner-div").html(finalString); 

			var printOrdersModal = document.getElementById('print-orders');
    	printOrdersModal.style.display = "block"; 

}); 


$("#multipleOrders").click(function(){

	var finalString = ""; 

			$(".allDivs").each(function()
			{

				var currentId = $(this).attr("id");
 				var currentId = currentId.replace("div", "");
 				var symbol = $("#symbol" + currentId).val(); 
 				var orderInput = $("#orderInput" + currentId).val();
 				var highRiskSpike = $("#highRiskValueDiv" + currentId).text(); 
				var tier = $("#volumeNotesText" + currentId).val(); 



 				highRiskSpike = highRiskSpike.trim(); 

 				if (highRiskSpike != "")
 				{
 					highRiskSpike = "HIGH_RISK"; 
 				}
 				else
 				{
 					highRiskSpike = "NON_HIGH_RISK"; 
 				}

    		if ($("#importantDiv" + currentId).css("background-color") == "rgb(255, 0, 0)")
    		{  
    			var orderStringArray = orderInput.split(" ");
		 			finalString += symbol + " " + orderInput + " " + tier + "<br>"; 
			  } 
			}); 

			finalString +=  "<br><br>"; 



		$("#multiple-orders-inner-div").html(finalString); 

		var multipleOrdersModal = document.getElementById('multiple-orders');
    multipleOrdersModal.style.display = "block"; 
}); 

// the "Start" button click

$(document.body).on('click', ".controlButton", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("controlButton", ""); 

	if ($(this).html() == "Start")
	{	
		var currentTime = getCurrentTimeAMPM();
		var currentNotesVal = $("#volumeNotesText" + currentId).val(); 
		var newNotesVal = currentNotesVal + "reset " + currentTime + " -- "; 
		var checkBigCharts = 0;   // first time around we aren't checking bigCharts 
		$("#volumeNotesText" + currentId).val(newNotesVal); 

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
   			var originalSymbol = currentSymbol; 
   			var modifiedSymbol = currentSymbol; 
   			var symbol;
   			var positionOfPeriod; 

   			positionOfPeriod = originalSymbol.indexOf(".");
   			stringLength = originalSymbol.length; 

			$("#chartDiv" + currentId).html("");
			$("#storedYahooLink" + currentId).html("");
			$("#storedMarketWatchMainLink" + currentId).html("");			
			$("#storedMarketWatchPartnerLink" + currentId).html("");
			$("#storedMarketWatchPRLink" + currentId).html("");
			$("#storedSECFilingLink" + currentId).html("");

		   	// take out the 5th "W/R/Z" for symbols like CBSTZ. 


  			if (positionOfPeriod > -1)
   			{
   				// if any stocks have a ".PD" or a ".WS", etc... 
					modifiedSymbol = originalSymbol.substr(0, positionOfPeriod); 
   			}
   			else if (originalSymbol.length == 5)
   			{
   				modifiedSymbol = originalSymbol.slice(0,-1); 
   			}
    		else
   			{
				modifiedSymbol = originalSymbol;    		
		   	}

		  var previousCloseString = getPreviousCloseString(currentId); 

			storeOriginalStateOfNews(originalSymbol, modifiedSymbol, currentId, previousCloseString); 

			originalSymbol = originalSymbol.replace(/\.p\./gi, ".P"); 

			$("#chartDiv" + currentId).html("<img style='max-width:100%; max-height:100%;' src='https://api.wsj.net/api/kaavio/charts/big.chart?nosettings=1&symb=" + originalSymbol + "&uf=0&type=2&size=2&style=320&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=4&rand=" + Math.random() + "&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1'>");
																								
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


// When the user clicks on the "D" (for down) button, to lower the percentage down 1 percent at a time. 
$(document.body).on('click', ".downButton", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("downButton", ""); 

	var orderStub = $("#orderInput" + currentId).val();

	var orderStringSplit = orderStub.split(" "); 
	var percentage = orderStringSplit[3]; 

	percentage = percentage.slice(1, -1); 
	percentage = percentage.slice(0, -1); 

	percentageFloat = parseFloat(percentage); 
	percentageFloat = percentageFloat + 0.25; 

	var newOrderStub = orderStringSplit[0] + " " + orderStringSplit[1] + " " + orderStringSplit[2] + " (" + percentageFloat.toFixed(2) + "%) " + orderStringSplit[4] + " " + orderStringSplit[5]; 

	$("#orderInput" + currentId).val(newOrderStub); 

	reCalcOrderStub(currentId); 

//	orderString = $("#orderInput" + currentId).

}); 

// When the user clicks on the "DOU" (for double the amount of shares) button, to increase the amount of shares by X2 
$(document.body).on('click', ".doubleButton", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("doubleButton", ""); 

	var orderStub = $("#orderInput" + currentId).val();

	var orderStringSplit = orderStub.split(" "); 

	var numShares = parseInt(orderStringSplit[1]); 
	numShares = numShares * 2; 

	var newOrderStub = orderStringSplit[0] + " " + numShares + " " + orderStringSplit[2] + " " + orderStringSplit[3] + " " + orderStringSplit[4] + " " + orderStringSplit[5]; 

	$("#orderInput" + currentId).val(newOrderStub); 

}); 

// When the user clicks on the "L" button for 10 percent below the current low button, to bump it down 10% past whatever the 
// current low-of-the-day is, if it recovered 5% ore more from it 
$(document.body).on('click', ".lowSeparation", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("lowSeparation", ""); 

	var orderStub = $("#orderInput" + currentId).val();

	var orderStringSplit = orderStub.split(" "); 

  var currentLow = parseFloat($("#lowValue" + currentId).val()); 
  var newPrice = currentLow - currentLow*0.1;

  var previousClose = orderStringSplit[5]; 
  previousClose = parseFloat(previousClose.replace("$", "")); 

  if (newPrice >= 1.00)
  {
  		newPrice = newPrice.toFixed(2);
  }
  else 
  {
  		if (previousClose >= 1.00)
  		{
  				newPrice = newPrice.toFixed(2);
  		}
  		else 
  		{
  				newPrice = newPrice.toFixed(4); 
  		}
  }

var prevCloseMinusNewPrice = previousClose - newPrice;
var prevCloseMinusNewPriceDivPrevClose = prevCloseMinusNewPrice/prevClose; 

	var newPercentage = ((previousClose - newPrice)/previousClose)*100.00; 
	var newPercentage = newPercentage.toFixed(2); 

	var newOrderStub = orderStringSplit[0] + " " + orderStringSplit[1] + " $" + newPrice + " (" + newPercentage + "%) " + orderStringSplit[4] + " " + orderStringSplit[5]; 

	$("#orderInput" + currentId).val(newOrderStub); 

 	$("#fullOrder" + currentId).val($("#symbol" + currentId).val() + " " + $("#orderInput" + currentId).val());

  	var copyTextarea = $("#fullOrder" + currentId);
  	copyTextarea.select();
  	try 
  	{
	    var successful = document.execCommand('copy');
	    var msg = successful ? 'successful' : 'unsuccessful';
		  alert($("#fullOrder" + currentId).val() + " successfully copied");
  	} 
  	catch (err) 
  	{
	    alert('Order did not succesfully copy');
  	}

	writeTradeStamp(currentId, "Low");	 

}); 

// When the user clicks on the "B" button for 10 percent big charts separation button, to bump it down 10% past whatever the 
// last bigcharts value was 
$(document.body).on('click', ".bigChartsSeparation", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("bigChartsSeparation", ""); 

	var bigChartsString = $("#bigChartsPercentageMain" + currentId).html(); 

	var bigChartsValues = bigChartsString.split(" "); 
	var bigChartsPrice = bigChartsValues[0]; 
	bigChartsPrice = bigChartsPrice.replace("$", ""); 
	bigChartsPrice = parseFloat(bigChartsPrice); 

	var orderStub = $("#orderInput" + currentId).val();
	var orderStringSplit = orderStub.split(" "); 
	var previousClose = orderStringSplit[5]; 
	previousClose = previousClose.replace("$", ""); 
	previousClose = parseFloat(previousClose); 
	var currentPrice = parseFloat(orderStringSplit[3].replace("$", "")); 

	var newPrice; 

	if (previousClose < 1.00)
	{
		newPrice = bigChartsPrice - bigChartsPrice*0.1251;
	}
	else 
	{
		newPrice = bigChartsPrice - bigChartsPrice*0.105;
	}

	if (previousClose >= 1.00)
	{
		newPrice = newPrice.toFixed(2); 

    let numberStr = newPrice.toString();

    // Split the number by the decimal point
    let parts = numberStr.split('.');

    // Truncate the last two decimal places
    let truncatedDecimal = parts[1].substring(0, 2);

    // Combine the integer part with the truncated decimal part
    let truncatedNumberStr = parts[0] + '.' + truncatedDecimal;

    newPrice = parseFloat(truncatedNumberStr); 
	}
	else
	{
		newPrice = newPrice.toFixed(4); 
	}

	var newPercentage = ((previousClose - newPrice)/previousClose)*100.00; 
	newPercentage = newPercentage.toFixed(2); 


	var newOrderStub = 	orderStringSplit[0] + " " + orderStringSplit[1] + " $" + newPrice + " (" + newPercentage + "%) " + orderStringSplit[4] + " " + orderStringSplit[5]; 

	if (newPrice > currentPrice)
	{ 
  	var bigChartsEmergencyModal = document.getElementById('big-charts-emergency');
    bigChartsEmergencyModal.style.display = "block"; 

 		$("#fullOrder" + currentId).val("--------------");

	  	var copyTextarea = $("#fullOrder" + currentId);
  		copyTextarea.select();
  		try 
  		{
		    var successful = document.execCommand('copy');
	    	var msg = successful ? 'successful' : 'unsuccessful';
		  	alert($("#fullOrder" + currentId).val() + " succesfully copied.");
  		} 
  		catch (err) 
  		{
		    alert('Order did not succesfully copy');
  		}
  }
  else
  {
		$("#orderInput" + currentId).val(newOrderStub); 

		reCalcOrderStub(currentId); 

 		$("#fullOrder" + currentId).val($("#symbol" + currentId).val() + " " + $("#orderInput" + currentId).val());

	  	var copyTextarea = $("#fullOrder" + currentId);
  		copyTextarea.select();
  		try 
  		{
		    var successful = document.execCommand('copy');
	    	var msg = successful ? 'successful' : 'unsuccessful';
		  	alert($("#fullOrder" + currentId).val() + " succesfully copied.");
  		} 
  		catch (err) 
  		{
		    alert('Order did not succesfully copy');
  		}
	}

	writeTradeStamp(currentId, "BigCharts");	 

}); 


// clicking on the up/down arrows to expand/contract the area which 
// displays the news links 


$(document.body).on('click', ".expandContractNews", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("expandContractNews", ""); 

	if ($("#upDownArrow" + currentId).attr("src") == "images/downArrow_smaller.jpg")
	{
		$("#upDownArrow" + currentId).attr("src", "images/upArrow_smaller.jpg")
		$("#div" + currentId).css("height", "270px");
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

$(document.body).on('click', ".haltDiv", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("haltDiv", ""); 

	$("#div" + currentId).css("background-color", "#ADAD85"); 

    if ($("#haltDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
    {  
			$("#haltDiv" + currentId).css("background-color", "rgb(255, 0, 0)"); 
    } 
    else 
    {
    		$("#haltDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    }	

		var currentTime = getCurrentTimeAMPM();
		var currentNotesVal = $("#volumeNotesText" + currentId).val(); 
		var newNotesVal = currentNotesVal + "Halt inspected " + currentTime + " -- "; 
		$("#volumeNotesText" + currentId).val(newNotesVal); 



});  // on clicking high risk box with the "H"

$(document.body).on('click', ".highRiskValueDiv", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("highRiskValueDiv", ""); 

    if ($("#highRiskValueDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
    {  
			$("#highRiskDiv" + currentId).css("background-color", "rgb(0, 255, 0)"); 
			$("#highRiskValueDiv" + currentId).css("background-color", "rgb(0, 255, 0)"); 
    } 
    else 
    {
    		$("#highRiskDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    		$("#highRiskValueDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    }	
});  // on clicking high risk box with the "H"

$(document.body).on('click', ".lowVolumeDiv", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("lowVolumeDiv", ""); 

	$("#volume30DayInput" + currentId).val("100,000"); 

    if ($("#lowVolumeDiv" + currentId).css("background-color") == "rgb(235, 235, 224)")
    {  
			$("#lowVolumeDiv" + currentId).css("background-color", "rgb(255, 255, 0)"); 
    } 
    else 
    {
    		$("#lowVolumeDiv" + currentId).css("background-color", "rgb(235, 235, 224)"); 
    }	
});  // on clicking high risk box with the "L"

$(document.body).on('click', ".checkPK", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("checkPK", ""); 

 	if ($(this).is(':checked'))
 	{
		$("#orderInput" + currentId).css("background-color", "rgb(255,192,203)"); 
	}
	else
	{
		$("#orderInput" + currentId).css("background-color", "rgb(255,255,255)"); 
	}

});  // Highlight pink sheet orders pink.

$(document.body).on('click', ".checkBB", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("checkBB", ""); 

 	if ($(this).is(':checked'))
 	{
		$("#orderInput" + currentId).css("background-color", "rgb(255, 207, 158)"); 
 	}
 	else
 	{
		$("#orderInput" + currentId).css("background-color", "rgb(255, 255, 255)"); 
 	}
});  // Highlight BB orders orange.

$(document.body).on('click', ".copyOrderToClipboard", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("copyOrderToClipboard", ""); 

 	$("#fullOrder" + currentId).val($("#symbol" + currentId).val() + " " + $("#orderInput" + currentId).val());

  	var copyTextarea = $("#fullOrder" + currentId);
  	copyTextarea.select();
  	try 
  	{
	    var successful = document.execCommand('copy');
	    var msg = successful ? 'successful' : 'unsuccessful';
		  alert($("#fullOrder" + currentId).val() + " successfully copied.");
  	} 
  	catch (err) 
  	{
	    alert('Order did not succesfully copy');
  	}

	writeTradeStamp(currentId, "Copy");

});  // Copy current order to clipboard 


//split the order in half, to average down 
$(document.body).on('click', ".halfOrder", function(){
	
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("halfOrder", ""); 
	

	var orderStub = $("#orderInput" + currentId).val(); 
	var orderStringSplit = 	orderStub.split(" "); 

	var originalNumShares = orderStringSplit[1]; 
	numShares = parseInt(originalNumShares); 
	numShares = numShares/3; 

	numShares = (Math.floor(numShares/50)*50); 

    // if the final number of shares is less than 50 (i.e. 0), then we're going to just start over again and 
    //  round it to the nearest 10 

    if (numShares < 50)
    {
        originalNumShares = orderStringSplit[1]; 
		numShares = parseInt(originalNumShares); 
		numShares = numShares/3; 
        numShares = (Math.floor(numShares/10)*10); 
        if (numShares < 10)
        {
        	numShares = 10; 
        }
    }

	$("#orderInput" + currentId).val(orderStringSplit[0] + " " +  numShares + " " + orderStringSplit[2] + " " + orderStringSplit[3] + " " + orderStringSplit[4] + " " + orderStringSplit[5]); 

 	$("#fullOrder" + currentId).val($("#symbol" + currentId).val() + " " + $("#orderInput" + currentId).val());

  	var copyTextarea = $("#fullOrder" + currentId);
  	copyTextarea.select();
  	try 
  	{
	    var successful = document.execCommand('copy');
	    var msg = successful ? 'successful' : 'unsuccessful';
	    alert($("#fullOrder" + currentId).val() + " succesfully copied");
  	} 
  	catch (err) 
  	{
	    alert('Order did not succesfully copy');
  	}

	$("#averageDownDiv" + currentId).css("background-color", "rgb(255, 165, 0)"); 

	writeTradeStamp(currentId, "Half");

});  // Split the order in half, to average down



    // email the trade to Jay 
$(document.body).on('click', ".emailOrder", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("emailOrder", ""); 

	var orderStub = $("#orderInput" + currentId).val();
	var orderStringSplit = orderStub.split(" "); 

	var symbol = $("#symbol" + currentId).val(); 
	var orderString = symbol + " " + orderStringSplit[0] + " " + orderStringSplit[1] + " " + orderStringSplit[2] + " " + orderStringSplit[3]; 

	  $.ajax({
	      url: "email.php",
	      data: {trade: orderString},
	       async: false, 
	      dataType: 'html',
	      success:  function (data) {
	        alert(data);
	      }
	  });  // end of AJAX call 

}); // end of e-mail trade button 


    // Get the big charts delayed quote 
$(document.body).on('click', ".bigCharts", function(){

		currentId = $(this).attr("id");
		currentId = currentId.replace("getBigCharts", ""); 

    var symbol = $("#symbol" + currentId).val(); 
    var site = "https://www.marketwatch.com/investing/stock/" + symbol; 
    window.open(site, "_blank");  


}); 


$(document.body).on('click', ".tierOneButton", function(){
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("tierOneButton", ""); 
 	$("#volumeNotesText" + currentId).val("ONE_TIER"); 
});  

$(document.body).on('click', ".tierTwoButton", function(){
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("tierTwoButton", ""); 
 	$("#volumeNotesText" + currentId).val("TWO_TIER"); 
});  

$(document.body).on('click', ".tierThreeButton", function(){
	currentId = $(this).attr("id"); 
 	currentId = currentId.replace("tierThreeButton", ""); 
 	$("#volumeNotesText" + currentId).val("THREE_TIER"); 
});  


$(document.body).on('paste', ".orderInput", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("orderInput", ""); 
	var percentage;
	var orderStub;
	var symbol;
	var entryPrice; 

	setTimeout(
		function() 
		{
				if (!confirm("Is this a news stock?"))
				{
					$("#noNewsDiv" + currentId).css("background-color", "#FFA1A1"); 
				}

		    orderStub = $.trim($("#orderInput" + currentId).val());

    		var orderStubSplit = orderStub.split(" ");
    		var percentage = orderStubSplit[4];
    		symbol = orderStubSplit[0];
    		entryPrice = orderStubSplit[3]; 

    		entryPrice = entryPrice.toString().replace(/\$/g, ""); 
    		entryPrice = parseFloat(entryPrice); 

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


    		if (percentage > 98.00) 
    		{
					$("#orderInput" + currentId).css("background-color", "#ECECEC"); 
					$("#symbol" + currentId).css("background-color", "#ECECEC");     
    		}
    		else if (
    			((percentage >= 34.00) && (entryPrice > 1.00)) || ((percentage >= 40.00) && (entryPrice < 1.00))
    			)
    		{
				$("#orderInput" + currentId).css("background-color", "#FFFFFF"); 
				$("#symbol" + currentId).css("background-color", "#FFFFFF");     			
    		}
    		else 
    		{
					let volume = prompt("Red flag volume amount"); 
					$("#volume30DayInput" + currentId).val(volume);  

					$("#orderInput" + currentId).css("background-color", "#CCE6FF"); 
					$("#playVolumeSound" + currentId).prop('checked', true); 
					$("#turnVolumeRed" + currentId).prop('checked', true);
					$("#symbol" + currentId).css("background-color", "#CCE6FF");
    		}

/*
    		if (percentage >= 70.00)
    		{
    				$("#checkForBigCharts" + currentId).prop('checked', false); 
    				$("#checkForNewNews" + currentId).prop('checked', false); 
    		}
*/

    		// For penny stocks, I want to start tracing them early, so put them under the radar 
    		// for 9% 
    		if (entryPrice < 1.00)
    		{
    			$("#lowInput" + currentId).val("4"); 
    			$("#pennyDiv" + currentId).css("background-color", "rgb(255, 165, 0)"); 
    		}

    		if (percentage >= 80)
    		{
    			$("#lowInput" + currentId).val("15"); 
    		}


			var dateObj = new Date(); 
			var hours = dateObj.getHours(); 
			var minutes = dateObj.getMinutes();
			if (minutes < 10)
			{
				minutes = "0" + minutes.toString(); 
			}
			var currentTime = hours.toString().concat(minutes); 
			currentTime = parseInt(currentTime); 

			if (currentTime < 630)
			{
				$("#symbol" + currentId).css("background-color", "orange"); 
			}
			else 
			if (currentTime < 650)
			{
				$("#symbol" + currentId).css("background-color", "yellow"); 
			}

    	// Handle high-risk previous day spike-ups
    	if (orderStub.search("HR_") != -1) {
    		$("#highRiskValueDiv" + currentId).css("background-color", "rgb(0, 255, 0)"); 
    		highRiskValue = orderStub.toString().match(/HR_(.*) /g); 

    		highRiskValue = highRiskValue[0]; 
    		highRiskValue = highRiskValue.replace(/HR_/, ""); 
    		$("#highRiskValueSpan" + currentId).html(highRiskValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")); 
    	}


    	// Grab the cik number from the string 
			var cikRegex = /CIK_(\d+|NOT_FOUND)/;
			var cikRegexMatch = orderStub.match(cikRegex); 
			$("#cikNumber" + currentId).html(cikRegexMatch[1]); 
			orderStub = orderStub.replace(cikRegex, '').trim(); 

	    calcPrevClose(currentId);    	
    	orderStub = orderStub.replace(/(.*)BUY/, "BUY"); 
    	orderStub = orderStub.replace(/HR_\d+/, ""); 
			$("#orderInput" + currentId).val(orderStub);    	

			if ($.trim($("#symbol" + currentId).val()) == "")
			{
				$("#symbol" + currentId).val(symbol);
				$("#controlButton" + currentId).click();
			}

			writeTradeStamp(currentId, "OriginalPaste");

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



$("#big-charts-emergency").click(function(){
    var bigChartsEmergencyModal = document.getElementById('big-charts-emergency');
        bigChartsEmergencyModal.style.display = "none"; 
}); 

$("#close-multiple-orders-window").click(function(){
    var bigChartsEmergencyModal = document.getElementById('multiple-orders');
        bigChartsEmergencyModal.style.display = "none"; 
}); 

$("#close-print-orders-window").click(function(){
    var bigChartsEmergencyModal = document.getElementById('print-orders');
        bigChartsEmergencyModal.style.display = "none"; 
}); 

});  // end of init function