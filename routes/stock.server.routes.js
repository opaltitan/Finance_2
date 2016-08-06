/**
 * Created by Justin on 7/16/2016.
 */
var stock = require('../controllers/stock.server.controller');

module.exports = function(app) {
    app.route('/api/stock')
        .get(stock.list)
        .post(stock.create, stock.read);
    app.route('/api/stock/lookup/:stockLookup')
        .get(stock.lookupStock);
    app.route('/api/stock/:stockId')
        .get(stock.getCurrentPrices, stock.read);

    app.param('stockId', stock.stockByID);
    app.param('stockLookup', stock.stockLookup);
};