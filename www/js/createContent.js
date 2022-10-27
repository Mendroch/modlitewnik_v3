import { getCategories, getTitles, getText } from './app.js'

export const createCategories = () => {
    let list = document.getElementById('categoriesList')
    let categories = getCategories()

    categories.forEach(category => {
        let listElem
        if (category.content !== '<p>---</p>') {
            listElem = `<a class="c-list__elem" href="/www/text" onclick="route(), setCategoryId(${category.id})">${category.name}</a>`
        } else {
            listElem = `<a class="c-list__elem" href="/www/titles" onclick="route(), setCategoryId(${category.id})">${category.name}</a>`
        }
        list.innerHTML += listElem
    })
}

export const createTitles = () => {
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
    let container = document.getElementById('text')
    let categoryName = document.getElementById('categoryName2')
    let text = getText()

    categoryName.innerText = text[1]
    if (text[0][0].name !== text[1]) {
        container.innerHTML += `<p class="c-text__text-name">${text[0][0].name}</p>`
    }
    container.innerHTML += `<p class="c-text">${text[0][0].content}</p>`
}
