document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Contact form validation and submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const nameInput = this.querySelector('input[type="text"]');
        const emailInput = this.querySelector('input[type="email"]');
        const messageInput = this.querySelector('textarea');
        
        // Reset previous error states
        [nameInput, emailInput, messageInput].forEach(input => {
            input.classList.remove('error');
        });
        
        // Validate inputs
        let isValid = true;
        
        if (nameInput.value.trim() === '') {
            nameInput.classList.add('error');
            isValid = false;
        }
        
        if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
            emailInput.classList.add('error');
            isValid = false;
        }
        
        if (messageInput.value.trim() === '') {
            messageInput.classList.add('error');
            isValid = false;
        }
        
        // If form is valid, send the data to the backend
        if (isValid) {
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim()
            };

            console.log('Sending form data:', formData);

            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.error) {
                    alert('Error: ' + data.error + (data.details ? '\n' + data.details : ''));
                } else {
                    alert('Message sent successfully!');
                    this.reset();
                }
            })
            .catch(error => {
                console.error('Detailed error:', error);
                alert('Failed to send message. Please check the console for details.');
            });
        }
    });

    // Add subtle animations and interactions
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
});
