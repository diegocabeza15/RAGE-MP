const fs = require('fs');
const path = require('path'); // Para manejar rutas de archivos y carpetas
const folder = path.join(__dirname, 'data');
const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027);
const creatorPlayerHeading = -185.0;

// this will increase by 1 every time a player is sent to the character creator
let creatorDimension = 1;
var lastPosition, lastHeading, lastCameraPosition;
// Start of Selection
mp.events.addCommand('personalizar', (player) => {
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

    // Guardar la posición actual del jugador
    lastPosition = player.position;
    lastHeading = player.heading;

    player.position = creatorPlayerPos;
    player.dimension = creatorDimension;
    player.heading = creatorPlayerHeading;

    console.log('=== INICIO CHARACTER CLIENT ===');
    /*
        const playerFile = path.join(folder, `player_${player.id}_customization.json`);
        if (fs.existsSync(playerFile)) {
            const data = fs.readFileSync(playerFile, 'utf8');
            const { customization } = JSON.parse(data);
            player.call("client:showCustomizationPanel", customization)
    
        }
    */
    // Llamar al evento del cliente
    player.call("client:showCustomizationPanel", null)
});


mp.events.add("server:saveCustomization", (player, data) => {
    // Lógica para aplicar los cambios en el personaje del jugador
    console.log('=== GUARDANDO CHARACTER SERVER ===');
    console.log(data)
    const custom = JSON.parse(data);
    for (const prop in custom) {
        if (Object.prototype.hasOwnProperty.call(custom, prop)) {
            const value = custom[prop];
            console.log(`-- Propiedad: ${prop} - ${value}.\n`)
        }
    }
    // Reaparición del personaje
    player.position = lastPosition
    player.dimension = 0
    player.heading = lastHeading
    const playerData = {
        id: player.id,
        customization: custom
    };

    // Ruta del archivo donde se guardarán los datos del jugador
    const playerFile = path.join(folder, `player_${player.id}_customization.json`);

    // Verificamos si la carpeta existe; si no, la creamos
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    fs.writeFile(playerFile, JSON.stringify(playerData, null, 2), (err) => {
        if (err) {
            console.error("Error al guardar la personalización:", err);
        } else {
            console.log("Datos de personalización guardados correctamente.");
        }
    });
    // Aquí también podrías guardar los cambios en la base de datos si es necesario
    player.call("client:hideCustomizationPanel");
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
    } else if (sexo === 'f') {
        player.model = mp.joaat('mp_f_freemode_01');
        player.setClothes(11, 27, 0, 2); // top 
        player.setClothes(3, 0, 0, 2); // torso 
        player.setClothes(8, 15, 0, 2); // undershit 
        player.setClothes(4, 0, 0, 2); // legs 
        player.setClothes(6, 3, 0, 2); // shoes 
        player.setClothes(2, 15, 1, 2); // hair 
    } else {
        console.log("El sexo especificado no es válido. Debe ser 'm' o 'f'.");
        return;
    }
})