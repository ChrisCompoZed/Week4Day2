'use strict'

var express = require('express');
var router = express.Router();

var monk = require('monk')
var db = monk('localhost/products_and_categories_dev')
var products = db.get('products')

router.get('/', function(req, res) {
  products.find({}).then(function (results) {
    res.send(results)
    res.end()
  })
})

router.get('/:id', function(req,res){
  products.find({_id : req.params.id}).then(function(results){
    res.send(results)
    res.end()
  })
})

router.post('/', function(req,res){
  products.insert(req.body).then(function(savedData){
    res.send(savedData)
    res.end()
  })
})

router.post('/:id', function (req,res) {
  //products.update({id: req.params.id}, req.body).then( function (savedData) {
  products.insert(req.body).then(function(savedData){
    res.send(savedData)
    res.end()
  })
})

module.exports = router;
