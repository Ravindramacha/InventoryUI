// @ts-ignore
import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../test/test-utils';
// @ts-ignore
import { screen, waitFor } from '@testing-library/react';
// @ts-ignore
import userEvent from '@testing-library/user-event';
import SignIn from '../SignIn';
import { server } from '../../../test/setup';
// @ts-ignore
import { http, HttpResponse } from 'msw';

describe('SignIn Component', () => {
  it('renders sign in form correctly', () => {
    render(<SignIn />);
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays error message with invalid credentials', async () => {
    // Override default handler for failed login
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json(
          { message: 'Invalid credentials' },
          { status: 401 }
        );
      })
    );
    
    const user = userEvent.setup();
    render(<SignIn />);
    
    await user.type(screen.getByLabelText(/username/i), 'wronguser');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('navigates to home page with valid credentials', async () => {
    // Mock the navigate function
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async (importOriginal: any) => {
      const actual = await importOriginal();
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });
    
    // Override default handler for successful login
    server.use(
      http.post('/api/auth/login', () => {
        return HttpResponse.json({
          token: 'valid-token',
          user: {
            id: 1,
            username: 'admin',
            name: 'Administrator',
            roles: ['admin']
          }
        });
      })
    );
    
    const user = userEvent.setup();
    render(<SignIn />);
    
    await user.type(screen.getByLabelText(/username/i), 'admin');
    await user.type(screen.getByLabelText(/password/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
      expect(localStorage.getItem('token')).toBe('valid-token');
    });
  });
});
