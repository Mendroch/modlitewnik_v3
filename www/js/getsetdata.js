// Pobiera dane z Local Storage
export const getLSData = (dataName) => {
    if (localStorage.getItem(dataName)) {
        return JSON.parse(localStorage.getItem(dataName))
    } else { 
        return undefined
    }
}

// Pobiera ustawienia czcionki z Local Storage
export const getFontSize = () => {
    if (localStorage.getItem('fontSize')) {
        return JSON.parse(localStorage.getItem('fontSize'))
    } else {
        localStorage.setItem('fontSize', JSON.stringify('16px'))
        return '16px'
    }
}

// Zapisuje ustawienia czcionki w Local Storage
export const setFontSize = (fontSize) => {
    localStorage.setItem('fontSize', JSON.stringify(fontSize))
}
