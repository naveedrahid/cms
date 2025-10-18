import { useState, useCallback } from 'react'

export function usePagination(fetchFunction, initialPage = 1, initialLimit = 10) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [pagination, setPagination] = useState({
        currentPage: initialPage,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: initialLimit
    })

    const fetchData = useCallback(async (page = initialPage, limit = initialLimit) => {
        try {
            setLoading(true)
            setError('')
            const result = await fetchFunction(page, limit)

            setData(result.data || [])
            setPagination(result.pagination || {
                currentPage: page,
                totalPages: 1,
                totalItems: result.data?.length || 0,
                itemsPerPage: limit
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [fetchFunction, initialPage, initialLimit])

    const goToPage = (page) => {
        fetchData(page, pagination.itemsPerPage)
    }

    const setItemsPerPage = (limit) => {
        fetchData(1, limit)
    }

    return {
        data,
        loading,
        error,
        pagination,
        goToPage,
        setItemsPerPage,
        refetch: () => fetchData(pagination.currentPage, pagination.itemsPerPage)
    }
}