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
            if (session?.user) {
                const userWithProfile = await fetchUserProfile(session.user);
                setUser(userWithProfile);
            } else {
                setUser(null);
            }
            setLoading(false);
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
