require('./login.js');
mp.events.add('playerReady', () => {
    mp.events.call('client:showLoginScreen');
});
require('./character.js');

