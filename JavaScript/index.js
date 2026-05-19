// -----------------------------
// SESSION + SUPABASE CLIENT
// -----------------------------
const SESSION_KEY = "3ce_supabase_session";
const SUPABASE_URL = "https://wvcrlyrdahimcennyhec.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Y3JseXJkYWhpbWNlbm55aGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTYwNTYsImV4cCI6MjA5MTU5MjA1Nn0.Lk5otEqUcyJvlxX3HrSbqsTfVvdpqhAvgzMl35pUcIE";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );

function getSession()
{
    return JSON.parse(
        localStorage.getItem(SESSION_KEY) || "null"
    );
}

async function init()
{
    try
    {
        const savedSession = getSession();

        if(savedSession)
        {
            await supabaseClient.auth.setSession(savedSession);
        }

        const {
            data: { session }
        } = await supabaseClient.auth.getSession();

        if(session)
        {
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );

            const navbarName =
                document.getElementById("navbarName");

            if(navbarName)
            {
                navbarName.innerHTML =
                    session.user.email;
            }
        }
    }

    catch(err)
    {
        console.error(err);
    }
}

init();