import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CSRFClient from '@/lib/csrf-client';

// Global variables - component se bahar
let csrfTokenPromise = null;
let globalInitialized = false; // ✅ Global flag

export function useAuth() {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [csrfReady, setCsrfReady] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // ✅ Global flag check karo
        if (globalInitialized) return;
        globalInitialized = true;

        const initializeCSRF = async () => {
            try {
                if (!csrfTokenPromise) {
                    console.log('🔄 CSRF Token fetching...');
                    csrfTokenPromise = CSRFClient.getCSRFToken();
                }
                await csrfTokenPromise;
                setCsrfReady(true);
                console.log('✅ CSRF Ready');
            } catch (error) {
                console.error('❌ CSRF initialization failed:', error);
                setCsrfReady(true); // ✅ Error mein bhi csrfReady true karo taki user try kar sake
            }
        };

        initializeCSRF();
    }, []);

    const login = async (email, password) => {
        if (!csrfReady) {
            throw new Error('Security not initialized. Please wait...');
        }

        setIsLoading(true);
        try {
            const response = await CSRFClient.fetchWithCSRF('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }), // ✅ headers remove karo, fetchWithCSRF already handle karega
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Login failed');
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
            if (csrfReady) {
                await CSRFClient.fetchWithCSRF('/api/auth/logout', {
                    method: 'POST',
                });
            }
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
        isLoading,
        csrfReady
    };
}