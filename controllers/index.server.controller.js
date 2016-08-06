/**
 * Created by Justin on 7/6/2016.
 */
exports.render = function(req, res) {
    res.render('index', {
        title: 'Asset Management System',
        user: JSON.stringify(req.user)
    });
};