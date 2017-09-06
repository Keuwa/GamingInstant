/**instanceUser
 * Created by Grunt on 29/06/2017.
 */
var express = require('express');
var swagger = require("swagger-node-express");
var server = express();
var subpath = express();

require('./config')(server);
require('./models');
require('./middlewares')(server);
require('./actions')(server);
require('./routes')(server);

swagger = require("swagger-node-express").createNew(subpath);
server.use(express.static('dist'));
swagger.setApiInfo({
    title: "EZ Pesée SWAGGER",
    description: "Manage your weight",
    termsOfServiceUrl: "",
    contact: "m.remiollivier@gmail.com",
    license: "",
    licenseUrl: ""
});

server.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});

swagger.configureSwaggerPaths('', 'api-docs', '');

var applicationUrl = 'http://' + server.config.domain + ':' + server.config.port;
console.log('snapJob API running on ' + applicationUrl);

swagger.configure(applicationUrl, '1.0.0');

server.listen(server.config.port)
