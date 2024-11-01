const saveDirectory = "CustomCharacters";
const freemodeCharacters = [mp.joaat("mp_m_freemode_01"), mp.joaat("mp_f_freemode_01")];
const creatorPlayerPos = new mp.Vector3(402.8664, -996.4108, -99.00027);
const creatorPlayerHeading = -185.0;

// this will increase by 1 every time a player is sent to the character creator
let creatorDimension = 1;
var lastPosition, lastHeading, lastCameraPosition;
// Start of Selection
mp.events.addCommand('personalizar', (player) => {
    if (!player.getVariable('loggedIn')) {
        player.outputChatBox("Debes iniciar sesión para personalizar tu personaje."); // Mensaje de advertencia
        return process.exit(0);// Salir si el jugador no está logueado
    }

    // Guardar la posición actual del jugador antes de teletransportarlo
    lastPosition = player.position;
    lastHeading = player.heading;
    // Guardar la posición de la cámara activa
    const currentCam = mp.cameras.new('default');
    if (currentCam && currentCam.isActive()) {
        lastCameraPosition = {
            position: currentCam.getCoord(),
            rotation: currentCam.getRot(2),
            pointCoord: currentCam.getPointingAtCoord()
        };
        currentCam.destroy();
    }
    player.freezePosition(true); // Congela al jugador
    player.position = creatorPlayerPos; // Teletransporta al jugador a las coordenadas del creador
    player.dimension = creatorDimension; // Asigna una dimensión diferente al jugador
    player.heading = creatorPlayerHeading;
    // Desactivar cualquier cámara activa en el juego
    mp.game.cam.renderScriptCams(false, false, 0, false, false); // Desactivar cámaras existentes
    // Crear una nueva cámara
    const creatorCam = mp.cameras.new('creatorCam', new mp.Vector3(player.position.x, player.position.y, player.position.z + 3.0), new mp.Vector3(0, 0, 0), 40); // Alejar la cámara
    creatorCam.setActive(true); // Activar la cámara
    creatorCam.pointAtCoord(player.position.x, player.position.y, player.position.z); // Hacer que la cámara mire al jugador
    mp.game.cam.renderScriptCams(true, false, 0, true, false); // Renderizar la cámara
    player.call('client:openCreatorUI', mp.character)
})

mp.events.add('server:saveCharacter', async (player) => {
    // Descongelar al jugador
    player.freezePosition(false);

    // Si existe una posición anterior guardada, teletransportar al jugador allí
    if (lastPosition) {
        player.position = lastPosition;
        player.dimension = 0; // Volver a la dimensión normal
    }

    // Desactivar la cámara del creador
    mp.game.cam.renderScriptCams(false, false, 0, false, false);

    // Si teníamos una posición de cámara guardada, la restauramos
    if (lastCameraPosition) {
        const returnCam = mp.cameras.new('default', lastCameraPosition.position, lastCameraPosition.rotation, 40);
        returnCam.setActive(true);
        returnCam.pointAtCoord(lastCameraPosition.pointCoord.x, lastCameraPosition.pointCoord.y, lastCameraPosition.pointCoord.z);
        mp.game.cam.renderScriptCams(true, false, 0, true, false);
    }
});