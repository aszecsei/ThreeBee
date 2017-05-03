/**
 * Created by Tanner on 5/2/2017.
 */
var express = require('express');
var router = express.Router();

var passport = require('passport');

var db = require('../src/database');
router.get('/',function(req, res) {
    db.query("SELECT * FROM threebee.pricing_modifiers", function(err, rows){
        console.log(rows);
            res.render('changetiers', {
                shouldDisplayLogin: 2,
                prices: rows
            });
    });
});
router.post('/', function(req, res) {
    console.log(req.body);
    db.query("UPDATE `threebee`.`pricing_modifiers` SET `modifier`=? WHERE `id`='1'",[req.body.coach], function(err1){
        db.query("UPDATE `threebee`.`pricing_modifiers` SET `modifier`=? WHERE `id`='2'",[req.body.business], function(err2){
            db.query("UPDATE `threebee`.`pricing_modifiers` SET `modifier`=? WHERE `id`='3'",[req.body.firstclass], function(err3){
                if (err3){
                    errorHandle(err);
                } else {
                    res.json({message: 'Successfully updated user info'});
                }
            });
            if (err2){
                errorHandle(err);
            }
        });
        if (err1){
            errorHandle(err);
        }
    });
});
var errorHandle = function(res, message) {
    res.status(500).json(message);
};

module.exports = router;