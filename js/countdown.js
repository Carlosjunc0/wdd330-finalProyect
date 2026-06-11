/**
 * @param {string} containerId - ID from the HTML element where the countdown will be displayed.
 * @param {string} targetDate - Target date in 'YYYY-MM-DDTHH:MM:SS' format.
 */

export function initCountdown(containerId, targetDate) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const eventTime = new Date(targetDate).getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = eventTime - now;

        if (distance < 0) {
            clearInterval(interval);
            container.innerHTML = "<h3>The event has started!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        container.innerHTML = `
            <div style="display: flex; gap: 1rem; justify-content: center; font-family: var(--font-heading); color: var(--primary-color);">
                <div class="time-box"><strong>${days}</strong><br>Days</div>
                <div class="time-box"><strong>${hours}</strong><br>Hours</div>
                <div class="time-box"><strong>${minutes}</strong><br>Mins</div>
                <div class="time-box"><strong>${seconds}</strong><br>Secs</div>
            </div>
        `;
    }, 1000);
}