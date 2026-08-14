import { supabase } from "../lib/supabase";
import type { User } from "../types/User";

export async function getUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select(`*`)
        .order('last_name');

    if(error) {
        throw Error;
    }

    return data;
}