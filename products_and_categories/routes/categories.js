'use strict'

var express = require('express');
var router = express.Router();

var monk = require('monk')
var db = monk('localhost/products_and_categories_dev')
var categories = db.get('categories')

router.get('/', function(req, res) {
  categories.find({}).then(function (results) {
    res.send(results)
    res.end()
  })
})

router.get('/:id', function(req,res){
  categories.find({_id : req.params.id}).then(function(results){
    res.send(results)
    res.end()
  })
})

router.post('/', function(req,res){
  categories.insert(req.body).then(function(savedData){
    res.send(savedData)
    res.end()
  })
})

module.exports = router;
