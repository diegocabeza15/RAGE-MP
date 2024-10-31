// shitcode will be better in the future
const Data = require("./data");

const localPlayer = mp.players.local;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colorForOverlayIdx(index) {
    let color;

    switch (index) {
        case 1:
            color = beardColorItem.Index;
            break;

        case 2:
            color = eyebrowColorItem.Index;
            break;

        case 5:
            color = blushColorItem.Index;
            break;

        case 8:
            color = lipstickColorItem.Index;
            break;

        case 10:
            color = chestHairColorItem.Index;
            break;

        default:
            color = 0;
    }

    return color;
}

function updateParents() {
    localPlayer.setHeadBlendData(
        // shape
        Data.mothers[motherItem.Index],
        Data.fathers[fatherItem.Index],
        0,

        // skin
        Data.mothers[motherItem.Index],
        Data.fathers[fatherItem.Index],
        0,

        // mixes
        similarityItem.Index * 0.01,
        skinSimilarityItem.Index * 0.01,
        0.0,

        false
    );
}

function updateFaceFeature(index) {
    localPlayer.setFaceFeature(
        index,
        parseFloat(featureItems[index].SelectedValue)
    );
}

function updateAppearance(index) {
    let overlayID =
        appearanceItems[index].Index == 0 ? 255 : appearanceItems[index].Index - 1;
    localPlayer.setHeadOverlay(
        index,
        overlayID,
        appearanceOpacityItems[index].Index * 0.01,
        colorForOverlayIdx(index),
        0
    );
}

function updateHairAndColors() {
    localPlayer.setComponentVariation(
        2,
        Data.hairList[currentGender][hairItem.Index].ID,
        0,
        2
    );
    localPlayer.setHairColor(hairColorItem.Index, hairHighlightItem.Index);
    localPlayer.setEyeColor(eyeColorItem.Index);
    localPlayer.setHeadOverlayColor(1, 1, beardColorItem.Index, 0);
    localPlayer.setHeadOverlayColor(2, 1, eyebrowColorItem.Index, 0);
    localPlayer.setHeadOverlayColor(5, 2, blushColorItem.Index, 0);
    localPlayer.setHeadOverlayColor(8, 2, lipstickColorItem.Index, 0);
    localPlayer.setHeadOverlayColor(10, 1, chestHairColorItem.Index, 0);
}

function applyCreatorOutfit() {
    if (currentGender == 0) {
        localPlayer.setDefaultComponentVariation();
        localPlayer.setComponentVariation(3, 15, 0, 2);
        localPlayer.setComponentVariation(4, 21, 0, 2);
        localPlayer.setComponentVariation(6, 34, 0, 2);
        localPlayer.setComponentVariation(8, 15, 0, 2);
        localPlayer.setComponentVariation(11, 15, 0, 2);
    } else {
        localPlayer.setDefaultComponentVariation();
        localPlayer.setComponentVariation(3, 15, 0, 2);
        localPlayer.setComponentVariation(4, 10, 0, 2);
        localPlayer.setComponentVariation(6, 35, 0, 2);
        localPlayer.setComponentVariation(8, 15, 0, 2);
        localPlayer.setComponentVariation(11, 15, 0, 2);
    }
}

function fillHairMenu() {
    /*
      hairItem = new UIMenuListItem("Hair", "Your character's hair.", new ItemsCollection(Data.hairList[currentGender].map(h => h.Name)));
      creatorHairMenu.AddItem(hairItem);
  
      hairColorItem = new UIMenuListItem("Hair Color", "Your character's hair color.", new ItemsCollection(hairColors));
      creatorHairMenu.AddItem(hairColorItem);
  
      hairHighlightItem = new UIMenuListItem("Hair Highlight Color", "Your character's hair highlight color.", new ItemsCollection(hairColors));
      creatorHairMenu.AddItem(hairHighlightItem);
  
      eyebrowColorItem = new UIMenuListItem("Eyebrow Color", "Your character's eyebrow color.", new ItemsCollection(hairColors));
      creatorHairMenu.AddItem(eyebrowColorItem);
  
      beardColorItem = new UIMenuListItem("Facial Hair Color", "Your character's facial hair color.", new ItemsCollection(hairColors));
      creatorHairMenu.AddItem(beardColorItem);
  
      eyeColorItem = new UIMenuListItem("Eye Color", "Your character's eye color.", new ItemsCollection(Data.eyeColors));
      creatorHairMenu.AddItem(eyeColorItem);
  
      blushColorItem = new UIMenuListItem("Blush Color", "Your character's blush color.", new ItemsCollection(blushColors));
      creatorHairMenu.AddItem(blushColorItem);
  
      lipstickColorItem = new UIMenuListItem("Lipstick Color", "Your character's lipstick color.", new ItemsCollection(lipstickColors));
      creatorHairMenu.AddItem(lipstickColorItem);
  
      chestHairColorItem = new UIMenuListItem("Chest Hair Color", "Your character's chest hair color.", new ItemsCollection(hairColors));
      creatorHairMenu.AddItem(chestHairColorItem);
  
      creatorHairMenu.AddItem(new UIMenuItem("Randomize", "~r~Randomizes your hair & colors."));
      creatorHairMenu.AddItem(new UIMenuItem("Reset", "~r~Resets your hair & colors."));
      */
}

function resetParentsMenu(refresh = false) {
    fatherItem.Index = 0;
    motherItem.Index = 0;
    similarityItem.Index = currentGender == 0 ? 100 : 0;
    skinSimilarityItem.Index = currentGender == 0 ? 100 : 0;

    updateParents();
    if (refresh) creatorParentsMenu.RefreshIndex();
}

function resetFeaturesMenu(refresh = false) {
    for (let i = 0; i < Data.featureNames.length; i++) {
        featureItems[i].Index = 100;
        updateFaceFeature(i);
    }

    if (refresh) creatorFeaturesMenu.RefreshIndex();
}

function resetAppearanceMenu(refresh = false) {
    for (let i = 0; i < Data.appearanceNames.length; i++) {
        appearanceItems[i].Index = 0;
        appearanceOpacityItems[i].Index = 100;
        updateAppearance(i);
    }

    if (refresh) creatorAppearanceMenu.RefreshIndex();
}

function resetHairAndColorsMenu(refresh = false) {
    hairItem.Index = 0;
    hairColorItem.Index = 0;
    hairHighlightItem.Index = 0;
    eyebrowColorItem.Index = 0;
    beardColorItem.Index = 0;
    eyeColorItem.Index = 0;
    blushColorItem.Index = 0;
    lipstickColorItem.Index = 0;
    chestHairColorItem.Index = 0;
    updateHairAndColors();

    if (refresh) creatorHairMenu.RefreshIndex();
}

let currentGender = 0;
let creatorMenus = [];
let creatorCamera;

// color arrays
let hairColors = [];
for (let i = 0; i < Data.maxHairColor; i++) hairColors.push(i.toString());

let blushColors = [];
for (let i = 0; i < Data.maxBlushColor; i++) blushColors.push(i.toString());

let lipstickColors = [];
for (let i = 0; i < Data.maxLipstickColor; i++)
    lipstickColors.push(i.toString());

// EVENTS
mp.events.add("toggleCreator", (active, charData) => {
    try {
        console.log('Probando el evento', active, charData)
        if (active) {
            // Asegurarse de que charData sea una cadena JSON válida
            let parsedData = null;
            if (charData) {
                try {
                    parsedData = typeof charData === 'string' ? JSON.parse(charData) : charData;
                } catch (e) {
                    console.error('Error al parsear charData:', e);
                }
            }

            // Crear la cámara
            if (!creatorCamera) {
                creatorCamera = mp.cameras.new(
                    "creatorCamera",
                    creatorCoords.camera,
                    new mp.Vector3(0, 0, 0),
                    45
                );
                creatorCamera.pointAtCoord(creatorCoords.cameraLookAt);
                creatorCamera.setActive(true);
            }

            // Configurar UI primero
            setupCreatorUI(true);
            showCreatorPanel()

        } else {
            resetCreatorState();
        }
    } catch (error) {
        console.error("Error en toggleCreator:", error);
    }
});

// Funciones auxiliares
function applyCharacterData(data) {
    // Género
    currentGender = data.Gender;
    genderItem.Index = data.Gender;

    // Actualizar menús
    creatorHairMenu?.Clear();
    fillHairMenu();
    applyCreatorOutfit();

    // Aplicar características
    applyParentData(data.Parents);
    applyFeatures(data.Features);
    applyHairAndColors(data.Hair, data);
    applyAppearance(data.Appearance);
}

function setupCreatorUI(show) {
    try {
        console.log('En setupCreatorUI:', show);
        // Configuración básica del juego
        mp.game.ui.setMinimapVisible(show);
        mp.gui.chat.activate(!show);
        mp.gui.chat.show(!show);
        mp.players.local.clearTasksImmediately();
        mp.players.local.freezePosition(show);

        // Configuración de cámara y cursor
        mp.game.cam.renderScriptCams(show, false, 0, true, false);
        mp.gui.cursor.show(show, show);

    } catch (error) {
        console.error('Error en setupCreatorUI:', error);
        // Restaurar estado por defecto
        mp.gui.chat.show(true);
        mp.game.ui.displayRadar(true);
        mp.game.ui.displayHud(true);
        mp.gui.cursor.show(false, false);
    }
}

function showCreatorPanel() {
    // Verificar el formato de los datos antes de pasarlos
    if (typeof data === 'object') {
        // Mostrar el panel con los datos correctos
        const browser = mp.browsers.new("package://cef/character/index.html");
        if (browser) {
            // Esperar a que el navegador esté listo
            setTimeout(() => {
                if (parsedData) {
                    browser.execute(`showCharacterPanel('${JSON.stringify(parsedData)}')`);
                } else {
                    browser.execute('showCharacterPanel(null)');
                }
            }, 100);
        }
    } else {
        console.error("Los datos no son un objeto válido:", data);
    }
}

function resetCreatorState() {
    // Ocultar menús
    creatorMenus.forEach((menu) => (menu.Visible = false));

    // Restaurar UI
    setupCreatorUI(false);

    // Restaurar personaje
    localPlayer.setDefaultComponentVariation();
    if (Data.hairList?.[currentGender]?.[hairItem?.Index]) {
        localPlayer.setComponentVariation(
            2,
            Data.hairList[currentGender][hairItem.Index].ID,
            0,
            2
        );
    }

    // Ocultar panel HTML
    const browser = mp.browsers.new(
        "package://cef/character/index.html"
    );
    if (browser) {
        browser.execute("hideCharacterPanel()");
    }
}
