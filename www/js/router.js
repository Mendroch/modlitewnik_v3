import { createCategories, createTitles, createText, createSearch } from './createContent.js'

const route = (event) => {
    event = event || window.event
    event.preventDefault()
    window.history.pushState({}, "", event.target.href)
    handleLocation()
}

const routes = {
    404: "/www/views/404.html",
    "/www/": "/www/views/home.html",
    "/www/categories": "/www/views/categories.html",
    "/www/titles": "/www/views/titles.html",
    "/www/text": "/www/views/text.html",
    "/www/search": "/www/views/search.html",
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
    const path = window.location.pathname
    const route = routes[path] || routes[404]
    const html = await fetch(route).then((data) => data.text())
    document.getElementById("mainContent").innerHTML = html
    createContent(path.slice(5))
}

window.onpopstate = handleLocation
window.route = route

handleLocation()
