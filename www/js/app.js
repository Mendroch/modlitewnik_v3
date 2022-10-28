import { getFontSize, setFontSize, getLSData } from './getsetdata.js'
import { getSongsCategoriesUpdate, getSongsUpdate, getPrayersCategoriesUpdate, 
    getPrayersUpdate, getLiturgyCategoriesUpdate, getLiturgyUpdate, getAnnouncements, getIntentions } from './updatecontent.js'
import { getSongsUpdateRequest } from './requests.js'

let songsCategories
let songs
let prayersCategories
let prayers
let liturgyCategories
let liturgy
let announcements
let intentions
let fontSize
let contentType
let categoryId
let textName
let fontSizeStartGesture
let fontSizeInTouchEvent
let initialDistance

const initializeApp = () => {
    initializeData()
    window.setType = setType
    window.setCategoryId = setCategoryId
    window.setTextName = setTextName
}

const setType = type => contentType = type
const setCategoryId = id => categoryId = id
const setTextName = name => textName = name

// Zaciąganie danych z serwera i ich aktualizacja jeśli jest to możliwe
function initializeData() {
    getCategoriesAndTexts()
    getSongsUpdateRequest.then(() => {
        updateData()
    }).catch(() => {
        if (!localStorage.getItem('songsLastUpdate')) {
            window.addEventListener('online', () => {
                location.reload()
            })
        }
    })
}

// Aktualizuje teksty
const updateData = () => {
    getSongsCategoriesUpdate()
    .then(getSongsUpdate)
    .then(getPrayersCategoriesUpdate)
    .then(getPrayersUpdate)
    .then(getLiturgyCategoriesUpdate)
    .then(getLiturgyUpdate)
    .then(getAnnouncements)
    .then(getIntentions)
    .then(getCategoriesAndTexts())
    .catch(err => {
        alert(err)
    })
}

// Pobiera dane z Local Storage
const getCategoriesAndTexts = () => {
    songsCategories = getLSData('songsCategories')
    songs = getLSData('songs')
    prayersCategories = getLSData('prayersCategories')
    prayers = getLSData('prayers')
    liturgyCategories = getLSData('liturgyCategories')
    liturgy = getLSData('liturgy')
    announcements = getLSData('announcements')
    intentions = getLSData('intentions')
    fontSize = getFontSize()
}

export const getCategories = () => {
    switch (contentType) {
        case 'songs': return songsCategories
        case 'prayers': return prayersCategories
        case 'liturgy': return liturgyCategories
    }
}

export const getTitles = () => {
    let categories
    let titles
    switch (contentType) {
        case 'songs': titles = songs; categories = songsCategories; break
        case 'prayers': titles = prayers; categories = prayersCategories; break
        case 'liturgy': titles = liturgy; categories = liturgyCategories; break
        default: titles = undefined; categories = undefined
    }
    return [titles.filter(title => title.category_id === categoryId), 
        categories.filter(categories => categories.id === categoryId)[0].name]
}

export const getText = () => {
    let categories
    let texts
    switch (contentType) {
        case 'songs': texts = songs; categories = songsCategories; break
        case 'prayers': texts = prayers; categories = prayersCategories; break
        case 'liturgy': 
            texts = liturgy; 
            categories = liturgyCategories; 

            if (categories.filter(categories => categories.id === categoryId)[0].content !== '<p>---</p>') {
                return [[categories.filter(categories => categories.id === categoryId)[0]],
                categories.filter(categories => categories.id === categoryId)[0]]
            }
        break
        case 'announcements': return [[announcements]]
        case 'intentions': return [[intentions]]
        default: texts = undefined; categories = undefined
    }
    let category = texts.filter(text => text.name === textName)
    return [category, categories.filter(categories => categories.id === category[0].category_id)[0]]
}

export const typeOfContent = () => {
    switch (contentType) {
        case 'songs': return 'Pieśni'
        case 'prayers': return 'Modlitwy'
        case 'liturgy': return 'Liturgia'
        case 'announcements': return 'Ogłoszenia'
        case 'intentions': return 'Intencje mszalne'
    }
}

export const getTexts = () => {
    switch (contentType) {
        case 'songs': return songs
        case 'prayers': return prayers
    }
}

// Określa początkowe wartości przy używaniu gestu
const zoomTouchStart = (e) => {
    if (e.touches.length === 2) {
        e.preventDefault()
        fontSizeStartGesture = fontSize
        fontSizeInTouchEvent = fontSize
        initialDistance = Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2)
        + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)))
    }
}

// Aktualizuje rozmiar czcionki przy używaniu gestu
const zoomTouchMove = (e) => {
    if (e.touches.length === 2) {
        let currentDistance = Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2)
        + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)))

        let fontsSize = ['12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px', '21px', '22px', '23px', '24px', '25px']
        let newfontSize = Math.floor((currentDistance - initialDistance) / 30)
        let fontSize = fontsSize[fontsSize.indexOf(fontSizeStartGesture) + newfontSize]
        if (fontSize !== undefined && fontSize !== fontSizeInTouchEvent) {
            let text = document.getElementById('text')
            text.style.fontSize = fontSize
            fontSizeInTouchEvent = fontSize
        }
    }
}

// Zapisuje ustawienia czcinki po zakończeniu używania gestu
const zoomTouchEnd = (e) => {
    if (e.touches.length === 1) {
        setFontSize(fontSizeInTouchEvent)
        fontSize = fontSizeInTouchEvent
    }
}

export const addZoomListeners = (container) => {
    container.addEventListener('touchstart', e => {
        zoomTouchStart(e)
    })
    container.addEventListener('touchmove', e => {
        zoomTouchMove(e)
    })
    container.addEventListener('touchend', e => {
        zoomTouchEnd(e)
    })
}

document.addEventListener('DOMContentLoaded', initializeApp())
