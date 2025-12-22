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
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
            );

            // Race between fetch and timeout
            const fetchPromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            const { data: profile, error } = await Promise.race([fetchPromise, timeoutPromise]);

            if (error) {
                console.error('AuthContext: Profile fetch error', error);
                throw error;
            }

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
        // Check active session
        const getSession = async () => {
            console.log('AuthContext: Checking session...');
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                console.log('AuthContext: Session retrieved', session ? 'User found' : 'No user', error);

                if (session?.user) {
                    console.log('AuthContext: Fetching profile...');
                    const userWithProfile = await fetchUserProfile(session.user);
                    console.log('AuthContext: Profile fetched', userWithProfile);
                    setUser(userWithProfile);
                }
            } catch (err) {
                console.error('AuthContext: Error getting session', err);
            } finally {
                console.log('AuthContext: Loading finished');
                setLoading(false);
            }
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: Auth change event', event);
            try {
                if (session?.user) {
                    console.log('AuthContext: Fetching profile for listener...');
                    const userWithProfile = await fetchUserProfile(session.user);
                    console.log('AuthContext: Profile fetched for listener', userWithProfile);
                    setUser(userWithProfile);
                } else {
                    console.log('AuthContext: No session in listener');
                    setUser(null);
                }
            } catch (err) {
                console.error('AuthContext: Listener error', err);
            } finally {
                console.log('AuthContext: Loading finished (listener)');
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
