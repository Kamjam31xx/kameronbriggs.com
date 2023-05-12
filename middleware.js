const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));



const basicAuthentication = (request, response, next) =>
{
    const reject = () => 
    {
        response.setHeader("www-authenticate", "Basic");
        response.sendStatus(401);
    };

    const authorization = request.headers.authorization;

    if(!authorization) 
    {
        return reject();
    }

    const [username, password] = Buffer.from(authorization.replace("Basic ", ""), "base64").toString().split(":");

    if(username === config.basicAuth.username && password === config.basicAuth.password)
    {
        response.render('private/index');
    } else {
        return reject();
    }
};
const httpRedirect = (request, response, next) =>
{
    if (request.secure) {
        next();
    } else {
        console.log('redirect to https > ' + request.headers.host + request.url);
        response.redirect('https://' + request.headers.host + request.url);
    }
}
const secure = {

    basicAuth: basicAuthentication,
    directHTTPS: httpRedirect,

}



const listenHTTP = (port) =>
{
    console.log(`<logger> HTTP server started... listening on port <${PORT_HTTP}>`);
}
const listenHTTPS = (port) =>
{
    console.log(`<logger> HTTPS server started... listening on port <${PORT_HTTPS}>`);
}
const logUrl = (request, response, next) =>
{
    console.log(`<logger> [${request.secure ? 'https' : 'http'}] : ${request.originalUrl}`);
    next();
}
const logAuthorization = (request, response, next) =>
{
    console.log(`<logger> header.authorization : ${request.headers.authorization}`);
}
const logger = {

    startHTTP: startHTTP,
    startHTTPS: startHTTPS,
    url: logUrl,
    auth: logAuthorization,

}



module.exports = { secure , logger };