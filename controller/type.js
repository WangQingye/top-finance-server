/*
 * @Author: your name
 * @Date: 2020-01-15 16:11:19
 * @LastEditTime : 2020-01-20 16:50:58
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \topfinance-server\controller\type.js
 */
const mongoose = require('mongoose')
const Type = mongoose.model('Type');
const Record = mongoose.model('Record');

class typeManager {
    static async addType(ctx, next) {
        const d = ctx.request.body;
        const had = await Type.findOne({
            type: d.typeName
        })
        if (had) {
            ctx.body = {
                code: 222,
                msg: '已经有这个分类了哦'
            }
            return;
        }
        let allTypes = await Type.find().sort({
            id: 1
        });
        let id;
        if (!allTypes.length) {
            id = 0
        } else {
            id = allTypes.pop().typeId + 1;
        }
        ctx.body = await Type.create({
            type: d.typeName,
            typeId: id
        })
    }
    static async delType(ctx, next) {
        const d = ctx.request.body;
        const had = await Record.findOne({
            typeId: d.typeId,
            isDelete: 0
        })
        if (had) {
            ctx.body = {
                msg: '有账目的分类不能删除'
            }
        } else {
            ctx.body = await Type.findOneAndRemove({
                typeId: d.typeId
            })
        }
    }
    static async getType(ctx, next) {
        ctx.body = await Type.find({}, {
            _id: 0,
            __v: 0
        })
    }
    static async getTypeStatistic(ctx, next) {
        const d = ctx.query;
        d.date = JSON.parse(d.date);
        let types = await Type.find({}, {
            _id: 0,
            __v: 0
        }, {
            lean: true
        });
        types = types.slice();
        let search = {
            "timeStamp": {
                $gte: new Date(d.date[0]).getTime(),
                $lte: new Date(d.date[1]).getTime()
            },
            "isDelete": 0
        };
        let records = await Record.find(search);
        // 用于百分比计算
        let allOutMoney = 0;
        let allInMoney = 0;
        // 将每条账目加入type数组中
        records.forEach(item => {
            let typeId = item.typeId;
            for (let index = 0; index < types.length; index++) {
                const typeData = types[index];
                if (typeId == typeData.typeId) {
                    // 注意区分是支出还是收入
                    let typeMoney = (item.isOut ? typeData.outMoney : typeData.inMoney) || 0;
                    typeMoney += item.money;
                    if (item.isOut) {
                        allOutMoney += item.money;
                        typeData.outMoney = typeMoney
                    } else {
                        allInMoney += item.money;
                        typeData.inMoney = typeMoney;
                    }
                    break;
                }
            }
        })
        types.forEach(item => {
            if (item.outMoney) item.outPercent = (item.outMoney / allOutMoney).toFixed(4) * 100;
            if (item.inMoney) item.inPercent = (item.inMoney / allInMoney).toFixed(4) * 100;
            // 补齐一下数据格式，免得前端处理麻烦
            if (!item.outMoney) item.outMoney = 0;
            if (!item.inMoney) item.inMoney = 0;
            if (!item.inPercent) item.inPercent = 0;
            if (!item.outPercent) item.outPercent = 0;
        })
        let data = {
            allOutMoney,
            allInMoney,
            types
        }
        ctx.body = data;
    }
}
module.exports = typeManager;