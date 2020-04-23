const express = require('express');
const favicon = require('express-favicon');
const enforce = require('express-sslify');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();

app.use(favicon(__dirname + '/build/favicon.ico'));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.use(enforce.HTTPS({trustProtoHeader: true}));

app.get('/ping', function (req, res) {
    return res.send('pong');
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);
console.log("Listening on port: " + port);
