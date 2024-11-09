const parents = document.querySelectorAll('#physical input[type="range"]')
parents.forEach((input) => {
    input.addEventListener('change', (e) => {
        e.preventDefault()
        mp.trigger('custom:parents', JSON.stringify({
            father: Number(Array.from(parents).find(({ name }) => name == 'father').value),
            mother: Number(Array.from(parents).find(({ name }) => name == 'mother').value),
            similar: Number(Array.from(parents).find(({ name }) => name == 'similar').value) * 0.01,
        }))
    })
})

const genders = document.querySelectorAll('#gender input[type="radio"]')
genders.forEach(gender => gender.addEventListener('change', (event) => {
    if (event.target.checked) {
        return mp.trigger('custom:gender', Number(event.target.value));;
    }
}))

const styles = document.querySelectorAll('#colors input[type="range"]')
styles.forEach(style => style.addEventListener('change', (event) => {
    mp.trigger('client:changeStyle', JSON.stringify({
        eyeColor: Number(Array.from(styles).find(({ name }) => name == 'eyeColor').value),
        hairStyle: Number(Array.from(styles).find(({ name }) => name == 'hairStyle').value),
        hairColor: Number(Array.from(styles).find(({ name }) => name == 'hairColor').value),
        highlightHairColor: Number(Array.from(styles).find(({ name }) => name == 'highlightHairColor').value)
    }));;
}));


document.querySelectorAll('[contenteditable]').forEach((element) => {
    element.addEventListener('input', (e) => {
        const value = e.target.textContent;
        const fieldset = e.target.closest('fieldset')
        const input = fieldset.querySelector("[type='range']")
        const numericValue = value.replace(/\D/g, '');
        const maxValue = input.getAttribute('max');
        const minValue = input.getAttribute('min');
        if (numericValue > maxValue) {
            e.target.textContent = maxValue;
            input.value = maxValue;
        } else if (numericValue < minValue) {
            e.target.textContent = minValue;
            input.value = minValue;
        } else {
            e.target.textContent = numericValue;
            input.value = numericValue;
        }
    });
})

document.querySelectorAll('[type="range"]').forEach((range) => {
    range.addEventListener('change', (e) => {
        const { value } = e.target
        const fieldset = e.target.closest('fieldset')
        const indicator = fieldset.querySelector('[contenteditable]')
        indicator.textContent = value
    })
})

document.getElementById('save').addEventListener('click', () => {
    mp.trigger('client:saveCustomization', JSON.stringify({
        father: Number(Array.from(parents).find(({ name }) => name == 'father').value),
        mother: Number(Array.from(parents).find(({ name }) => name == 'mother').value),
        similar: Number(Array.from(parents).find(({ name }) => name == 'similar').value) * 0.01,
        gender: document.querySelector('input[name="gender"]:checked').value
    }));
});

document.getElementById('cancel').addEventListener('click', () => {
    mp.trigger('client:saveCustomization', JSON.stringify({
        father: Number(Array.from(parents).find(({ name }) => name == 'father').value),
        mother: Number(Array.from(parents).find(({ name }) => name == 'mother').value),
        similar: Number(Array.from(parents).find(({ name }) => name == 'similar').value) * 0.01,
        gender: document.querySelector('input[name="gender"]:checked').value
    }));
});

function openTab(evt, tabName) {
    var i, tabcontent, tabbuttons;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tabbuttons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabbuttons.length; i++) {
        tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.className += " active";
}

// Inicializar la primera pestaña como visible
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.tab-button').click();
});

document.querySelectorAll('#features details').forEach((detail) => {
    detail.addEventListener('click', function () {
        document.querySelectorAll('#features details').forEach((otherDetail) => {
            if (otherDetail !== detail && otherDetail.open) {
                const accordion = new Accordion(otherDetail);
                accordion.shrink(); // Cerrar el detail abierto con animación
            }
        });
    });
});
class Accordion {
    constructor(el) {
        this.el = el;
        this.summary = el.querySelector('summary');
        this.content = el.querySelector('.details-content');
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.summary.addEventListener('click', (e) => this.onClick(e));
    }

    onClick(e) {
        e.preventDefault();
        this.el.style.overflow = 'hidden';
        if (this.isClosing || !this.el.open) {
            this.open();
        } else if (this.isExpanding || this.el.open) {
            this.shrink();
        }
    }

    shrink() {
        this.isClosing = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 250,
            easing: 'ease-in-out'
        });

        this.animation.onfinish = () => {
            this.el.removeAttribute('open'); // Asegúrate de cerrar el detail
            this.onAnimationFinish(false);
        };
        this.animation.oncancel = () => this.isClosing = false;
    }

    open() {
        this.el.style.height = `${this.el.offsetHeight}px`;
        this.el.open = true;
        window.requestAnimationFrame(() => this.expand());
    }

    expand() {
        this.isExpanding = true;
        const startHeight = `${this.el.offsetHeight}px`;
        const endHeight = `${this.summary.offsetHeight + this.content.scrollHeight}px`;

        if (this.animation) {
            this.animation.cancel();
        }

        this.animation = this.el.animate({
            height: [startHeight, endHeight]
        }, {
            duration: 250,
            easing: 'ease-in-out'
        });

        this.animation.onfinish = () => this.onAnimationFinish(true);
        this.animation.oncancel = () => this.isExpanding = false;
    }

    onAnimationFinish(open) {
        this.el.open = open;
        this.animation = null;
        this.isClosing = false;
        this.isExpanding = false;
        this.el.style.height = this.el.style.overflow = '';
    }
}

document.querySelectorAll('details').forEach((el) => {
    new Accordion(el);
});

document.querySelectorAll('fieldset').forEach((fieldset) => {
    const output = fieldset.querySelector('output');
    const minusButton = fieldset.querySelector('button[id$="Minus"]');
    const plusButton = fieldset.querySelector('button[id$="Plus"]');

    if (minusButton && plusButton && output) {
        minusButton.addEventListener('click', () => {
            output.textContent = Math.max(0, parseInt(output.textContent) - 1);
            if (parseInt(output.textContent) === 0) {
                minusButton.setAttribute('disabled', "");
            }
        });
        plusButton.addEventListener('click', () => {
            output.textContent = parseInt(output.textContent) + 1;
            minusButton.removeAttribute('disabled');
        });
    }
});
