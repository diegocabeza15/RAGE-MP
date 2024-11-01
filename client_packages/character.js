var creatorBrowser;
mp.events.add('client:openCreatorUI', () => {
    creatorBrowser = mp.browsers.new('package://cef/character/index.html');
    mp.game.ui.setMinimapVisible(true);
    mp.gui.chat.activate(false);
    mp.gui.chat.show(false);
    setTimeout(() => { mp.gui.cursor.show(true, true); }, 500);
    mp.game.ui.displayRadar(false);
})

mp.events.add('saveCharacter', (characterDataJson) => {
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