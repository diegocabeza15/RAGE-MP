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
    mp.players.local.freezePosition(false); // Descongelar al personaje
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

mp.events.add('custom:gender', (gender = 0) => {
    const maleModel = mp.game.joaat('mp_m_freemode_01');
    const femaleModel = mp.game.joaat('mp_f_freemode_01');
    if (gender === 0) { // Masculino
        mp.players.local.model = maleModel;
        setMaleAppearance();
    } else { // Femenino
        mp.players.local.model = femaleModel;
        setFemaleAppearance();
    }
});

// Configura la apariencia masculina predeterminada
function setMaleAppearance() {
    mp.players.local.setComponentVariation(2, 51, 0, 2); // Peinado masculino de ejemplo
    mp.players.local.setComponentVariation(11, 0, 0, 2); // Camisa masculina de ejemplo
    mp.players.local.setComponentVariation(8, 0, 0, 2); // Pantalones masculinos de ejemplo
    mp.players.local.setComponentVariation(6, 0, 0, 2); // Zapatos masculinos de ejemplo
}

// Configura la apariencia femenina predeterminada
function setFemaleAppearance() {
    mp.players.local.setComponentVariation(2, 1, 0, 2); // Peinado femenino de ejemplo
    mp.players.local.setComponentVariation(11, 1, 0, 2); // Camisa femenina de ejemplo
    mp.players.local.setComponentVariation(8, 1, 0, 2); // Pantalones femeninos de ejemplo
    mp.players.local.setComponentVariation(6, 1, 0, 2); // Zapatos femeninos de ejemplo
    mp.players.local.setComponentVariation(4, 1, 0, 2); // Accesorios femeninos de ejemplo
    mp.players.local.setComponentVariation(3, 1, 0, 2); // Atributos faciales femeninos de ejemplo
}

mp.events.add('custom:style', (style) => {
    const { eyeColor = 0, hairStyle = 0, hairColor = 0, highlightHairColor = 0 } = JSON.parse(style)
    mp.players.local.setEyeColor(eyeColor);
    mp.players.local.setHairColor(hairColor, highlightHairColor);
    mp.players.local.setComponentVariation(2, hairStyle, 0, 2);
});