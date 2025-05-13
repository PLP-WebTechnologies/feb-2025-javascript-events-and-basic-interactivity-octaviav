document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let selectedAmount = null;
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.gallery-slide').length;
    
    // Elements
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountContainer = document.getElementById('custom-amount-container');
    const customAmountInput = document.getElementById('custom-amount');
    const donationForm = document.getElementById('donation-form');
    const gallerySlides = document.querySelectorAll('.gallery-slide');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeButton = document.querySelector('.close-button');
    const logo = document.getElementById('logo');
    
    // For the impact stats animation
    const donorsCount = document.getElementById('donors-count');
    const donationTotal = document.getElementById('donation-total');
    const livesImpacted = document.getElementById('lives-impacted');
    
    // Tab functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and tab panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to current tab and tab pane
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // If we're switching to the impact tab, animate the stats
            if (tabId === 'impact') {
                animateStats();
            }
        });
    });
    
    // Donation amount selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function() {
            const amount = this.getAttribute('data-amount');
            
            // Remove selected class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Handle custom amount
            if (amount === 'custom') {
                customAmountContainer.style.display = 'block';
                this.classList.add('selected');
                selectedAmount = null;
            } else {
                customAmountContainer.style.display = 'none';
                this.classList.add('selected');
                selectedAmount = parseInt(amount);
            }
        });
    });
    
    // Custom amount input
    customAmountInput.addEventListener('input', function() {
        selectedAmount = this.value ? parseInt(this.value) : null;
    });
    
    // Form validation
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const causeSelect = document.getElementById('cause');
    const cardNumberInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('expiry');
    const cvvInput = document.getElementById('cvv');
    
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const causeError = document.getElementById('cause-error');
    const cardError = document.getElementById('card-error');
    const expiryError = document.getElementById('expiry-error');
    const cvvError = document.getElementById('cvv-error');
    
    // Real-time validation
    fullNameInput.addEventListener('input', validateName);
    emailInput.addEventListener('input', validateEmail);
    causeSelect.addEventListener('change', validateCause);
    cardNumberInput.addEventListener('input', validateCard);
    expiryInput.addEventListener('input', validateExpiry);
    cvvInput.addEventListener('input', validateCVV);
    
    function validateName() {
        if (fullNameInput.value.trim() === '') {
            nameError.textContent = 'Name is required';
            return false;
        } else if (fullNameInput.value.trim().length < 3) {
            nameError.textContent = 'Name must be at least 3 characters';
            return false;
        } else {
            nameError.textContent = '';
            return true;
        }
    }
    
    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required';
            return false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        } else {
            emailError.textContent = '';
            return true;
        }
    }
    
    function validateCause() {
        if (causeSelect.value === '') {
            causeError.textContent = 'Please select a cause';
            return false;
        } else {
            causeError.textContent = '';
            return true;
        }
    }
    
    function validateCard() {
        // Remove spaces and non-digits
        const value = cardNumberInput.value.replace(/\D/g, '');
        
        // Format with spaces every 4 digits
        cardNumberInput.value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        
        if (value === '') {
            cardError.textContent = 'Card number is required';
            return false;
        } else if (value.length < 13 || value.length > 19) {
            cardError.textContent = 'Card number should be between 13 and 19 digits';
            return false;
        } else {
            cardError.textContent = '';
            return true;
        }
    }
    
    function validateExpiry() {
        // Format as MM/YY
        let value = expiryInput.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        expiryInput.value = value;
        
        const parts = value.split('/');
        const month = parseInt(parts[0]);
        
        if (value === '') {
            expiryError.textContent = 'Expiry date is required';
            return false;
        } else if (parts.length < 2 || parts[1].length < 2) {
            expiryError.textContent = 'Please enter a valid expiry date (MM/YY)';
            return false;
        } else if (month < 1 || month > 12) {
            expiryError.textContent = 'Month must be between 1 and 12';
            return false;
        } else {
            expiryError.textContent = '';
            return true;
        }
    }
    
    function validateCVV() {
        const value = cvvInput.value.replace(/\D/g, '');
        cvvInput.value = value;
        
        if (value === '') {
            cvvError.textContent = 'CVV is required';
            return false;
        } else if (value.length < 3 || value.length > 4) {
            cvvError.textContent = 'CVV must be 3 or 4 digits';
            return false;
        } else {
            cvvError.textContent = '';
            return true;
        }
    }
    
    // Form submission
    donationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Check if amount is selected
        if (!selectedAmount && (customAmountInput.value === '' || parseInt(customAmountInput.value) <= 0)) {
            alert('Please select or enter a valid donation amount');
            return;
        }
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isCauseValid = validateCause();
        const isCardValid = validateCard();
        const isExpiryValid = validateExpiry();
        const isCVVValid = validateCVV();
        
        if (isNameValid && isEmailValid && isCauseValid && isCardValid && isExpiryValid && isCVVValid) {
            // Show success modal
            successModal.style.display = 'flex';
            
            // Reset form
            donationForm.reset();
            amountButtons.forEach(btn => btn.classList.remove('selected'));
            customAmountContainer.style.display = 'none';
            selectedAmount = null;
            
            // Create confetti effect
            createConfetti();
        }
    });
    
    // Close modal functionality
    closeModalBtn.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    closeButton.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Gallery navigation
    function showSlide(n) {
        // Hide all slides
        gallerySlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Set current slide index
        currentSlide = (n + totalSlides) % totalSlides;
        
        // Show current slide and active dot
        gallerySlides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }
    
    // Next/previous controls
    prevButton.addEventListener('click', function() {
        showSlide(currentSlide - 1);
    });
    
    nextButton.addEventListener('click', function() {
        showSlide(currentSlide + 1);
    });
    
    // Dot navigation
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-slide'));
            showSlide(slideIndex);
        });
    });
    
    // Logo animation
    logo.addEventListener('click', function() {
        this.classList.add('rotate');
        setTimeout(() => {
            this.classList.remove('rotate');
        }, 1000);
    });
    
    // Stats animation function
    function animateStats() {
        // Target values
        const donorsTarget = 1845;
        const donationTarget = 87560;
        const livesTarget = 5630;
        
        // Current values
        let donorsCurrent = 0;
        let donationCurrent = 0;
        let livesCurrent = 0;
        
        // Animation speed
        const animationDuration = 2000; // 2 seconds
        const frameRate = 60;
        const totalFrames = animationDuration / 1000 * frameRate;
        
        // Increment values
        const donorsIncrement = donorsTarget / totalFrames;
        const donationIncrement = donationTarget / totalFrames;
        const livesIncrement = livesTarget / totalFrames;
        
        // Animation function
        const animate = function() {
            donorsCurrent += donorsIncrement;
            donationCurrent += donationIncrement;
            livesCurrent += livesIncrement;
            
            if (donorsCurrent <= donorsTarget) {
                donorsCount.textContent = Math.round(donorsCurrent);
            }
            
            if (donationCurrent <= donationTarget) {
                donationTotal.textContent = '$' + Math.round(donationCurrent).toLocaleString();
            }
            
            if (livesCurrent <= livesTarget) {
                livesImpacted.textContent = Math.round(livesCurrent);
            }
            
            if (donorsCurrent < donorsTarget || donationCurrent < donationTarget || livesCurrent < livesTarget) {
                requestAnimationFrame(animate);
            }
        };
        
        // Start animation
        animate();
    }
    
    // Confetti effect for success modal
    function createConfetti() {
        const confettiContainer = document.querySelector('.confetti');
        confettiContainer.innerHTML = '';
        
        // Create confetti pieces
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti-piece');
            
            // Random styles
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-5%';
            confetti.style.position = 'absolute';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.opacity = Math.random() + 0.5;
            
            // Animation
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                0% {
                    top: -5%;
                    transform: translateX(0) rotate(0deg);
                }
                100% {
                    top: 100%;
                    transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 360}deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize first slide
    showSlide(0);
});