const bcrypt = require('bcryptjs');
const saltRounds = 10;
const fs = require('fs');

//  Called when a player submits the Registration HTML form
mp.events.add('server:registerAccount', async (player, username, email, password) => {
    //  Check username and password lengths
    if (username.length >= 3 && password.length >= 5) {
        //  Check for an invalid email
        if (!validEmail(email)) return failedLoginHandle(player, 'invalid-info');

        try {
            const res = await attemptRegister(player, username, email, password);
            if (res) {
                console.log(`${username} has registered a new account.`)
                successLoginHandle(player, 'registered', username);
                player.call('toggleCreator', [true, null]);
                player.model = mp.joaat("mp_m_freemode_01"); // Modelo personaj
                player.sendToCreator();
            } else {
                failedLoginHandle(player, 'takeninfo');
            }
        } catch (e) { errorHandler(e) };
    } else {
        failedLoginHandle(player, 'tooshort');
    }
});

//  Called when a user wants to login to an account
//  NOTE: This event doesn't load the data onto the account, use server:loadAccount
mp.events.add('server:loginAccount', async (player, username, password) => {
    //  Loop through players array to find any matching usernames currently logged in
    let loggedAccount = mp.players.toArray().find(p => p.getVariable('username') === username);
    if (loggedAccount) return player.call('client:loginHandler', ['logged']);

    try {
        //  Returns true/false if the login was successful or not
        const res = await attemptLogin(username, password);
        res ? successLoginHandle(player, 'success', username) : failedLoginHandle(player, 'incorrectinfo');
    } catch (e) { errorHandler(e) };
});

//  Called after successfully logging into an account and loads the data onto the account
mp.events.add('server:loadAccount', async (player, username) => {
    try {
        // Primera consulta: SELECT
        const { rows } = await mp.db.query(
            'SELECT * FROM accounts WHERE username = $1',
            [username]
        );

        // Segunda consulta: UPDATE
        await mp.db.query(
            'UPDATE accounts SET last_active = NOW() WHERE username = $1',
            [username]
        );

        if (rows.length != 0) {
            player.sqlID = rows[0].id; // Nota: cambiado de ID a id
            player.name = username;
            player.setVariable('username', username);
            //  If a position doesn't exist in the database, load them onto the default spawn position
            rows[0].position === null ?
                player.position = new mp.Vector3(mp.settings.defaultSpawnPosition) :
                player.position = new mp.Vector3(JSON.parse(rows[0].position));
            player.setVariable("loggedIn", true);


        }
    } catch (e) {
        console.log('Error en loadAccount:', e);
        errorHandler(e);
    }
});

mp.events.add('playerJoin', (player) => {
    player.setVariable("loggedIn", false);
    timeoutKick(player);
});

//  Saves the account data upon player quitting (only logged in users)
mp.events.add('playerQuit', async (player) => {
    if (player.getVariable('loggedIn') === false) return;
    let name = player.name;
    try {

        const result = await mp.db.query(
            'UPDATE accounts SET position = $1 WHERE username = $2 RETURNING *',
            [JSON.stringify(player.position), player.name]
        );

        if (result.rowCount === 1) console.log(`${name}'s data successfully saved.`);
        console.log(`${name} has quit the server.`);
    } catch (e) { errorHandler(e) }
})

//  Runs when attempting to register a new account
async function attemptRegister(player, username, email, pass) {
    try {
        console.log('=== INICIO REGISTRO ===');
        console.log(`Intentando registrar: ${username}, ${email}`);

        const { rows } = await mp.db.query(
            'SELECT * FROM accounts WHERE username = $1 OR email = $2',
            [username, email]
        );

        console.log('Filas encontradas:', rows);
        console.log('Cantidad de filas:', rows.length);

        if (rows.length !== 0) {
            console.log('CUENTA EXISTENTE - Detalles:', rows[0]);
            player.call('client:loginHandler', ['exists']);
            return false;
        }

        console.log('Cuenta no existe, procediendo a crear...');
        const hash = await bcrypt.hash(pass, saltRounds);

        const result = await mp.db.query(
            'INSERT INTO accounts (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hash]
        );

        console.log('Resultado de inserción:', result);
        console.log('=== FIN REGISTRO ===');

        return result.rowCount === 1;
    } catch (e) {
        console.log('ERROR EN REGISTRO:', e);
        errorHandler(e);
        return false;
    }
}

//  Runs when attempting to login to an account
async function attemptLogin(username, password) {
    try {
        console.log('=== INICIO LOGIN ===');
        console.log(`Intentando login: ${username}`);
        const { rows } = await mp.db.query(
            'SELECT username, password FROM accounts WHERE username = $1',
            [username]
        );

        //  If no account found, return false
        if (rows.length === 0) return false;

        //  Returns true/false if the password matches
        const res = await bcrypt.compare(password, rows[0].password);

        return res;
    } catch (e) { errorHandler(e) }
}

//  Error handler to handler an error depending if it's an SQL error or JS error
function errorHandler(e) {
    if (e.query) {
        console.log(`[PostgreSQL] ERROR: ${e.message}\n[PostgreSQL] QUERY: ${e.query}`)
    } else {
        console.log(`Error: ${e}`)
    }
}

//  Runs when a failed login attempt has occurred
function failedLoginHandle(player, handle) {
    player.call('client:loginHandler', [handle]);
    resetTimeout(player);
}

//  Resets the idle kick timeout players have upon joining the server
function resetTimeout(user) {
    if (user.idleKick) {
        clearTimeout(user.idleKick);
        user.idleKick = null;
    }
    timeoutKick(user);
}

//  Runs when a successful login attempt has occurred
function successLoginHandle(player, handle, username) {
    if (player.idleKick) {
        clearTimeout(player.idleKick);
        player.idleKick = null;
    }

    // Primero cargar la cuenta
    mp.events.call("server:loadAccount", player, username);

    player.call('client:loginHandler', [handle]);
    console.log(`${username} has successfully logged in.`);
}

//  Sets an idle kick timeout users receive upon joining the server and are waiting to login
function timeoutKick(user) {
    user.idleKick = setTimeout(() => {
        user.call('client:hideLoginScreen');
        user.outputChatBox(`You were kicked for idling too long.`);
        user.kick();
    }, 180000);
}

//  Checks for a valid email during registration/login
function validEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

mp.events.add('serverRegisterAccount', async (player, username, password, email) => {
    try {
        // ... código existente de registro ...

        // Después del registro exitoso
        console.log(`${username} registrado, iniciando character creator...`);

        // Establecer modelo por defecto
        player.model = mp.joaat("mp_m_freemode_01");

    } catch (error) {
        console.error("Error en registro:", error);
        player.call('showNotification', ['Error en el registro']);
    }
});