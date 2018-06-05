var express = require('express');
var router = express.Router();
var Student = require('../models/Student');
/* GET home page. */
router.get('/', function(req, res, next) {
  Student.find({}, function(err, students) {
      if(err) console.log(err);
      res.render('index', {page: 'index', title: 'Dziekanat', students: students });
  });
});

module.exports = router;
