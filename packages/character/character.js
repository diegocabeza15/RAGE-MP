const saveDirectory = "CustomCharacters";
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
    // Llamar al evento del cliente
    player.call("client:showCustomizationPanel")
});


mp.events.add("server:saveCustomization", (player, data) => {
    // Lógica para aplicar los cambios en el personaje del jugador
    console.log('=== GUARDANDO CHARACTER SERVER ===');
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
    // Aquí también podrías guardar los cambios en la base de datos si es necesario
    player.call("client:hideCustomizationPanel");
});