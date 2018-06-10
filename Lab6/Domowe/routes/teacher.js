var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Teacher = require('../models/Teacher');
var Student = require('../models/Student');
var ensure = require('../public/javascripts/ensure');
var passport = require('passport');
var LocalStrategyTeacher = require('passport-local').Strategy;

router.get('/:id', ensure.ensureAuthenticated, function(req, res) {
    console.log("Teacher " + req.user);
    Teacher.findById(req.params.id, function(err, teacher) {
        Student.find({"subjects.teacher": teacher._id}).exec(function (err, students) {
            res.render('teacher', {page: 'teacher', title: teacher.name + " " + teacher.surname, teacher: teacher, students: students});
        });
    });
});

router.get('/:id/addsubject', function(req, res) {
    Teacher.findById(req.params.id, function(err, teacher) {

        res.render('addsubject', {page: 'teacher', title: teacher.name + " " + teacher.surname, teacher: teacher});
    });
});

router.post('/:id/addsubject', function(req, res) {
    console.log("POST");
    Teacher.findOne({_id: req.params.id}).exec(function(err, result) {
        result.subjects.push({name: req.body.name});
        result.save(function(err) {
            res.redirect('/teacher/'+req.params.id)
        });
    });
});

//logging

passport.use('teacher', new LocalStrategyTeacher({usernameField: "login", passwordField: "password"},
    function (login, password, done) {
        Teacher.getTeacherByLogin(login, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            Teacher.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function serializeTeacher(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function deserializeTeacher(id, done) {
    Teacher.getTeacherById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('teacher'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        console.log("User authenticated: " + req.user);
        res.redirect('/teacher/'+req.user.id);
    });

module.exports = router;
