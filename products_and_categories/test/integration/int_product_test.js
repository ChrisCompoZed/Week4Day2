'use strict'

var expect = require('chai').expect
var request = require('supertest')
var app = require('../../app.js')
var monk = require('monk')

var db = monk('localhost/products_and_categories_dev')
var products = db.get('products')

beforeEach( function() {
  return products.remove({})
})

describe('When doing a GET on the Products API with no database', function() {
  it('it should return a code 200', function(done) {
    request(app).get('/products')
    .expect(200)
    .expect(function(response){
      console.log(response.body)
      expect(response.body).to.eql([])
    }).end(done)
  })

  it('should return a single object when there is one object in the database', function(done){
    var testproduct1 = { name: 'boaty mc boatface', price: 10, category: 'new category', description: 'a product'}
    products.insert(testproduct1).then(function(savedData){
      request(app).get('/products')
      .expect( function(response) {
        expect(response.body[0].name).to.eql(savedData.name)
        expect(response.body[0]._id).to.equal(savedData._id.toString())
      }).end(done)
    })
  })

 it('should return the products corresponding to a specific _Id when calling a GET on that ID', function (done) {
   var testProductArr = [{ name: 'boaty mc boatface', price: 10, category: 'new category', description: 'a product'},
   { name: 'hooty mc owlface', price: 10, category: 'new category', description: 'woooo'}]
   products.insert(testProductArr).then(function(savedData){
     request(app).get('/products/' + savedData[1]._id)
     .expect(function (response) {
       expect(response.body.name).to.eql(savedData.name)
     }).end(done)
   })
 })

 it('should return 200 when POSTing to /products', function(done){
    request(app).post('/products')
    .expect(200).end(done)
  })

 it('it should add a new entry to the database when an item is POSTed to categories', function (done) {
    var testproduct3 = { name: 'boaty mc boatface', price: 10, category: 'new category', description: 'a product'}
    request(app).post('/products').send(testproduct3)
    .expect(function (response) {
      expect(response.body._id).to.exist
    }).end(done)
  })

  it('it should update an existing product', function(done){
    var testProduct = { name: 'boaty mc boatface', price: 10, category: 'new category', description: 'a product'}
    var testProduct2 = { name: 'boaty mc boatface2', price: 50, category: 'new category', description: 'a product'}
    products.insert(testProduct).then(function(savedData){
      request(app).post('/products/' + savedData._id).send(testProduct2)
      .expect(function (response) {
        console.log(response.body)
        expect(response.body.name).to.eql(testProduct2.name)
        expect(response.body.price).to.eql(testProduct2.price)
      }).end(done)
    })
  })

})
