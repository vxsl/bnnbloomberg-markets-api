const fetch = require('node-fetch')
const Headers = fetch.Headers;

const baseURI = 'https://data.bnn.ca/dispenser/hydra/dapi/'

const types = {    
    "stockList":"stockList?s=",     // list of current quotes for individual stocks
    "stockChart":"stockChart?s=",   // current quote for one individual stock    
    "stock":"quote/summary?s="      // historical data for one individual stock
}

const resources = {
    "us": {
        "nasdaq":"CCMPDL:IND",		//NASDAQ
        "sp500":"SPX:IND",			//S&P 500        
        "dow30": {  // DOW 30 (as of October 10, 2020)
            "industrials":"BA:US,+CAT:US,+DOW:UN,+HON:UN,+MMM:US,+UTX:US",
            "tech":"BAPL:US,+IBM:US,+INTC:US,+MSFT:US,+CSCO:US,+CRM:UN",
            "consumer":"AD:US,+WMT:UN,+DIS:UN,+MCD:US,+NKE:US,+VZ:US,+KO:US",
            "financials":"HXP:US,+GS:UN,+JPM:UN,+TRV:US,+V:US",
            "healthcare":"AMGN:UW,+JNJ:US,+MRK:US,+PG:US,+UNH:US,+WBA:UN",
            "energy":"AVX:US",
        }
    },    
    "ca": {
        "composite":"SPTSX:IND",    // TSX Composite Index 
        "midcap":"SPTSXM:IND",      // TSX Midcap Index 
        "smallcap":"SPTSXS:IND",    // TSX Smallcap Index
        "venture":"SPTSXVEN:IND"    // TSX Venture Index
    }
}

var requestHeaders = new Headers({
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

const fetchOptions = {

	method: 'GET', 
	headers: requestHeaders
}

module.exports = {
    fetch, baseURI, resources, types, requestHeaders, fetchOptions
}