function showCharacterPanel(charData) {
    document.getElementById('character-creator').style.display = 'block';
    if (charData) {
        const data = JSON.parse(charData);
        document.getElementById('gender').value = data.Gender;
        // Populate other fields based on charData
    }
}

function hideCharacterPanel() {
    document.getElementById('character-creator').style.display = 'none';
}

document.getElementById('save').addEventListener('click', () => {
    const gender = document.getElementById('gender').value;
    const hair = document.getElementById('hair').value;
    const hairColor = document.getElementById('hairColor').value;
    const eyeColor = document.getElementById('eyeColor').value;

    const characterData = {
        Gender: gender,
        Hair: hair,
        HairColor: hairColor,
        EyeColor: eyeColor
    };

    mp.trigger('saveCharacter', JSON.stringify(characterData));
});

document.getElementById('cancel').addEventListener('click', () => {
    mp.trigger('cancelCharacterCreation');
    hideCharacterPanel();
});

// Populate hair and color options
function populateOptions() {
    const hairSelect = document.getElementById('hair');
    const hairColorSelect = document.getElementById('hairColor');
    const eyeColorSelect = document.getElementById('eyeColor');

    // Example data, replace with actual data
    const hairOptions = ['Short', 'Long', 'Curly'];
    const colorOptions = ['Black', 'Brown', 'Blonde', 'Red'];

    hairOptions.forEach(hair => {
        const option = document.createElement('option');
        option.value = hair;
        option.textContent = hair;
        hairSelect.appendChild(option);
    });

    colorOptions.forEach(color => {
        const option = document.createElement('option');
        option.value = color;
        option.textContent = color;
        hairColorSelect.appendChild(option);
        eyeColorSelect.appendChild(option);
    });
}

populateOptions();
