let customizationBrowser, customizationCamera = null;

mp.events.add("client:showCustomizationPanel", () => {
    mp.gui.cursor.show(true, true);
    // Posición y ángulo de la cámara para ver al personaje completo
    const playerPosition = mp.players.local.position;
    const cameraDistance = 3.0; // Distancia de la cámara hacia atrás para ver al personaje completo
    const cameraHeight = 1.0;   // Altura de la cámara para un ángulo de vista más alto

    const cameraPosition = new mp.Vector3(
        playerPosition.x,
        playerPosition.y - cameraDistance, // Colocamos la cámara detrás del jugador
        playerPosition.z + cameraHeight    // Ajustamos la altura para una vista completa
    );

    mp.gui.cursor.show(true, true);
    mp.players.local.freezePosition(true); // Congelar al personaje

    // Crear y configurar la cámara
    customizationCamera = mp.cameras.new('customizationCamera', cameraPosition, new mp.Vector3(0, 0, 0), 40);
    customizationCamera.pointAtCoord(playerPosition.x, playerPosition.y, playerPosition.z + 0.5); // Apunta al centro del personaje
    customizationCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 0, true, false); // Activa la cámara
    setTimeout(() => {
        if (!customizationBrowser) {
            customizationBrowser = mp.browsers.new("package://cef/character/index.html");
        }
    }, 1000)
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
    mp.console.logInfo('=== GUARDANDO CHARACTER ===');
    mp.console.logInfo(data)
    mp.events.callRemote("server:saveCustomization", data);
});

mp.events.add('custom:parents', (data) => {
    mp.console.logInfo('=== GUARDANDO PARENTS ===');
    const { mother = 0, father = 0, similar = 1.0 } = JSON.parse(data)
    mp.players.local.setHeadBlendData(mother, father, 0, mother, father, 0, similar, similar, 0.0, false);
})

mp.events.add('custom:gender', (player, gender) => {
    // Definir los modelos masculino y femenino
    const models = [mp.game.joaat('mp_m_freemode_01'), mp.game.joaat('mp_f_freemode_01')];  // Modelo masculino
    // Aplicar el cambio de modelo (esto hará que el jugador se vea con el género seleccionado)
    player.model = models[gender]
    player.setModel(player.model);
    player.spawn(player.position); // Asegúrate de hacer respawnear al jugador para aplicar el cambio correctamente
});