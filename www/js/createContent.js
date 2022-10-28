import { getCategories, getTitles, getText, typeOfContent, getTexts, addZoomListeners } from './app.js'
import { getFontSize } from './getsetdata.js'

const updateLocation = (view) => {
    let location = document.getElementById('navigationLocation')
    let content = typeOfContent()
    location.innerText = content
    if (content === 'Liturgia' && view) {
        let input = document.getElementById('searchInputDiv')
        input.classList.add('h-display-none')
        let list = document.getElementById(view)
        if (view === 'categoriesList') {
            list.classList.add('is-categories__list')
        } else {
            list.classList.add('is-titles__list')
        }
    }
}

let texts

const searchText = () => {
    let input = document.getElementById('searchInput')
    let list = document.getElementById('titlesList')
    let inputText = input.value
    list.innerHTML = ''
    texts.forEach(text => {
        if (text.name.toLowerCase().indexOf(inputText.toLowerCase()) !== -1 || inputText === '') {
            const listElem = `<a class="c-list__elem" href="/www/text" onclick="route(), setTextName('${text.name}')">${text.name}</a>`
            list.innerHTML += listElem
        }
    })
}

export const createCategories = () => {
    updateLocation('categoriesList')
    let list = document.getElementById('categoriesList')
    let categories = getCategories()

    categories.forEach(category => {
        let listElem
        if (category.content && category.content !== '<p>---</p>') {
            listElem = `<a class="c-list__elem" href="/www/text" onclick="route(), setCategoryId(${category.id})">${category.name}</a>`
        } else {
            listElem = `<a class="c-list__elem" href="/www/titles" onclick="route(), setCategoryId(${category.id})">${category.name}</a>`
        }
        list.innerHTML += listElem
    })
}

export const createTitles = () => {
    updateLocation('titlesList')
    let list = document.getElementById('titlesList')
    let categoryName = document.getElementById('categoryName')
    let titles = getTitles()

    categoryName.innerText = titles[1]
    titles[0].forEach(title => {
        let listElem = `<a class="c-list__elem" href="/www/text" onclick="route(), setTextName('${title.name}')">${title.name}</a>`
        list.innerHTML += listElem
    })
}

export const createText = () => {
    updateLocation()
    let container = document.getElementById('text')
    addZoomListeners(container)
    container.style.fontSize = getFontSize()
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
    container.innerHTML += `<p class="c-text">${text[0][0].content}</p>`
}

export const createSearch = () => {
    updateLocation()
    texts = getTexts()
    let input = document.getElementById('searchInput')
    searchText()
    input.addEventListener('keyup', searchText)
    input.focus()
}
