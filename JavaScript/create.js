// User Input
const userForm = document.getElementById("eventForm");

const inputs = 
{
    title: document.getElementById("eventTitle"),
    date: document.getElementById("eventDate"),
    time: document.getElementById("eventTime"),
    location: document.getElementById("eventLocation"),
    description: document.getElementById("eventDescription"),
    image: document.getElementById("eventImage")
};

Object.values(inputs).forEach(input => { input.addEventListener("input", updatePreview); });

// Modal View and Updater
const eventModal = new bootstrap.Modal(document.getElementById("previewModal"), { focus: false });

const preview = 
{
    title: document.getElementById("titlePreview"),
    date: document.getElementById("datePreview"),
    time: document.getElementById("timePreview"),
    location: document.getElementById("locationPreview"),
    description: document.getElementById("descriptionPreview"),
    image: document.getElementById("imagePreview")
};

function formatDate(date)
{
    if( !date)
        return "Month Day, Year";

    const [year, month, day] = date.split("-");

    const formattedDate = new Date(year, month - 1, day);

    return formattedDate.toLocaleDateString(undefined, 
    {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function formatTime(time)
{
    if( !time)
        return "Time";

    const [hour, minute] = time.split(":");
    
    const date = new Date();

    date.setHours(hour, minute);

    return date.toLocaleTimeString([], 
    {
        hour: "numeric",
        minute: "2-digit"
    });
}

function clearTime()
{
    inputs.time.value = "";
    updatePreview();
}

function showModal()
{
    eventModal.show();
}

function updatePreview()
{
// Get form data
    const userEvent = 
    {
        title: inputs.title.value || "Your Event Title",
        date: formatDate(inputs.date.value),
        time: formatTime(inputs.time.value),
        location: inputs.location.value || "Event location",
        description: inputs.description.value || "Your event description will appear here.",
        image: inputs.image.value || ""
    };

// Update modal preview
    preview.title.textContent = userEvent.title;
    preview.date.textContent = `${userEvent.date} • ${userEvent.time}`;
    preview.location.textContent = userEvent.location;
    preview.description.textContent = userEvent.description;
    preview.image.src = userEvent.image;
}

document.getElementById("previewModal").addEventListener("hidden.bs.modal", () => 
{    
// Reset form fields
    userForm.reset();

// Reset preview text
    preview.title.textContent = "Your Event Title";
    preview.date.textContent = "Month Day, Year • Time";
    preview.location.textContent = "Event location";
    preview.description.textContent = "Your event description will appear here.";

// Reset image
    preview.image.src = "";
});