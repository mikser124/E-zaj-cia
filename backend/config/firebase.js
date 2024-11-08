const admin = require('firebase-admin');

const serviceAccount = require('../projekt-inzynierski-55317-firebase-adminsdk-8ish0-485e013c49');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'projekt-inzynierski-55317.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = { bucket: admin.storage().bucket() };

