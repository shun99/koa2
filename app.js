"use strict";
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const fs = require('fs');

function addMapping(router, mapping){
    for(let url in mapping){
        if(url.startsWith('GET ')){
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        }else if(url.startsWith('POST ')){
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        }else{
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router){
    var files = fs.readdirSync(__dirname+'/controllers');
    var js_files = files.filter((f)=>{
        return f.endsWith('.js');
    });
    for(let file of js_files){
        console.log(`process controller: ${file}...`);
        let mapping = require(__dirname+'/controllers/'+file);
        addMapping(router, mapping);
    }
}

addControllers(router);
//app.use(bodyParser());必须至少放在app.use(router.routes());之前。
app.use(bodyParser());
app.use(router.routes());
app.listen(3000);
console.log('app start at port 3000...');