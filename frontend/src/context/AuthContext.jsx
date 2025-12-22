import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (authUser) => {
        if (!authUser) return null;
        console.log('AuthContext: fetchUserProfile called for', authUser.id);

        try {
            // Create a timeout promise (Short timeout for backend call)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout')), 2000)
            );

            // Fetch from Backend API (Bypasses RLS)
            const fetchPromise = (async () => {
                const { data: { session } } = await supabase.auth.getSession();
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/profile`, {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`
                    }
                });
                if (!res.ok) throw new Error('Backend fetch failed');
                return res.json();
            })();

            const profile = await Promise.race([fetchPromise, timeoutPromise]);

            return {
                ...authUser,
                profile,
                role: profile?.role || 'authenticated'
            };
        } catch (err) {
            console.error('AuthContext: Error fetching profile:', err);
            // Return user without profile on error to allow login
            return {
                ...authUser,
                profile: null,
                role: 'authenticated'
            };
        }
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const userWithProfile = await fetchUserProfile(session.user);
            setUser(userWithProfile);
        }
    };

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: Auth change event', event);

            if (session?.user) {
                // 1. OPTIMISTIC LOGIN: Show UI Immediately
                // Default to 'authenticated' role so they can see Learner UI
                console.log('AuthContext: Optimistic Login (Immediate)');
                setUser({ ...session.user, role: 'authenticated' });
                setLoading(false);

                // 2. BACKGROUND FETCH: Get Profile/Role silently
                fetchUserProfile(session.user).then(fullUser => {
                    if (fullUser?.profile) {
                        console.log('AuthContext: Background Profile Update', fullUser.role);
                        setUser(fullUser); // Update state with Admin role if found
                    }
                }).catch(err => console.warn('AuthContext: Background fetch failed', err));

            } else {
                console.log('AuthContext: No session');
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        refreshUser,
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
