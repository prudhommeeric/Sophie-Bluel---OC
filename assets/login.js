
console.log('login.js chargé');

document.addEventListener('DOMContentLoaded', function() {

    function updateLoginLink() {
        const loginLink = document.getElementById('loginLink');
        if (localStorage.getItem('authToken')) {
            loginLink.textContent = 'logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', function(event) {
                event.preventDefault();
                localStorage.removeItem('authToken');
                window.location.href = 'login.html';
            });
        } else {
            loginLink.textContent = 'login';
            loginLink.href = 'login.html';
        }
    }

    updateLoginLink();

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche la réinitialisation du formulaire

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('Tentative de connexion avec:', email, password);

        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data);

            if (data.token) { // Connexion réussie si un token est présent
                // Sauvegarder le token dans le stockage local
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html'; // Redirige vers la page d'accueil
            } else {
                // Erreur retournée par le serveur
                showError();
            }
        })
        .catch((error) => {
            console.error('Erreur:', error);
            // Erreur lors de la requête
            showError();
        });
    });

    function showError() {
        const errorMsgDiv = document.querySelector('.error-msg');
        errorMsgDiv.classList.remove('hidden'); // Afficher le message d'erreur
    }

    function hideError() {
        const errorMsgDiv = document.querySelector('error-msg');
        errorMsgDiv.classList.add('hidden'); // Cacher le message d'erreur
    }
});
