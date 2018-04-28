'use strict';

var mongoose = require('mongoose');
var orderModel = function(){
    var orderSchema = mongoose.Schema({
        sort:Number,
        store:String,
        sales:String,
        cost:String,
        profit:String,
        date:String
    });
    return mongoose.model('Order', orderSchema, 'order');
}
module.exports = new orderModel();