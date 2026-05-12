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
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open', navMenu.classList.contains('active'));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// ========================================
// Formulario principal de reservas
// ========================================
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nombre = getValue('nombre');
        const telefono = getValue('telefono');
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
            `*Teléfono:* ${telefono}`,
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

// ========================================
// Formato del teléfono
// ========================================
const telefonoInput = document.getElementById('telefono');

if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');

        if (value.startsWith('56')) {
            value = value.slice(2);
        }

        if (value.length > 9) {
            value = value.slice(0, 9);
        }

        if (!value) {
            this.value = '';
        } else if (value.length <= 1) {
            this.value = value;
        } else if (value.length <= 5) {
            this.value = `+56 ${value}`;
        } else {
            this.value = `+56 ${value.slice(0, 1)} ${value.slice(1, 5)} ${value.slice(5, 9)}`.trim();
        }
    });
}

console.log('✅ Script de Lubrimotor cargado correctamente');
