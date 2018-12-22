"use strict";

const request = require('supertest');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = require('../app');
const database = require('../config/database');
const Meme = require('../models/memeModel');

describe('Test Mongoose database connection', () => {
  test('Test connection', () => {
    return mongoose.connect(database.URL).then(() => {
      expect(mongoose.connection.readyState).toBe(1);
    });
  });
});

describe('Test routers', () => {
  test('GET request for list of all items', () => {
    return request(app).get('/meme/list').set('Accept', 'application/json')
    .then((response) => {
      expect(response.statusCode).toBe(200);
      });
  });
  
  let new_id = '';
  
  test('Insert test meme', () => {
    const meme = new Meme({
		name: 'Meme',
		width: 480,
		height: 480,
		background_color: 'black',
		image_url: 'url',
		image_width: 100,
		image_height: 200,
		image_x: 10,
		image_y: 20,
		font_size: 30,
		font_color: 'white',
		text_x: 100,
		text_y: 200,
		caption: 'Test'
	});
    
    return meme.save()
      .then((insert) => {
        new_id = insert._id;
      }, (err) => {
        throw new Error('Insert error: ' + err);
      });
  });
  
  test('GET request for test meme', () => {
    return request(app).get('/meme/' + new_id + '/json').set('Accept', 'application/json')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe('Meme');
	  });
  });
  
  test('Delete test meme', () => {
    return Meme.deleteOne({_id: new_id})
      .then(() => {
      }, (err) => {
        throw new Error('Delete error: ' + err);
      });
  });
});
