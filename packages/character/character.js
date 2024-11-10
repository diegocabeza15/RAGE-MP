const fs = require('fs');
const path = require('path'); // Para manejar rutas de archivos y carpetas
const folder = path.join(__dirname, 'data');

mp.events.add("server:saveCustomization", (player, data) => {
    // Lógica para aplicar los cambios en el personaje del jugador
    console.log('=== GUARDANDO CHARACTER SERVER ===');
    const custom = JSON.parse(data);

    // Ruta del archivo donde se guardarán los datos del jugador
    const playerFile = path.join(folder, `player_${player.id}_customization.json`);

    // Verificamos si la carpeta existe; si no, la creamos
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    fs.writeFile(playerFile, JSON.stringify({ ...custom }, null, 2), (err) => {
        if (err) {
            console.error("Error al guardar la personalización:", err);
        } else {
            console.log("Datos de personalización guardados correctamente.");
        }
    });
});

mp.events.addCommand('init', (player, sexo) => {
    console.log('=== INICIO CHARACTER ===');

    if (!player.getVariable('loggedIn')) {
        console.log("Debes iniciar sesión para personalizar tu personaje.");
        return;
    }

    // Verificar si el jugador tiene una skin de freemode
    if (!freemodeCharacters.includes(player.model)) {
        console.log("Solo puedes personalizar personajes freemode.");
        return;
    }

    if (sexo === 'm') {
        player.model = mp.joaat('mp_m_freemode_01');
        player.setClothes(11, 267, 1, 2); // top 
        player.setClothes(3, 6, 0, 2); // torso 
        player.setClothes(4, 31, 0, 2); // legs 
        player.setClothes(6, 27, 0, 2); // shoes 
        const customData = {
            model: player.model,
            top: { component: 11, drawable: 267, texture: 1, palette: 2 },
            torso: { component: 3, drawable: 6, texture: 0, palette: 2 },
            legs: { component: 4, drawable: 31, texture: 0, palette: 2 },
            shoes: { component: 6, drawable: 27, texture: 0, palette: 2 }
        };
        mp.events.call('server:saveCustomization', JSON.stringify(customData))
    } else if (sexo === 'f') {
        player.model = mp.joaat('mp_f_freemode_01');
        player.setClothes(11, 27, 0, 2); // top 
        player.setClothes(3, 0, 0, 2); // torso 
        player.setClothes(8, 15, 0, 2); // undershit 
        player.setClothes(4, 0, 0, 2); // legs 
        player.setClothes(6, 3, 0, 2); // shoes 
        player.setClothes(2, 15, 1, 0); // hair 
        player.setHairColor(1); // Rubio
        const customData = {
            model: player.model,
            top: { component: 11, drawable: 27, texture: 0, palette: 2 },
            torso: { component: 3, drawable: 0, texture: 0, palette: 2 },
            undershit: { component: 8, drawable: 15, texture: 0, palette: 2 },
            legs: { component: 4, drawable: 0, texture: 0, palette: 2 },
            shoes: { component: 6, drawable: 3, texture: 0, palette: 2 },
            hair: { component: 2, drawable: 15, texture: 1, palette: 0, color: 1 },
        };
        mp.events.call('server:saveCustomization', JSON.stringify(customData))
    } else {
        console.log("El sexo especificado no es válido. Debe ser 'm' o 'f'.");
        return;
    }
})