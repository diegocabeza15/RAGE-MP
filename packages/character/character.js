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
        player.outputChatBox("Debes iniciar sesión para personalizar tu personaje.");
        return;
    }

    // Verificar si el jugador tiene una skin de freemode
    if (!freemodeCharacters.includes(player.model)) {
        player.outputChatBox("Solo puedes personalizar personajes freemode.");
        return;
    }

    // Guardar la posición actual del jugador
    lastPosition = player.position;
    lastHeading = player.heading;

    player.position = creatorPlayerPos;
    player.dimension = creatorDimension;
    player.heading = creatorPlayerHeading;


    console.log(`Intentando personalizar a : \n ${JSON.stringify({ clothes: player.getClothes(), decorations: player.getDecoration(), face: player.getFaceFeature() }, null, 2)}`);

    console.log('=== INICIO CHARACTER CLIENT ===');
    // Llamar al evento del cliente
    player.call('client:startCharacterCreator');
});

mp.events.add('server:saveCharacter', async (player) => {

    // Si existe una posición anterior guardada, teletransportar al jugador allí
    if (lastPosition) {
        player.position = lastPosition;
        player.dimension = 0; // Volver a la dimensión normal
    }

    // Desactivar la cámara del creador
    mp.game.cam.renderScriptCams(false, false, 0, false, false);
});