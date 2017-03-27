/**
 * Created by emmahawk on 3/6/2017.
 */
//checks whether or not user wants a return type
//changes whether they can select return flight
$(document).ready(function(){
    $("#oneway").click(function (event) {
        $("#returngroup").hide();
    })
    $("#roundtrip").click(function (event) {
        $("#returngroup").show();
    })
})

// handles the outward flight date picker
$(document).ready(function(){
    var date_input=$('input[name="outward-date"]'); //our date input has the name "date"
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options={
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
})

//handles the return flight date picker
$(document).ready(function(){
    var date_input=$('input[name="return-date"]'); //our date input has the name "date"
    var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
    var options={
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);
})