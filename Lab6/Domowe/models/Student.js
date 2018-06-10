var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var studentSchema = Schema({
   name: String,
   surname: String,
   login: String,
   password: String,

   subjects: [{
       name: String,
       marks: [{value: Number}],
       teacher: {type: Schema.Types.ObjectId, ref: 'Teacher'}
        }]
});

var Student = module.exports = mongoose.model('Student', studentSchema);

module.exports.createStudent = function(newStudent, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newStudent.password, salt, function(err, hash) {
            newStudent.password = hash;
            newStudent.save(callback);
        });
    });
};

module.exports.getStudentByLogin = function(login, callback){
    var query = {login: login};
    Student.findOne(query, callback);
}

module.exports.getStudentById = function(id, callback){
    Student.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
}

