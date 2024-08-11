console.log('admin.js chargé')

function updateAdminContentVisibility () {
	const adminContent = document.querySelectorAll('.admin-content')
	// Afficher le contenu administrateur s'il existe
	adminContent.forEach((element) => {
		if (localStorage.getItem('authToken')) {
			element.classList.remove('hidden')
		} else {
			element.classList.add('hidden')
		}
	})
}

function updateLoginLink () {
	const loginLink = document.getElementById('loginLink')

	if (localStorage.getItem('authToken')) {
		loginLink.textContent = 'logout'
		loginLink.href = '#'

		loginLink.addEventListener('click', function (event) {
			event.preventDefault()
			localStorage.removeItem('authToken')
			window.location.href = 'login.html'
		})
	} else {
		loginLink.textContent = 'login'
		loginLink.href = 'login.html'
	}
}

document.addEventListener('DOMContentLoaded', function () {
	updateAdminContentVisibility()
	updateLoginLink()
})

