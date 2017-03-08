/**
 * Created by Tanner on 3/8/2017.
 */
var db = require('../database');
window.onload = function () {
    alert("Page is loaded");
    db.query("SELECT * FROM AIRPLANE_TYPE", function (err, row) {
        alert("Page is loaded");
        if (err) {
            return;
        }
        var options = '';
        if (row.length > 0) {
            for(var i =0; i<row.length;i++)
            {
                options += '<option value="' + row[i].idairplane_type + '" text="' + row[i].airplane_name + '" />';
            }
            $('.airplanes').append(options);
            return;
        }
    });
};
