import { createCategories, createTitles, createText, createSearch } from './createContent.js'
import { makeTransition } from './animation.js'
let undo = false

const route = (event) => {
    event = event || window.event
    event.preventDefault()
    window.history.pushState({}, "", event.target.href)
    undo = false
    handleLocation()
}

const routes = {
    404: "/views/404.html",
    "/": "/views/home.html",
    "/index.html": "/views/home.html",
    "/categories": "/views/categories.html",
    "/titles": "/views/titles.html",
    "/text": "/views/text.html",
    "/search": "/views/search.html",
}

const createContent = (view) => {
    switch (view) {
        case 'categories': createCategories(); break
        case 'titles': createTitles(); break
        case 'text': createText(); break
        case 'search': createSearch(); break
    }
}

const handleLocation = async () => {
    makeTransition(false, undo)
    setTimeout(async () => {
        document.getElementById("mainContent").innerHTML = ''
        const path = window.location.pathname
        const route = routes[path] || routes[404]
        const html = await fetch(route).then((data) => data.text())
        document.getElementById("mainContent").innerHTML = html
        createContent(path.slice(1))
        makeTransition(true, undo)
        undo = true
    }, 230)
}

const initializeApp = () => {
    window.onpopstate = handleLocation
    window.route = route
    handleLocation()
}

document.addEventListener('DOMContentLoaded', initializeApp())
