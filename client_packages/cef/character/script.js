
function hideCharacterPanel() {
    document.getElementById('character-creator').style.display = 'none';
}

document.getElementById('save').addEventListener('click', () => {
    mp.trigger('client:saveCustomization', JSON.stringify({}));
});

document.getElementById('cancel').addEventListener('click', () => {
    mp.trigger('client:saveCustomization', JSON.stringify({}));
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
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Inicializar la primera pestaña como visible
document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('.tab-button').click();
});
