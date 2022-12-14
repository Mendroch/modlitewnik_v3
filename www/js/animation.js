export const makeTransition = (showView, undo) => {
    if (document.querySelector('.h-transition') !== null) {
        let content = document.querySelector('.h-transition')

        if (showView) {
            if (undo || document.querySelector('.c-home')) {
                if (document.querySelector('.c-home')) {
                    content.style.animation = 'fadeIn .25s ease-in-out'
                } else {
                    content.style.animation = 'slideRightIn .25s ease-in-out'
                }
            } else {
                if (document.querySelector('.categories')) {
                    content.style.animation = 'fadeIn .25s ease-in-out'
                } else {
                    content.style.animation = 'slideLeftIn .25s ease-in-out'
                }
            }
        } else {
            if (undo) {
                if (document.querySelector('.categories')) {
                    content.style.animation = 'fadeOut .25s ease-in-out'
                } else {
                    content.style.animation = 'slideRightOut .25s ease-in-out'
                }
            } else {
                if (document.querySelector('.c-home')) {
                    content.style.animation = 'fadeOut .25s ease-in-out'
                } else {
                    content.style.animation = 'slideLeftOut .25s ease-in-out'
                }
            }
        }
    }
}
