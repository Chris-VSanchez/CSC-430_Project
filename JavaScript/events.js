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

        card.innerHTML = `
            <img src="${event.image || 'default.jpg'}" class="event-img" />

            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${new Date(event.event_date).toLocaleString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p>${event.description}</p>

            <div class="event-actions">
                ${session ? `<button class="join-btn">Join Event</button>` 
                          : `<button class="login-btn">Login to Join</button>`}

                ${isOwner ? `
                    <button class="edit-btn" data-id="${event.id}">Edit</button>
                    <button class="delete-btn" data-id="${event.id}">Delete</button>
                ` : ""}
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

// -----------------------------
// INIT
// -----------------------------
loadEvents();
