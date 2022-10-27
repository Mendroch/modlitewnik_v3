const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/www/views/404.html",
    "/www/": "/www/views/home.html",
    "/": "/www/views/home.html",
    "/categories": "/www/views/categories.html",
    "/titles": "/www/views/titles.html",
    "/text": "/www/views/text.html",
    "/search": "/www/views/search.html",
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("mainContent").innerHTML = html;
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
