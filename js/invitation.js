import { requireAuth } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('invitation-form');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

/**
 * Maneja el evento de envío del formulario.
 * Valida los campos y guarda el payload en LocalStorage.
 * @param {Event} e 
 */
function handleFormSubmit(e) {
    e.preventDefault(); // Evita la recarga de la página

    const form = e.target;
    const isValid = validateForm(form);

    if (isValid) {
        const formData = new FormData(form);
        const eventPayload = {
            id: generateUUID(),
            name: formData.get('eventName').trim(),
            date: formData.get('eventDate'),
            time: formData.get('eventTime'),
            location: formData.get('eventLocation').trim(),
            message: formData.get('eventMessage').trim(),
            createdAt: new Date().toISOString()
        };

        // Persistencia en LocalStorage
        try {
            localStorage.setItem('luvia_current_invitation', JSON.stringify(eventPayload));
            console.log("Datos guardados exitosamente.");
            
            // Simulación de redirección a la vista previa (se construirá luego)
            alert("Invitation details saved! Ready for preview.");
            // window.location.href = 'preview.html'; 
        } catch (error) {
            console.error("Error saving to LocalStorage:", error);
        }
    }
}

/**
 * Valida los campos del formulario usando Regex y manipulación del DOM.
 * @param {HTMLFormElement} form 
 * @returns {boolean}
 */
function validateForm(form) {
    let isValid = true;
    
    // Selectores de inputs y errores
    const nameInput = form.eventName;
    const nameError = document.getElementById('eventNameError');
    const locationInput = form.eventLocation;
    const locationError = document.getElementById('eventLocationError');

    // Resetear estados
    nameInput.classList.remove('invalid');
    nameError.textContent = '';
    locationInput.classList.remove('invalid');
    locationError.textContent = '';

    // Regex: Permite letras, números, espacios y caracteres especiales básicos
    const safeTextRegex = /^[a-zA-Z0-9\s.,&'-]{3,100}$/;

    if (!safeTextRegex.test(nameInput.value.trim())) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'Please enter a valid event name (3-100 characters).';
        isValid = false;
    }

    if (locationInput.value.trim().length < 5) {
        locationInput.classList.add('invalid');
        locationError.textContent = 'Location address is too short.';
        isValid = false;
    }

    return isValid;
}

/**
 * Utilidad: Generador de UUID para identificar eventos de forma única
 * @returns {string}
 */
function generateUUID() {
    return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
}