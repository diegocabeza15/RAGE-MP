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
    localPlayer.setFaceFeature(index, parseFloat(featureItems[index].SelectedValue));
}

function updateAppearance(index) {
    let overlayID = (appearanceItems[index].Index == 0) ? 255 : appearanceItems[index].Index - 1;
    localPlayer.setHeadOverlay(index, overlayID, appearanceOpacityItems[index].Index * 0.01, colorForOverlayIdx(index), 0);
}

function updateHairAndColors() {
    localPlayer.setComponentVariation(2, Data.hairList[currentGender][hairItem.Index].ID, 0, 2);
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
    similarityItem.Index = (currentGender == 0) ? 100 : 0;
    skinSimilarityItem.Index = (currentGender == 0) ? 100 : 0;

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
for (let i = 0; i < Data.maxLipstickColor; i++) lipstickColors.push(i.toString());

// EVENTS
mp.events.add("toggleCreator", (active, charData) => {
    if (active) {
        if (creatorCamera === undefined) {
            creatorCamera = mp.cameras.new("creatorCamera", creatorCoords.camera, new mp.Vector3(0, 0, 0), 45);
            creatorCamera.pointAtCoord(creatorCoords.cameraLookAt);
            creatorCamera.setActive(true);
        }

        // update menus with current character data
        if (charData) {
            charData = JSON.parse(charData);

            // gender
            currentGender = charData.Gender;
            genderItem.Index = charData.Gender;

            creatorHairMenu.Clear();
            fillHairMenu();
            applyCreatorOutfit();

            // parents
            fatherItem.Index = Data.fathers.indexOf(charData.Parents.Father);
            motherItem.Index = Data.mothers.indexOf(charData.Parents.Mother);
            similarityItem.Index = parseInt(charData.Parents.Similarity * 100);
            skinSimilarityItem.Index = parseInt(charData.Parents.SkinSimilarity * 100);
            updateParents();

            // features
            for (let i = 0; i < charData.Features.length; i++) {
                featureItems[i].Index = (charData.Features[i] * 100) + 100;
                updateFaceFeature(i);
            }

            // hair and colors
            let hair = Data.hairList[currentGender].find(h => h.ID == charData.Hair.Hair);
            hairItem.Index = Data.hairList[currentGender].indexOf(hair);

            hairColorItem.Index = charData.Hair.Color;
            hairHighlightItem.Index = charData.Hair.HighlightColor;
            eyebrowColorItem.Index = charData.EyebrowColor;
            beardColorItem.Index = charData.BeardColor;
            eyeColorItem.Index = charData.EyeColor;
            blushColorItem.Index = charData.BlushColor;
            lipstickColorItem.Index = charData.LipstickColor;
            chestHairColorItem.Index = charData.ChestHairColor;
            updateHairAndColors();

            // appearance
            for (let i = 0; i < charData.Appearance.length; i++) {
                appearanceItems[i].Index = (charData.Appearance[i].Value == 255) ? 0 : charData.Appearance[i].Value + 1;
                appearanceOpacityItems[i].Index = charData.Appearance[i].Opacity * 100;
                updateAppearance(i);
            }
        }

        creatorMainMenu.Visible = true;
        mp.gui.chat.show(false);
        mp.game.ui.displayRadar(false);
        mp.game.ui.displayHud(false);
        localPlayer.clearTasksImmediately();
        localPlayer.freezePosition(true);

        mp.game.cam.renderScriptCams(true, false, 0, true, false);

        // Mostrar el panel HTML
        mp.gui.cursor.show(true, true);
        mp.browsers.new('package://client_package/cef/character/index.html').execute(`showCharacterPanel(${charData})`);
    } else {
        for (let i = 0; i < creatorMenus.length; i++) creatorMenus[i].Visible = false;
        mp.gui.chat.show(true);
        mp.game.ui.displayRadar(true);
        mp.game.ui.displayHud(true);
        localPlayer.freezePosition(false);
        localPlayer.setDefaultComponentVariation();
        localPlayer.setComponentVariation(2, Data.hairList[currentGender][hairItem.Index].ID, 0, 2);

        mp.game.cam.renderScriptCams(false, false, 0, true, false);

        // Ocultar el panel HTML
        mp.gui.cursor.show(false, false);
        mp.browsers.new('package://client_package/cef/character/index.html').execute('hideCharacterPanel()');
    }
});
