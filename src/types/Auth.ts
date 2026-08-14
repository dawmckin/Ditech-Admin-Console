import type { User } from "./User";

export interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null
    signIn: (email: string, password: string) => Promise<User>;
    signOut: () => Promise<void>;
    sendResetEmail: (email: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}