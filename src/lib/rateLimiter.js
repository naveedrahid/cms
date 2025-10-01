class RateLimiter {
    constructor(maxRequest, windowMs){
        this.maxRequest =  maxRequest
        this.windowMs = windowMs
        this.requests = new Map()
    }

    isAllowed(identifier){
        const now = Date.now()
        const windowStart = now - this.windowMs

        if (!this.requests.has(identifier)) {
            this.requests.set(identifier, [])
        }

        const userRequests = this.requests.get(identifier)

        while(userRequests.length > 0 && userRequests[0] < this.windowMs){
            userRequests.shift()
        }

        if (userRequests.length < this.maxRequest) {
            userRequests.push(now)
            return true
        }
        return false
    }

    cleanup(){
        const now = Date.now()
        const windowStart = now - this.windowMs

        for (const [identifier, requests] of this.requests.entries()) {
            const validRequests = requests.filter(time => time > windowStart)
            if (validRequests.length === 0) {
                this.requests.delete(identifier)
            } else {
                this.requests.set(identifier ,validRequests)
            }
        }
    }
}

export const authRateLimiter =  new RateLimiter(5, 15 * 60 * 1000)
export const apiRateLimiter =  new RateLimiter(100, 60 * 1000)

setInterval(() => {
    authRateLimiter.cleanup()
    apiRateLimiter.cleanup()
}, 60000);