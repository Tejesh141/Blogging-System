
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as blogPostService from '../api/blogPostService';
import BlogDetail from '../components/BlogDetail';
import BlogForm from '../components/BlogForm';
import BlogList from '../components/BlogList';
import "@testing-library/jest-dom";

jest.mock('../api/blogPostService');

// Utility for rendering BlogForm with routing
const renderWithRouter = (ui, routeProps = {}) =>
  render(
    <MemoryRouter initialEntries={routeProps.entries || ['/posts/new']}>
      <Routes>
        <Route path="/posts/new" element={ui} />
        <Route path="/posts/:id/edit" element={ui} />
        <Route path="/posts/:id" element={<BlogDetail />} />
      </Routes>
    </MemoryRouter>
  );

describe('Blog App Combined Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const post = {
    id: 1,
    title: 'Getting Started with Spring Boot',
    content: 'Spring Boot makes it easy...',
    author: 'John Doe',
    createdAt: '2023-05-15T10:30:00',
    updatedAt: '2023-05-15T10:30:00',
  };
  // State_
  // Form_
  // Axios_
  // ErrorHandling_
  // Routes_

  // BlogDetail Tests
  test('State_displays blog post details', async () => {
    blogPostService.getPostById.mockResolvedValue(post);
    renderWithRouter(<BlogDetail />, { entries: ['/posts/1'] });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText(post.title)).toBeInTheDocument();
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByText(/spring boot makes it easy/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to list/i })).toBeInTheDocument();
  });

  test('ErrorHandling_shows error if not found', async () => {
    blogPostService.getPostById.mockRejectedValue('Blog post not found');
    renderWithRouter(<BlogDetail />, { entries: ['/posts/2'] });
    expect(await screen.findByText(/blog post not found/i)).toBeInTheDocument();
  });

  test('Axios_delete confirmation and API call', async () => {
    blogPostService.getPostById.mockResolvedValue(post);
    blogPostService.deletePost.mockResolvedValue({ message: 'Blog post deleted successfully' });
    window.confirm = jest.fn(() => true);
    renderWithRouter(<BlogDetail />, { entries: ['/posts/1'] });
    await screen.findByText(post.title);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(blogPostService.deletePost).toHaveBeenCalledWith('1'));
    expect(await screen.findByText(/blog post deleted successfully/i)).toBeInTheDocument();
  });

  test('Axios_API error shown on delete', async () => {
    blogPostService.getPostById.mockResolvedValue(post);
    blogPostService.deletePost.mockRejectedValue('Delete API error!');
    window.confirm = jest.fn(() => true);
    renderWithRouter(<BlogDetail />, { entries: ['/posts/1'] });
    await screen.findByText(post.title);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(await screen.findByText(/delete api error/i)).toBeInTheDocument();
  });

  // BlogForm Tests
  test('State_renders in create mode and validates input', async () => {
    renderWithRouter(<BlogForm mode="create" />);
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: '' } });
    fireEvent.blur(screen.getByLabelText(/title/i));
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
  });

  test('State_renders in edit mode and populates fields', async () => {
    blogPostService.getPostById.mockResolvedValue({ title: 'Edit', content: 'C', author: 'A' });
    renderWithRouter(<BlogForm mode="edit" />, { entries: ['/posts/1/edit'] });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByDisplayValue('Edit')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A')).toBeInTheDocument();
  });

  test('Axios_creates post successfully', async () => {
    blogPostService.createPost.mockResolvedValue({ id: 2 });
    renderWithRouter(<BlogForm mode="create" />);
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'My Title' } });
    fireEvent.change(screen.getByTestId('content-input'), { target: { value: 'Content' } });
    fireEvent.change(screen.getByTestId('author-input'), { target: { value: 'Jane' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByText(/blog post created successfully/i)).toBeInTheDocument();
  });

  test('Axios_updates post successfully', async () => {
    blogPostService.getPostById.mockResolvedValue({ title: 'E', content: 'C', author: 'A' });
    blogPostService.updatePost.mockResolvedValue({});
    renderWithRouter(<BlogForm mode="edit" />, { entries: ['/posts/1/edit'] });
    await screen.findByDisplayValue('E');
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Updated T' } });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(await screen.findByText(/blog post updated successfully/i)).toBeInTheDocument();
  });

  test('Axios_handles API validation error', async () => {
    blogPostService.createPost.mockRejectedValue('Required fields missing');
    renderWithRouter(<BlogForm mode="create" />);
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'T' } });
    fireEvent.change(screen.getByTestId('content-input'), { target: { value: 'C' } });
    fireEvent.change(screen.getByTestId('author-input'), { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(await screen.findByText(/required fields missing/i)).toBeInTheDocument();
  });

  test('ErrorHandling_API error on update', async () => {
    blogPostService.getPostById.mockResolvedValue({ title: 'E', content: 'C', author: 'A' });
    blogPostService.updatePost.mockRejectedValue('API validation error on update');
    renderWithRouter(<BlogForm mode="edit" />, { entries: ['/posts/1/edit'] });
    await screen.findByDisplayValue('E');
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Bad Title' } });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(await screen.findByText(/api validation error on update/i)).toBeInTheDocument();
  });

  // BlogList Tests
  test('State_loads and displays posts', async () => {
    blogPostService.getAllPosts.mockResolvedValue([post]);
    render(<MemoryRouter><BlogList /></MemoryRouter>);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText('Getting Started with Spring Boot')).toBeInTheDocument();
    const createdAt = new Date(post.createdAt).toLocaleString();
    expect(screen.getByText(`By John Doe on ${createdAt}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create new post/i })).toBeInTheDocument();
  });

  test('ErrorHandling_handles API error', async () => {
    blogPostService.getAllPosts.mockRejectedValue('Fetch error');
    render(<MemoryRouter><BlogList /></MemoryRouter>);
    expect(await screen.findByText(/fetch error/i)).toBeInTheDocument();
  });

  test('State_shows empty state', async () => {
    blogPostService.getAllPosts.mockResolvedValue([]);
    render(<MemoryRouter><BlogList /></MemoryRouter>);
    expect(await screen.findByText(/no posts available/i)).toBeInTheDocument();
  });

  test('Axios_triggers delete on confirmation', async () => {
    window.confirm = jest.fn(() => true);
    blogPostService.getAllPosts.mockResolvedValue([post]);
    blogPostService.deletePost.mockResolvedValue({ message: 'Blog post deleted successfully' });
    render(<MemoryRouter><BlogList /></MemoryRouter>);
    await screen.findByText('Getting Started with Spring Boot');
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(blogPostService.deletePost).toHaveBeenCalledWith(1));
    expect(await screen.findByText(/blog post deleted successfully/i)).toBeInTheDocument();
  });

  test('ErrorHandling_API error displayed on delete', async () => {
    window.confirm = jest.fn(() => true);
    blogPostService.getAllPosts.mockResolvedValue([post]);
    blogPostService.deletePost.mockRejectedValue('Delete error occurred');
    render(<MemoryRouter><BlogList /></MemoryRouter>);
    await screen.findByText('Getting Started with Spring Boot');
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(await screen.findByText(/delete error occurred/i)).toBeInTheDocument();
  });
});
