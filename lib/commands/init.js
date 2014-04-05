/*
	Init.js
*/

var
	FS 		= require('q-io/fs'),
	Q 			= require('q')
	;

var template = JSON.stringify({"state" : [],"results" : []}, null, "\t")

var Init = function(args){

		return FS.makeDirectory('./photon')
		.then(function(data){
			return FS.write('./photon.json', template)
		}, function(err){
			throw new Error()
		})
		.then(function(){
			console.log('Initialized new photon repository.')
		})
		.fail(function(err){
			console.log("Repository already exists.")
		})
};

module.exports = Init;