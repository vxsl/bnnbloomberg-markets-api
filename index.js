const { QuoteLogger } = require('./QuoteLogger.js')
const { fetch, fetchOptions, baseURI, resources, types } = require('./params.js')

var uri
var doLogging, logger
var freshestTimestamp = 0

const constructURI = async (reqResourceFriendly) => {

	let result
	switch (reqResourceFriendly) {
		case "us":
			console.log("\nSelected option is a summary of the US market (NASDAQ, S&P500, and DOW 30).")
			result = types.stockList
			result += resources.us.nasdaq + "," + resources.us.sp500 + ","
			for (let c in resources.us.dow30) {
				result += c
			}
			console.log(result)
			break
		case "ca":
			console.log("\nSelected option is a summary of the Canadian market (TSX Composite Index, Midcap Index and Smallcap Index).")
			result = types.stockList + resources.ca.composite + "," + resources.ca.midcap + "," + resources.ca.smallcap
			break
		default:
			if (new RegExp(`$[a-z, A-Z]+\:[a-z, A-Z]+^`).test(reqResourceFriendly)) {	
				throw "\nSorry, " + reqResourceFriendly + " is not a valid resource name."
			}
			else {
				console.log("\nSelected option is an individual quote for \'" + reqResourceFriendly + "\'.")
				result = types.stockChart + reqResourceFriendly	
				await fetch(baseURI + result, fetchOptions).then(res => res.json()).then(json => {
					if (json.statusCode != 200) {						
						throw "\nSorry, that query was rejected by the API with error code " + json.statusCode + "."
					}
				})
			}
	}
	return result
}

const initialize = async (reqResourceFriendly="ca", log=false) => {
	
	try {
		uri = baseURI + await constructURI(reqResourceFriendly)
	}
	catch (error) {
		console.log(error)
		return 1
	}
	
	console.log("The corresponding URI is " + uri + ".\n")	

	doLogging = log
	log? logger = new QuoteLogger() : null

	// get initial quote
	while (true) {
		let res = await quote(true)
		if (res !== 1 && Math.abs(Date.parse(res[0].generatedTimestamp) - Date.parse(res[1].get('date')).toString()) < 9000) {
			freshestTimestamp = Date.parse(res[0].generatedTimestamp)
			break
		}
	}
}

const quote = async (init=false) => {
	
	while (true) {
	
		doLogging? logger.reqInit() : null

		let responseHeaders

		// Make API request	
		// use spoofParams() to give fake parameters to URI, increasing likelihood of getting a correct response
		let r = await fetch(spoofParams(uri), fetchOptions).then(function(res) {
			responseHeaders = res.headers;
			return res.json()
		})

		doLogging? logger.respInit(r, responseHeaders) : null

		let newTimestamp = Date.parse(r.generatedTimestamp)
		if (newTimestamp <= freshestTimestamp) continue	// ignore erroneous results from the API, which are frequent
		else freshestTimestamp = newTimestamp

		doLogging? logger.fin(r) : null

		if (init) return [r, responseHeaders]
		else return r
	}
}

// Appends random parameter/value pair to end of URI in order to urge the data.bnn.ca to generate a new response.
const spoofParams = () => {
	spoofed = uri
	const randomLetter = () => {
		return String.fromCharCode(97+Math.floor(Math.random() * 26))
	}
	let fakeParam = randomLetter()
	while (true) {
		if (fakeParam != 's') break
		else { fakeParam = randomLetter() }
	}
	spoofed += "&" + fakeParam + "=" + randomLetter()
	return spoofed
}

// not implemented but keeping in case it's useful later
const destroyCookie = () => {

	/*if (responseHeaders.get('Set-Cookie') != null) {
		
		//customRequestHeaders["Set-Cookie"] = "abc" + "; Expires=" + (new Date((new Date).getTime() + 5000)).toString()
		customRequestHeaders["Set-Cookie"] = "TS01ed3f75="+ "; " + "Expires=" + (new Date((new Date).getTime())).toString() + "; Path=/; Secure"
		//customRequestHeaders["Set-Cookie"] = "TS01ed3f75="+ "; Path=/; Secure"
	}
	else {
		//customRequestHeaders["Set-Cookie"] = null
		//customRequestHeaders["Set-Cookie"] = "TS01ed3f75="+ "; Path=/; Secure"
	}*/
}

module.exports = {

	quote,
	initialize
}
