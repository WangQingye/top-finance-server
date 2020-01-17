/*
 * @Author: your name
 * @Date: 2020-01-15 16:11:19
 * @LastEditTime : 2020-01-16 17:26:53
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \topfinance-server\controller\type.js
 */
const mongoose = require('mongoose')
const Type = mongoose.model('Type');
const Record = mongoose.model('Record');
const recordManager = require('./record')

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
        console.log(d);
        ctx.body = await Type.findOneAndRemove({
            typeId: d.typeId
        })
    }
    static async getType(ctx, next) {
        ctx.body = await Type.find()
    }
    static async getTypeStatistic(ctx, next) {
        const d = ctx.request.body;
        let types = await Type.find({},{
            _id: 0,
            __v: 0
        },{lean: true});
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