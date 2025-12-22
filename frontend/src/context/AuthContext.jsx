import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (authUser) => {
        if (!authUser) return null;

        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            return {
                ...authUser,
                profile,
                role: profile?.role || 'authenticated'
            };
        } catch (err) {
            console.error('Error fetching profile:', err);
            return authUser;
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
        let isMounted = true;

        // Check active session
        const getSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (isMounted) {
                    if (session?.user) {
                        try {
                            const userWithProfile = await fetchUserProfile(session.user);
                            setUser(userWithProfile);
                        } catch (err) {
                            console.error('Failed to fetch profile during init:', err);
                            setUser(session.user);
                        }
                    }
                    setLoading(false);
                }
            } catch (err) {
                console.error('Session check failed:', err);
                if (isMounted) setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return;

            if (session?.user) {
                try {
                    const userWithProfile = await fetchUserProfile(session.user);
                    setUser(userWithProfile);
                } catch (err) {
                    console.error('Failed to fetch profile on auth change:', err);
                    setUser(session.user);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
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
