document.addEventListener('DOMContentLoaded', () => {
    const eventDataJSON = localStorage.getItem('luvia_current_invitation');
    
    if (!eventDataJSON) {
        window.location.href = 'invitation.html';
        return;
    }

    const eventData = JSON.parse(eventDataJSON);
    renderPremiumTemplate(eventData);
});

async function renderPremiumTemplate(data) {
    // Inject data into DOM
    document.body.classList.add(`theme-${data.template}`);
    document.getElementById('display-names').textContent = data.names;
    document.getElementById('display-location').textContent = data.location;
    
    const messageContainer = document.getElementById('display-message');
    if (data.message) {
        messageContainer.textContent = `"${data.message}"`;
    } else {
        messageContainer.style.display = 'none';
    }

    // Date & Time Formatting
    const dateParts = data.date.split('-'); 
    const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    document.getElementById('display-date').textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const timeParts = data.time.split(':');
    let hours = parseInt(timeParts[0], 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    document.getElementById('display-time').textContent = `${hours % 12 || 12}:${timeParts[1]} ${ampm}`;

    // Google Maps Embed API 
    const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const mapContainer = document.getElementById('map-api-container');
    if (mapsApiKey) {
        const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${encodeURIComponent(data.location)}`;
        mapContainer.innerHTML = `<iframe width="100%" height="100%" frameborder="0" style="border:0" src="${mapUrl}" allowfullscreen></iframe>`;
    }

    // GoQR API 
    const qrImg = document.getElementById('qr-code-img');
    const encodedUrl = encodeURIComponent(window.location.href);
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}&color=2C4A3E`;

    // Unsplash API (Import an image and insert it into the template)
    await fetchUnsplashDecoration(data.template);

    // World Time API (Initialize a countdown timer based on the event date and time)
    await initDynamicCountdown(data.date, data.time);
}

/** Unsplash API (Fetch a random image related to "wedding decoration" or "party decoration" based on the template theme and insert it as a banner in the invitation card) */
async function fetchUnsplashDecoration(templateTheme) {
    const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    if (!accessKey) return;

    // Look for "wedding decoration" if the template theme includes "wedding", otherwise use "party decoration"
    const query = templateTheme.includes('wedding') ? 'wedding decoration' : 'party decoration';
    const apiUrl = `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${accessKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Unsplash fetch failed');
        
        const json = await response.json();
        
        // Inject the image into the DOM as a header decoration
        const headerDecoration = document.createElement('img');
        headerDecoration.src = json.urls.regular;
        headerDecoration.alt = json.alt_description || "Event decoration";
        headerDecoration.style.width = '100%';
        headerDecoration.style.height = '150px';
        headerDecoration.style.objectFit = 'cover';
        headerDecoration.style.borderRadius = '4px 4px 0 0';
        
        const card = document.getElementById('invitation-card');
        card.insertBefore(headerDecoration, card.firstChild);
    } catch (error) {
        console.warn('Could not fetch decoration:', error);
    }
}

/** World Time API (Get the exact time from the server to create an infallible countdown) */
async function initDynamicCountdown(targetDate, targetTime) {
    const container = document.getElementById('countdown-timer');
    const targetDateTime = new Date(`${targetDate}T${targetTime}:00`).getTime();
    
    try {
        // Trying to get the current time from the World Time API to ensure the countdown is accurate regardless of the user's local clock
        const response = await fetch('http://worldtimeapi.org/api/ip');
        const timeData = await response.json();
        
        // Use the server time as the starting point for the countdown
        let currentServerTime = timeData.unixtime * 1000;

        // Set an interval to update the countdown every second
        const interval = setInterval(() => {
            currentServerTime += 1000; // sum 1 second to the server time on each tick
            const distance = targetDateTime - currentServerTime;

            if (distance < 0) {
                clearInterval(interval);
                container.innerHTML = "<h3>The event has started!</h3>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Inject data into DOM
            container.innerHTML = `
                <div style="display: flex; gap: 1rem; justify-content: center; font-family: var(--font-heading); color: var(--primary-color);">
                    <div class="time-box"><strong>${days}</strong><br>Days</div>
                    <div class="time-box"><strong>${hours}</strong><br>Hours</div>
                    <div class="time-box"><strong>${minutes}</strong><br>Mins</div>
                    <div class="time-box"><strong>${seconds}</strong><br>Secs</div>
                </div>
            `;
        }, 1000);

    } catch (error) {
        console.error("Time API failed, falling back to local time", error);
    }
}