  import { pool } from '@/config/db'
  import bcrypt from 'bcryptjs'

  class AuthService {
    static async register(userData) {
      const client = await pool.connect();
      try {
        const existingUserResult = await client.query(
          'SELECT id FROM users WHERE email = $1',
          [userData.email]
        );

        if (existingUserResult.rows.length > 0) {
          throw new Error('User already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const result = await client.query(
          `INSERT INTO users (name, email, password, role, is_verified) 
          VALUES ($1, $2, $3, $4, $5) 
          RETURNING id, name, email, role, is_verified, created_at`,
          [userData.name, userData.email, hashedPassword, 'user', false]
        );

        const user = result.rows[0];

        return {
          success: true,
          user: user,
          message: 'User registered successfully'
        };

      } catch (error) {
        console.error("❌ AuthService error:", error);
        throw error;
      } finally {
        client.release();
      }
    }

    static async login(email, password) {
      const client = await pool.connect()
      try {        
        const result = await client.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        )
        
        if (result.rows.length === 0) {
          throw new Error('Invalid email or password')
        }
        
        const user = result.rows[0]
        const isValidPassword = await bcrypt.compare(password, user.password)
        
        if (!isValidPassword) {
          throw new Error('Invalid email or password')
        }

        const { password: _, ...userWithoutPassword } = user;

        return {
          success: true,
          user: userWithoutPassword,
          message: 'Login successful'
        }
      } catch (error) {
        console.error("❌ AuthService - Login error:", error.message)
        throw error;
      } finally {
        client.release()
      }
    }
  }

  export default AuthService