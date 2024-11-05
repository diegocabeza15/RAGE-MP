let customizationBrowser = null;

mp.events.add("client:showCustomizationPanel", () => {
    if (!customizationBrowser) {
        customizationBrowser = mp.browsers.new("package://cef/chatacter/index.html");
    }
    mp.gui.cursor.show(true, true);
});

mp.events.add("client:hideCustomizationPanel", () => {
    if (customizationBrowser) {
        customizationBrowser.destroy();
        customizationBrowser = null;
    }
    mp.gui.cursor.show(false, false); // Oculta el cursor del mouse
});

// Recibe datos de personalización del navegador
mp.events.add("client:saveCustomization", (data) => {
    mp.events.callRemote("server:saveCustomization", JSON.stringify(data));
});
