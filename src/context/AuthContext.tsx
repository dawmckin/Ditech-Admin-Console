import { 
    createContext, 
    useCallback, 
    useEffect, 
    useState, 
    type ReactNode 
} from "react";

import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

import type { User } from "../types/User";
import type { AuthContextType } from "../types/Auth";

import { 
    getCurrentSession,
    getUserProfile,
    signIn as authSignIn,
    signOut as authSignOut,
    sendResetEmail as authSendResetEmail,
    resetPassword as authResetPassword
} from "../services/authService";

interface AuthContextProps {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: AuthContextProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadUserProfile = useCallback(async (authUser: SupabaseUser | null): Promise<User | null> => {
        if(!authUser) {
            setUser(null);
            return null;
        }

        const data = await getUserProfile(authUser.id);

        setUser(data as User); 
        return data as User;
    }, []);

    const signIn = useCallback(async (email: string, password: string): Promise<User> => {
        setLoading(true);
        setError(null);

        try {
            const authUser = await authSignIn(email, password);
            
            const appUser = await loadUserProfile(authUser);

            if(!appUser) {
                throw new Error('Unable to load user profile');
            }

            return appUser;
        } catch(err) {
            const message = err instanceof Error ? err.message : 'Unable to sign in';

            setError(message);
            setUser(null);

            throw err;
        } finally {
            setLoading(false);
        }
    }, [loadUserProfile]);

    const signOut = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await authSignOut();

            setUser(null);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unable to sign out'

            setError(message);

            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const sendResetEmail = useCallback(async (email: string) => {
        setLoading(true);
        setError(null);

        try {
            await authSendResetEmail(email);
        } catch(err) {
            const message = (err instanceof Error) ? err.message : 'Unable to send reset password email';

            setError(message);
        } finally {
            setLoading(false);
        }

    }, []);

    const resetPassword = useCallback(async (password: string): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await authResetPassword(password);
        } catch (err) {
            const message = (err instanceof Error) ? err.message : 'Unable to reset password';

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);

            const session = await getCurrentSession();

            if(!session) {
                setLoading(false);
                return;
            }

            await loadUserProfile(session?.user ?? null);

            setLoading(false);
        }

        initializeAuth();

        const {data: {subscription}} = supabase.auth.onAuthStateChange(async (_event, session) => {
            await loadUserProfile(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [loadUserProfile]);

    return (
        <AuthContext.Provider
            value={{user, loading, error, signIn, signOut, sendResetEmail, resetPassword}}
        >
            {children}
        </AuthContext.Provider>
    );
}