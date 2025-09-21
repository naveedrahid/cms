import bcrypt from 'bcryptjs'

export async function hashPassword(password) {
    try {
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    } catch (error) {
        console.error('Password hashing error:', error)
        throw new Error('Password hashing failed')
    }
}

export async function comparePassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword)
        return isMatch
    } catch (error) {
        console.error('Password comparison error:', error)
        throw new Error('Password comparison failed')
    }
}

export async function validatePasswordStrength(password) {
    const minLength = 6
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    const isStrong = (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar
    )

    return {
        isValid: password.length >= minLength,
        isStrong,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar,
        minLength
    }
}