"use strict";
// const isProduction = process.env.NODE_ENV === 'production';
// const Koa = require('koa');
// const router = require('koa-router')();
// const bodyParser = require('koa-bodyparser');
// const app = new Koa();
// const fs = require('fs');
// const controller1 = require('./controller1');
// const staticFiles = require('./static-files');
// const templating = require('./templating');

// app.use(async (ctx, next) => {
//     console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
//     var
//         start = new Date().getTime(),
//         execTime;
//     await next();
//     execTime = new Date().getTime() - start;
//     ctx.response.set('X-Response-Time', `${execTime}ms`);
// });

// //2 middleware处理静态文件：

// app.use(staticFiles('/static/', __dirname + '/static'));

// //3 middleware解析POST请求：
// app.use(bodyParser());

// //4 middleware负责给ctx加上render()来使用Nunjucks：
// app.use(templating('views', {
//     noCache: !isProduction,
//     watch: !isProduction
// }));

// //5 处理路由
// controller1.fun(fs, router);
// app.use(router.routes());
// //调用controller.js
// // app.use(controller());

// app.listen(3000);
// console.log('app start at port 3000...');

const Sequelize = require('sequelize');
const config = require('./config');

var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: 'mysql',
        pool:{
            max: 5,
            min: 0, 
            idle: 30000
        }
    }
);

//定义数据模型
var Pet = sequelize.define(
    'pet',
     {
        id: {type: Sequelize.STRING(50),primaryKey: true},
        name: Sequelize.STRING(100),
        gender: Sequelize.BOOLEAN,
        birth: Sequelize.STRING(10),
        createdAt: Sequelize.BIGINT,
        updatedAt: Sequelize.BIGINT,
        version: Sequelize.BIGINT
    }, 
    {timestamps: false}
);

var now = Date.now();

//插入数据
Pet.create({
    id: 'g-' + now,
    name: 'Gaffey',
    gender: false,
    birth: '2007-07-07',
    createdAt: now,
    updatedAt: now,
    version: 0
}).then(function (p) {
    console.log('created.' + JSON.stringify(p));
}).catch(function (err) {
    console.log('failed: ' + err);
});