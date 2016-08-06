/**
 * Created by Justin on 7/16/2016.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    schema = mongoose.Schema;

var StockSchema = new schema ({
    ticker: String,
    stockName: String,
    created: {
        type: Date,
        default: Date.now
    },
    currentPrice: Object
});

StockSchema.set('toJson', { getters: true, virtuals: true });

mongoose.model('Stock', StockSchema);