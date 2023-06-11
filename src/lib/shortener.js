import { supabase } from '@/lib/supabaseClient'
import { nanoid } from 'nanoid'

const Shortener = async ()  => {
    let shortened;
    let unique = false;

    const { data: countData , count } = supabase.from('urls').select('*', { count: 'exact', head: true }) // Checking table count
    if (!countData && !count) { // if no results from table set unique to true and generate shortened id
        unique = true
        shortened = nanoid(7)
    }

    // shortened = nanoid(7) // generates a 7-char unique identifier
    while (!unique) {
        shortened = nanoid(7)  // generates a 7-char unique identifier
        try {
            const { data, error } = await supabase
                .from('urls')
                .select('short_uri')
                .eq('short_uri', shortened)
                .limit(1)

            // If no data is returned, then the shortened URL is unique
            unique = !data;
        } catch (error) {
            return {
                shortened: null,
                error: error.message
            }
        }
    }

    return {
        shortened: shortened,
        error: null
    }
}


export default Shortener