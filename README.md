# bnnbloomberg-markets-scraper

A small helper tool to provide close-to-realtime market data from BNN Bloomberg's unauthenticated API.

By default it provides data on all stocks listed [here](https://www.bnnbloomberg.ca/markets), but you can change the URI to data about other exchanges, individual securities, and/or do some digging to find out what else the API has in store...


## Usage

* Pass to ```build()``` the ticker for a particular stock, for example ```"AAPL:UN"```. (you can figure out BNN Bloomberg's ticker naming conventions by searching stocks on [their site](https://www.bnnbloomberg.ca/stock/AAPL:UN)).

  Alternatively, pass ```"us"``` or ```"ca"``` for a summary of the NYSE or TSX, respectively.

* Call ```quote()``` to retrieve the most current data. The response's ```data``` value will look like this:

  ```
  statusCode: 200,
  generatedTimestamp: '2020-10-10T13:45:21.574',
  duration: 141,
  data: {
    stocks: [
      {
        symbol: 'AC:CT',
        name: 'AIR CANADA',
        currency: 'CAD',
        price: 16.09,
        netChng: -0.67,
        pctChng: -4,
        htsclsdate: '2020-10-09',
        tradeDate: '09 Oct 2020',
        yearHigh: 52.71,
        yearLow: 9.26,
        yearHighDate: '2020-01-14',
        yearLowDate: '2020-03-18',
        totalVolume: 4314594
      }
    ],
    invalidSymbols: []
  }
  ```

### Example 

```
git clone https://github.com/vxsl/bnnbloomberg-markets-scraper.git
cd bnnbloomberg-markets-scraper; npm i; cd ..
```

```javascript
const { QuoteHarvester } = require("./bnnbloomberg-markets-scraper")

!async function () {    

    let q = await QuoteHarvester.build("AC:CT")
    // QuoteHarvester.build("ca")       //      A summary of the market (Canada or US) is also possible.
    // QuoteHarvester.build("us")       //      ...see params.js if you wish to look into it further.
    
    while (true) {        
        let quote = await q.quote()
        console.log(quote)
        // do something with data (of particular interest are quote.data and quote.generatedTimestamp)
    }
}();
```

## Disclaimer
**Use at your own risk. Incorporates spoofing of headers and other questionable tactics.**
