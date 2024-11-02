var creatorBrowser;
let creatorCam;

mp.events.add('client:startCharacterCreator', () => {
    console.log('=== INICIO CHARACTER PANEL ===');
    mp.console.logInfo('=== INICIO CHARACTER PANEL ===');
    // Mostrar texto al ingresar al creador de personajes
    let startTime = Date.now();
    let duration = 5000; // 5 segundos de duración

    mp.events.add('render', () => {
        if (Date.now() - startTime < duration) {
            mp.game.graphics.drawText("Creador de Personajes\nIngresando al Creador de Personajes", [0.5, 0.2], {
                font: 4,
                color: [0, 255, 0, 255],
                scale: [0.6, 0.6],
                outline: true,
                centre: true
            });
        }
    });

    // Configuración de la cámara
    /*
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
    */

    console.log('=== SET VISUALIZATION ===');
    mp.console.logInfo('=== SET VISUALIZATION ===');
    freezePlayerPosition(true);
    mp.game.ui.setMinimapVisible(true);
    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);
    setTimeout(() => { mp.gui.cursor.show(true, true); }, 500);
    mp.game.ui.displayRadar(false);

    console.log('=== MOSTRAR EL PANEL ===');
    mp.console.logInfo('=== MOSTRAR EL PANEL ===');
    // Asegurarnos que el navegador se crea correctamente
    if (!creatorBrowser) {
        creatorBrowser = mp.browsers.new('package://cef/character/index.html');
        mp.console.logInfo("Navegador creado exitosamente");
    } else {
        mp.console.logError("Error al crear el navegador: " + error);
    }


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

    freezePlayerPosition(false);
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
    mp.console.logInfo("Your position " + (toggle ? "frozen" : "unfrozen") + ".");
}
