const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
    // ponytail: don't throw in test/CI — lets unit tests import modules that transitively require this
    if (process.env.NODE_ENV === 'test') {
        module.exports = { supabase: null };
        return;
    }
    throw new Error('Supabase configuration missing');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
