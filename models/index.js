/**
 * Created by Grunt on 29/06/2017.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../config/config.json')[env];
//var config = require(__dirname + '/../config/configHome.json')[env];
var db = {};
var models = require('../models');
var sequelize;

//var dbConfig = require('../config/configHome.json').db;
var dbConfig = require('../config/config.json').db;
var dbConfigDev = dbConfig.development;

var uri = "mysql://"
    + dbConfigDev.username
    + ":"
    + dbConfigDev.password
    + "@"
    + dbConfigDev.host
    + ":"
    + dbConfigDev.port
    + "/"
    + dbConfigDev.database;

sequelize = new Sequelize(dbConfigDev.database, dbConfigDev.username, dbConfigDev.password);

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(function (file) {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

sequelize.authenticate()
    .then(function () {
        console.log('Connection has been established successfully');

        sequelize.sync()
            .then(function () {
                console.log('Item table created successfully');

            }).catch(function (err) {
            console.log('An error occur while creating table : ' + err);
        }).done();
    })
    .catch(function (err) {
        console.log('There is connection in ERROR');
    })
    .done();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
