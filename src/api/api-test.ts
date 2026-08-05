import { supabase } from "../lib/supabase"

export default async function ApiTest() {

    const { data } = await supabase
        .from("users")
        .select("*")

    console.log(data)

    return 'hello';
}