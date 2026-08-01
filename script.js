// ===== SLIDESHOW =====
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
let slideInterval;

// Create dots
slides.forEach((_, index) => {
    const dot = document.createElement('span');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('span');

function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 4000);
}

function resetSlideshow() {
    clearInterval(slideInterval);
    startSlideshow();
}

nextBtn.addEventListener('click', () => {
    nextSlide();
    resetSlideshow();
});

prevBtn.addEventListener('click', () => {
    prevSlide();
    resetSlideshow();
});

const hero = document.getElementById('hero');
hero.addEventListener('mouseenter', () => clearInterval(slideInterval));
hero.addEventListener('mouseleave', startSlideshow);

startSlideshow();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== PLACEMENT BUTTONS =====
const placementBtns = document.querySelectorAll('.placement-btn');
const selectedPlacement = document.getElementById('selectedPlacement');

placementBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        placementBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedPlacement.value = this.dataset.value;
    });
});

// ===== PAYMENT METHOD BUTTONS =====
const paymentBtns = document.querySelectorAll('.payment-btn');
const selectedPayment = document.getElementById('selectedPayment');

paymentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        paymentBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedPayment.value = this.dataset.value;
    });
});

// ===== SIGNATURE PAD =====
const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
    };
}

function startDraw(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
}

function draw(e) {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastX = pos.x;
    lastY = pos.y;
    checkSignature();
}

function endDraw(e) {
    e.preventDefault();
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);
canvas.addEventListener('touchstart', startDraw);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', endDraw);

document.getElementById('clearSignature').addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    checkSignature();
});

// ===== CHECK SIGNATURE & TERMS =====
function checkSignature() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let hasDrawing = false;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] > 0) {
            hasDrawing = true;
            break;
        }
    }
    const agree = document.getElementById('agreeTerms').checked;
    const confirmBtn = document.getElementById('confirmBooking');
    if (hasDrawing && agree) {
        confirmBtn.classList.add('active');
    } else {
        confirmBtn.classList.remove('active');
    }
}

document.getElementById('agreeTerms').addEventListener('change', checkSignature);

// ===== CONFIRM BOOKING =====
document.getElementById('confirmBooking').addEventListener('click', function() {
    if (!this.classList.contains('active')) return;

    const name = document.getElementById('clientName')?.value.trim() || 'Not provided';
    const email = document.getElementById('clientEmail')?.value.trim() || 'Not provided';
    const phone = document.getElementById('clientPhone')?.value.trim() || 'Not provided';
    const placement = document.getElementById('selectedPlacement')?.value || 'Not specified';
    const size = document.getElementById('tattooSize')?.value || 'Not specified';
    const date = document.getElementById('preferredDate')?.value || 'Not specified';
    const recap = document.getElementById('ideaRecap')?.value.trim() || 'No details provided';
    const payment = document.getElementById('selectedPayment')?.value || 'Not specified';
    const agreed = document.getElementById('agreeTerms').checked ? 'Yes' : 'No';

    const message = `✅ FINAL BOOKING CONFIRMATION - InkForge%0A%0A` +
                    `📝 CLIENT DETAILS:%0A` +
                    `Name: ${name}%0A` +
                    `Email: ${email}%0A` +
                    `Phone: ${phone}%0A%0A` +
                    `🎨 APPOINTMENT DETAILS:%0A` +
                    `Placement: ${placement}%0A` +
                    `Size: ${size}%0A` +
                    `Preferred Date: ${date}%0A%0A` +
                    `💡 Idea Recap:%0A${recap}%0A%0A` +
                    `💳 Payment Method: ${payment}%0A` +
                    `📋 Agreed to Terms: ${agreed}%0A` +
                    `✍️ Signature: [Drawn on website]%0A%0A` +
                    `💰 Deposit: 50% refundable required%0A` +
                    `⏰ Refundable up to 48 hours before session%0A%0A` +
                    `Please confirm availability and send payment details. Thanks!`;

    window.location.href = `sms:+19494398195?body=${message}`;
});

console.log('🔥 InkForge Studio loaded successfully!');
