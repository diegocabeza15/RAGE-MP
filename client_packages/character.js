var creatorBrowser;
let creatorCam;

mp.events.add('client:startCharacterCreator', () => {
    // Agregar log para verificar que el evento se dispara
    mp.gui.chat.push("Ingresando al Creador de Personajes.");

    // Configuración de la cámara
    mp.game.cam.renderScriptCams(false, false, 0, false, false);
    creatorCam = mp.cameras.new('creatorCam',
        new mp.Vector3(mp.players.local.position.x,
            mp.players.local.position.y,
            mp.players.local.position.z + 3.0),
        new mp.Vector3(0, 0, 0),
        40
    );
    creatorCam.setActive(true);
    creatorCam.pointAtCoord(
        mp.players.local.position.x,
        mp.players.local.position.y,
        mp.players.local.position.z
    );
    mp.game.cam.renderScriptCams(true, false, 0, true, false);

    // Agregar log para verificar que el evento se dispara
    mp.gui.chat.push("Preciona la tecla E para empazar .");


});

mp.events.add('saveCharacter', () => {
    // Destruir la cámara
    if (creatorCam) {
        creatorCam.destroy();
        creatorCam = null;
    }

    if (creatorBrowser) {
        creatorBrowser.destroy();
        creatorBrowser = null;
    }

    mp.game.ui.setMinimapVisible(false);
    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
    mp.events.callRemote("server:saveCharacter")
});


// Function to freeze the player's position
function freezePlayerPosition(toggle) {
    let player = mp.players.local; // Reference to the local player
    player.freezePosition(toggle); // Freeze or unfreeze the player's position
    mp.gui.chat.push("Your position " + (toggle ? "frozen" : "unfrozen") + ".");
}

// Function to freeze the player's position by ID
function freezePlayerPositionById(playerId, toggle) {
    let player = mp.players.at(playerId); // Get the player by ID
    if (player) { // Check if the player exists
        player.freezePosition(toggle); // Freeze or unfreeze the player's position
        mp.gui.chat.push("Player ID " + playerId + " position " + (toggle ? "frozen" : "unfrozen") + ".");
    } else {
        mp.gui.chat.push("Player with ID " + playerId + " not found.");
    }
}

// Bind the function to the "E" key (freeze/unfreeze self)
mp.keys.bind(69, false, function () { // 69 is the key code for "E"
    let player = mp.players.local; // Reference to the local player
    let isFrozen = player.isPositionFrozen; // Check if the player's position is currently frozen
    freezePlayerPosition(!isFrozen); // Toggle freeze state
    // Asegurarnos que el navegador se crea correctamente
    try {
        creatorBrowser = mp.browsers.new('package://cef/character/index.html');
        mp.console.logInfo("Navegador creado exitosamente");
    } catch (error) {
        mp.console.logError("Error al crear el navegador: " + error);
    }

    mp.game.ui.setMinimapVisible(true);
    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);
    setTimeout(() => { mp.gui.cursor.show(true, true); }, 500);
    mp.game.ui.displayRadar(false);
});

// Bind the function to the "X" key (freeze/unfreeze player by ID)
mp.keys.bind(88, false, function () { // 88 is the key code for "X"
    let playerId = 0; // Set the player ID to 0 (you can change this to any ID)
    let player = mp.players.at(playerId); // Get the player by ID
    if (player) { // Check if the player exists
        let isFrozen = player.isPositionFrozen; // Check if the player's position is currently frozen
        freezePlayerPositionById(playerId, !isFrozen); // Toggle freeze state
    } else {
        mp.gui.chat.push("Player with ID " + playerId + " not found.");
    }
});