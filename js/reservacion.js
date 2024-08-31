document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservation-form');
    const dateInput = document.getElementById('date');
    const timeSelect = document.getElementById('time');
    const phoneInput = document.getElementById('phone');
    const messageDiv = document.getElementById('message');
    const phoneErrorDiv = document.getElementById('phone-error');

    // Generar opciones de tiempo en intervalos de 30 minutos
    const generateTimeOptions = () => {
        const start = 8; // Hora de inicio: 8:00 AM
        const end = 20; // Hora de fin: 8:00 PM

        for (let hour = start; hour < end; hour++) {
            let period = hour < 12 ? 'AM' : 'PM';
            let hourFormatted = hour % 12 === 0 ? 12 : hour % 12;

            timeSelect.appendChild(new Option(`${hourFormatted}:00 ${period}`, `${hourFormatted}:00 ${period}`));
        }
    };

    generateTimeOptions();

    // Cargar reservas desde localStorage
    const reservations = JSON.parse(localStorage.getItem('reservations')) || {};

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const date = dateInput.value;
        const time = timeSelect.value;
        const phone = phoneInput.value;

        if (!date) {
            showMessage('Por favor, selecciona una fecha.', 'error');
            return;
        }

        if (!time) {
            showMessage('Por favor, selecciona una hora.', 'error');
            return;
        }

        // Validación del teléfono
        const phonePattern = /^\d+$/;
        if (!phonePattern.test(phone)) {
            phoneErrorDiv.textContent = 'El número de teléfono debe contener solo números.';
            return;
        } else {
            phoneErrorDiv.textContent = ''; // Limpiar mensaje de error
        }

        // Crear una clave combinada para fecha y hora
        const reservationKey = `${date}T${time}`;

        // Si ya hay una reserva para esa fecha y hora
        if (reservations[reservationKey]) {
            showMessage('Lo sentimos, ya se ha realizado una reserva para esta hora. Por favor, elige otra hora.', 'error');
            return;
        }

        // Si no hay reserva para esa fecha y hora
        reservations[reservationKey] = true;

        // Guardar reservas en localStorage
        localStorage.setItem('reservations', JSON.stringify(reservations));

        showMessage('¡Reserva realizada con éxito!', 'success');
        form.reset();
    });

    function showMessage(message, type) {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    }

    // Cambiar la apariencia de la barra de navegación al hacer scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Desplazamiento suave al hacer clic en los enlaces del navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
