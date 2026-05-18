// -----------------------------
// SESSION + SUPABASE CLIENT
// -----------------------------
const SESSION_KEY = "3ce_supabase_session";
const SUPABASE_URL = "https://wvcrlyrdahimcennyhec.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Y3JseXJkYWhpbWNlbm55aGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTYwNTYsImV4cCI6MjA5MTU5MjA1Nn0.Lk5otEqUcyJvlxX3HrSbqsTfVvdpqhAvgzMl35pUcIE";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getSession() {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

const session = getSession();
if (session) {
    supabaseClient.auth.setSession(session);
}

const currentUserId = session?.user?.id || null;

// -----------------------------
// LOAD EVENTS
// -----------------------------
async function loadEvents() {
    const { data: events, error } = await supabaseClient
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

    if (error) {
        console.error("Error loading events:", error);
        return;
    }

    renderEvents(events);
}

// -----------------------------
// RENDER EVENTS
// -----------------------------
function renderEvents(events) {
    const container = document.getElementById("events");
    container.innerHTML = "";

    if (!events.length) {
        container.innerHTML = "<p>No events found.</p>";
        return;
    }

    events.forEach(event => {
        const isOwner = currentUserId === event.user_id;

        const card = document.createElement("div");
        card.className = "event-card";

        card.innerHTML =
        `
        <div class = "event-card">
            <img class = "event-image" src = "${event.image || ""}">
            <div class = "event-body">
                <h5 class = "event-title">${event.title}</h5>
                <p class = "event-date"> ${new Date(event.event_date).toLocaleString()}</p>
                <p class = "event-location"> ${event.location || "TBA"}</p>
                <p class = "event-description">${event.description || "No description available."}</p>
                <a href="#" class="btn btn-3ce w-100">View Details</a>
            </div>
        </div>
        `;

        container.appendChild(card);
    });

    attachEventListeners();
}

// -----------------------------
// ATTACH BUTTON LISTENERS
// -----------------------------
function attachEventListeners() {
    // Login button
    document.querySelectorAll(".login-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = "registration.html";
        });
    });

    // Join button
    document.querySelectorAll(".join-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            alert("Joined event! (RSVP system coming next)");
        });
    });

    // Edit button
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            window.location.href = `edit-event.html?id=${id}`;
        });
    });

    // Delete button
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = e.target.dataset.id;
            if (!confirm("Are you sure you want to delete this event?")) return;

            const { error } = await supabaseClient
                .from("events")
                .delete()
                .eq("id", id);

            if (error) {
                alert("Failed to delete event.");
                console.error(error);
                return;
            }

            alert("Event deleted.");
            loadEvents();
        });
    });
}
supabaseClient.auth.getSession().then(async ({ data }) => {
    if (data.session)
    {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
        document.getElementById("navbarName").innerHTML = `${data.session.user.email}`;
    }
});

// -----------------------------
// INIT
// -----------------------------
loadEvents();
