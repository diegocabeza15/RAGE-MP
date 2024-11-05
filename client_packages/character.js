let customizationBrowser, customizationCamera = null;

mp.events.add("client:showCustomizationPanel", () => {
    if (!customizationBrowser) {
        customizationBrowser = mp.browsers.new("package://cef/character/index.html");
    }
    // Posición de la cámara (ajusta las coordenadas según el juego)
    const playerPosition = mp.players.local.position;
    const cameraPosition = new mp.Vector3(playerPosition.x, playerPosition.y + 1.5, playerPosition.z + 0.5);

    // Crear y configurar la cámara
    customizationCamera = mp.cameras.new('customizationCamera', cameraPosition, new mp.Vector3(0, 0, 0), 40);
    customizationCamera.pointAtCoord(playerPosition.x, playerPosition.y, playerPosition.z + 0.5);
    customizationCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false); // Activa la cámara

    mp.gui.cursor.show(true, true);
});

mp.events.add("client:hideCustomizationPanel", () => {
    if (customizationBrowser) {
        customizationBrowser.destroy();
        customizationBrowser = null;
    }
    if (customizationCamera) {
        customizationCamera.setActive(false);
        customizationCamera.destroy();
        customizationCamera = null;
        mp.game.cam.renderScriptCams(false, false, 0, true, false); // Regresa a la cámara predeterminada
    }
    mp.gui.cursor.show(false, false); // Oculta el cursor del mouse
});

// Recibe datos de personalización del navegador
mp.events.add("client:saveCustomization", (data) => {
    mp.events.callRemote("server:saveCustomization", JSON.stringify(data));
});
