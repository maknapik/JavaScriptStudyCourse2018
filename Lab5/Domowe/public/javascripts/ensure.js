module.exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    } else {
        console.log("Not authenticated");
        res.redirect('/users/login');
    }
};