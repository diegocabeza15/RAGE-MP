var creatorBrowser;
let creatorCam;

mp.events.add('client:startCharacterCreator', () => {
    // Agregar log para verificar que el evento se dispara
    mp.console.logInfo("Iniciando creador de personaje");

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

    // Configuración de la UI
    mp.players.local.freezePosition(true);
    mp.players.local.setCollision(false, false);

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

mp.events.add('saveCharacter', (characterDataJson) => {
    // Destruir la cámara
    if (creatorCam) {
        creatorCam.destroy();
        creatorCam = null;
    }

    if (creatorBrowser) {
        creatorBrowser.destroy();
        creatorBrowser = null;
    }
    mp.players.local.freezePosition(false);
    mp.game.ui.setMinimapVisible(false);
    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);
    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(true);
    mp.events.callRemote("server:saveCharacter")
});