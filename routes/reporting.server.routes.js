/**
 * Created by Justin on 7/23/2016.
 */
var stock = require('../controllers/stock.server.controller');

module.exports = function(app) {
    app.route('/api/reporting')
        .get(stock.getAllCurrentStockPrices, stock.returnAllCurrentStockPrices)
};