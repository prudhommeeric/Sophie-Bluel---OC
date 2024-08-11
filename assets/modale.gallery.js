// Fonction pour fermer toutes les modales
function closeModals () {
	const modalMain = document.querySelector('.modal-main')
	const modalAdd = document.querySelector('.modal-2')

	modalMain.classList.add('hidden')
	modalAdd.classList.add('hidden')
}

// Fonction pour initialiser les événements des modales
function initModal () {
	const openModalButton = document.querySelector('.open-modal')
	const closeModalButton = document.querySelector('.close-modal')
	const addWorksButton = document.querySelector('.add-works')
	const generiquemodal = document.querySelector('.modal')

	// Fermeture des modales en cliquant à l'extérieur de la modale
	if (generiquemodal) {
		generiquemodal.addEventListener('click', (e) => {
			if (!e.target.closest('.modal-wrapper')) {
				closeModals()
			}
		})
	}

	// Ouverture de la modale principale
	if (openModalButton) {
		openModalButton.addEventListener('click', async () => {
			const modalMain = document.querySelector('.modal-main')
			modalMain.classList.remove('hidden')
			await mettreAJourGalerieModal()
		})
	} else {
		console.error('Bouton pour ouvrir la modale non trouvé')
	}

	// Fermeture de la modale principale via le bouton de fermeture
	if (closeModalButton) {
		closeModalButton.addEventListener('click', closeModals)
	} else {
		console.error('Bouton pour fermer la modale non trouvé')
	}

	// Fermeture de la modale principale et ouverture de la modale d'ajout
	if (addWorksButton) {
		addWorksButton.addEventListener('click', () => {
			closeModals()
			const modalAdd = document.querySelector('.modal-2')
			modalAdd.classList.remove('hidden')
		})
	} else {
		console.error('Bouton "Ajouter une photo" non trouvé')
	}
}

// Fonction pour récupérer les données de la galerie via une API
async function fetchGalerieModalData () {
	const url = 'http://localhost:5678/api/works'
	try {
		const response = await fetch(url)
		if (!response.ok) throw new Error('Erreur de réponse du serveur')
		return await response.json()
	} catch (error) {
		console.error('Erreur lors de la récupération des données de la galerie:', error)
		return []
	}
}

// Fonction pour mettre à jour la galerie dans la modale
async function mettreAJourGalerieModal () {
	const data = await fetchGalerieModalData()
	const galleryModal = document.querySelector('.gallery-modal')

	// Efface le contenu existant de la galerie
	galleryModal.innerHTML = ''

	// Ajoute chaque item de la galerie dans le DOM
	data.forEach(item => {
		const figure = document.createElement('figure')
		figure.dataset.id = item.id // Ajouter l'ID comme attribut de données
		const imageElement = document.createElement('img')
		imageElement.src = item.imageUrl
		imageElement.alt = item.title

		const trashIcon = document.createElement('i')
		trashIcon.className = 'fa-solid fa-trash-can trash-icon'
		trashIcon.dataset.id = item.id

		// Ajoute un gestionnaire d'événements pour supprimer l'élément
		trashIcon.addEventListener('click', async () => {
			const success = await deleteWork(item.id)
			if (success) {
				figure.remove()
				await mettreAJourGalerie()
				closeModals()
			}
		})

		figure.appendChild(imageElement)
		figure.appendChild(trashIcon)
		galleryModal.appendChild(figure)
	})
}

// Fonction pour supprimer un work via l'API
async function deleteWork (id) {
	const url = `http://localhost:5678/api/works/${id}`
	const token = localStorage.getItem('authToken')

	if (!token) {
		console.error('Jeton non trouvé dans le localStorage.')
		return false
	}

	try {
		const response = await fetch(url, {
			method: 'DELETE', headers: {
				'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`,
			},
		})

		if (response.ok) {
			console.log(`Le works avec l'ID ${id} a été supprimée avec succès.`)
			return true
		} else {
			const errorMessage = await response.text()
			console.error(`Échec de la suppression du works avec l'ID ${id}. Erreur: ${errorMessage}`)
			return false
		}
	} catch (error) {
		console.error(`Erreur lors de la requête de suppression du works avec l'ID ${id}. Erreur: ${error.message}`)
		return false
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Initialisation des événements
	initModal()
})
