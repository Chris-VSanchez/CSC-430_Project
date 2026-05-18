const SUPABASE_URL = "https://wvcrlyrdahimcennyhec.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Y3JseXJkYWhpbWNlbm55aGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTYwNTYsImV4cCI6MjA5MTU5MjA1Nn0.Lk5otEqUcyJvlxX3HrSbqsTfVvdpqhAvgzMl35pUcIE";
const SESSION_KEY = "3ce_supabase_session";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authForm = document.getElementById("authForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const authStatus = document.getElementById("authStatus");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

function setStatus(message, isError = false)
{
    authStatus.textContent = message;
    authStatus.className = isError ? "text-danger" : "text-success";
}

async function saveSession()
{
    const { data } = await supabaseClient.auth.getSession();

    if (data.session)
    {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
        return data.session;
    }

    localStorage.removeItem(SESSION_KEY);
    return null;
}

async function signUp()
{
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!email || !password)
    {
        setStatus("Email and password are required.", true);
        return;
    }

    if (password !== confirmPassword)
    {
        setStatus("Passwords do not match.", true);
        return;
    }

    const { error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error)
    {
        setStatus(error.message, true);
        return;
    }

    await saveSession();
    setStatus("Account created. If email confirmation is enabled, check your inbox and then sign in.");
}

async function signIn()
{
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password)
    {
        setStatus("Email and password are required.", true);
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error)
    {
        setStatus(error.message, true);
        return;
    }

    await saveSession();
    setStatus("Signed in. Redirecting to your events...");
    window.location.href = "events.html";
}

async function signOut()
{
    const { error } = await supabaseClient.auth.signOut();

    if (error)
    {
        setStatus(error.message, true);
        return;
    }

    localStorage.removeItem(SESSION_KEY);
    setStatus("Signed out.");
}

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await signUp();
});

loginBtn.addEventListener("click", async () => {
    await signIn();
});

logoutBtn.addEventListener("click", async () => {
    await signOut();
});

supabaseClient.auth.getSession().then(async ({ data }) => {
    if (data.session)
    {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
        document.getElementById("navbarName").innerHTML = `${data.session.user.email}`;
        setStatus(`Signed in as ${data.session.user.email}`);
    }
});