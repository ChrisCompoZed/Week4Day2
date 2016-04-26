'use strict'

var expect = require('chai').expect
var request = require('supertest')
var app = require('../../app.js')
var monk = require('monk')

var db = monk('localhost/products_and_categories_dev')
var categories = db.get('categories')

beforeEach( function() {
  return categories.remove({})
})

describe('When doing a GET on the Categories API with no database', function() {

  it('should return a code 200', function (done) {
      request(app).get('/categories')
      .expect(200)
      .expect(function(response){
        console.log(response.body)
        expect(response.body).to.eql([])
      }).end(done)
  })

  it('should return a single object when there is one object in the database', function(done){
    var testCategory1 = { name: 'Test Category'}
    categories.insert(testCategory1).then(function(savedData){
      request(app).get('/categories')
      .expect( function(response) {
        expect(response.body[0].name).to.eql(savedData.name)
        expect(response.body[0]._id).to.equal(savedData._id.toString())
      }).end(done)
    })
  })

 it('should return the category corresponding to a specific _Id when calling a GET on that ID', function (done) {
   var testCategoryArr = [{ name: 'Test Category'}, { name: 'Test Category2'}]
   categories.insert(testCategoryArr).then(function(savedData){
     request(app).get('/categories/' + savedData[1]._id)
     .expect(function (response) {
       expect(response.body.name).to.eql(savedData.name)
     }).end(done)
   })
 })

 it('should return 200 when POSTing to /categories', function(done){
    request(app).post('/categories')
    .expect(200).end(done)
  })

 it('it should add a new entry to the database when an item is POSTed to categories', function (done) {
    var testCategory3 = { name: 'Test Category3' }
    request(app).post('/categories').send(testCategory3)
    .expect(function (response) {
      expect(response.body._id).to.exist
    }).end(done)
  })

 })
