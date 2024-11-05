function hideCharacterPanel() {
    document.getElementById('character-creator').style.display = 'none';
}

document.getElementById('save').addEventListener('click', () => {
    mp.trigger('client:saveCustomization', JSON.stringify({
        gender: document.getElementById('gender').value
    }));
});

document.getElementById('cancel').addEventListener('click', () => {
    mp.trigger('client:saveCustomization', {});
    hideCharacterPanel();
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
