// ========================================
// Configuración general
// ========================================
const LUBRIMOTOR_WHATSAPP = '56932401276';

function openWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${LUBRIMOTOR_WHATSAPP}?text=${encodedMessage}`, '_blank');
}

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
}

// ========================================
// Fechas de reserva: impedir días pasados
// ========================================
const DATE_ERROR_MESSAGE = 'Por favor selecciona una fecha válida. No se pueden reservar fechas pasadas.';
const SUNDAY_CLOSED_MESSAGE = 'Los domingos estamos cerrados. Por favor selecciona otro día.';
const INVALID_TIME_MESSAGE = 'Por favor selecciona un horario disponible para la fecha elegida.';
const WEEKDAY_HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const SATURDAY_HOURS = ['09:00', '10:00', '11:00', '12:00', '13:00'];
const TIME_PLACEHOLDER_INITIAL = 'Selecciona una fecha primero';
const TIME_PLACEHOLDER_DEFAULT = 'Selecciona horario';
const TIME_PLACEHOLDER_CLOSED = 'Domingo cerrado';

function getTodayDateString() {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 10);
}

function getLocalDateFromInput(value) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function getAllowedHoursForDate(value) {
    if (!value) {
        return [];
    }

    const day = getLocalDateFromInput(value).getDay();

    if (day === 6) {
        return SATURDAY_HOURS;
    }

    if (day === 0) {
        return [];
    }

    return WEEKDAY_HOURS;
}

function getTimeSelectForDateInput(dateInput) {
    const form = dateInput.closest('form');
    return form ? form.querySelector('select[name="hora"], select#hora') : null;
}

function renderTimeOptions(select, hours, placeholderText, disabled = false) {
    if (!select) {
        return;
    }

    const selectedValue = select.value;
    const placeholder = placeholderText || TIME_PLACEHOLDER_DEFAULT;
    select.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = placeholder;
    select.appendChild(placeholderOption);

    hours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        select.appendChild(option);
    });

    select.value = hours.includes(selectedValue) ? selectedValue : '';
    select.disabled = disabled;
}

function updateScheduleForDateInput(input, shouldReport = false) {
    const timeSelect = getTimeSelectForDateInput(input);
    const allowedHours = getAllowedHoursForDate(input.value);
    const selectedDay = input.value ? getLocalDateFromInput(input.value).getDay() : null;

    if (!input.value) {
        renderTimeOptions(timeSelect, [], TIME_PLACEHOLDER_INITIAL, true);
    } else if (selectedDay === 0) {
        renderTimeOptions(timeSelect, [], TIME_PLACEHOLDER_CLOSED, true);
    } else {
        renderTimeOptions(timeSelect, allowedHours, TIME_PLACEHOLDER_DEFAULT, false);
    }

    if (input.value && selectedDay === 0) {
        input.setCustomValidity(SUNDAY_CLOSED_MESSAGE);

        if (shouldReport) {
            input.reportValidity();
        }
    } else if (input.value && input.value < getTodayDateString()) {
        input.setCustomValidity(DATE_ERROR_MESSAGE);
    } else {
        input.setCustomValidity('');
    }

    if (timeSelect) {
        timeSelect.setCustomValidity('');
    }
}

function setupDateInputs() {
    const today = getTodayDateString();

    document.querySelectorAll('input[type="date"]').forEach(input => {
        if (!input.min || input.min < today) {
            input.min = today;
        }

        input.addEventListener('input', function() {
            updateScheduleForDateInput(this);
        });

        input.addEventListener('change', function() {
            updateScheduleForDateInput(this, true);
        });

        updateScheduleForDateInput(input);
    });
}

function validateDateFields(form) {
    const today = getTodayDateString();
    const dateInputs = form.querySelectorAll('input[type="date"]');

    for (const input of dateInputs) {
        if (input.value && input.value < today) {
            input.setCustomValidity(DATE_ERROR_MESSAGE);
            input.reportValidity();
            input.focus();
            return false;
        }

        if (input.value && getLocalDateFromInput(input.value).getDay() === 0) {
            input.setCustomValidity(SUNDAY_CLOSED_MESSAGE);
            input.reportValidity();
            input.focus();
            return false;
        }

        input.setCustomValidity('');

        const timeSelect = getTimeSelectForDateInput(input);
        const allowedHours = getAllowedHoursForDate(input.value);

        if (timeSelect && input.value && (!timeSelect.value || !allowedHours.includes(timeSelect.value))) {
            timeSelect.setCustomValidity(INVALID_TIME_MESSAGE);
            timeSelect.reportValidity();
            timeSelect.focus();
            return false;
        }

        if (timeSelect) {
            timeSelect.setCustomValidity('');
        }
    }

    return true;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupDateInputs);
} else {
    setupDateInputs();
}

document.addEventListener('submit', function(event) {
    if (!validateDateFields(event.target)) {
        event.preventDefault();
        event.stopImmediatePropagation();
    }
}, true);

// ========================================
// Widget de WhatsApp
// ========================================
function toggleWhatsAppChat() {
    const chat = document.getElementById('whatsappChat');

    if (chat) {
        chat.classList.toggle('active');
    } else {
        openWhatsApp('Hola, necesito información sobre Lubrimotor');
    }
}

function sendQuickMessage(message) {
    openWhatsApp(message);
}

document.addEventListener('click', function(event) {
    const whatsappWidget = document.querySelector('.whatsapp-widget');
    const chat = document.getElementById('whatsappChat');

    if (!whatsappWidget || !chat || !chat.classList.contains('active')) {
        return;
    }

    const clickedInsideWidget = whatsappWidget.contains(event.target);
    const clickedChatControl = event.target.closest('.whatsapp-button, .whatsapp-chat');

    if (!clickedInsideWidget && !clickedChatControl) {
        chat.classList.remove('active');
    }
});

// ========================================
// Navegación responsive
// ========================================
function setupMobileNavigation() {
    const menuToggle = document.querySelector('#hamburger, .hamburger, .menu-toggle, .mobile-menu-toggle');
    const navMenu = document.querySelector('#nav-menu, .nav-menu, .nav-links, .mobile-menu');

    if (!menuToggle || !navMenu || menuToggle.dataset.navReady === 'true') {
        return;
    }

    menuToggle.dataset.navReady = 'true';
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegacion');

    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active', 'open');
        document.body.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu de navegacion');
    }

    function toggleMobileMenu(event) {
        event.stopPropagation();

        const willOpen = !navMenu.classList.contains('active');

        menuToggle.classList.toggle('active', willOpen);
        navMenu.classList.toggle('active', willOpen);
        navMenu.classList.toggle('open', willOpen);
        document.body.classList.toggle('menu-open', willOpen);
        menuToggle.setAttribute('aria-expanded', String(willOpen));
        menuToggle.setAttribute('aria-label', willOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion');
    }

    menuToggle.addEventListener('click', toggleMobileMenu);

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', function(event) {
        if (!navMenu.classList.contains('active')) {
            return;
        }

        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMobileNavigation);
} else {
    setupMobileNavigation();
}

// ========================================
// Formulario principal de reservas
// ========================================
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!validateDateFields(bookingForm)) {
            return;
        }

        const nombre = getValue('nombre');
        const email = getValue('email');
        const vehiculo = getValue('vehiculo');
        const servicioSelect = document.getElementById('servicio');
        const servicio = servicioSelect
            ? servicioSelect.options[servicioSelect.selectedIndex].text
            : getValue('servicio');
        const patente = getValue('patente') || 'No especificada';
        const fecha = getValue('fecha');
        const hora = getValue('hora');
        const comentarios = getValue('comentarios') || 'Ninguno';

        const message = [
            '*NUEVA RESERVA - LUBRIMOTOR*',
            '',
            `*Cliente:* ${nombre}`,
            `*Email:* ${email}`,
            `*Vehículo:* ${vehiculo}`,
            `*Patente:* ${patente}`,
            `*Servicio:* ${servicio}`,
            `*Fecha:* ${fecha}`,
            `*Hora:* ${hora}`,
            `*Comentarios:* ${comentarios}`
        ].join('\n');

        openWhatsApp(message);
        alert('✅ Tu reserva se ha enviado a WhatsApp. Pronto nos pondremos en contacto.');
        bookingForm.reset();
        const dateInput = bookingForm.querySelector('input[type="date"]');
        if (dateInput) {
            updateScheduleForDateInput(dateInput);
        }
    });
}

// ========================================
// Navbar con efecto al hacer scroll
// ========================================
const navbar = document.getElementById('navbar');

if (navbar) {
    window.addEventListener('scroll', function() {
        const hasScrolled = window.pageYOffset > 50;

        navbar.style.background = hasScrolled
            ? 'rgba(10, 15, 28, 0.5)'
            : 'rgba(10, 15, 28, 0.3)';
        navbar.style.boxShadow = hasScrolled
            ? '0 4px 20px rgba(0, 0, 0, 0.3)'
            : '0 4px 20px rgba(0, 0, 0, 0.2)';
    });
}

// ========================================
// Animaciones al hacer scroll
// ========================================
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// ========================================
// Desplazamiento suave para enlaces internos
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(event) {
        const href = this.getAttribute('href');
        const target = href && href !== '#' ? document.querySelector(href) : null;

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ========================================
// Validación visual del email
// ========================================
const emailInput = document.getElementById('email');

if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (email && !isValid) {
            this.style.borderColor = '#ff6b6b';
            this.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.2)';
        } else {
            this.style.borderColor = 'rgba(78, 205, 196, 0.4)';
            this.style.boxShadow = '';
        }
    });
}

console.log('✅ Script de Lubrimotor cargado correctamente');
