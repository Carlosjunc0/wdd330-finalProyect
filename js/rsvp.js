document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVPSubmit);
    }
});

async function handleRSVPSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (validateRSVP(form)) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const successMsg = document.getElementById('success-message');

        // Extract form values
        const guestName = formData.get('guestName').trim();
        const guestEmail = formData.get('guestEmail').trim();
        const attendanceStatus = formData.get('attendanceStatus');

        // Change button state to indicate processing
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
            // payload config to send confirmation email via EmailJS API
            const payload = {
                service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
                template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY, // <-- ¡CÁMBIALO A user_id AQUÍ!
                template_params: {
                    to_name: guestName,
                    to_email: guestEmail,
                    reply_to: "contacto@luviadesign.com",
                    message: attendanceStatus === 'yes'
                        ? `Thank you for confirming your attendance! We are so excited to see you at the event.`
                        : `We are sorry you can't make it, but we appreciate you letting us know.`
                }
            };

            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to send email');

            // Save RSVP data to localStorage (simulating a database save)
            const rsvpData = { id: Date.now().toString(), name: guestName, email: guestEmail, status: attendanceStatus, timestamp: new Date().toISOString() };
            const existingRSVPs = JSON.parse(localStorage.getItem('luvia_rsvps')) || [];
            existingRSVPs.push(rsvpData);
            localStorage.setItem('luvia_rsvps', JSON.stringify(existingRSVPs));

            // Display success message and reset form
            successMsg.style.display = 'block';
            form.reset();
            setTimeout(() => { successMsg.style.display = 'none'; }, 5000);

        } catch (error) {
            console.error('Error sending RSVP email:', error);
            alert("There was an error sending your confirmation. Please try again.");
        } finally {
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    }
}

function validateRSVP(form) {
    let isValid = true;

    const nameInput = form.guestName;
    const emailInput = form.guestEmail;
    const statusInput = form.attendanceStatus;

    // Reset errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, select').forEach(el => el.classList.remove('invalid'));

    if (nameInput.value.trim().length < 3) {
        nameInput.classList.add('invalid');
        document.getElementById('guestNameError').textContent = 'Please enter a valid full name.';
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        document.getElementById('guestEmailError').textContent = 'Please enter a valid email address.';
        isValid = false;
    }

    if (statusInput.value === "") {
        statusInput.classList.add('invalid');
        document.getElementById('attendanceError').textContent = 'Please select your attendance status.';
        isValid = false;
    }

    return isValid;
}