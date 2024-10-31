let spawnPoints = require('./data.json').SpawnPoints;

mp.events.add('playerDeath', (player) => {
    // Verificar si hay puntos de aparición disponibles
    if (spawnPoints.length > 0) {
        player.spawn(spawnPoints[0]);
    } else {
        player.outputChatBox("No hay puntos de aparición disponibles.");
    }
    player.health = 100;
});