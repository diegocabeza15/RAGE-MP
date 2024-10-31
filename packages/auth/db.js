async function initializeDatabase(){
    try {
        const client = await mp.db.connect();
        if(client){
            await client.query(`
                CREATE TABLE IF NOT EXISTS accounts (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(24) UNIQUE NOT NULL,
                    email VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(60) NOT NULL,
                    last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    position TEXT DEFAULT NULL
                );
            `);
            
            console.log('Database Connected successfully.');
            client.release();
            return;
        }
    } catch(err) {
        console.log('Error específico:', err);
        switch(err.code){
            case 'PROTOCOL_CONNECTION_LOST':
                throw new Error('Database connection was closed.');
            case '53300':
                throw new Error('Database has too many connections.');
            case 'ECONNREFUSED':
                throw new Error('Check your connection details (packages/template/settings.json) or make sure your PostgreSQL server is running.');
            case '3D000':
                throw new Error('The database name you\'ve entered does not exist. Ensure the details inside your config file are correct.');
            case '28P01':
                throw new Error('Check your PostgreSQL username and password and make sure they\'re correct.');
            case 'ENOENT':
                throw new Error('There is no internet connection. Check your connection and try again.');
            case 'ENOTFOUND':
                throw new Error('Database host not found.');
            default:
                throw new Error(err.message || err);
        }
    }
}

if(mp.settings.db_debug){
    mp.db.on('connect', client => {
        console.log('New client connected');
    });

    mp.db.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err);
    });

    mp.db.on('remove', client => {
        console.log('Client removed');
    });
}

module.exports = {
    initializeDatabase
}