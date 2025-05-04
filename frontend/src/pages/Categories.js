import React, { useState, useEffect } from 'react';
import API from '../api';
import { toast } from 'react-toastify';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';

const Categories = () => {
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/categories');
      setCategories(data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    try {
      const { data } = await API.post('/categories', { name: newCategory });
      setCategories([...categories, data]);
      setNewCategory('');
      toast.success(`Category "${newCategory}" added successfully!`);
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary">Categories</h2>
          <p className="text-muted">Manage your transaction categories</p>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <h5 className="mb-3">Add New Category</h5>
              <Form onSubmit={handleSubmit}>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    required
                  />
                  <Button type="submit" variant="primary" className="add-btn">
                    Add Category
                  </Button>
                </InputGroup>
              </Form>
            </Card.Body>
          </Card>

          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="mb-3">Your Categories</h5>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading categories...</span>
                  </div>
                </div>
              ) : categories.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {categories.map(category => (
                    <span key={category._id} className="category-tag">
                      <i className="fas fa-tag me-2"></i>
                      {category.name}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <i className="fas fa-folder-open"></i>
                  <p>No categories yet. Add your first category!</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Categories;