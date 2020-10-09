# bnnbloomberg-markets-scraper

A small helper tool to provide close-to-realtime market data from BNN Bloomberg's unauthenticated API.

By default it provides data on all stocks listed [here](https://www.bnnbloomberg.ca/markets), but you can change the URI to data about other exchanges, individual securities, and/or do some digging to find out what else the API has in store...



## Usage

```
git clone https://github.com/vxsl/bnnbloomberg-markets-scraper.git
cd bnnbloomberg-markets-scraper; npm i; cd ..
```

```javascript
const scraper = require("./bnnbloomberg-markets-scraper")

const getNewQuote = async () => {
    while (true) {
        let newQuote = await scraper.poll()
        if (newQuote != 1) return newQuote  // return 1 indicates an overly-unfresh response from the server
    }
}

scraper.initialize(0)
!async function () {
    while (true) {
        console.log(await getNewQuote())
    }
}();
```

## Disclaimer
Use at your own risk. Incorporates spoofing of headers and other questionable tactics.
