class CSRFClient {
    static pendingRequest = null;

    static async getCSRFToken() {
        if (this.pendingRequest) {
            return this.pendingRequest;
        }

        this.pendingRequest = (async () => {
            try {
                const response = await fetch('/api/csrf-token', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to get CSRF token');
                }

                const data = await response.json();
                return data.csrfToken;
            } catch (error) {
                console.error('CSRF Token fetch error:', error);
                throw error;
            } finally {
                this.pendingRequest = null;
            }
        })();

        return this.pendingRequest;
    }

    static async withCSRF(fetchFunction) {
    try {
        const csrfToken = await this.getCSRFToken()
        return await fetchFunction(csrfToken)
    } catch (error) {
        console.error('CSRF protected request failed:', error)
        throw error
    }
}

    static async fetchWithCSRF(url, options = {}) {
    return this.withCSRF(async (csrfToken) => {
        const mergedOptions = {
            ...options,
            headers: {
                ...options.headers,
                'X-CSRF-Token': csrfToken,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        }
        return fetch(url, mergedOptions)
    })
}
}

export default CSRFClient