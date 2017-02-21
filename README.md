# node 框架

Koa2+mysql

## Koa

**中间件级联**很关键。下面是对Koa1的中间件级联描述，koa2类似。

Koa 的中间件通过一种更加传统（您也许会很熟悉）的方式进行级联，摒弃了以往 node 频繁的回调函数造成的复杂代码逻辑。 我们通过 generators 来实现“真正”的中间件。 Connect 简单地将控制权交给一系列函数来处理，直到函数返回。 与之不同，当执行到 yield next 语句时，Koa 暂停了该中间件，继续执行下一个符合请求的中间件('downstrem')，然后控制权再逐级返回给上层中间件('upstream')。

下面的例子在页面中返回 "Hello World"，然而当请求开始时，请求先经过 x-response-time 和 logging 中间件，并记录中间件执行起始时间。 然后将控制权交给 reponse 中间件。当中间件运行到 yield next 时，函数挂起并将控制前交给下一个中间件。当没有中间件执行 yield next 时，程序栈会逆序唤起被挂起的中间件来执行接下来的代码。
```
var koa = require('koa');
var app = koa();

// x-response-time

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});

// logger

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

// response

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
```

```
app.use(async (ctx, next) => {
    await next();
    ctx.response.type = 'text/html';
    ctx.response.body = '<h1>Hello, koa2!</h1>';
});
```

## Babel

将基于高版本的es标准的js 转化为低版本的js

## koa-router
```
router.get('/path', async fn)   处理的是get请求。
router.post('/path', async fn)。处理post请求
```
当处理的url多时
```
app.use(async (ctx, next) => {
    if (ctx.request.path === '/') {
        ctx.response.body = 'index page';
    } else {
        await next();
    }
});

app.use(async (ctx, next) => {
    if (ctx.request.path === '/test') {
        ctx.response.body = 'TEST page';
    } else {
        await next();
    }
});

app.use(async (ctx, next) => {
    if (ctx.request.path === '/error') {
        ctx.response.body = 'ERROR page';
    } else {
        await next();
    }
});
......
```
路由，为了统一处理URL，我们需要引入koa-router这个middleware
```
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
});

app.use(router.routes());
```
## koa-bodyparser
因为无论是Node.js提供的原始request对象，还是koa提供的request对象，都不提供解析request的body的功能。引入koa-bodyparser解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中

## Nunjucks 模板引擎
### 定义
是基于模板配合数据构造出**字符串**输出的一个组件
### 作用
- 对特殊字符要转义，避免受到XSS攻击
- 对不同类型的变量要格式化
- 能执行一些简单逻辑

### 创建
```
const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader('views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

var env = createEnv('views', {
    watch: true,
    filters: {
        hex: function (n) {
            return '0x' + n.toString(16);
        }
    }
});
```
变量env就表示Nunjucks模板引擎对象，它有一个render(view,model)方法，正好传入view和model两个参数，并**返回字符串**

### 使用
view
```
<h1>Hello {{ name }}</h1>
```
model
```
{ name: '小明' }
```
使用
```
var s = env.render('hello.html', );
console.log(s);
```

# MVC

```
view-koa/
|
+- controllers/ <-- Controller
|
+- views/ <-- html模板文件
|
+- static/ <-- 静态资源文件
|
+- controller.js <-- 扫描注册Controller
|
+- app.js <-- 使用koa的js
|
+- start.js <-- 启动入口js
|
+- package.json <-- 项目描述文件
|
+- node_modules/ <-- npm安装的所有依赖包
|
+- static-files.js 处理静态文件
|
+- templating.js 给ctx加上render()来使用Nunjucks
```
- start.js
```
var register = require('babel-core/register');

register({
    presets: ['stage-3']
});

require('./app.js');
```

- controller.js
```
'use strict';
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

/**
 *  外部直接调用app.use(controller());
 */
module.exports = function (dir){
    let
        controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
}
```

- static-files.js
```
const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

// url: 类似 '/static/'
// dir: 类似 __dirname + '/static'
function staticFiles(url, dir) {
    return async (ctx, next) => {
        let rpath = ctx.request.path;
        // 判断是否以指定的url开头:
        if (rpath.startsWith(url)) {
            // 获取文件完整路径:
            let fp = path.join(dir, rpath.substring(url.length));
            // 判断文件是否存在:
            if (await fs.exists(fp)) {
                // 查找文件的mime:
                ctx.response.type = mime.lookup(rpath);
                // 读取文件内容并赋值给response.body:
                ctx.response.body = await fs.readFile(fp);
            } else {
                // 文件不存在:
                ctx.response.status = 404;
            }
        } else {
            // 不是指定前缀的URL，继续处理下一个middleware:
            await next();
        }
    };
}

module.exports = staticFiles;
```
- templating.js
```
const nunjucks = require('nunjucks');

function createEnv(path, opts) {
    var
        autoescape = opts.autoescape && true,
        noCache = opts.noCache || false,
        watch = opts.watch || false,
        throwOnUndefined = opts.throwOnUndefined || false,
        env = new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path || 'views', {
                noCache: noCache,
                watch: watch,
            }), {
                autoescape: autoescape,
                throwOnUndefined: throwOnUndefined
            });
    if (opts.filters) {
        for (var f in opts.filters) {
            env.addFilter(f, opts.filters[f]);
        }
    }
    return env;
}

function templating(path, opts) {
    // 创建Nunjucks的env对象:
    var env = createEnv(path, opts);
    return async (ctx, next) => {
        // 给ctx绑定render函数:
        ctx.render = function (view, model) {
            // 把render后的内容赋值给response.body:
            ctx.response.body = env.render(view, Object.assign({}, ctx.state || {}, model || {}));
            // 设置Content-Type:
            ctx.response.type = 'text/html';
        };
        // 继续处理请求:
        await next();
    };
}

module.exports = templating;
```

app.js
```
"use strict";
const isProduction = process.env.NODE_ENV === 'production';
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const fs = require('fs');
const controller1 = require('./controller1');
const staticFiles = require('./static-files');
const templating = require('./templating');

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

//2 middleware处理静态文件：

app.use(staticFiles('/static/', __dirname + '/static'));

//3 middleware解析POST请求：
app.use(bodyParser());

//4 middleware负责给ctx加上render()来使用Nunjucks：
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

//5 处理路由
controller1.fun(fs, router);
app.use(router.routes());
//调用controller.js
// app.use(controller());

app.listen(3000);
console.log('app start at port 3000...');
```
