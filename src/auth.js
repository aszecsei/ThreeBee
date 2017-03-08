module.exports = {
    // route middleware to make sure a user is logged in
    isLoggedIn: function(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    },

    isManager: function(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() && (req.user.user_type == 1 || req.user.user_type == 2))
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    },

    isAdmin: function(req, res, next) {
        // if user is authenticated in the session, carry on
        if (req.isAuthenticated() && req.user.user_type == 2)
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
};