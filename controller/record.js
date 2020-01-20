/*
 * @Author: your name
 * @Date: 2020-01-15 16:11:14
 * @LastEditTime : 2020-01-20 11:40:57
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \topfinance-server\controller\record.js
 */
const mongoose = require('mongoose')
const Record = mongoose.model('Record');
class recordManager {
    /**
     * @description: 添加新账目
     * @param {type: String,typeId: Number,desc: String,money: Number,date: String,isOut: Number}
     * @return: 添加成功的数据
     */
    static async addRecord(ctx, next) {
        const d = ctx.request.body;
        d.timeStamp = new Date(d.date).getTime();
        ctx.body = await Record.create(d);
    }
    /**
     * @description: 获取财务记录，支持翻页，分类搜索，时间段搜索
     * @param {page, pageLimit, typeId, date:[startDate, endData]}
     * @return: 财务记录list
     */
    static async getRecord(ctx, next) {
        const d = ctx.query;
        d.date = JSON.parse(d.date);
        // 搜索条件
        let search = {
            "timeStamp": {
                $gte: new Date(d.date[0]).getTime(),
                $lte: new Date(d.date[1]).getTime()
            },
            "isDelete": 0
        };
        if (d.typeId != 'null') search.typeId = d.typeId;
        // 第二个参数options隐藏了一些前端不必要的字段
        ctx.body = await Record.find(search, {
            isDelete: 0,
            __v: 0,
            timeStamp: 0
        }).sort({
            timeStamp: -1
        }).skip((d.page - 1) * d.pageLimit).limit(Number(d.pageLimit));
    }
    static async delRecord(ctx, next) {
        const d = ctx.request.body;
        ctx.body = await Record.findByIdAndUpdate(d.id, {
            isDelete: 1
        })
    }
    static async delRecord(ctx, next) {
        const d = ctx.request.body;
        ctx.body = await Record.findByIdAndUpdate(d.id, {
            isDelete: 1
        })
    }
}
module.exports = recordManager;