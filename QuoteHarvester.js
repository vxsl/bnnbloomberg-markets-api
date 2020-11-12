const { corsProxy } = require('./config.js')
const { QuoteLogger } = require('./QuoteLogger.js')
const { fetch, baseURI, resources, types, fetchOptions } = require('./params.js')

class QuoteHarvester {		 

	constructor (ticker, uri, firstStamp, log) {
		
		this.ticker = ticker				
		this.uri = corsProxy + uri	// corsProxy is empty by default, check config.js
		this.freshestTimestamp = firstStamp
		this.log = log
		this.invalidResponseCount = 0
		console.log("The corresponding URI is " + this.uri + ".\n")	
		log? this.logger = new QuoteLogger() : null		
	}
	
	static async build (reqResource="ca", log=false) {
		try {
			let result = new QuoteHarvester(reqResource, baseURI + await QuoteHarvester.constructURI(reqResource), 0, log)
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

	async quote (init=false) {
		
		while (true) {
			this.log? this.logger.reqInit() : null

			let responseHeaders

			// Make API request	
			// use spoofParams() to give fake parameters to URI, increasing likelihood of getting a correct response
			let r = await fetch(QuoteHarvester.spoofParams(this.uri), fetchOptions).then(function(res) {
				responseHeaders = res.headers;
				try {
					return res.json()
				}
				catch (error) {	
					console.log(error)
					return 1	// see below block
				}
			})
			// handle invalid JSON response. Happens very occasionally, but best not to have the whole program crash if it happens once or twice.
			// If it happens more than 5 times, something is probably wrong, so at this point the program should stop.
			// At the time of writing this I have never seen that happen, but better safe than sorry.
			if (r == 1) { 
				if (++invalidResponseCount > 5) throw "The server appears to be unreliable. Halting execution."
				else continue 
			}	

			this.log? this.logger.respInit(r, responseHeaders) : null

			let newTimestamp = Date.parse(r.generatedTimestamp)
			if (newTimestamp <= this.freshestTimestamp) continue	// ignore erroneous results from the API, which are frequent
			else this.freshestTimestamp = newTimestamp

			this.log? this.logger.fin(r) : null

			if (init) return [r, responseHeaders]
			else return r
		}
	}	

	static async constructURI (reqResourceFriendly) {

		let result
		switch (reqResourceFriendly) {
			case "us":
				console.log("\nSelected option is a summary of the NASDAQ (Unfortunately NYSE data is not available from Bloomberg's API).")
				result = types.stockList
				result += resources.us.nasdaq
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
					console.log("\nTrying to obtain an individual quote for \'" + reqResourceFriendly + "\'.")
					result = types.stockChart + reqResourceFriendly	
					let invalidTestResponseCount = 0
					let response
					while (invalidTestResponseCount < 5) {
						response = await fetch(baseURI + result, fetchOptions).then(res => res.json()).catch(error => {
								console.log(error)
								invalidTestResponseCount++
								return 1	// invalid JSON response (happens occasionally on server error)
							})
						if (response != 1) break	// ... if == 1 try again, if != 1 the test query was successful
						else if (invalidTestResponseCount == 4) throw "Sorry, the API is behaving unreliably."		
					}
					if (response.statusCode != 200) {						
						throw "\nSorry, that query was rejected by the API with error code " + response.statusCode + "."
					}
				}
		}
		return result
	}
	
	// Appends random parameter/value pair to end of URI in order to urge the data.bnn.ca to generate a new response.
	static spoofParams (uri) {
		const randomLetter = () => {
			return String.fromCharCode(97+Math.floor(Math.random() * 26))
		}
		let fakeParam = randomLetter()
		while (true) {
			if (fakeParam != 's') break
			else { fakeParam = randomLetter() }
		}
		return uri += "&" + fakeParam + "=" + randomLetter()
	}
}

module.exports = {

	QuoteHarvester
}
