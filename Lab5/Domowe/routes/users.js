var express = require('express');
var router = express.Router();
var Teacher = require('../models/Teacher');
var Student = require('../models/Student');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login', {page: 'login', title: 'Login'});
});

router.get('/register', function(req, res, next) {
    res.render('register', {page: 'login', title: 'Login', errors: null });
});

router.post('/register', function(req, res, next) {
    var role = req.body.role;
    var login = req.body.login;
    var name = req.body.name;
    var surname = req.body.surname;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('surname', 'Surname is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors) {
        res.render('register', {page: 'register', title: 'Register', errors: errors})
    } else {
        if(role == 'teacher') {
            var newTeacher = new Teacher({
                login: login,
                name: name,
                surname: surname,
                password: password
            });

            Teacher.createTeacher(newTeacher, function(err, user) {
                if(err) throw err;
                console.log(user);
            });
            res.render('login', {page: 'login', title: 'Login'});
        } else {
            var newStudent = new Student({
                login: login,
                name: name,
                surname: surname,
                password: password
            });

            Student.createStudent(newStudent, function (err, user) {
                if (err) throw err;
                console.log(user);
            });
            res.render('login', {page: 'login', title: 'Login'});
        }
    }
});

passport.use('teacher', new LocalStrategy({usernameField: "login", passwordField: "password"},
    function (login, password, done) {
    console.log('Strategy');
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

passport.use('student', new LocalStrategy({usernameField: "login", passwordField: "password"},
    function (login, password, done) {
        Student.getStudentByLogin(login, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            Student.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    if(user instanceof Teacher) {
        done(null, {id: user.id, type: 'Teacher'});
    } else {
        done(null, {id: user.id, type: 'Student'});
    }

});

passport.deserializeUser(function (user, done) {
    if (user.type === 'Teacher') {
        Teacher.getTeacherById(user.id, function (err, user) {
            done(err, user);
        });
    } else {
        Student.getStudentById(user.id, function (err, user) {
            done(err, user);
        });
    }

});

/*router.post('/login', function(req, res, next) {
    if(req.body.role == 'student') {
        passport.authenticate('student', function(err, user, info) {
            console.log("User authenticated: " + req.user);
            res.redirect('/student/'+req.user.id);
        });
    } else {
        console.log("ELO" + req.body.login + "||");
        passport.authenticate('teacher', function(err, user, info) {
            console.log("User authenticated: " + req.user);
            res.redirect('/teacher/'+req.user.id);
        });
    }
});*/

router.post('/login', function(req, res) {
    if(req.body.role == 'student') {
        res.redirect(307, '/users/login/student');
    } else if(req.body.role == 'teacher'){
        res.redirect(307, '/users/login/teacher');
    } else {
        res.redirect('/users/login/');
    }
});

router.post('/login/teacher',
    passport.authenticate('teacher'),
    function (req, res) {
        res.redirect('/teacher/'+req.user.id);
    });

router.post('/login/student',
    passport.authenticate('student'),
    function (req, res) {
        res.redirect('/student/'+req.user.id);
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/users/login');
});
module.exports = router;
