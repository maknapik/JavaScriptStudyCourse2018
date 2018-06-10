var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var teacherSchema = Schema({
    name: String,
    surname: String,
    login: String,
    password: String,
    subjects: [{name: String}]
});

var Teacher = module.exports = mongoose.model('Teacher', teacherSchema);

module.exports.createTeacher = function(newTeacher, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newTeacher.password, salt, function(err, hash) {
            newTeacher.password = hash;
            newTeacher.save(callback);
        });
    });
};

module.exports.getTeacherByLogin = function(login, callback){
    var query = {login: login};
    Teacher.findOne(query, callback);
}

module.exports.getTeacherById = function(id, callback){
    Teacher.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}