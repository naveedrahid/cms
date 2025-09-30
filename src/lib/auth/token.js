import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'hJtQzluxehhIRG850fQrJriAK9htUu+mu7MbU/Jxfn7Xt6jZ1ZiTmWoA6PGy7n8dfD2R39jEs9hY3Id13E5xA==';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

export class TokenService {
    static generateAccessToken(payload) {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            issuer: 'cms-app',
            subject: payload.userId?.toString()
        })
    }

    static generateRefreshToken(payload) {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: REFRESH_EXPIRES_IN,
            issuer: 'cms-app',
        })
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET)
        } catch (error) {
            throw new Error('Invalid or expired token')
        }
    }

    static decodeToken(token) {
        return jwt.decode(token);
    }
}