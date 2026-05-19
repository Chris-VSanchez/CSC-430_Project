// -----------------------------
// SESSION + SUPABASE CLIENT
// -----------------------------
const SESSION_KEY = "3ce_supabase_session";
const SUPABASE_URL = "https://wvcrlyrdahimcennyhec.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2Y3JseXJkYWhpbWNlbm55aGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTYwNTYsImV4cCI6MjA5MTU5MjA1Nn0.Lk5otEqUcyJvlxX3HrSbqsTfVvdpqhAvgzMl35pUcIE";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUserId = null;

function getSession()
{
    return JSON.parse(
        localStorage.getItem(SESSION_KEY) || "null"
    );
}

// -----------------------------
// INIT
// -----------------------------
async function init() 
{
    try
    {
        // Restore saved session
        const savedSession = getSession();

        if( savedSession)
        {
            const { error } = await supabaseClient.auth.setSession(savedSession);

            if( error)
            {
                console.error(
                    "Session restore failed:",
                    error.message
                );
            }
        }

        // Get active session from Supabase
        const { data: { session } } = await supabaseClient.auth.getSession();

        // User logged in
        if( session)
        {
            // Save latest session
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(session)
            );

            // Save user id globally
            currentUserId = session.user.id;

            // Update navbar
            const navbarName = document.getElementById("navbarName");

            if( navbarName)
                navbarName.innerHTML = session.user.email;
        }

        // Load events
        await loadEvents();
    }
    
    catch( err)
    {
        console.error("Init failed:", err);
    }
}

// -----------------------------
// LOAD EVENTS
// -----------------------------
async function loadEvents() 
{
    const { data: events, error } = await supabaseClient
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

    console.log("EVENTS:", events);
    console.log("ERROR:", error);

    if( error) 
    {
        console.error("Error loading events:", error);
        return;
    }

    renderEvents(events);
}

// -----------------------------
// RENDER EVENTS
// -----------------------------
function renderEvents(events) 
{
    const container = document.getElementById("events");
    container.innerHTML = "";

    if( !events.length) 
    {
        container.innerHTML = 
        `   <p style = "text-align: center;">
                No events found.
            </p> `;
        return;
    }

    events.forEach(event => {
        const isOwner = currentUserId === event.user_id;

        const card = document.createElement("div");
        card.className = "event-card";

        card.innerHTML = 
        `   <img class="event-image" src="${event.image || ""}">
    
            <div class="event-body">
                <h5 class = "event-title">${event.title}</h5>

                <p class = "event-date">
                    ${ new Date(event.event_date).toLocaleDateString("en-US",
                        {
                            timeZone: "America/New_York",
                            dateStyle: "medium"
                        })
                    }

                    •

                    ${ new Date(event.event_date).toLocaleTimeString("en-US",
                        {
                            timeZone: "America/New_York",
                            timeStyle: "short"
                        })
                    }
                </p>

                <p class = "event-location">
                    ${event.location || "TBA"}
                </p>

                <p class = "event-description">
                    ${event.description || "No description available."}
                </p>

                <a class = "btn btn-3ce w-100">
                    View Details
                </a>
            </div>  `;

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
// Start App
// -----------------------------
init();