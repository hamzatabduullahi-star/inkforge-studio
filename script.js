// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const body = document.body;

if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active') &&
            !mobileNav.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
        }
    });
}

// ===== PLACEMENT BUTTONS =====
const placementBtns = document.querySelectorAll('.placement-btn');
const selectedPlacement = document.getElementById('selectedPlacement');

placementBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        placementBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (selectedPlacement) {
            selectedPlacement.value = this.dataset.value;
        }
    });
});

// ===== PAYMENT METHOD BUTTONS =====
const paymentBtns = document.querySelectorAll('.payment-btn');
const selectedPayment = document.getElementById('selectedPayment');

paymentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        paymentBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        if (selectedPayment) {
            selectedPayment.value = this.dataset.value;
        }
    });
});

// ===== SIGNATURE PAD =====
const canvas = document.getElementById('signatureCanvas');
if (canvas) {
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
        const agree = document.getElementById('agreeTerms');
        const confirmBtn = document.getElementById('confirmBooking');
        if (agree && confirmBtn) {
            if (hasDrawing && agree.checked) {
                confirmBtn.classList.add('active');
            } else {
                confirmBtn.classList.remove('active');
            }
        }
    }

    document.getElementById('agreeTerms').addEventListener('change', checkSignature);

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
            `✍️ Signature: [Drawn on website]%0A%0A` +
            `💰 Deposit: 50% refundable required%0A` +
            `⏰ Refundable up to 48 hours before session%0A%0A` +
            `Please confirm availability and send payment details. Thanks!`;

        window.location.href = `sms:+19494398195?body=${message}`;
    });
}

console.log('🔥 InkForge loaded successfully!');
