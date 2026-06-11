document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('invitation-form');

    const urlParams = new URLSearchParams(window.location.search);
    const templateFromUrl = urlParams.get('template') || 'wedding-oliva';

    if (form) {
        document.getElementById('selectedTemplate').value = templateFromUrl;
        document.getElementById('template-badge').textContent = `Template: ${templateFromUrl.replace('-', ' ')}`;
        form.addEventListener('submit', handleFormSubmit);
    }
});

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (!validateForm(form)) return;

    const formData = new FormData(form);
    const eventPayload = {
        template: formData.get('selectedTemplate') || 'wedding-oliva',
        names: formData.get('eventNames').trim(),
        date: formData.get('eventDate'),
        time: formData.get('eventTime'),
        location: formData.get('eventLocation').trim(),
        message: formData.get('eventMessage').trim()
    };

    // print to console for debugging
    console.log("Guardando datos:", eventPayload);

    // save to localStorage and redirect to template.html
    localStorage.setItem('luvia_current_invitation', JSON.stringify(eventPayload));

    // redirect to template.html with query param for theme
    window.location.href = `template.html?theme=${eventPayload.template}`;
}

function validateForm(form) {
    let isValid = true;
    const names = form.eventNames;
    const date = form.eventDate;
    const time = form.eventTime;
    const location = form.eventLocation;

    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    document.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid'));

    const nameRegex = /^[a-zA-Z\s&'-]{3,100}$/;
    if (!nameRegex.test(names.value.trim())) {
        names.classList.add('invalid');
        document.getElementById('eventNamesError').textContent = 'Please enter valid names (letters, spaces, & allowed).';
        isValid = false;
    }

    if (!date.value) {
        date.classList.add('invalid');
        document.getElementById('eventDateError').textContent = 'Date is required.';
        isValid = false;
    }

    if (!time.value) {
        time.classList.add('invalid');
        document.getElementById('eventTimeError').textContent = 'Time is required.';
        isValid = false;
    }

    if (location.value.trim().length < 5) {
        location.classList.add('invalid');
        document.getElementById('eventLocationError').textContent = 'Please provide a more descriptive location address.';
        isValid = false;
    }

    return isValid;
}