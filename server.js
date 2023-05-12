// author Kameron Briggs 

const { readFile } = require('fs').promises
const fs = require('fs');
const express = require('express');
const https = require('https');
const session = require('express-session');
const crypto = require('crypto');
const { secure , logger } = require("./middleware");


// Config file containing file paths and more
const config = JSON.parse(fs.readFileSync('./config.json'));
const PORT_HTTP              = config.ports.http;
const PORT_HTTPS             = config.ports.https;
const PATH_PRIVATE_KEY       = config.paths.privateKey;
const PATH_PRIVATE_KEY_LOCAL = config.paths.privateKeyLocal;
const PATH_FULL_CHAIN        = config.paths.fullChain;
const PATH_FULL_CHAIN_LOCAL  = config.paths.fullChainLocal;
const PATH_APP               = config.paths.app;


// Load the SSL/TLS key and certificate
const PRIVATE_KEY = fs.readFileSync(PATH_PRIVATE_KEY_LOCAL, 'utf8');
const CERTIFICATE = fs.readFileSync(PATH_FULL_CHAIN_LOCAL, 'utf8');


// maintain order
const app = express();


app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger.url);
app.use(secure.directHTTPS);
app.use(session({
    secret: crypto.randomBytes(32).toString('hex'),
    resave: false,
    saveUninitialized: true
}));
app.use(logger.auth);
app.get(`/`, (request, response, next) => {secure.basicAuth(request, response, next)});
app.use(express.static("public"));


const httpsServer = https.createServer({ key: PRIVATE_KEY, cert: CERTIFICATE }, app);

httpsServer.listen(PORT_HTTPS, logger.startHTTPS(PORT_HTTPS) );
app.listen(PORT_HTTP, logger.startHTTP(PORT_HTTP) );