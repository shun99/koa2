"use strict";
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const fs = require('fs');
const controller1 = require('./controller1');


app.use(bodyParser());

//调用controller.js
// app.use(controller());

//调用controller1.js
controller1.fun(fs, router);
app.use(router.routes());


app.listen(3000);
console.log('app start at port 3000...');