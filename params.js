const fetch = require('node-fetch')
const Headers = fetch.Headers;

const baseURI = 'https://kylegrimsrudma.nz:8080/' + 'https://data.bnn.ca/dispenser/hydra/dapi/'

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

module.exports = {
    fetch, baseURI, resources, types
}