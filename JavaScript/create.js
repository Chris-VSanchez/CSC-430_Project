// -----------------------------
// USER INPUT + PREVIEW SETUP
// -----------------------------
const userForm = document.getElementById("eventForm");

const inputs = {
    title: document.getElementById("eventTitle"),
    date: document.getElementById("eventDate"),
    time: document.getElementById("eventTime"),
    location: document.getElementById("eventLocation"),
    description: document.getElementById("eventDescription"),
    image: document.getElementById("eventImage")
};

Object.values(inputs).forEach(input => {
    input.addEventListener("input", updatePreview);
});

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

function requireSession() {
    if (!getSession()) {
        window.location.href = "registration.html";
        return false;
    }
    return true;
}

requireSession();

// Restore session so RLS works
const session = getSession();
if (session) {
    supabaseClient.auth.setSession(session);
}

// -----------------------------
// PREVIEW MODAL
// -----------------------------
const eventModal = new bootstrap.Modal(document.getElementById("previewModal"), { focus: false });

const preview = {
    title: document.getElementById("titlePreview"),
    date: document.getElementById("datePreview"),
    time: document.getElementById("timePreview"),
    location: document.getElementById("locationPreview"),
    description: document.getElementById("descriptionPreview"),
    image: document.getElementById("imagePreview")
};

// -----------------------------
// HELPERS
// -----------------------------
function formatDate(date) {
    if (!date) return "Month Day, Year";
    const [year, month, day] = date.split("-");
    const formattedDate = new Date(year, month - 1, day);
    return formattedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function formatTime(time) {
    if (!time) return "Time";
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

function clearTime() {
    inputs.time.value = "";
    updatePreview();
}

function showModal() {
    eventModal.show();
}

function buildEventDate() {
    if (!inputs.date.value) return "";
    if (!inputs.time.value) return inputs.date.value;
    return `${inputs.date.value}T${inputs.time.value}:00`;
}

// -----------------------------
// UPDATE PREVIEW
// -----------------------------
function updatePreview() {
    const userEvent = {
        title: inputs.title.value || "Your Event Title",
        date: formatDate(inputs.date.value),
        time: formatTime(inputs.time.value),
        location: inputs.location.value || "Event location",
        description: inputs.description.value || "Your event description will appear here.",
        image: inputs.image.value || ""
    };

    preview.title.textContent = userEvent.title;
    preview.date.textContent = `${userEvent.date} • ${userEvent.time}`;
    preview.location.textContent = userEvent.location;
    preview.description.textContent = userEvent.description;
    preview.image.src = userEvent.image;
}

// -----------------------------
// CREATE EVENT (SUPABASE DIRECT)
// -----------------------------
async function createEvent(eventData) {
    const session = getSession();
    if (!session?.user?.id) throw new Error("User not authenticated");

    const { data, error } = await supabaseClient
        .from("events")
        .insert([{
            title: eventData.title,
            description: eventData.description,
            event_date: eventData.event_date,
            location: eventData.location,
            image: eventData.image,
            user_id: session.user.id
        }])
        .select()
        .single();

    if (error) throw new Error(error.message || "Unable to create event");
    return data;
}

// -----------------------------
// FORM SUBMIT
// -----------------------------
userForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        title: inputs.title.value.trim(),
        description: inputs.description.value.trim(),
        event_date: buildEventDate(),
        location: inputs.location.value.trim(),
        image: inputs.image.value.trim()
    };

    if (!payload.title || !payload.event_date) {
        window.alert("Please enter an event title and date before creating it.");
        return;
    }

    try {
        await createEvent(payload);
        window.alert("Event created successfully.");
        window.location.href = "events.html";
    } catch (error) {
        console.error("Error creating event:", error);
        window.alert(error.message);
    }
});

// -----------------------------
// RESET MODAL ON CLOSE
// -----------------------------
document.getElementById("previewModal").addEventListener("hidden.bs.modal", () => {
    userForm.reset();
    preview.title.textContent = "Your Event Title";
    preview.date.textContent = "Month Day, Year • Time";
    preview.location.textContent = "Event location";
    preview.description.textContent = "Your event description will appear here.";
    preview.image.src = "";
});
