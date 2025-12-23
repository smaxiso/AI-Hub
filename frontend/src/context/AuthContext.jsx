import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null); // Added session state
    const [streak, setStreak] = useState(null);
    const [loading, setLoading] = useState(true);
    const userRef = useRef(user);

    // Keep userRef synced with user state
    useEffect(() => {
        userRef.current = user;
    }, [user]);

    // Simple cache to prevent rapid re-fetching
    const lastFetchTime = useRef(0);
    const profileFetchPromise = useRef(null);

    const fetchUserProfile = async (userId) => {
        if (!userId) return; // Ensure we have a userId to fetch for

        const now = Date.now();
        const currentUser = userRef.current;

        // If fetched less than 10 seconds ago AND we already have a profile, skip
        // This prevents unnecessary backend calls if the user object already has profile data
        if (now - lastFetchTime.current < 10000 && currentUser?.profile && currentUser.id === userId) {
            return; // No need to refetch
        }

        // If a fetch is already in progress for this user, wait for it
        if (profileFetchPromise.current) {
            return profileFetchPromise.current;
        }

        console.log(`AuthContext: fetchUserProfile called for ${userId}`);

        profileFetchPromise.current = (async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();
                if (!currentSession || currentSession.user.id !== userId) {
                    // Session expired or user changed, clear promise and return
                    profileFetchPromise.current = null;
                    return;
                }

                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
                const res = await fetch(`${API_URL}/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
                });

                if (res.ok) {
                    const profile = await res.json();
                    if (profile) {
                        console.log('AuthContext: Background Profile Update', profile.role);
                        setUser(currentUser => {
                            // Deep compare to prevent re-render if identical
                            if (currentUser?.profile?.updated_at === profile.updated_at &&
                                currentUser?.role === profile.role &&
                                currentUser?.id === userId) {
                                return currentUser;
                            }
                            // Merge new profile data into the existing user object
                            return { ...currentUser, ...currentSession.user, role: profile.role, profile };
                        });
                        lastFetchTime.current = Date.now();
                    }

                    // Fetch Streak Data (in parallel or sequence)
                    const streakRes = await fetch(`${API_URL}/gamification/streak/check`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${currentSession.access_token}` }
                    });
                    if (streakRes.ok) {
                        const streakData = await streakRes.json();
                        setStreak(streakData.streak?.current_streak || 0);
                    }
                } else {
                    console.error('AuthContext: Backend fetch failed with status', res.status);
                    // If backend fetch fails, ensure user state is consistent (e.g., no profile)
                    setUser(currentUser => {
                        if (currentUser?.id === userId) {
                            return { ...currentUser, profile: null, role: 'authenticated' };
                        }
                        return currentUser;
                    });
                }
            } catch (err) {
                console.error('AuthContext: Error fetching profile:', err);
                // On error, ensure user state is consistent (e.g., no profile)
                setUser(currentUser => {
                    if (currentUser?.id === userId) {
                        return { ...currentUser, profile: null, role: 'authenticated' };
                    }
                    return currentUser;
                });
            } finally {
                profileFetchPromise.current = null; // Clear the promise regardless of success/failure
            }
        })();

        return profileFetchPromise.current;
    };

    const refreshUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            await fetchUserProfile(session.user.id);
        }
    };

    useEffect(() => {
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('AuthContext: Auth change event', event);
            setSession(session); // Update session state

            if (session?.user) {
                // 1. OPTIMISTIC LOGIN: Show UI Immediately
                console.log('AuthContext: Optimistic Login (Immediate)');
                setUser(prev => prev?.id === session.user.id ? prev : { ...session.user, role: 'authenticated' });
                setLoading(false);

                // 2. BACKGROUND FETCH: Get Profile/Role
                fetchUserProfile(session.user.id);

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
        session, // Expose session
        streak,
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
