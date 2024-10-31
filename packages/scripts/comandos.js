mp.events.addCommand('hp', (player) => {
    player.health = 100;
});

mp.events.addCommand('armor', (player) => {
    player.armour = 100;
});

mp.events.addCommand('kill', (player) => {
    player.health = 0;
});

mp.events.addCommand('wp', (player, weaponName) => {
    if (!weaponName) {
        player.outputChatBox("Uso: /wp [nombre_del_arma]");
        return;
    }

    const weaponHash = mp.joaat(weaponName.toUpperCase());
    player.giveWeapon(weaponHash, 5000); // Cambia 100 por la cantidad deseada
    player.outputChatBox(`Has recibido un arma: ${weaponName.toUpperCase()}`);
});

mp.events.addCommand('skin', (player, skinName) => {
    if (!skinName) {
        player.outputChatBox("Uso: /skin [nombre_de_la_skin]");
        return;
    }

    const skinHash = mp.joaat(skinName.toLowerCase());
    player.model = skinHash;
    player.outputChatBox(`Has cambiado tu skin a: ${skinName}`);
});

// ... existing commands ...

mp.events.addCommand('veh', (player, vehicleName) => {
    if (!vehicleName) {
        player.outputChatBox("Uso: /veh [nombre_del_vehiculo]");
        return;
    }

    // Obtener la posición del jugador
    const pos = player.position;
    const heading = player.heading;
    
    // Crear el vehículo
    try {
        const vehicle = mp.vehicles.new(mp.joaat(vehicleName.toUpperCase()), 
            new mp.Vector3(pos.x + 2, pos.y, pos.z), 
            {
                heading: heading,
                numberPlate: "RAGE",
                dimension: player.dimension
            }
        );
        player.outputChatBox(`Has generado un ${vehicleName.toUpperCase()}`);
    } catch (error) {
        player.outputChatBox("Error: Vehículo no válido");
    }
});


