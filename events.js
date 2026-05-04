let eventList = document.getElementById("events");

async function loadEvents()
{
    try
    {
        const response = await fetch("events.json");
        const events = await response.json();
    
        for( const event of events)
        {
            const eventCard = 
            `   <div class = "event-card">

                    <img class = "event-image" src = "${event.image || ""}">

                    <div class = "event-body">

                        <h5 class = "event-title">${event.title}</h5>

                        <p class = "event-date">${event.date || "TBA"} • ${event.time || "TBA"}</p>

                        <p class = "event-location"> ${event.location || "TBA"}</p>

                        <p class = "event-description">${event.description || "No description available."}</p>

                        <a href="#" class="btn btn-3ce w-100">View Details</a>

                    </div>

                </div>  `;
            
            eventList.innerHTML += eventCard;
        }
    }

    catch( error)
    {
        console.error("Error loading events:", error);
    }
}

loadEvents();