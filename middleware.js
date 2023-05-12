const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json'));


const secure = {

    basicAuth: (request, response, next) =>
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
    },
    directHTTPS: (request, response, next) =>
    {
        if (request.secure) {
            next();
        } else {
            console.log('redirect to https > ' + request.headers.host + request.url);
            response.redirect('https://' + request.headers.host + request.url);
        }
    },

}





const logger = {

    startHTTP: (port) =>
    {
        console.log(`<logger> HTTP server started... listening on port <${port}>`);
    },
    startHTTPS: (port) =>
    {
        console.log(`<logger> HTTPS server started... listening on port <${port}>`);
    },
    url: (request, response, next) =>
    {
        console.log(`<logger> [${request.secure ? 'https' : 'http'}] : ${request.originalUrl}`);
        next();
    },
    auth: (request, response, next) =>
    {
        console.log(`<logger> header.authorization : ${request.headers.authorization}`);
    },

}



module.exports = { secure , logger };