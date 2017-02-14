const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();


/**
 * 提供解析request的body的功能
 * let name = ctx.request.body.name || '';
 */

app.use(bodyParser());

app.use(async(ctx, next)=>{
    console.log(`progress ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

router.get('/', async (ctx, next)=>{
      ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async(ctx, next)=>{
    let name = ctx.request.body.name || '';
    let password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if(name === 'koa' && password === '123'){
        ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
    }else{
        ctx.response.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});

// router.get('/hello/:name', async (ctx, next) =>{
//     let name = ctx.params.name;
//     ctx.response.body = 'hello, ${name}!';
// });
// router.get('/', async(ctx, next) =>{
//     ctx.response.body = 'index';
// });
app.use(router.routes());


// app.use(async(ctx, next)=>{
//     if(ctx.request.path === '/test'){
//         ctx.response.body = 'Test page';
//     }else{
//         await next();
//     }
// });
// app.use(async(ctx, next)=>{
//     if(ctx.request.path === '/error'){
//         ctx.response.body = 'Error page';
//     }else{
//         await next();
//     }
// });
app.listen(3000);
console.log('app start at port 3000...');