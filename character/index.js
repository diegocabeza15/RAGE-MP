//  Step 1 - Required before anything else
const fs = require('fs');

//  Step 2 - Obtaining and loading config file
if (!fs.existsSync(__dirname + '/data.json')) {
    console.log(`${'You do not have a \'data.json\' file setup.'}`);
    process.exit(0);
} else {
    mp.character = require('./data.json');
}

require('./character.js');