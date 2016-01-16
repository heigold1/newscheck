

var timerVariable; 

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

//    alert("numShares is " + numSharesWithoutCommas + ", thePercentage is " + thePercentage + ", price is " + price);  

    prevClose = price/(1- (thePercentage/100)); 

    var newCalculatedPrice = prevClose - ((thePercentage/100)*prevClose)

//    alert("prevClose is " + prevClose);
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


    if (orderStub.match(/LOSS/g))
    {
    	var orderType = " LOSS";
    }

    price = price.replace(/\$/g, "");
    numSharesWithoutCommas = numShares.replace(/,/g, ""); 
    thePercentage = orderStub.match(/\((.*)\)/g); 
    thePercentage = thePercentage.toString().replace(/\(/g, ""); 
    thePercentage = thePercentage.toString().replace(/\)/g, ""); 
    thePercentage = thePercentage.toString().replace(/\%/g, ""); 

//    alert("numShares is " + numSharesWithoutCommas + ", thePercentage is " + thePercentage + ", price is " + price + " , prevClose is " + prevClose);


	if (thePercentage.length > 4)
	{

    	var newCalculatedPrice = prevClose - ((thePercentage/100)*prevClose); 

	//    alert("prevClose is " + prevClose);
	//    alert("newCalculatedPrice is " + newCalculatedPrice);

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
		// alert("start position is " + startPos); 

		numSharesWithCommas = numShares; 
 		numSharesWithCommas = numSharesWithCommas.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");

 		if (newCalculatedPrice > 1.00)
 		{
 			newCalculatedPrice = newCalculatedPrice.toFixed(3); 
 		}
 		else if (newCalculatedPrice < 1.00)
 		{
 			newCalculatedPrice = newCalculatedPrice.toFixed(5);
 		}

	    $("#orderInput" + currentId).val("BUY " + numSharesWithCommas + " $" + newCalculatedPrice + " (" + thePercentage.toFixed(2) + "%) -- $" + totalValueString + orderType); 
	//    $("#orderStub" + currentId).val("hello"); 

	//	alert("end of recalc ");
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
	newNewsEntry += "		<div class='textLabel'>"; 
	newNewsEntry += "			Symbol:"; 
	newNewsEntry += "		</div>"; 
	newNewsEntry += "		<input id='symbol" + newIdNumber + "' class='symbolTextInput'>"; 
	newNewsEntry += "		<input id='orderInput" + newIdNumber + "' class='orderInput'>"; 
 	newNewsEntry += "	 	<div id='prevClose" + newIdNumber + "'></div>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += "	<div class='controlButtonDiv'>"; 
	newNewsEntry += "		<button id='controlButton" + newIdNumber + "' class='controlButton' type='button'>Start</button>"; 
	newNewsEntry += " 	</div>"; 
	newNewsEntry += " 	"; 
	newNewsEntry += "	<div id='newsResultsDiv" + newIdNumber + "' class='newsResultsDiv' tabindex='-1'>"; 
	newNewsEntry += " 		<span id='newsStatusLabel" + newIdNumber + "' class='newsStatusLabel' tabindex='-1'>";
	newNewsEntry += "			Status...</span>"; 
	newNewsEntry += " 	</div>"; 
/*	newNewsEntry += "	<div id='chart" + newIdNumber + "' class='chart' tabindex='-1'>"; 
	newNewsEntry += "	</div>";  */ 
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
	newNewsEntry += "	<div id='importantDiv" + newIdNumber + "' class='importantDiv' tabindex='-1'>"; 
	newNewsEntry += "		<span class='importantSpan' tabindex='-1'>!</span>"; 
	newNewsEntry += "	</div>"; 
	newNewsEntry += " 	<div class='newsContainer'>"; 
	newNewsEntry += "		<div class='symbolCheckBox' tabindex='-1'>"
	newNewsEntry +=	"			<span class='symbolCheckBoxLabel'>" 
	newNewsEntry += "				<input type='checkbox' id='stripLastCharacterCheckbox" + newIdNumber + "' value='1' checked='checked'>Truncate the 5th 'W/R/Z' character, '.WS' '.PD', etc...'"; 
	newNewsEntry += "			</span> "; 
	newNewsEntry += "			&nbsp;";
 	newNewsEntry += "			Avg Volume: <input type='text' id='avgVolume" + newIdNumber + "' class='avgVolume'>"; 
	newNewsEntry += "			<input type='checkbox' id='checkVolume" + newIdNumber + "' value='1'>Check Volume";
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
	newNewsEntry += "			<span class='storedLinkLabel' tabindex='-1'>Original Marketwatch Press Release Link:</span> "; 
	newNewsEntry += " 			<div id='storedMarketWatchPRLink" + newIdNumber + "' class='storedLink' tabindex='-1'></div> "; 
	newNewsEntry += "  		</div> 	"; 
	newNewsEntry += "	 	<div class='individualNotesDiv' tabindex='-1'>";
	newNewsEntry += "			<span class='individualNotesLabel' tabindex='-1'>Notes:</span>";
	newNewsEntry += "			&nbsp;<input type='text' id='individualNotesText" + newIdNumber + "' class='individualNotesText'>";
	newNewsEntry += "           <input type='checkbox' id='earningsLossCheckbox" + newIdNumber + "' class='earningsLossCheckbox'  value='0'>Earnings Loss"	
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
var mwPRHeadlinesLink1 = "";
var mwPRHeadlinesLink1Title = "";

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
	   			yahooFound = data.found; 
	   			yahooCompanyName = data.companyName; 
	   			yahooFirstLink = data.yahooInfo.url;
	   			yahooFirstLink = yahooFirstLink.replace(/&amp;/g, '&');    			
	   			yahooFirstLinkTitle = data.yahooInfo.urlTitle; 
	   			currentVolume = data.currentVolume;

	   			etfStringLocation =  yahooCompanyName.search(/ etf /i);

	   			// if it is an ETF then we need to tell the proxy server that, so when it 
	   			// searches for marketwatch information it can insert "fund" instead of "stock"
	   			// in the URl. 

	   			if (etfStringLocation > -1)
				{	   				
	   				stockOrFund = "fund"; 
	   			}
	   			else
	   			{
	   				stockOrFund = "stock";
	   			}

//	   			alert("etf found is " . yahooCompanyName.search(/ etf /i)); 
    	} // end of yahoo success function
	});  // end of ajax call for yahoo finance   


 	$.ajax({
	    url: "newsproxy.php",
	    data: {symbol: currentSymbol,
	    	   stockOrFund: stockOrFund, 
	    	   which_website: "marketwatch", 
	    	   host_name: "www.marketwatch.com"} , 
		async: false,	    	   
	    dataType: 'json',
	    success:  function (data) {
	    		marketWatchFound = data.found;
				mwMainContentLink1 = data.mwMainHeadlines.url; 
				mwMainContentLink1 = mwMainContentLink1.replace(/&amp;/g, '&');
				mwMainContentLink1Title = data.mwMainHeadlines.urlTitle; 

				mwPartnerHeadlinesLink1 = data.mwPartnerHeadLines.url; 
				mwPartnerHeadlinesLink1 = mwPartnerHeadlinesLink1.replace(/&amp;/g, '&'); 
				mwPartnerHeadlinesLink1Title = data.mwPartnerHeadLines.urlTitle;

				mwPRHeadlinesLink1 = data.mwPRHeadLines.url;  
				mwPRHeadlinesLink1 = mwPRHeadlinesLink1.replace(/&amp;/g, '&'); 
				mwPRHeadlinesLink1Title = data.mwPRHeadLines.urlTitle;



 				if ((yahooFound == "notFound") && (marketWatchFound == "notFound"))
 				{
					alert(currentSymbol + " was not found on either Yahoo or Marketwatch.  Check the spelling");
					$("#newsStatusLabel" + currentId).html("Status...")		
 				}
 				else 
 				{

 					// yahoo main 

 					if (yahooFirstLink != "")
 					{
			// 			alert("storing yahoo link " + yahooFirstLink);
						$("#storedYahooLink" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + "</a>");
					}
					else
					{
						$("#storedYahooLink" + currentId).html("No news");
					}

					// marketwatch main

					if (mwMainContentLink1 != "")
					{
						$("#storedMarketWatchMainLink" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + "</a>");
					} 
					else
					{
						$("#storedMarketWatchMainLink" + currentId).html("No news");
					}

					// marketwatch partner headlines 

					if (mwPartnerHeadlinesLink1 != "")
					{			
						$("#storedMarketWatchPartnerLink" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + "</a>"); 
					}
					else
					{
						$("#storedMarketWatchPartnerLink" + currentId).html("No news"); 
					}

					// marketwatch PR headlines

					if (mwPRHeadlinesLink1 != "")
					{
						$("#storedMarketWatchPRLink" + currentId).html("<a target='_blank' href='" + mwPRHeadlinesLink1 + "'>" + mwPRHeadlinesLink1Title + "</a>"); 		
					}
					else
					{
						$("#storedMarketWatchPRLink" + currentId).html("No news");
					}

			// keep, for testing purposes
			//		alert("yahoo link is " + $("#storedYahooLink" + currentId).html());
			//		alert("mw main link is " + $("#storedMarketWatchMainLink" + currentId).html());
			//		alert("mw partner link is " + $("#storedMarketWatchPartnerLink" + currentId).html());
			//		alert("mw PR link is " + $("#storedMarketWatchPRLink" + currentId).html());

					// change the value of the control button to "Stop"

					$("#newsStatusLabel" + currentId).html("News links stored...");

					$("#controlButton" + currentId).html("Stop"); 

				}  // else either one of yahoo or marketwatch was found


	   	} // end of marketwatch success function 

	}); // end of ajax call to Marketwatch   

}  // end of function storeOriginalStateOfNews 



// check a single div for new news and update chart 

function checkIndividualDivForNews(divId)
{

		currentSymbol = $.trim($("#symbol" + divId).val()); 
		currentSymbol = currentSymbol.toUpperCase(); 		

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
			var yahooCompanyName = ""; 
			var stockOrFund = ""; 
			var mwMainContentLink1 = ""; 
			var mwPartnerHeadlinesLink1 = ""; 
			var mwPRHeadlinesLink1 = ""; 
			var newsFlag = false; 

//			$("#div" + currentId).css("background-color", "#2F5E76"); 
			$("#div" + currentId).css("background-color", "#00FF00"); 			
			
			$("#newsStatusLabel" + currentId).html("Checking back for news/updating chart...")
			$.ajax({
		   		url: "newsproxy.php",
	   			data: {symbol: symbol,
			   		which_website: "yahoo", 
	   				host_name: "finance.yahoo.com"} , 
				async: false,	   		
	   			dataType: 'json',
	   			success:  function (data) {

	   					yahooFound = data.found; 
	   					yahooCompanyName = data.companyName; 
	   					yahooFirstLink = data.yahooInfo.url;
	   					yahooFirstLink = yahooFirstLink.replace(/&amp;/g, '&'); 
		   				yahooFirstLinkTitle = data.yahooInfo.urlTitle; 
	   					currentVolume = data.currentVolume; 
	   					averageVolume = $("#avgVolume" + divId).val(); 


	
	   					// now we compare the current volume against the average volume to make sure 
	   					// that there isn't a red flag volume explosion

	   					currentVolume = currentVolume.toString().replace(/,/g, "");
	   					averageVolume = averageVolume.toString().replace(/,/g, "");
	   					averageVolume = Number(averageVolume); 
	   					volumeIndex = 1.5;
	   					comparativeAverageVolume = averageVolume*volumeIndex;

						if ( $("#checkVolume" + currentId).prop('checked'))
						{
		   					if (currentVolume >= comparativeAverageVolume)
	   						{
								$("#volumeDiv" + divId).css("background-color", "rgb(255, 0, 0)");
	   						}
    						else 
    						{
	    						$("#volumeDiv" + divId).css("background-color", "rgb(235, 235, 224)"); 
    						}	
    					}	
    					else 
    					{
	    					$("#volumeDiv" + divId).css("background-color", "rgb(235, 235, 224)"); 
    					}	

	   					etfStringLocation =  yahooCompanyName.search(/ etf /i);

	   					// if it is an ETF then we need to tell the proxy server that, so when it 
	   					// searches for marketwatch information it can insert "fund" instead of "stock"
	   					// in the URl. 

	   					if (etfStringLocation > -1)
						{	   				
	   						stockOrFund = "fund"; 
	   					}
	   					else
	   					{
	   						stockOrFund = "stock";
	   					}

    			}  // end of yahoo success function
			});  // end of ajax call for yahoo finance  

	 		$.ajax({
		    	url: "newsproxy.php",
	    		data: {symbol: symbol,
	    	   		stockOrFund: stockOrFund, 	    			
		    	   	which_website: "marketwatch", 
	    	   		host_name: "www.marketwatch.com"} , 
				async: false,	    	   
	    		dataType: 'json',
	    		success:  function (data) {
	    				marketWatchFound = data.found;
						mwMainContentLink1 = data.mwMainHeadlines.url; 
						mwMainContentLink1 = mwMainContentLink1.replace(/&amp;/g, '&'); 
						mwMainContentLink1Title = data.mwMainHeadlines.urlTitle; 

						mwPartnerHeadlinesLink1 = data.mwPartnerHeadLines.url; 
						mwPartnerHeadlinesLink1 = mwPartnerHeadlinesLink1.replace(/&amp;/g, '&'); 
						mwPartnerHeadlinesLink1Title = data.mwPartnerHeadLines.urlTitle;

						mwPRHeadlinesLink1 = data.mwPRHeadLines.url;  
						mwPRHeadlinesLink1 = mwPRHeadlinesLink1.replace(/&amp;/g, '&'); 
						mwPRHeadlinesLink1Title = data.mwPRHeadLines.urlTitle;




				tempStored = $("#storedYahooLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing yahoo " + yahooFirstLink + " AGAINST yahooo " + tempStored);

	 			// if we bring back a yahoo link 
	 			if (yahooFirstLink != "")
 				{
	 				// then if there was currently no news stored, 
 					if ($("#storedYahooLink" + currentId).html() == "No news")     
		 				{
	//	 					alert("yahoo news for " + symbol);
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
							$("#controlButton" + currentId).html("Start"); 
							newsFlag = true; 

	 					}  // or what just came back is different than what was previously stored
 						else if (yahooFirstLink != $("#storedYahooLink" + currentId).find("a:first").attr("href")) 
 						{
	//		 				alert("yahoo DIFFERENT news for " + symbol);
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
							$("#controlButton" + currentId).html("Start"); 						
							newsFlag = true; 
	 					}

 				}  // if we bring back a yahoo link 

				//tempStored = $("#storedMarketWatchMainLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing " + mwMainContentLink1 + " AGAINST " + tempStored);

	 			// if we bring back a marketwatch main table link 
 				if (mwMainContentLink1 != "")
 				{
	 				if ($("#storedMarketWatchMainLink" + currentId).html() == "No news")
 					{
	// 					alert("marketwatch main news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
						$("#controlButton" + currentId).html("Start"); 						 					
						newsFlag = true; 					
 					}
 					else if (mwMainContentLink1 != $("#storedMarketWatchMainLink" + currentId).find("a:first").attr("href")) 
 					{
	// 					alert("marketwatch main news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 
 					}

 				}  // if we bring back a marketwatch main link  

				//tempStored = $("#storedMarketWatchPartnerLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing " + mwPartnerHeadlinesLink1 + " AGAINST " + tempStored);

 				// if we bring back a marketwatch partner headlines link 
 				if (mwPartnerHeadlinesLink1 != "")
 				{
					if ($("#storedMarketWatchPartnerLink" + currentId).html() == "No news")
 					{
	// 					alert("marketwatch partner news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (mwPartnerHeadlinesLink1 != $("#storedMarketWatchPartnerLink" + currentId).find("a:first").attr("href")) 
 					{
	// 					alert("marketwatch partner news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}

 				} // if we bring back a marketwatch partner headlines link 

				//tempStored = $("#storedMarketWatchPRLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing " + mwPRHeadlinesLink1 + " AGAINST " + tempStored);

 				// if we bring back a marketwatch PR headlines link 
				if (mwPRHeadlinesLink1 != "") 
				{
					if ($("#storedMarketWatchPRLink" + currentId).html() == "No news")
 					{
 	//					alert("marketwatch PR news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + mwPRHeadlinesLink1 + " - MW PR</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (mwPRHeadlinesLink1 != $("#storedMarketWatchPRLink" + currentId).find("a:first").attr("href")) 
 					{
	// 					alert("marketwatch PR news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + mwPRHeadlinesLink1 + " - MW PR</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}

				} // if we bring back a marketwatch PR headlines link 

				$("#div" + currentId).css("background-color", "#ADAD85"); 

				if (newsFlag == false)
				{				
	 				$("#newsStatusLabel" + currentId).html("No new news...")
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
	$(".allDivs").each(function(){
		currentId = $(this).attr("id"); 
 		currentId = currentId.replace("div", ""); 	

		var orderStub = $.trim($("#orderInput" + currentId).val());
    	var orderStubSplit = orderStub.split(" ");
    	percentage = orderStubSplit[3];
    	percentage = percentage.toString().replace(/\(/g, ""); 
    	percentage = percentage.toString().replace(/\)/g, ""); 
    	percentage = percentage.toString().replace(/\%/g, ""); 
    	percentage = parseFloat(percentage);

    	if (percentage <= 35.00)
    	{
    		checkIndividualDivForNews(currentId); 
    	}




/*		currentSymbol = $.trim($("#symbol" + currentId).val()); 

   		var original_symbol = currentSymbol; 
   		var symbol;
   		var positionOfPeriod; 

   		positionOfPeriod = original_symbol.indexOf(".");

		// take out the 5th "W/R/Z" for symbols like CBSTZ. 

   		if ( $("#stripLastCharacterCheckbox" + currentId).prop('checked') && (original_symbol.length == 5) )
   		{
   			symbol = original_symbol.slice(0,-1); 
   		}
   		else if ( $("#stripLastCharacterCheckbox" + currentId).prop('checked') && (positionOfPeriod > -1) )
   		{
   			// if any stocks have a ".PD" or a ".WS", etc... 

			symbol = original_symbol.substr(0, positionOfPeriod); 
   		}
   		else
   		{
			symbol = original_symbol;    		
		}

        original_symbol = original_symbol.replace(/\.p\./gi, ".P"); 		

 		if ($("#controlButton" + currentId).html() == "Stop")
 		{

			var yahooFirstLink = ""; 
			var mwMainContentLink1 = ""; 
			var mwPartnerHeadlinesLink1 = ""; 
			var mwPRHeadlinesLink1 = ""; 
			var newsFlag = false; 

			$("#div" + currentId).css("background-color", "#E0E0D1"); 
			$("#newsStatusLabel" + currentId).html("Checking back for news/updating chart...")
			$.ajax({
		   		url: "newsproxy.php",
	   			data: {symbol: symbol,
			   		which_website: "yahoo", 
	   				host_name: "finance.yahoo.com"} , 
				async: false,	   		
	   			dataType: 'json',
	   			success:  function (data) {
	   					yahooFound = data.found; 
	   					yahooFirstLink = data.yahooInfo.url;
	   					yahooFirstLink = yahooFirstLink.replace(/&amp;/g, '&'); 
		   				yahooFirstLinkTitle = data.yahooInfo.urlTitle; 


    			}  // end of yahoo success function
			});  // end of ajax call for yahoo finance  

	 		$.ajax({
		    	url: "newsproxy.php",
	    		data: {symbol: symbol,
		    	   	which_website: "marketwatch", 
	    	   		host_name: "www.marketwatch.com"} , 
				async: false,	    	   
	    		dataType: 'json',
	    		success:  function (data) {
	    				marketWatchFound = data.found;
						mwMainContentLink1 = data.mwMainHeadlines.url; 
						mwMainContentLink1 = mwMainContentLink1.replace(/&amp;/g, '&'); 
						mwMainContentLink1Title = data.mwMainHeadlines.urlTitle; 

						mwPartnerHeadlinesLink1 = data.mwPartnerHeadLines.url; 
						mwPartnerHeadlinesLink1 = mwPartnerHeadlinesLink1.replace(/&amp;/g, '&'); 
						mwPartnerHeadlinesLink1Title = data.mwPartnerHeadLines.urlTitle;

						mwPRHeadlinesLink1 = data.mwPRHeadLines.url;  
						mwPRHeadlinesLink1 = mwPRHeadlinesLink1.replace(/&amp;/g, '&'); 
						mwPRHeadlinesLink1Title = data.mwPRHeadLines.urlTitle;




				tempStored = $("#storedYahooLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing yahoo " + yahooFirstLink + " AGAINST yahooo " + tempStored);

	 			// if we bring back a yahoo link 
	 			if (yahooFirstLink != "")
 				{
	 				// then if there was currently no news stored, 
 					if ($("#storedYahooLink" + currentId).html() == "No news")     
		 				{
	//	 					alert("yahoo news for " + symbol);
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
							$("#controlButton" + currentId).html("Start"); 
							newsFlag = true; 

	 					}  // or what just came back is different than what was previously stored
 						else if (yahooFirstLink != $("#storedYahooLink" + currentId).find("a:first").attr("href")) 
 						{
	//		 				alert("yahoo DIFFERENT news for " + symbol);
							$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
 							$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + yahooFirstLinkTitle + " - Yahoo</a>");
							$("#controlButton" + currentId).html("Start"); 						
							newsFlag = true; 
	 					}

 				}  // if we bring back a yahoo link 

				//tempStored = $("#storedMarketWatchMainLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing " + mwMainContentLink1 + " AGAINST " + tempStored);

	 			// if we bring back a marketwatch main table link 
 				if (mwMainContentLink1 != "")
 				{
	 				if ($("#storedMarketWatchMainLink" + currentId).html() == "No news")
 					{
	// 					alert("marketwatch main news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
						$("#controlButton" + currentId).html("Start"); 						 					
						newsFlag = true; 					
 					}
 					else if (mwMainContentLink1 != $("#storedMarketWatchMainLink" + currentId).find("a:first").attr("href")) 
 					{
	// 					alert("marketwatch main news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwMainContentLink1 + "'>" + mwMainContentLink1Title + " - MW Main</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 
 					}

 				}  // if we bring back a marketwatch main link  

				//tempStored = $("#storedMarketWatchPartnerLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing " + mwPartnerHeadlinesLink1 + " AGAINST " + tempStored);

 				// if we bring back a marketwatch partner headlines link 
 				if (mwPartnerHeadlinesLink1 != "")
 				{
					if ($("#storedMarketWatchPartnerLink" + currentId).html() == "No news")
 					{
	// 					alert("marketwatch partner news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (mwPartnerHeadlinesLink1 != $("#storedMarketWatchPartnerLink" + currentId).find("a:first").attr("href")) 
 					{
	// 					alert("marketwatch partner news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + mwPartnerHeadlinesLink1 + "'>" + mwPartnerHeadlinesLink1Title + " - MW Other</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}

 				} // if we bring back a marketwatch partner headlines link 

				//tempStored = $("#storedMarketWatchPRLink" + currentId).find("a:first").attr("href"); 
	//	 		alert("comparing " + mwPRHeadlinesLink1 + " AGAINST " + tempStored);

 				// if we bring back a marketwatch PR headlines link 
				if (mwPRHeadlinesLink1 != "") 
				{
					if ($("#storedMarketWatchPRLink" + currentId).html() == "No news")
 					{
 	//					alert("marketwatch PR news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + mwPRHeadlinesLink1 + " - MW PR</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}
 					else if (mwPRHeadlinesLink1 != $("#storedMarketWatchPRLink" + currentId).find("a:first").attr("href")) 
 					{
	// 					alert("marketwatch PR news for " + symbol); 
						$("#newsResultsDiv" + currentId).css("background-color", "#FF0000"); 
						$("#newsStatusLabel" + currentId).html("<a target='_blank' href='" + yahooFirstLink + "'>" + mwPRHeadlinesLink1 + " - MW PR</a>");
						$("#controlButton" + currentId).html("Start"); 						 					 					
						newsFlag = true; 					
 					}

				} // if we bring back a marketwatch PR headlines link 

				$("#div" + currentId).css("background-color", "#ADAD85"); 

				if (newsFlag == false)
				{				
	 				$("#newsStatusLabel" + currentId).html("No new news...")
 				}

	   			}  // end of marketwatch success function 
			}); // end of ajax call to Marketwatch 

			$("#chartDiv" + currentId).html("");
			$("#chartDiv" + currentId).html("<img style='max-width:100%; max-height:100%;' src='http://bigcharts.marketwatch.com/kaavio.Webhost/charts/big.chart?nosettings=1&symb=" + original_symbol + "&uf=0&type=2&size=2&freq=1&entitlementtoken=0c33378313484ba9b46b8e24ded87dd6&time=4&rand=" + Math.random() + "&compidx=&ma=0&maval=9&lf=1&lf2=0&lf3=0&height=335&width=579&mocktick=1'>");

		} // if ($("#controlButton" + currentId).html() == "Stop")
   */
	}); // allDivs.each()

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

// oil pulling

alert("Oil pulling.\n\nAlso check pre-market prev. day lows if it's before 6:00 AM\n\n Check the VIX");

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

});  // on clicking expand/contract news 

$(document.body).on('paste', ".orderInput", function(){

	currentId = $(this).attr("id"); 
	currentId = currentId.replace("orderInput", ""); 
	var percentage;
	var orderStub;

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

    		if (percentage < 35.00)
    		{
				if (confirm(symbol + ': Percentage is ' + percentage + '. Do you want to check for volume?')) 
				{
    			// Save it!
					$("#upDownArrow" + currentId).attr("src", "images/upArrow_smaller.jpg"); 
					$("#div" + currentId).css("height", "243px");
					$( "#checkVolume" + currentId).prop( "checked", true );
				} 
				else 
				{
    			// Do nothing!
				}
			}

    		if (percentage >= 35.00)
    		{
				$("#orderInput" + currentId).css("background-color", "#FFFFFF"); 
				$("#symbol" + currentId).css("background-color", "#FFFFFF");     			
    		}
    		else 
    		{
				$("#orderInput" + currentId).css("background-color", "#CCE6FF"); 
				$("#symbol" + currentId).css("background-color", "#CCE6FF");     			
    		}

			if (orderStub.match(/LOSS/g))
			{ 
				$("#importantDiv" + currentId).css("background-color", "rgb(255, 0, 0)"); 
				$("#earningsLossCheckbox" + currentId).prop("checked", true); 
			} 

	     	calcPrevClose(currentId);    	
    		orderStub = orderStub.replace(/(.*)BUY/, "BUY"); 
			$("#orderInput" + currentId).val(orderStub);    	

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