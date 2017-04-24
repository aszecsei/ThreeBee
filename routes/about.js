/**
 * Created by Tanner on 4/23/2017.
 */
router.get('/', function(req, res) {
    res.render('about', {shouldDisplayLogin: (req.isAuthenticated() ? 1 : 0)});
});