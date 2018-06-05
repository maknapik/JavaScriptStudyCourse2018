const supertest = require("supertest");
const express = require('express');
const should = require('should');
// This agent refers to PORT where program is runninng.
var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe('GET /', function() {
    it('respond with html', function(done) {
    server
    .get('/')
    .expect('Content-Type', /html/)
    .expect(200, done);
    });
});

var adress = '/add/';
for(var i=1;i<10;i++){
	adress = '/add/' + i.toString() +'/' + (10-i).toString();
	resp = i.toString()+' + '+(10-i).toString()+' = 10';
	describe('GET '+adress, function() {
		  it('respond with html', function(done) {
			 server
			 .get(adress)
			 .expect('Content-Type', /html/)
			 .expect(200, done)
			 .expect(function(res){
				if (!res.text.includes(resp)) throw new Error("Wrong answer")
             })
		  });
	});
}