// ========================================
// FUNCIONALIDAD DEL WHATSAPP WIDGET
// ========================================
function toggleWhatsAppChat() {
    const chat = document.getElementById('whatsappChat');
    chat.classList.toggle('active');
}

function sendQuickMessage(message) {
    const phoneNumber = '56932401276';
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Cerrar chat al hacer clic fuera
document.addEventListener('click', function(event) {
    const whatsappWidget = document.querySelector('.whatsapp-widget');
    const chat = document.getElementById('whatsappChat');
    if (!whatsappWidget.contains(event.target) && chat.classList.contains('active')) {
        // Solo cerrar si el clic fue fuera del widget
        if (!event.target.closest('.whatsapp-button') && !event.target.closest('.whatsapp-chat')) {
            chat.classList.remove('active');
        }
    }
});

// ========================================
// NAVEGACIÓN RESPONSIVE
// ========================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Cerrar menú al hacer clic en un enlace
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ========================================
// FORMULARIO DE CITAS
// ========================================
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener datos del formulario
        const nombre = document.getElementById('nombre').value;
        const telefono = document.getElementById('telefono').value;
        const email = document.getElementById('email').value;
        const vehiculo = document.getElementById('vehiculo').value;
        const servicio = document.getElementById('servicio').value;
        const patente = document.getElementById('patente').value;
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const comentarios = document.getElementById('comentarios').value;

        // Crear mensaje para WhatsApp
        let mensaje = `*NUEVA RESERVA - LUBRIMOTOR*\\n\\n`;
        mensaje += `*Cliente:* ${nombre}\\n`;
        mensaje += `*Teléfono:* ${telefono}\\n`;
        mensaje += `*Email:* ${email}\\n`;
        mensaje += `*Vehículo:* ${vehiculo}\\n`;
        mensaje += `*Patente:* ${patente || 'No especificada'}\\n`;
        mensaje += `*Servicio:* ${servicio}\\n`;
        mensaje += `*Fecha:* ${fecha}\\n`;
        mensaje += `*Hora:* ${hora}\\n`;
        mensaje += `*Comentarios:* ${comentarios || 'Ninguno'}`;

        // URL de WhatsApp
        const phoneNumber = '56932401276';
        const encodedMessage = encodeURIComponent(mensaje);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // Abrir WhatsApp
        window.open(whatsappURL, '_blank');

        // Mostrar confirmación
        alert('✅ Tu reserva se ha enviado a WhatsApp. Pronto nos pondremos en contacto.');

        // Limpiar formulario
        bookingForm.reset();
    });
}

// ========================================
// NAVBAR EFECTO SCROLL
// ========================================
const navbar = document.getElementById('navbar');
let lastScrollPosition = 0;

window.addEventListener('scroll', function() {
    const currentScrollPosition = window.pageYOffset;

    if (currentScrollPosition > 50) {
        navbar.style.background = 'rgba(10, 15, 28, 0.5)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 15, 28, 0.3)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    }

    lastScrollPosition = currentScrollPosition;
});

// ========================================
// ANIMACIONES AL SCROLL
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar tarjetas de servicios
const cards = document.querySelectorAll('.service-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// ========================================
// SMOOTH SCROLL PARA BOTONES
// ========================================
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// VALIDACIÓN DE EMAIL EN TIEMPO REAL
// ========================================
const emailInput = document.getElementById('email');

if (emailInput) {
    emailInput.addEventListener('blur', function() {
        const email = this.value;
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
// FORMATO DE TELÉFONO
// ========================================
const telefonoInput = document.getElementById('telefono');

if (telefonoInput) {
    telefonoInput.addEventListener('input', function() {
        // Remover caracteres no numéricos
        let value = this.value.replace(/\D/g, '');
        
        // Limitar a 9 dígitos
        if (value.length > 9) {
            value = value.slice(0, 9);
        }
        
        // Formatear: +56 9 XXXX XXXX
        if (value.length > 0) {
            if (value.length <= 1) {
                this.value = value;
            } else if (value.length <= 4) {
                this.value = '+56 ' + value;
            } else if (value.length <= 8) {
                this.value = '+56 9 ' + value.slice(1, 5) + ' ' + value.slice(5);
            } else {
                this.value = '+56 9 ' + value.slice(1, 5) + ' ' + value.slice(5, 9);
            }
        }
    });
}

console.log('✅ Script de Lubrimotor cargado correctamente');
