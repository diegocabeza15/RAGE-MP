function showCharacterPanel(charData) {
    try {
        console.log('Recibiendo datos:', charData);
        document.getElementById('character-creator').style.display = 'block';

        if (charData) {
            // Asegurarse de que charData sea un objeto
            const data = typeof charData === 'string' ? JSON.parse(charData) : charData;

            // Establecer valores
            if (data.Gender !== undefined) {
                document.getElementById('gender').value = data.Gender;
            }
            if (data.Hair !== undefined) {
                document.getElementById('hair').value = data.Hair;
            }
            if (data.HairColor !== undefined) {
                document.getElementById('hairColor').value = data.HairColor;
            }
            if (data.EyeColor !== undefined) {
                document.getElementById('eyeColor').value = data.EyeColor;
            }
        }

        // Asegurarse de que las opciones estén pobladas
        populateOptions();
    } catch (error) {
        console.error('Error en showCharacterPanel:', error);
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

    // Guardar valores seleccionados actuales
    const currentHair = hairSelect.value;
    const currentHairColor = hairColorSelect.value;
    const currentEyeColor = eyeColorSelect.value;

    // Limpiar opciones existentes
    hairSelect.innerHTML = '';
    hairColorSelect.innerHTML = '';
    eyeColorSelect.innerHTML = '';

    // Ejemplo de datos (reemplazar con datos reales)
    const hairOptions = ['Short', 'Long', 'Curly'];
    const colorOptions = ['Black', 'Brown', 'Blonde', 'Red'];

    // Repoblar y restaurar selecciones
    hairOptions.forEach(hair => {
        const option = document.createElement('option');
        option.value = hair;
        option.textContent = hair;
        hairSelect.appendChild(option);
    });

    colorOptions.forEach(color => {
        const hairColorOption = document.createElement('option');
        hairColorOption.value = color;
        hairColorOption.textContent = color;
        hairColorSelect.appendChild(hairColorOption);

        const eyeColorOption = document.createElement('option');
        eyeColorOption.value = color;
        eyeColorOption.textContent = color;
        eyeColorSelect.appendChild(eyeColorOption);
    });

    // Restaurar valores seleccionados
    if (currentHair) hairSelect.value = currentHair;
    if (currentHairColor) hairColorSelect.value = currentHairColor;
    if (currentEyeColor) eyeColorSelect.value = currentEyeColor;
}

populateOptions();
