import { getCategories, getTitles, getText, typeOfContent, getTexts, addZoomListeners, removeZoomListeners } from './app.js'
import { createDOMElem } from './dominteractions.js'

const updateLocation = (view) => {
    let location = document.getElementById('navigationLocation')
    let content = typeOfContent()
    location.innerText = content
    if (content === 'Liturgia' && view) {
        let searchButton = document.getElementById('searchButton')
        searchButton.classList.add('h-display-none')
        let list = document.getElementById(view)
        list.classList.add('is-liturgy__list')
    }
}

let texts
const searchText = () => {
    let input = document.getElementById('searchInput')
    let list = document.getElementById('titlesList')
    let inputText = input.value
    list.innerHTML = ''
    list.scrollTop = 0

    let searchedTexts = texts.filter(text => text.name.toLowerCase().includes(inputText.toLowerCase()) 
        || text.content.toLowerCase().includes(inputText.toLowerCase()))

    searchedTexts.sort((a, b) => {
        if(a.name.toLowerCase().includes(inputText.toLowerCase()) === true && b.name.toLowerCase().includes(inputText.toLowerCase()) === false) return -1
        else if(a.name.toLowerCase().includes(inputText.toLowerCase()) === false && b.name.toLowerCase().includes(inputText.toLowerCase()) === true) return 1
        else return 0
    })

    searchedTexts.forEach(text => {
        let name = text.name

        const listElem = createDOMElem('a', 'c-list__elem', '', '/text')
        listElem.innerHTML = name
        listElem.onclick = () => {
            route()
            setTextName(name)
        }
    
        list.appendChild(listElem)
    })
    if (searchedTexts.length == 0) {
        let noResult = createDOMElem('div', 'c-no-results', 'Brak wyników')
        list.appendChild(noResult)
    }
}

export const createCategories = () => {
    updateLocation('categoriesList')
    let list = document.getElementById('categoriesList')
    let categories = getCategories()

    categories.forEach(category => {
        let listElem
        if (category.content && category.content !== '<p>---</p>') {
            listElem = createDOMElem('a', 'c-list__elem', category.name, '/text')
        } else {
            listElem = createDOMElem('a', 'c-list__elem', category.name, '/titles')
        }

        listElem.onclick = () => {
            route()
            setCategoryId(category.id)
        }
        list.appendChild(listElem)
    })
}

export const createTitles = () => {
    updateLocation('titlesList')
    let list = document.getElementById('titlesList')
    let categoryName = document.getElementById('categoryName')
    let titles = getTitles()

    categoryName.innerText = titles[1]
    titles[0].forEach(title => {
        let listElem = createDOMElem('a', 'c-list__elem', title.name, '/text')
        listElem.onclick = () => {
            route()
            setTextName(title.name)
        }
        list.appendChild(listElem)
    })
}

export const createText = () => {
    updateLocation()
    let container = document.getElementById('text')
    if (typeOfContent() !== 'Kolęda') {
        addZoomListeners(container)
    } else {
        removeZoomListeners(container)
    }
    let categoryName = document.getElementById('categoryName2')
    let text = getText()

    if (!text[1]) {
        categoryName.classList.add('h-display-none')
        container.classList.add('is-text--no-category')
        if (text[0][0].name !== undefined) {
            container.innerHTML += `<p class="c-text__text-name">${text[0][0].name}</p>`
        }
    } else {
        categoryName.innerText = text[1].name
        if (text[0][0].name !== text[1].name) {
            container.innerHTML += `<p class="c-text__text-name">${text[0][0].name}</p>`
        }
    }
    container.innerHTML += `<div class="text">${text[0][0].content}</div>`
}

export const createSearch = () => {
    updateLocation()
    texts = getTexts()
    let input = document.getElementById('searchInput')
    searchText()
    input.addEventListener('keyup', searchText)
    input.focus()
}
