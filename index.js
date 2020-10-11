const { QuoteLogger } = require('./QuoteLogger.js')
const { fetch, fetchOptions, baseURI, resources, types } = require('./params.js')

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

// Appends random parameter/value pair to end of URI in order to urge the data.bnn.ca to generate a new response.
const spoofParams = (uri) => {
	const randomLetter = () => {
		return String.fromCharCode(97+Math.floor(Math.random() * 26))
	}
	let fakeParam = randomLetter()
	while (true) {
		if (fakeParam != 's') break
		else { fakeParam = randomLetter() }
	}
	spoofed = uri += "&" + fakeParam + "=" + randomLetter()
	return spoofed
}

class QuoteHarvester {		

	constructor (ticker, uri, firstStamp, log) {
		this.ticker = ticker
		this.uri = uri
		this.freshestTimestamp = firstStamp
		this.log = log

		console.log("The corresponding URI is " + this.uri + ".\n")	
		log? logger = new QuoteLogger() : null		
	}
	
	static async build (reqResource="ca", log=false) {
		try {
			let result = new QuoteHarvester(reqResource, baseURI + await constructURI(reqResource), 0, log)
			let firstStamp
			while (true) {
				let r = await result.quote(true)
				if (r !== 1 && Math.abs(Date.parse(r[0].generatedTimestamp) - Date.parse(r[1].get('date')).toString()) < 9000) {
					firstStamp = Date.parse(r[0].generatedTimestamp)
					break
				}
			}
			return result
		}
		catch (error) {
			console.log(error)
			throw "...unable to instantiate a QuoteHarvester for " + reqResource + ".\n"
		}		
	}

	quote = async (init=false) => {
		
		while (true) {
		
			this.log? this.logger.reqInit() : null

			let responseHeaders

			// Make API request	
			// use spoofParams() to give fake parameters to URI, increasing likelihood of getting a correct response
			let r = await fetch(spoofParams(this.uri), fetchOptions).then(function(res) {
				responseHeaders = res.headers;
				return res.json()
			})

			this.log? this.logger.respInit(r, responseHeaders) : null

			let newTimestamp = Date.parse(r.generatedTimestamp)
			if (newTimestamp <= this.freshestTimestamp) continue	// ignore erroneous results from the API, which are frequent
			else this.freshestTimestamp = newTimestamp

			this.log? this.logger.fin(r) : null

			if (init) return [r, responseHeaders]
			else return r
		}
	}	
}

module.exports = {

	QuoteHarvester
}
