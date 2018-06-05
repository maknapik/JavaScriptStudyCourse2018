var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Student = require('../models/Student');
var Teacher = require('../models/Teacher');
var ensure = require('../public/javascripts/ensure');
var passport = require('passport');
var LocalStrategyStudent = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
    Student.find({}, function(err, students) {
        res.render('student', {page: 'student', title: "Students", students: students});
    });
});

router.get('/:id', ensure.ensureAuthenticated, function(req, res, next) {
    /*var teacher = new Teacher({name: 'Rom', surname: 'Banks', subjects: [{name: "Maths"}, {name: "Physics"}]});
    teacher.save();
    var bob = new Student({name: 'Bob', surname: 'Smith', login: 'bobby', password: 'xxx',
        subjects: [{name: 'Maths', marks: [{value: 4}], teacher: teacher._id},
            {name: 'Physics', marks: [{value: 2}], teacher: teacher._id}]});
    bob.save();*/

    Student.findById(req.params.id, function(err, student) {
        if(err) console.log(err);
        student.populate('subjects.teacher', function (err, student) {
            if(err) console.log(err);
            res.render('studentdetail', {page: 'studentdetail', title: "Student", student: student});
        });
    });
});

router.post('/:id/addmark/:sid', function(req, res, next) {
    Student.findOne({_id: req.params.id}).exec(function(err, result) {
       result.subjects.id(req.params.sid).marks.push({value: req.body.mark});
        result.save(function(err) {
            res.redirect('/student/'+req.params.id)
        });
    });
});

router.post('/:id/deletemark/:sid/', function(req, res, next) {

    Student.findOne({_id: req.params.id}).exec(function(err, result) {
        result.subjects.id(req.params.sid).marks.id(req.body.mark).remove();
        result.save(function(err) {
            res.redirect('/student/'+req.params.id)
        });
    });
});

router.post('/:id/editmark/:sid/', function(req, res, next) {

    Student.findOne({_id: req.params.id}).exec(function(err, result) {
        result.subjects.id(req.params.sid).marks.id(req.body.mark).set({value: req.body.value});
        result.save(function(err) {
            res.redirect('/student/'+req.params.id)
        });
    });
});

router.post('/:id/deletesubject/', function(req, res, next) {

    Student.findOne({_id: req.params.id}).exec(function(err, result) {
        result.subjects.id(req.body.id).remove();
        result.save(function(err) {
            res.redirect('/student/'+req.params.id)
        });
    });
});

router.post('/:id/addsubject/', function(req, res, next) {
    Student.findOne({_id: req.params.id}).exec(function(err, result) {
        var add = true;
        result.subjects.forEach(function(element) {
            if(element.name === req.body.name)
            {
                add = false;
            }
        });
        if(add)
        {
            result.subjects.push({name: req.body.name, teacher: req.body.teacher});
            result.save(function(err) {
                res.redirect('/student/'+req.params.id)
            });
        }
        else
        {
            res.redirect('/student/'+req.params.id)
        }

    });
});

module.exports = router;
