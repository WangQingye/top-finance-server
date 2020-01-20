/*
 * @Author: your name
 * @Date: 2020-01-15 15:17:57
 * @LastEditTime : 2020-01-17 14:12:49
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \topfinance-server\router\routes.js
 */
const Router = require('koa-router')
const router = new Router();
const typeManager = require('../controller/type.js')
const recordManager = require('../controller/record.js')
router.get('/getType', typeManager.getType)
.post('/addType',typeManager.addType)
.delete('/delType', typeManager.delType)
.get('/getTypeStatistic', typeManager.getTypeStatistic)
.get('/getRecord', recordManager.getRecord)
.post('/addRecord', recordManager.addRecord)
.delete('/delRecord', recordManager.delRecord)
module.exports = router