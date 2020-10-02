const fetch = require('node-fetch')
const Headers = fetch.Headers;

var customRequestHeaders = new Headers({
	"Host": "data.bnn.ca",
	"Connection": "keep-alive",
	"Pragma": "no-cache",
	"Cache-Control": "no-cache",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
	"Accept": "*/*",
	"Origin": "https://www.bnnbloomberg.ca",
	"Sec-Fetch-Site": "cross-site",
	"Sec-Fetch-Mode": "cors",
	"Sec-Fetch-Dest": "empty",
	"Referer": "https://www.bnnbloomberg.ca/",
	"Accept-Encoding": "gzip, deflate, br",
	"Accept-Language": "en-US,en;q=0.9,fr-CA;q=0.8,fr-FR;q=0.7,fr;q=0.6"
})
const options = {

	method: 'GET', 
	headers: customRequestHeaders
}

const resources = [
	'stockList?s=SPTSX%3AIND%2CSPTSXM%3AIND%2CSPTSXS%3AIND',
	'stockChart?s=AC:CT',
	'quote/summary?s=AC%3ACT'
]

const baseURI = 'https://data.bnn.ca/dispenser/hydra/dapi/'
var uri

const select = (resourceIndex) => {
	uri = baseURI + resources[resourceIndex]
	console.log("Selected URI is " + uri)
}

const poll = async () => {
	var responseHeaders
	
	// TODO: encapsulate logging
			// let requestTime = (new Date).getTime()	
			// let requestedTimestamp = Date.now() + 4500	

	spoofParams()
	// Make API request
	let r = await fetch(uri, options).then(function(res) {
		responseHeaders = res.headers;
		return res.json()
	})
	
			// let responseTime = responseHeaders.get('date')	
			// let responseTimestamp = Date.parse(responseTime).toString()	
			// let responseGeneratedTimestamp = Date.parse(r.generatedTimestamp)

	// ignore erroneous results from the API, which are frequent
	if (Math.abs(Date.parse(r.generatedTimestamp) - Date.parse(responseHeaders.get('date')).toString()) > 2000) return 0;
	
			//console.log(responseHeaders.get('x-vcache'))
			/*if (responseHeaders.get('Set-Cookie') != null) {
				console.log("New cookie")
			}*/
	
	/*if (responseHeaders.get('Set-Cookie') != null) {
		
		//customRequestHeaders["Set-Cookie"] = "abc" + "; Expires=" + (new Date((new Date).getTime() + 5000)).toString()
		customRequestHeaders["Set-Cookie"] = "TS01ed3f75="+ "; " + "Expires=" + (new Date((new Date).getTime())).toString() + "; Path=/; Secure"
		//customRequestHeaders["Set-Cookie"] = "TS01ed3f75="+ "; Path=/; Secure"
	}
	else {
		//customRequestHeaders["Set-Cookie"] = null
		//customRequestHeaders["Set-Cookie"] = "TS01ed3f75="+ "; Path=/; Secure"
	}*/
	

			//console.log("Received server response at " + responseTime)
			// //console.log("difference = " + (responseTimestamp - requestTime))
			//console.log("requested stamp - received = " + (responseGeneratedTimestamp - responseTimestamp))

	console.log("[ " + r.generatedTimestamp + " ]")
	if (r.statusCode != '200') {
		console.log(r.statusCode)
	}
			//console.log(r)
	return
}


// Appends random parameter/value pair to end of URI in order to urge the data.bnn.ca to generate a new response.
const spoofParams = () => {
	
	const randomLetter = () => {
		return String.fromCharCode(97+Math.floor(Math.random() * 26))
	}
	let fakeParam = randomLetter()
	while (true) {
		if (fakeParam != 's') break
		else { fakeParam = randomLetter() }
	}
	uri += "&" + fakeParam + "=" + randomLetter()
}

const parseResponse = (res) => {

	console.log(res.headers)
	return res.json()
}

module.exports = {

	poll,
	select
}