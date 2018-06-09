import { Meteor } from 'meteor/meteor';

import '../imports/api/tasks.js';

Meteor.startup(() => {

});

Meteor.methods({
    'getFiles': function(path) {
        var fs = Npm.require("fs");
        var files = fs.readdirSync(path);
        var tab = [];
        files.forEach(file => {
            var stat = fs.lstatSync(path + "/" + file);
            if(!stat.isDirectory()) {
                tab.push({name: file, type: "file", active: 0});
            } else {
                tab.push({name: file, type: "folder", active: 0});
            }
        });
        //console.log(tab);
        return tab;
    },

    'copyFile': function(path1, path2, name) {
        var fs = Npm.require("fs");
        var file = fs.readFileSync(path1 + '/' + name);
        fs.writeFileSync(path2 + '/' + name, file);
    },

    'deleteFile': function(path, name) {
        var fs = Npm.require("fs");
        fs.unlinkSync(path + '/' + name);
    },

    'renameFile': function(path, oldname, newname) {
        var fs = Npm.require("fs");
        fs.renameSync(path + '/' + oldname, path + '/' + newname);
    }
});
