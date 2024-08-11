console.log('categorie.js chargé')

//-----------------------------Boutons Categories--------------------------------------------

// Fonction pour récupérer les données de l'API Categories
async function fetchCategoriesData () {
	const responseCategories = await fetch('http://localhost:5678/api/categories')
	const dataCategories = await responseCategories.json()
	return dataCategories
}

async function mettreAJourCategories () {

	const dataCategories = await fetchCategoriesData()
	// Sélectionnez les éléments déjà présents dans le HTML
	const categoriesElement = document.querySelector('.categories')
	const divCategories = categoriesElement.querySelector('.div-bouton')
	dataCategories.unshift({ id: null, name: 'Tous' })

	// Efface le contenu existant de la galerie
	divCategories.innerHTML = ''

	// Utiliser un Set pour éviter les doublons
	const categoriesSet = new Set()

	dataCategories.forEach(category => {
		categoriesSet.add(category.name)

		// Créez un bouton pour chaque catégorie unique
		const button = document.createElement('button')
		button.type = 'button'
		button.textContent = category.name
		button.dataset.id = category.id

		// Ajoutez un gestionnaire d'événements au bouton pour mettre à jour la galerie en fonction de la catégorie
		button.addEventListener('click', () => {
			console.log(`Bouton catégorie '${category.name}' cliqué, ID: ${category.id}`)
			mettreAJourGalerie(category.id)
		})

		button.classList.add('filtre-bouton')
		divCategories.appendChild(button)
	})
}


//--------------------------------GALLERY Works-----------------------------------

// Fonction pour récupérer les données de l'API Works
async function fetchGalerieData () {
	const url = 'http://localhost:5678/api/works'
	console.log(`recuperer les donnée a partir de l'url: ${url}`)
	const responseWorks = await fetch(url)
	const dataWorks = await responseWorks.json()
	return dataWorks
}

// Fonction pour créer et ajouter les éléments de la galerie
async function mettreAJourGalerie (categoryId = null) {
	let dataWorks = await fetchGalerieData()

	if (categoryId) {
		// Filtrer les travaux par catégorie
		dataWorks = dataWorks.filter(work => work.categoryId === categoryId)
	}

	const gallery = document.querySelector('.gallery')

	// Compteur de projets dans l'API
	const nombreDeProjets = dataWorks.length
	console.log(`Le nombre de projets est : ${nombreDeProjets}`)

	// Efface le contenu existant de la galerie
	gallery.innerHTML = ''

	dataWorks.forEach(item => {

		// Crée leséléments HTML
		const figure = document.createElement('figure')

		const imageElement = document.createElement('img')
		imageElement.src = item.imageUrl
		imageElement.alt = item.title

		const figcaption = document.createElement('figcaption')
		figcaption.innerHTML = item.title

		// Ajoute les éléments au DOM
		figure.appendChild(imageElement)
		figure.appendChild(figcaption)
		gallery.appendChild(figure)
	})
}

// Appel de la fonction pour récupérer les données de l'API Works et mettre à jour la galerie après que le DOM est chargé
document.addEventListener('DOMContentLoaded', async () => {
	await mettreAJourGalerie()
	await mettreAJourCategories()

})
