const Koa = require('koa');
const router = require('koa-router')();
const app = new Koa();



app.use(async(ctx, next)=>{
    console.log(`progress ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

router.get('/hello/:name', async (ctx, next) =>{
    let name = ctx.params.name;
    ctx.response.body = 'hello, ${name}!';
});
router.get('/', async(ctx, next) =>{
    ctx.response.body = 'index';
});
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