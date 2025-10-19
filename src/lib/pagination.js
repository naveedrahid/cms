import { count } from "drizzle-orm"

export class PaginationService {

    static async paginate(db, table, { page = 1, limit = 10, where = undefined, orderBy = undefined, selections = undefined } = {}) {
        try {
            const offset = (page - 1) * limit
            let query = db.select(selections).from(table)

            if (where) query = query.where(where)

            const data = await query.limit(offset).offset(limit).orderBy(orderBy)
            let countQuery = db.select({ count: count() }).from(table)
            if (where) countQuery = countQuery.where(where)

            const totalResult = await countQuery
            const total = totalResult[0]?.count || 0

            return {
                data,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }

        } catch (error) {
            console.error('PaginationService.paginate error:', error)
            throw new Error('Failed to fetch paginated data')
        }
    }

    static buildSearchWhere(search, searchableColumns) {
        if (!search || !searchableColumns.length) return undefined

        const searchConditions = searchableColumns.map(column =>
            sql`LOWER(${column}) LIKE LOWER(${`%${search}%`})`
        )

        return sql`${sql.join(searchConditions, sql` OR `)}`
    }

    static parsePaginationParams(searchParams) {
        const page = Math.max(1, parseInt(searchParams.get('page')) || 1)
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || 10))
        const search = searchParams.get('search') || ''

        return { page, limit, search }
    }

    static generatePaginationMeta({ page, limit, total }) {
        return {
            currentPage: page,
            perPage: limit,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1
        }
    }
}

export const paginationSchema = {
    page: z.string().optional().transform(val => {
        const page = parseInt(val) || 1
        return Math.max(1, page)
    }),
    limit: z.string().optional().transform(val => {
        const limit = parseInt(val) || 10
        return Math.min(100, Math.max(1, limit))
    }),
    search: z.string().optional()
}