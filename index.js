const fetch = require('node-fetch')
const Headers = fetch.Headers;

const customHeaders = new Headers({
    "Host": "data.bnn.ca",
	"Connection": "keep-alive",
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
	"Accept": "*/*",
	"Origin": "https://www.bnnbloomberg.ca",
	"Sec-Fetch-Site": "cross-site",
	"Sec-Fetch-Mode": "cors",
	"Sec-Fetch-Dest": "empty",
	"Referer": "https://www.bnnbloomberg.ca/",
	"Accept-Encoding": "gzip, deflate, br",
	"Accept-Language": "en-US,en;q=0.9,fr-CA;q=0.8,fr-FR;q=0.7,fr;q=0.6"
});

const options = {

	method		: 'GET',
	headers 	: customHeaders
}

const url = 'https://data.bnn.ca/dispenser/hydra/dapi/stockList?s=SPTSX%3AIND%2CSPTSXM%3AIND%2CSPTSXS%3AIND';


async function getGainers() {

	//var x = await fetch('https://data.bnn.ca/dispenser/hydra/dapi/stockList?s=SPTSX%3AIND%2CSPTSXM%3AIND%2CSPTSXS%3AIND').then(res => res.json()).then(json => json.data)
	var x = await fetch(url, options).then(res => res.text()).then(text => console.log(text))
	return x;
}


console.log(getGainers())