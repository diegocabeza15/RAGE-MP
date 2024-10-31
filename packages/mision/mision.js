/*
    krane#2890 for FiveM or RageMP development
*/

// Configuración del electricista y otros elementos del juego
let CONFIG = require('./data.json');

// Datos de la misión
let mission_data = {};
let garage_blip = null; // Blip del garaje
let garage_marker = null; // Marcador del garaje
let is_working = false; // Indica si el electricista está trabajando
let car_delete_interval = null; // Intervalo para eliminar el vehículo
let outside_car_timer = 500; // Temporizador para salir del vehículo
let is_hired = false; // Indica si el jugador está contratado
let left_vehicle = false; // Indica si el jugador ha salido del vehículo
let work_van = null; // Vehículo de trabajo del electricista

// Función para crear un blip
function createBlip(name, position, color, shortRange = true) {
    return mp.blips.new(643, position, { name: name, color: color, shortRange: shortRange, dimension: 0 });
}

// Función para crear un marcador
function createMarker(type, position, scale, color) {
    return mp.markers.new(type, position, scale, { color: color, visible: true, dimension: 0 });
}

// Validación de datos
function validateConfig(config) {
    if (!config.NPC || !config.Garage || !Array.isArray(config.teleports) || !Array.isArray(config.broken_panels)) {
        throw new Error("Configuración inválida en data.json");
    }
    // Validar propiedades del NPC
    const npcProps = ['x', 'y', 'z', 'heading', 'model', 'is_networked'];
    npcProps.forEach(prop => {
        if (typeof config.NPC[prop] === 'undefined') {
            throw new Error(`Falta la propiedad ${prop} en NPC`);
        }
    });
    // Validar propiedades del Garaje
    const garageProps = ['x', 'y', 'z'];
    garageProps.forEach(prop => {
        if (typeof config.Garage[prop] === 'undefined') {
            throw new Error(`Falta la propiedad ${prop} en Garage`);
        }
    });
}

// Cargar y validar la configuración
try {
    let CONFIG = require('./data.json');
    validateConfig(CONFIG);
    // Crear el NPC del electricista
    let Electrician_Ped = mp.peds.new(mp.game.joaat(CONFIG.NPC.model), new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), CONFIG.NPC.heading, mp.players.local.dimension);
    Electrician_Ped.freezePosition(true);
    Electrician_Ped.setInvincible(true);

    // Crear blip y marcador
    createBlip("Electrician", new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z), 0);
    createMarker(1, new mp.Vector3(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z - 1.0), 0.7, [255, 255, 255, 255]);

    // Función para detener el trabajo del electricista
    function stop_working() {
        is_hired = false; // Cambia el estado de contratado
        left_vehicle = false; // Cambia el estado de salida del vehículo
        if (work_van) work_van.destroy(); // Destruye el vehículo de trabajo si existe
        if (garage_blip) garage_blip.destroy(); // Destruye el blip del garaje si existe
        if (garage_marker) garage_marker.destroy(); // Destruye el marcador del garaje si existe
        if (car_delete_interval) clearInterval(car_delete_interval); // Limpia el intervalo de eliminación del vehículo
        if (mission_data.blip) mission_data.blip.destroy(); // Destruye el blip de la misión si existe
        if (mission_data.marker) mission_data.marker.destroy(); // Destruye el marcador de la misión si existe
        if (mission_data.text) mission_data.text.destroy(); // Destruye el texto de la misión si existe
        is_working = false; // Cambia el estado de trabajo
    }

    // Función para contratar al electricista
    function hire() {
        is_hired = true; // Cambia el estado de contratado
        let Player = mp.players.local; // Obtiene el jugador local
        Player.clearTasksImmediately(); // Limpia las tareas del jugador
        Player.taskTurnToFaceCoord(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, 0); // Gira al jugador hacia el NPC
        Player.playFacialAnim("mic_chatter", "mp_facial"); // Reproduce una animación facial
        setTimeout(() => Player.clearTasksImmediately(), 1000); // Limpia las tareas después de 1 segundo
        enable_garage(); // Habilita el garaje
    }

    // Función para generar el vehículo de trabajo
    function spawn_car() {
        work_van = mp.vehicles.new(mp.game.joaat("burrito3"), new mp.Vector3(CONFIG.Garage.x, CONFIG.Garage.y, CONFIG.Garage.z), { numberPlate: "ELECTR" }); // Crea un nuevo vehículo
        setTimeout(() => mp.players.local.setIntoVehicle(work_van.handle, -1), 500); // Coloca al jugador en el vehículo después de 0.5 segundos
    }

    // Función para habilitar el garaje
    function enable_garage() {
        garage_blip = mp.blips.new(357, new mp.Vector3(CONFIG.Garage.x, CONFIG.Garage.y, CONFIG.Garage.z), { name: "Garage Electrician", color: 0, shortRange: true, dimension: 0, scale: 0.7 }); // Crea un blip para el garaje
        garage_marker = mp.markers.new(1, new mp.Vector3(CONFIG.Garage.x, CONFIG.Garage.y, CONFIG.Garage.z - 1.0), 0.7, { color: [255, 0, 0, 100], visible: true, dimension: 0 }); // Crea un marcador para el garaje
    }

    // Función para obtener una nueva misión
    function get_new_mission() {
        mission_data.mission = CONFIG.broken_panels[Math.floor(Math.random() * CONFIG.broken_panels.length)]; // Selecciona un panel roto al azar
        mission_data.blip = mp.blips.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), { name: "Electrician", color: 5, shortRange: true, dimension: 0, scale: 0.7 }); // Crea un blip para la misión
        mission_data.blip.setRoute(true); // Establece la ruta para el blip
        mission_data.marker = mp.markers.new(1, new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z - 1.0), 0.7, { color: [200, 160, 0, 100], visible: true, dimension: 0 }); // Crea un marcador para la misión
        mission_data.text = mp.labels.new("Repair the panel", new mp.Vector3(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z), { los: false, font: 4, drawDistance: 10, color: [255, 255, 255, 255], dimension: 0 }); // Crea un texto para la misión
    }

    // Función para iniciar el trabajo
    function start_job() {
        is_working = true; // Cambia el estado de trabajo
        mp.players.local.freezePosition(true); // Congela la posición del jugador
        mp.players.local.taskTurnToFaceCoord(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, 0); // Gira al jugador hacia la misión
        mp.players.local.taskStartScenarioInPlace("WORLD_HUMAN_WELDING", 0, true); // Inicia la animación de trabajo
        setTimeout(() => {
            mp.players.local.clearTasksImmediately(); // Limpia las tareas del jugador
            mission_data.blip.destroy(); // Destruye el blip de la misión
            mission_data.marker.destroy(); // Destruye el marcador de la misión
            mission_data.text.destroy(); // Destruye el texto de la misión
            mp.players.local.freezePosition(false); // Descongela la posición del jugador
            get_new_mission(); // Obtiene una nueva misión
            is_working = false; // Cambia el estado de trabajo
        }, 10000); // Espera 10 segundos antes de finalizar el trabajo
    }

    // Manejo de teclas
    mp.keys.bind(0x45, true, function () {
        // Verifica si el jugador está cerca del garaje
        if (mp.game.system.vdist(CONFIG.Garage.x, CONFIG.Garage.y, CONFIG.Garage.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
            if (is_hired) {
                spawn_car(); // Genera el vehículo de trabajo
                get_new_mission(); // Obtiene una nueva misión
            }
        }
        // Verifica si el jugador está cerca del NPC
        if (mp.game.system.vdist(CONFIG.NPC.x, CONFIG.NPC.y, CONFIG.NPC.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
            hire(); // Contrata al electricista
        }
        // Verifica si el jugador está cerca de la misión
        if (mp.game.system.vdist(mission_data.mission.x, mission_data.mission.y, mission_data.mission.z, mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z) < 2.0) {
            if (is_hired) {
                start_job(); // Inicia el trabajo
            }
        }
    });

    // Eventos de vehículo
    mp.events.add("playerLeaveVehicle", (vehicle, seat) => {
        if (is_hired && vehicle == work_van) {
            left_vehicle = true; // Indica que el jugador ha salido del vehículo
            car_delete_interval = setInterval(() => {
                outside_car_timer--; // Disminuye el temporizador
                if (outside_car_timer < 0) {
                    clearInterval(car_delete_interval); // Limpia el intervalo
                    stop_working(); // Detiene el trabajo
                }
            }, 1000); // Intervalo de 1 segundo
        }
    });

    mp.events.add("playerEnterVehicle", (vehicle, seat) => {
        if (is_hired && vehicle == work_van) {
            left_vehicle = false; // Indica que el jugador ha vuelto al vehículo
            outside_car_timer = 500; // Reinicia el temporizador
            clearInterval(car_delete_interval); // Limpia el intervalo
        }
    });

    // Renderizar mensajes en pantalla
    mp.events.add("render", () => {
        if (is_hired && left_vehicle) {
            mp.game.graphics.drawText(`Get back inside the vehicle or you lose your job: ${outside_car_timer}s left.`, [0.5, 0.01], { font: 0, color: [255, 255, 255, 255], scale: [0.3, 0.3], outline: true }); // Muestra un mensaje en pantalla
        }
    });

    // Teletransportes
    let colshapes_entrances = []; // Almacena las formas de colisión de las entradas
    let raw_data_entrances = []; // Almacena los datos de las entradas
    let colshapes_exits = []; // Almacena las formas de colisión de las salidas
    let raw_data_exits = []; // Almacena los datos de las salidas
    let can_tp = true; // Indica si se puede teletransportar
    let timer = 0; // Temporizador para el teletransporte

    // Crear formas de colisión para los teletransportes
    CONFIG.teleports.forEach((teleport) => {
        let colshape_entrance = mp.colshapes.newSphere(teleport[0].x, teleport[0].y, teleport[0].z, 1.5); // Crea la forma de colisión de entrada
        let colshape_exit = mp.colshapes.newSphere(teleport[1].x, teleport[1].y, teleport[1].z, 1.5); // Crea la forma de colisión de salida
        colshapes_entrances.push(colshape_entrance); // Agrega la entrada a la lista
        colshapes_exits.push(colshape_exit); // Agrega la salida a la lista
        raw_data_entrances.push(teleport[0]); // Agrega los datos de entrada
        raw_data_exits.push(teleport[1]); // Agrega los datos de salida
    });

    // Manejo de eventos de colisión
    mp.events.add("playerEnterColshape", (colshape) => {
        if (colshapes_entrances.includes(colshape) && can_tp) {
            let index = colshapes_entrances.indexOf(colshape); // Obtiene el índice de la entrada
            let exit = raw_data_exits[index]; // Obtiene la salida correspondiente
            mp.players.local.position = new mp.Vector3(exit.x, exit.y, exit.z); // Teletransporta al jugador
            can_tp = false; // Desactiva el teletransporte
            timer = 3; // Establece el temporizador
            setTimeout(() => can_tp = true, 3000); // Reactiva el teletransporte después de 3 segundos
        }
        if (colshapes_exits.includes(colshape) && can_tp) {
            let index = colshapes_exits.indexOf(colshape); // Obtiene el índice de la salida
            let entrance = raw_data_entrances[index]; // Obtiene la entrada correspondiente
            mp.players.local.position = new mp.Vector3(entrance.x, entrance.y, entrance.z); // Teletransporta al jugador
            can_tp = false; // Desactiva el teletransporte
            timer = 3; // Establece el temporizador
            setTimeout(() => can_tp = true, 3000); // Reactiva el teletransporte después de 3 segundos
        }
    });
} catch (error) {
    console.error("Error al cargar la configuración:", error.message);
}
