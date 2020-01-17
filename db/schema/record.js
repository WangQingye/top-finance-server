/*
 * @Author: your name
 * @Date: 2020-01-15 16:17:54
 * @LastEditTime : 2020-01-16 15:59:47
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edits
 * @FilePath: \topfinance-server\db\schema\record.js
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var recordSchema = new Schema({
    // 分类
    type: String,
    // 分类id
    typeId: Number,
    // 详细描述
    desc: String,
    // 具体数额
    money: Number,
    // 账本发生日期
    date: String,
    // 支出还是收入，1代表支出，0代表收入
    isOut: Number,
    // ------------------分割线----------------- 上面的字段需要用户输入，后面的字段为服务端自行维护
    // 日期的时间戳，用于筛选条件
    timeStamp: String,
    // 账目的入库日期
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // 是否被删除（为了不做物理删除）
    isDelete: {
        type: Number,
        default: 0
    }
});
mongoose.model('Record', recordSchema)