import {getSongsCategoriesRequest, getSongsRequest, getSongsCategoriesUpdateRequest, getSongsUpdateRequest, 
    getPrayersCategoriesRequest, getPrayersRequest, getPrayersCategoriesUpdateRequest, getPrayersUpdateRequest, 
    getLiturgyCategoriesRequest, getLiturgyRequest, getLiturgyCategoriesUpdateRequest, getLiturgyUpdateRequest,
    getAnnouncementsRequest, getIntentionsRequest
} from "./requests.js"

let songsCategoriesLastUpdateLS
let songsLastUpdateLS
let prayersCategoriesLastUpdateLS
let prayersLastUpdateLS
let liturgyCategoriesLastUpdateLS
let liturgyLastUpdateLS

// Aktualizuje kategorie pieśni
export const getSongsCategoriesUpdate = () => {
    return new Promise((resolve, reject) => {
        getSongsCategoriesUpdateRequest.then((response) => {
            if (response.lastUpdate != songsCategoriesLastUpdateLS) {
                localStorage.setItem("songsCategoriesLastUpdate",JSON.stringify(response.lastUpdate))
                getSongsCategoriesRequest.then((response) => {
                    function sortStr (a, b) {
                        return a.name.localeCompare(b.name);
                    }
                    response.sort(sortStr);
                    localStorage.setItem("songsCategories",JSON.stringify(response))
                    resolve()
                }).catch((reject) => alert(reject))
            } else {
                resolve()
            }
        }).catch((reject) => alert(reject))
    })
}

// Aktualizuje pieśni
export const getSongsUpdate = () => {
    return new Promise((resolve, reject) => {
        getSongsUpdateRequest.then((response) => {
            if (response.lastUpdate != songsLastUpdateLS) {
                localStorage.setItem("songsLastUpdate",JSON.stringify(response.lastUpdate));
                getSongsRequest.then((response) => {
                    function sortStr (a, b) {
                        return a.name.localeCompare(b.name);
                    }
                    response.sort(sortStr);
                    localStorage.setItem("songs",JSON.stringify(response))
                    resolve()
                }).catch((reject) => alert(reject))
            } else {
                resolve()
            }
        }).catch((reject) => alert(reject))
    })
}

// Aktualizuje kategorie modlitw
export const getPrayersCategoriesUpdate = () => {
    return new Promise((resolve, reject) => {
        getPrayersCategoriesUpdateRequest.then((response) => {
            if (response.lastUpdate != prayersCategoriesLastUpdateLS) {
                localStorage.setItem("prayersCategoriesLastUpdate",JSON.stringify(response.lastUpdate))
                getPrayersCategoriesRequest.then((response) => {
                    function sortStr (a, b) {
                        return a.name.localeCompare(b.name);
                    }
                    response.sort(sortStr);
                    localStorage.setItem("prayersCategories",JSON.stringify(response))
                    resolve()
                }).catch((reject) => alert(reject))
            } else {
                resolve()
            }
        }).catch((reject) => alert(reject))
    })
}

// Aktualizuje modlitwy
export const getPrayersUpdate = () => {
    return new Promise((resolve, reject) => {
        getPrayersUpdateRequest.then((response) => {
            if (response.lastUpdate != prayersLastUpdateLS) {
                localStorage.setItem("prayersLastUpdate",JSON.stringify(response.lastUpdate));
                getPrayersRequest.then((response) => {
                    function sortStr (a, b) {
                        return a.name.localeCompare(b.name);
                    }
                    response.sort(sortStr);
                    localStorage.setItem("prayers",JSON.stringify(response))
                    resolve()
                }).catch((reject) => alert(reject))
            } else {
                resolve()
            }
        }).catch((reject) => alert(reject))
    })
}
getLiturgyCategoriesUpdateRequest
// Aktualizuje kategorie liturgii
export const getLiturgyCategoriesUpdate = () => {
    return new Promise((resolve, reject) => {
        getLiturgyCategoriesUpdateRequest.then((response) => {
            if (response.lastUpdate != liturgyCategoriesLastUpdateLS) {
                localStorage.setItem("liturgyCategoriesLastUpdate",JSON.stringify(response.lastUpdate))
                getLiturgyCategoriesRequest.then((response) => {
                    function sortStr (a, b) {
                        return a.name.localeCompare(b.name);
                    }
                    response.sort(sortStr);
                    localStorage.setItem("liturgyCategories",JSON.stringify(response))
                    resolve()
                }).catch((reject) => alert(reject))
            } else {
                resolve()
            }
        }).catch((reject) => alert(reject))
    })
}

// Aktualizuje liturgie
export const getLiturgyUpdate = () => {
    return new Promise((resolve, reject) => {
        getLiturgyUpdateRequest.then((response) => {
            if (response.lastUpdate != liturgyLastUpdateLS) {
                localStorage.setItem("liturgyLastUpdate",JSON.stringify(response.lastUpdate));
                getLiturgyRequest.then((response) => {
                    function sortStr (a, b) {
                        return a.name.localeCompare(b.name);
                    }
                    response.sort(sortStr);
                    localStorage.setItem("liturgy",JSON.stringify(response))
                    resolve()
                }).catch((reject) => alert(reject))
            } else {
                resolve()
            }
        }).catch((reject) => alert(reject))
    })
}

// Aktualizuje ogłoszenia
export const getAnnouncements = () => {
    return new Promise((resolve, reject) => {
        getAnnouncementsRequest.then((response) => {
            localStorage.setItem("announcements",JSON.stringify(response))
            resolve()
        }).catch((reject) => alert(reject))
    })
}

// Aktualizuje intencje
const addEnters = (text) => {
    let keyWords = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota']
    for (let keyWord of keyWords) {
        if (text.content.indexOf(keyWord) !== -1) {
            text.content = text.content.replaceAll(keyWord, `<br/><br/>${keyWord}`)
        }
    }
    return text
}

export const getIntentions = () => {
    return new Promise((resolve, reject) => {
        getIntentionsRequest.then((response) => {
            localStorage.setItem("intentions",JSON.stringify(addEnters(response)))
            resolve()
        }).catch((reject) => alert(reject))
    })
}
