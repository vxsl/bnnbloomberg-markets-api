# bnnbloomberg-markets-scraper

A small helper tool to provide close-to-realtime market data from BNN Bloomberg's unauthenticated API.

By default it provides data on all stocks listed [here](https://www.bnnbloomberg.ca/markets), but you can change the URI to data about other exchanges, individual securities, and/or do some digging to find out what else the API has in store...


## Usage

* Pass to ```initialize()``` the ticker for a particular stock, for example ```"AAPL:UN"```. (you can figure out BNN Bloomberg's ticker naming conventions by searching stocks on [their site](https://www.bnnbloomberg.ca/stock/AAPL:UN)).

  Alternatively, pass ```"us"``` or ```"ca"``` for a summary of the NYSE or TSX, respectively.

  ***(Note: ```initialize()``` returns ```1``` if a valid URI could not be constructed.)***

* Call ```quote()``` to retrieve the most current data.

### Example 

```
git clone https://github.com/vxsl/bnnbloomberg-markets-scraper.git
cd bnnbloomberg-markets-scraper; npm i; cd ..
```

```javascript
const scraper = require("./bnnbloomberg-markets-scraper")

!async function () {    

    let example = "AC:CT"       // ":CT" is the BNN naming convention for Canadian stocks.
    // let example = "ca"       //      A summary of the market (Canada or US) is also possible.
    // let example = "us"       //      ...see params.js if you wish to look into it further.

    // scraper.initialize() returns 1 if a valid query cannot be constructed with the requested resource: 
    if (await scraper.initialize(example) == 1) return  
    
    while (true) {        
        let quote = await scraper.quote()
        console.log(quote)
        // do something with data (in particular, quote.data and quote.generatedTimestamp)
    }
}();
```

## Disclaimer
**Use at your own risk. Incorporates spoofing of headers and other questionable tactics.**
