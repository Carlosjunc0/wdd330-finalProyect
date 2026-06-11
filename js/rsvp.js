document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', handleRSVPSubmit);
    }
});

function handleRSVPSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    if (validateRSVP(form)) {
        const formData = new FormData(form);
        const rsvpData = {
            id: Date.now().toString(),
            name: formData.get('guestName').trim(),
            email: formData.get('guestEmail').trim(),
            status: formData.get('attendanceStatus'),
            guests: formData.get('guestCount'),
            timestamp: new Date().toISOString()
        };

        const existingRSVPs = JSON.parse(localStorage.getItem('luvia_rsvps')) || [];
        existingRSVPs.push(rsvpData);
        localStorage.setItem('luvia_rsvps', JSON.stringify(existingRSVPs));

        const successMsg = document.getElementById('success-message');
        successMsg.style.display = 'block';
        form.reset();

        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
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