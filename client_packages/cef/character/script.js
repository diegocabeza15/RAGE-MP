function showCharacterPanel(charData) {
    try {
        console.log('Recibiendo datos:', charData);
        document.getElementById('character-creator').style.display = 'block';
    } catch (error) {
        console.error('Error en showCharacterPanel:', error);
    }
}

function hideCharacterPanel() {
    document.getElementById('character-creator').style.display = 'none';
}

document.getElementById('save').addEventListener('click', () => {
    mp.trigger('saveCharacter', JSON.stringify({}));
});

document.getElementById('cancel').addEventListener('click', () => {
    mp.trigger('saveCharacter', JSON.stringify({}));
    hideCharacterPanel();
});
