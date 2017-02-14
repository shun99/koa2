const Koa = require('koa');
const app = new Koa();
app.use(
    /**
     * 参数ctx是由koa传入的封装了request和response的变量
     * next是koa传入的将要处理的下一个异步函数。
     * 上面的异步函数中，我们首先用await next();处理下一个异步函数，然后，设置response的Content-Type和内容。
     */
    async(ctx, next)=>{
        await next();
        ctx.response.type = 'text/html';
        ctx.response.body = '<h1>Hello, koa2</h1>';
    }
);
app.listen(3000);
console.log('app start at port 3000...');