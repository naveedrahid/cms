import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || result.error || 'Login failed');
            }

            setAccessToken(result.accessToken);
            setUser(result.user);
            return result;
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAccessToken(null);
            setUser(null);
            router.push('/auth/login');
        }
    };

    return {
        accessToken,
        user,
        login,
        logout,
        isLoading
    };
}