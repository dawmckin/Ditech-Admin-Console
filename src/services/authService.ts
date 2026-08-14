import type { User as SupabaseUser } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export async function signIn(email: string, password: string): Promise<SupabaseUser> {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});

    if(error) {
        throw error;
    }

    if(!data.user) {
        throw new Error('Unable to retrieve authenticated user');
    }

    return data.user;
}

export async function signOut(): Promise<void> {
    const {error} = await supabase.auth.signOut();

    if(error) {
        throw error;
    }
}

export async function getCurrentSession() {
    const {data: {session}, error} = await supabase.auth.getSession();

    if(error) {
        throw error;
    }

    return session;
}

export async function getUserProfile(userId: string) {
    const {data, error} = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single();

    if(error) {
        throw error;
    }

    return data;
}  

export async function sendResetEmail(email: string): Promise<void> {
    const {error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
    });

    if(error) {
        throw error;
    }
}

export async function resetPassword(password: string): Promise<void> {
    const {error} = await supabase.auth.updateUser({password});

    if(error) {
        throw error;
    }
}