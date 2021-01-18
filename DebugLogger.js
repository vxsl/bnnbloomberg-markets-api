class DebugLogger {
    
    reqInit = async () => {
        this.requestTime = (new Date).getTime()	
        this.reqLog()
    } 

    reqLog = () => {
        console.log('\n\n')
        console.log('New request in progress at ' + this.requestTime + "\n")
    }

    respInit = async (r, responseHeaders) => {
        this.responseTime = responseHeaders.get('date')	
		this.responseTimestamp = Date.parse(this.responseTime).toString()	
        this.responseGeneratedTimestamp = Date.parse(r.generatedTimestamp)
        this.respLog(r, responseHeaders)
    }

    respLog = (r, responseHeaders) => {
        console.log(responseHeaders.get('x-vcache'))
        if (responseHeaders.get('Set-Cookie') != null) {
            console.log("New cookie")
        }

        console.log("Received server response at " + this.responseTime)
        console.log("Difference between generated stamp and actual = " + (this.responseGeneratedTimestamp - this.responseTimestamp))

        if (Math.abs(Date.parse(r.generatedTimestamp) - Date.parse(responseHeaders.get('date')).toString()) > 2000) console.log("\nFAIL\n");
    }

    fin = async (r) => {
        console.log("[ " + r.generatedTimestamp + " ]")
        if (r.statusCode != '200') {
            console.log(r.statusCode)
        }	
    }
}

module.exports = {

    DebugLogger
}