// Fonction pour fermer la modale sur un clic extérieur
function closeModalOnClickOutside (event) {
	const modalMain = document.querySelector('.modal-main')
	const modal2 = document.querySelector('.modal-2')

	if (!event.target.closest('.modal-wrapper')) {
		if (!modal2.classList.contains('hidden') || !modalMain.classList.contains('hidden')) {
			modal2.classList.add('hidden')
			modalMain.classList.add('hidden')
		}
	}
}

// Fonction pour réinitialiser le formulaire
function resetForm () {
	const form = document.getElementById('add-work-form')
	const imagePreview = document.getElementById('image-preview')
	const blockAddStatic = document.querySelector('.block-add-static')
	const submitButton = document.querySelector('.button-validation-preview')

	form.reset()
	imagePreview.src = ''
	imagePreview.classList.add('hidden')
	blockAddStatic.classList.remove('hidden')
	submitButton.classList.remove('active')
	submitButton.disabled = true
	checkFormValidity() // Vérifie la validité du formulaire après réinitialisation
}

// Fonction pour vérifier la validité du formulaire
function checkFormValidity () {
	const imagePreview = document.getElementById('image-preview')
	const titleInput = document.getElementById('name')
	const categorySelect = document.getElementById('categories')
	const submitButton = document.querySelector('.button-validation-preview')

	const isImagePreviewVisible = !imagePreview.classList.contains('hidden')
	const isTitleFilled = titleInput.value.trim() !== ''
	const isCategorySelected = categorySelect.value !== ''

	if (isImagePreviewVisible && isTitleFilled && isCategorySelected) {
		submitButton.classList.add('active')
		submitButton.disabled = false
	} else {
		submitButton.classList.remove('active')
		submitButton.disabled = true
	}
}

// Gestion du bouton précédent de la modal 2
function goToPreviousModal () {
	const modal2 = document.querySelector('.modal-2')
	const modalMain = document.querySelector('.modal-main')
	const errorMsgDiv = document.querySelector('.error-msg')

	modal2.classList.add('hidden')
	if (modalMain) {
		modalMain.classList.remove('hidden')
	} else {
		console.error('Modal principale non trouvée')
	}
	// Réinitialise le formulaire et cache le message d'erreur
	resetForm()
	if (errorMsgDiv) {
		errorMsgDiv.classList.add('hidden')
	}
}

// Gestion du clic sur le label + Ajouter photo
function handleAddPhotoLabelClick () {
	const errorMsgDiv = document.querySelector('.error-msg')

	if (errorMsgDiv) {
		errorMsgDiv.classList.add('hidden')
	}
}

// Prévisualisation de l'image avec vérification des fichiers
function handleFileInputChange () {
	const fileInput = document.getElementById('files')
	const imagePreview = document.getElementById('image-preview')
	const blockAddStatic = document.querySelector('.block-add-static')
	const errorMsgDiv = document.querySelector('.error-msg')

	const file = fileInput.files[0]
	const validTypes = ['image/jpeg', 'image/png']
	const maxSize = 4 * 1024 * 1024 // 4 Mo

	if (file && validTypes.includes(file.type) && file.size <= maxSize) {
		const reader = new FileReader()
		reader.onload = (e) => {
			imagePreview.src = e.target.result
			imagePreview.classList.remove('hidden')
			blockAddStatic.classList.add('hidden')
			checkFormValidity() // Vérifie la validité du formulaire
		}
		reader.readAsDataURL(file)
	} else {
		imagePreview.src = ''
		imagePreview.classList.add('hidden')
		blockAddStatic.classList.remove('hidden')
		// Affichage du message d'erreur avec texte personnalisé
		if (errorMsgDiv) {
			errorMsgDiv.classList.remove('hidden')
			errorMsgDiv.querySelector('p').textContent = `Le fichier doit être de type JPG ou PNG et ne pas dépasser 4 Mo.`
		}
		checkFormValidity() // Vérifie la validité du formulaire
	}
}

// Gestion de la soumission du formulaire
async function handleFormSubmit (event) {
	event.preventDefault()

	const titleInput = document.getElementById('name')
	const categorySelect = document.getElementById('categories')
	const fileInput = document.getElementById('files')
	const errorMsgDiv = document.querySelector('.error-msg')
	const title = titleInput.value
	const categoryId = categorySelect.value
	const token = localStorage.getItem('authToken')

	try {
		let formData = new FormData()

		if (fileInput.files.length > 0) {
			formData.append('title', title)
			formData.append('category', categoryId)
			formData.append('image', fileInput.files[0])
		}

		const response = await fetch('http://localhost:5678/api/works', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${token}`,
			},
			body: formData,
		})

		if (response.ok) {
			if (response.status === 201) {
				// Redirection en cas de succès
				await mettreAJourGalerieModal()
				await mettreAJourGalerie()
				closeModals()
			} else {
				throw new Error(`Erreur HTTP ${response.status}`)
			}
		} else {
			const result = await response.json()
			throw new Error(result.message || `Erreur HTTP ${response.status}`)
		}
	} catch (error) {
		console.error('Erreur lors de l\'ajout du travail:', error)

		// Affichage du message d'erreur avec texte personnalisé
		if (errorMsgDiv) {
			errorMsgDiv.classList.remove('hidden')
			errorMsgDiv.querySelector('p').textContent = `Works non créé, message d'erreur : ${error.message}`
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const generiquemodal = document.querySelector('.modal-2')
	const form = document.getElementById('add-work-form')

	// Ajout des gestionnaires d'événements
	if (generiquemodal) {
		generiquemodal.addEventListener('click', closeModalOnClickOutside)
	}

	const closeModalTwoButton = document.querySelector('.close-modal-two')

	if (closeModalTwoButton) {
		closeModalTwoButton.addEventListener('click', closeModals)
	} else {
		console.error('Bouton pour fermer la modale non trouvé')
	}

	const previousModalMainButton = document.querySelector('.previous-modal-main')
	if (previousModalMainButton) {
		previousModalMainButton.addEventListener('click', goToPreviousModal)
	} else {
		console.error('Bouton pour revenir sur la 1ère modal non trouvé')
	}

	const addPhotoLabel = document.querySelector('label[for="files"]')
	if (addPhotoLabel) {
		addPhotoLabel.addEventListener('click', handleAddPhotoLabelClick)
	} else {
		console.error('Label pour ajouter une photo non trouvé')
	}

	const fileInput = document.getElementById('files')
	if (fileInput) {
		fileInput.addEventListener('change', handleFileInputChange)
	}

	const titleInput = document.getElementById('name')
	const categorySelect = document.getElementById('categories')
	if (titleInput && categorySelect) {
		titleInput.addEventListener('input', checkFormValidity)
		categorySelect.addEventListener('change', checkFormValidity)
	}

	form.addEventListener('submit', handleFormSubmit)

	// Initial check for form validity on load
	checkFormValidity()
})
