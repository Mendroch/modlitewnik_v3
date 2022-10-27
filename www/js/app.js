import { mapListToDOMElements, createDOMElem } from './dominteractions.js'
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
                categories.filter(categories => categories.id === categoryId)[0].name]
            }
        break
        default: texts = undefined; categories = undefined
    }
    return [texts.filter(text => text.name === textName),
        categories.filter(categories => categories.id === categoryId)[0].name]
}

initializeApp()

class Prayo {
    constructor() {
        this.viewElems = {}
        this.fontSizeStartGesture
        this.fontSizeInTouchEvent
        this.temporaryCategoryNum
        this.categoryNum
        this.categoryTitle
        this.textTitle
        this.backViewFromSearch
        this.isSearchOpened = false
        this.initializeApp()
        this.currentView = 'categories'
        this.initialDistance
        this.menuStartTouchPosition
        this.contentType
        this.liturgyShort
        this.textField
    }

    initializeApp = () => {
        this.connectDOMElements()
        this.setupListeners()
        this.initializeData()
    }

    // Zaciąganie danych z serwera i ich aktualizacja jeśli jest to możliwe
    initializeData = () => {
        this.getCategoriesAndTexts()
        getSongsUpdateRequest.then(() => {
            this.updateData()
        }).catch(() => {
            if (!localStorage.getItem('songsLastUpdate')) {
                this.togglePopUp(this.viewElems.networkInformation, true)
                this.viewElems.shadow.removeEventListener('click', this.toggleShadowWith)
                window.addEventListener('online', () => {
                    location.reload()
                })
            }
        })
    }

    // Usuwa ekran ładowania
    removeLoadingScreen = () => {
        if (getLSData('intentions') !== undefined) {
            this.viewElems.loadingScreen.classList.add('h-display--none')
        } else {
            this.viewElems.loadingScreen.classList.remove('h-display--none')
        }
    }

    // Aktualizuje teksty
    updateData = () => {
        getSongsCategoriesUpdate()
        .then(getSongsUpdate)
        .then(getPrayersCategoriesUpdate)
        .then(getPrayersUpdate)
        .then(getLiturgyCategoriesUpdate)
        .then(getLiturgyUpdate)
        .then(getAnnouncements)
        .then(getIntentions)
        .then(this.getCategoriesAndTexts)
        .catch(err => {
            alert(err)
        })
    }

    // Pobiera dane z Local Storage
    getCategoriesAndTexts = () => {
        this.songsCategories = getLSData('songsCategories')
        this.songs = getLSData('songs')
        this.prayersCategories = getLSData('prayersCategories')
        this.prayers = getLSData('prayers')
        this.liturgyCategories = getLSData('liturgyCategories')
        this.liturgy = getLSData('liturgy')
        this.announcements = getLSData('announcements')
        this.intentions = getLSData('intentions')
        this.fontSize = getFontSize()
        // this.removeLoadingScreen()
    }

    // Chwyta elementy drzewa DOM
    connectDOMElements = () => {
        const listOfIds = Array.from(document.querySelectorAll('[id]')).map(elem => elem.id)
        this.viewElems = mapListToDOMElements(listOfIds, 'id')
        this.listOfRadioFontType = document.querySelectorAll("input[name='fontType']")
        this.listOfRadioFontSize = document.querySelectorAll("input[name='fontSize']")
        this.listOfRadioFontLineHeight = document.querySelectorAll("input[name='fontLineHeight']")
    }

    // Ustawia wszystkie Listenery
    setupListeners = () => {
        this.viewElems.searchInput.addEventListener('focus', () => {
            this.currentView = 'search'
            this.editTextView()
        })
        this.viewElems.searchInputDiv.addEventListener('keyup', this.searchText)
        this.viewElems.textList.addEventListener('touchstart', e => {
            this.zoomTouchStart(e)
        })
        this.viewElems.textList.addEventListener('touchmove', e => {
            this.zoomTouchMove(e)
        })
        this.viewElems.textList.addEventListener('touchend', e => {
            this.zoomTouchEnd(e)
        })
    }


    // Edytuje wygląd widoku kategorii i tekstu
    editTextView = () => {
        this.viewElems.navigationLocation.innerText = this.contentType
        this.viewElems.textList.innerHTML = ''
        this.viewElems.textList.scrollTo(0, 0)

        switch (this.currentView) {
            case 'categories':
                this.backViewFromSearch = 'categories'
                this.viewElems.searchInputDiv.classList.remove('h-display-none')
                this.viewElems.categoryName.classList.add('h-display-none')
                this.viewElems.textList.classList.remove('is-text__list--categories')
                this.viewElems.textList.classList.remove('is-text__list--text')
                this.viewElems.textList.classList.remove('is-text__list--categories-liturgy')

                this.liturgyShort = false

                let categories
                switch (this.contentType) {
                    case "PIEŚNI": categories = this.songsCategories; break
                    case "MODLITWY": categories = this.prayersCategories; break
                    case "LITURGIA": 
                        categories = this.liturgyCategories; 
                        this.viewElems.searchInputDiv.classList.add('h-display-none')
                        this.viewElems.textList.classList.add('is-text__list--categories-liturgy')
                    break
                }

                categories.forEach(category => {
                    let listElem = this.createListSelection(category.name)
                    listElem.addEventListener('click', () => {
                        this.categoryNum = category.id
                        this.categoryTitle = category.name
                        if (this.contentType === "LITURGIA") {
                            if (category.content === "<p>---</p>") {
                                this.currentView = 'titles'
                                this.editTextView()
                            } else {
                                this.currentView = 'text'
                                this.liturgyShort = true
                                this.editTextView()
                            }
                        } else {
                            this.currentView = 'titles'
                            this.editTextView()
                        }
                    })
                    this.viewElems.textList.appendChild(listElem)
                })
            break
            case 'titles':
                this.backViewFromSearch = 'titles'
                this.viewElems.searchInputDiv.classList.remove('h-display-none')
                this.viewElems.categoryName.innerText = this.categoryTitle
                this.viewElems.categoryName.classList.remove('h-display-none')
                this.viewElems.textList.classList.add('is-text__list--categories')
                this.viewElems.textList.classList.remove('is-text__list--categories-liturgy')
                this.viewElems.textList.classList.remove('is-text__list--text')

                let titles
                switch (this.contentType) {
                    case "PIEŚNI": titles = this.songs; break
                    case "MODLITWY": titles = this.prayers; break
                    case "LITURGIA": 
                        titles = this.liturgy
                        this.viewElems.searchInputDiv.classList.add('h-display-none')
                        this.viewElems.textList.classList.add('is-text__list--text')
                    break
                }

                titles.forEach(text => {
                    if (this.categoryNum === text.category_id) {
                        const listElem = this.createListSelection(text.name)
                        listElem.addEventListener('click', () => {
                            this.textTitle = text.name
                            this.currentView = 'text'
                            this.editTextView()
                        })
                        this.viewElems.textList.appendChild(listElem)
                    }
                })
            break
            case 'text':
                this.viewElems.searchInputDiv.classList.add('h-display-none')
                this.viewElems.categoryName.innerText = this.categoryTitle
                this.viewElems.categoryName.classList.remove('h-display-none')
                this.viewElems.textList.classList.remove('is-text__list--categories')
                this.viewElems.textList.classList.remove('is-text__list--categories-liturgy')
                this.viewElems.textList.classList.add('is-text__list--text')

                if (!this.liturgyShort && this.contentType !== 'OGŁOSZENIA' && this.contentType !== 'INTENCJE MSZY') {
                    const textName = createDOMElem('div', 'c-text__text-name', this.textTitle)
                    this.viewElems.textList.appendChild(textName)
                }

                if (this.isSearchOpened) {
                    this.viewElems.categoryName.classList.add('h-display-none')
                    this.viewElems.textList.classList.add('is-text__list--search')
                }

                let textParagraph
                let text

                let i = 0
                switch (this.contentType) {
                    case "PIEŚNI": text = this.songs; break
                    case "MODLITWY": text = this.prayers; break
                    case "LITURGIA": 
                        if (this.liturgyShort) {
                            this.liturgyCategories.forEach(category => {
                                if (this.categoryNum === category.id) {
                                    textParagraph = createDOMElem('p', 'c-text', null, null, category.content)
                                    this.viewElems.textList.appendChild(textParagraph)
                                    i++
                                }
                            })
                        }
                        text = this.liturgy
                    break
                    case "OGŁOSZENIA":
                        textParagraph = createDOMElem('p', 'c-text', null, null, this.announcements.content)
                        this.viewElems.textList.appendChild(textParagraph)
                        i++
                    break
                    case "INTENCJE MSZY":
                        textParagraph = createDOMElem('p', 'c-text', null, null, this.intentions.content)
                        this.viewElems.textList.appendChild(textParagraph)
                        i++
                    break
                }

                if (i === 0) {
                    text.forEach(text => {
                        if (this.textTitle === text.name && i === 0) {
                            textParagraph = createDOMElem('p', 'c-text', null, null, text.content)
                            this.viewElems.textList.appendChild(textParagraph)
                            i++
                        }
                    })
                }
                this.textField = document.querySelector('.c-text')
                this.textField.style.fontSize = this.fontSize
            break
            case 'search':
                this.isSearchOpened = true
                this.viewElems.searchInputDiv.classList.remove('h-display-none')
                this.viewElems.categoryName.classList.add('h-display-none')
                this.viewElems.textList.classList.remove('is-text__list--search')
                this.viewElems.textList.classList.remove('is-text__list--categories')
                this.viewElems.textList.classList.remove('is-text__list--text')
                this.viewElems.textList.classList.remove('is-text__list--categories-liturgy')
                this.viewElems.searchInput.focus()

                let textTitles
                switch (this.contentType) {
                    case "PIEŚNI": textTitles = this.songs; break
                    case "MODLITWY": textTitles = this.prayers; break
                }

                textTitles.forEach(text => {
                    const listElem = this.createListSelection(text.name)
                    listElem.addEventListener('click', () => {
                        this.textTitle = text.name
                        this.currentView = 'text'
                        this.editTextView()
                    })
                    this.viewElems.textList.appendChild(listElem)
                })
            break
        }
    }

    // Tworzy element listy
    createListSelection = (text) => {
        const listElem = createDOMElem('div', 'c-list__elem', text)
        return listElem
    }

    // Przełącza przeźroczystość body
    fadeInOut = () => {
        if (this.viewElems.text.style.opacity === '1' || this.viewElems.text.style.opacity === '') {
            this.viewElems.text.style.opacity = '0'
        } else {
            this.viewElems.text.style.opacity = '1'
        }
    }

    // Wyszukuje pieśni i wyświetla wyniki
    searchText = () => {
        this.viewElems.textList.innerHTML = ''
        let inputText = this.viewElems.searchInput.value
        let texts

        switch (this.contentType) {
            case "PIEŚNI": texts = this.songs; break
            case "MODLITWY": texts = this.prayers; break
        }

        texts.forEach(text => {
            if (text.name.toLowerCase().indexOf(inputText.toLowerCase()) !== -1) {
                const listElem = this.createListSelection(text.name)
                listElem.addEventListener('click', () => {
                    this.textTitle = text.name
                    this.currentView = 'text'
                    this.editTextView()
                })
                this.viewElems.textList.appendChild(listElem)
            }
        })
    }

    // Określa początkowe wartości przy używaniu gestu
    zoomTouchStart = (e) => {
        if (e.touches.length === 2 && this.currentView === 'text') {
            e.preventDefault()
            this.fontSizeStartGesture = this.fontSize
            this.fontSizeInTouchEvent = this.fontSize
            this.initialDistance = Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2)
            + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)))
        }
    }

    // Aktualizuje rozmiar czcionki przy używaniu gestu
    zoomTouchMove = (e) => {
        if (e.touches.length === 2 && this.currentView === 'text') {
            let currentDistance = Math.round(Math.sqrt(Math.pow(e.touches[0].pageX - e.touches[1].pageX, 2)
            + Math.pow(e.touches[0].pageY - e.touches[1].pageY, 2)))

            let fontsSize = ['12px', '13px', '14px', '15px', '16px', '17px', '18px', '19px', '20px', '21px', '22px', '23px', '24px', '25px']
            let newfontSize = Math.floor((currentDistance - this.initialDistance) / 30)
            let fontSize = fontsSize[fontsSize.indexOf(this.fontSizeStartGesture) + newfontSize]
            if (fontSize !== undefined && fontSize !== this.fontSizeInTouchEvent) {
                this.textField.style.fontSize = fontSize
                this.fontSizeInTouchEvent = fontSize
            }
        }
    }

    // Zapisuje ustawienia czcinki po zakończeniu używania gestu
    zoomTouchEnd = (e) => {
        if (e.touches.length === 1 && this.currentView === 'text') {
            setFontSize(this.fontSizeInTouchEvent)
            this.fontSize = this.fontSizeInTouchEvent
        }
    }
}

// document.addEventListener('DOMContentLoaded', new Prayo())
