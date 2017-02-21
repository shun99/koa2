"use strict";

// const Sequelize = require('sequelize');
// const config = require('./config');
//
// var sequelize = new Sequelize(
//     config.database,
//     config.username,
//     config.password,
//     {
//         host: config.host,
//         dialect: 'mysql',
//         pool:{
//             max: 5,
//             min: 0,
//             idle: 30000
//         }
//     }
// );
//
// //定义数据模型
// var User = sequelize.define(
//     'user',
//      {
//         id: {type: Sequelize.STRING(50),primaryKey: true},
//         name: Sequelize.STRING(100),
//         gender: Sequelize.BOOLEAN,
//         birth: Sequelize.STRING(10),
//         createdAt: Sequelize.BIGINT,
//         updatedAt: Sequelize.BIGINT,
//         version: Sequelize.BIGINT
//     },
//     {timestamps: false}
// );
//
// var now = Date.now();
//
// //插入数据
// User.create({
//     id: 'g-' + now,
//     name: 'Gaffey',
//     gender: false,
//     birth: '2007-07-07',
//     createdAt: now,
//     updatedAt: now,
//     version: 0
// }).then(function (p) {
//     console.log('created.' + JSON.stringify(p));
// }).catch(function (err) {
//     console.log('failed: ' + err);
// });

const model = require('./model');
let User = model.User,
    Pet = model.Pet;

(async() => {
    var user = await User.create({
        name: 'John',
        gender: false,
        email: 'john-' + Date.now() + '@garfield.pet',
        passwd: 'hahaha'
    });
    console.log('created: ' + JSON.stringify(user));

    var cat = await Pet.create({
        ownerId: user.id,
        name: 'Garfield',
        gender: false,
        birth: '2007-07-07',
    });
    console.log('created: ' + JSON.stringify(cat));
    var dog = await Pet.create({
        ownerId: user.id,
        name: 'Odie',
        gender: false,
        birth: '2008-08-08',
    });
    console.log('created: ' + JSON.stringify(dog));
})();