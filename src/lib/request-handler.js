export class RequestHandler {
    static withTimeout(handler, timeoutMs = 10000) {
        return async (request) => {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
            )

            try {
                const result = await Promise.race([handler(request), timeoutPromise])
                return result
            } catch (error) {
                console.error('Request Handler Error:', error)

                if (error.message === 'Request timeout') {
                    return new Response(
                        JSON.stringify({
                            success: false,
                            error: 'Request timeout',
                            message: 'Please try again later'
                        }),
                        {
                            status: 408,
                            headers: { 'Content-Type': 'application/json' }
                        }
                    )
                }

                return new Response(
                    JSON.stringify({
                        success: false,
                        error: 'Internal server error'
                    }),
                    {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
            }
        }
    }

    static validateContentType(request) {
        const contentType = request.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: 'Invalid content type. Only JSON accepted'
                }),
                {
                    status: 415,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }
        return null
    }

    static checkBodySize(request, maxSizeMB = 5) {
        const contentLength = request.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > maxSizeMB * 1024 * 1024) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: `Request body too large. Maximum ${maxSizeMB}MB allowed`
                }),
                {
                    status: 413,
                    headers: { 'Content-Type': 'application/json' }
                }
            )
        }
        return null
    }
}