/*
 * @Author: your name
 * @Date: 2020-01-15 15:12:52
 * @LastEditTime : 2020-01-17 14:06:31
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \topfinance-server\index.js
 */
const Koa = require('koa')
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
/* 数据库连接 */
const {
    connect,
    initSchemas
} = require('./db/init');
(async () => {
    initSchemas()
    await connect()
})()
const router = require('./router/routes.js')
const app = new Koa()
app.use(bodyParser())
app.use(cors({
    // 为什么直接返回字符串‘*’不行，非要用函数才行呢，此问题待解决
    origin: function (ctx) {
        return '*';
    },
}))
app.use(router.routes())
    // .use(router.allowedMethods())

app.listen(2333);