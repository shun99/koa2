'use strict'

var fn_singin = async(ctx, next)=>{
    var
        email = ctx.request.body.email || '',
        password = ctx.request.body.password || '';
    if (email === 'admin@example.com' && password === '123456') {
        ctx.render('signin-ok.html',{
            title: 'Sign In OK',
            name: 'Mr Node'
        });
    }else{
         ctx.render('signin-failed.html',{
           title: 'Sign In Failed'
        });
    }
};

module.exports ={
    'POST /signin':fn_singin
};



// var fn_singin = async(ctx, next)=>{
//     var
//         name = ctx.request.body.name || '',
//         password = ctx.request.body.password || '';
//     console.log(`signin with name: ${name}, password: ${password}`);
//     if (name === 'koa' && password === '12345') {
//         ctx.response.body = `<h1>Welcome, ${name}!</h1>`;
//     } else {
//         ctx.response.body = `<h1>Login failed!</h1>
//         <p><a href="/">Try again</a></p>`;
//     }
// };