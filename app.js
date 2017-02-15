"use strict";
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const fs = require('fs');
const controller = require('./controller');

app.use(controller());
//app.use(bodyParser());必须至少放在app.use(router.routes());之前。
app.use(bodyParser());
app.use(router.routes());
app.listen(3000);
console.log('app start at port 3000...');