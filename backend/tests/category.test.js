require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const app = require('../src/index');
const mongoose = require('mongoose');
const Category = require('../src/models/Category');

describe('Category API', () => {
  beforeAll(async () => {
    await Category.create({
      name: 'Test Category',
      parent: null,
    });
  });

  afterAll(async () => {
    await Category.deleteMany({});
    mongoose.disconnect();
    app.close();
  });

  it('should return all categories', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should create a new category', async () => {
    const response = await request(app)
      .post('/api/categories')
      .send({ name: 'New Category', parent: null });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe('New Category');
  });

  it('should update an existing category', async () => {
    const testCategory = await Category.findOne({ name: 'Test Category' });

    const response = await request(app)
      .put(`/api/categories/${testCategory._id}`)
      .send({ name: 'Updated Category' });

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(testCategory._id.toString());
    expect(response.body.name).toBe('Updated Category');
  });

  it('should delete an existing category', async () => {
    const testCategory = await Category.findOne({ name: 'Updated Category' });

    const response = await request(app).delete(`/api/categories/${testCategory._id}`);

    expect(response.status).toBe(200);

    // Ensure the category is deleted
    const deletedCategory = await Category.findById(testCategory._id);
    expect(deletedCategory).toBeNull();
  });
});