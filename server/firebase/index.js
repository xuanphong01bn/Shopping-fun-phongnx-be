var admin = require("firebase-admin"); // dùng để điều khiển con rối firebase từ máy local

var serviceAccount = require("../configs/fbServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
