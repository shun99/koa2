"use strict";

const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const fs = require('fs');

// 先导入fs模块，然后用readdirSync列出文件
// 这里可以用sync是因为启动时只运行一次，不存在性能问题:
var files = fs.readdirSync(__dirname+'/controllers');
var js_files = files.filter((f)=>{
    return f.endsWith('.js');
});

for(var f of js_files){
    console.log(`process controller: ${f}...`);
    /**
     * 此处时用的是  /controllers/
     */
    let mapping = require(__dirname+'/controllers/' + f);
    for(var url in mapping){
        if(url.startsWith('GET ')){
            var path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        }else if(url.startsWith('POST ')){
            var path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        }else{
              // 无效的URL:
            console.log(`invalid URL: ${url}`);
        }
    }
}


app.use(bodyParser());
app.use(router.routes());
app.listen(3000);
console.log('app start at port 3000...');