// src/services/courseService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const courseService = {
  // Get all categories with sub-categories and courses
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get specific category details
  async getCategory(categoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`);
      if (!response.ok) throw new Error('Failed to fetch category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Get courses for a specific sub-category
  async getCoursesBySubCategory(subCategoryId) {
    try {
      const response = await fetch(`${API_BASE_URL}/sub-categories/${subCategoryId}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }
};