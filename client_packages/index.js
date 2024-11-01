require('./login.js');
require('./char.js');

mp.events.add('playerReady', () => {
    mp.events.call('client:showLoginScreen');
});

