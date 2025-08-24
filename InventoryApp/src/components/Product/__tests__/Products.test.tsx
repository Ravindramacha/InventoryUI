// @ts-ignore
import { describe, it, expect, vi } from 'vitest';
import { render } from '../../../test/test-utils';
// @ts-ignore
import { screen, waitFor } from '@testing-library/react';
// @ts-ignore
import userEvent from '@testing-library/user-event';
import Products from '../Products';
// Import server but don't use it directly since we're mocking the hooks
// @ts-ignore
import { http, HttpResponse } from 'msw';

// Mock the React Query hooks
vi.mock('../../../api/ApiQueries', () => ({
  useProductTypes: vi.fn(() => ({
    data: [
      { productTypeId: 1, productTypeCode: 'RAW', productTypeDesc: 'Raw Material', isActive: true },
      { productTypeId: 2, productTypeCode: 'FG', productTypeDesc: 'Finished Goods', isActive: true },
    ],
    isLoading: false,
    isError: false,
    error: null,
  })),
  usePostProductType: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
  })),
}));

describe('Products Component', () => {
  it('renders product types table', async () => {
    render(<Products />);
    
    // Check that the table headers are rendered
    expect(screen.getByText(/product type code/i)).toBeInTheDocument();
    expect(screen.getByText(/product type description/i)).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    
    // Check that the product types are rendered
    expect(screen.getByText('RAW')).toBeInTheDocument();
    expect(screen.getByText('Raw Material')).toBeInTheDocument();
    expect(screen.getByText('FG')).toBeInTheDocument();
    expect(screen.getByText('Finished Goods')).toBeInTheDocument();
  });

  it('opens dialog when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<Products />);
    
    // Click the add button
    const addButton = screen.getByRole('button', { name: /add/i });
    await user.click(addButton);
    
    // Check that the dialog is opened
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/add product type/i)).toBeInTheDocument();
    
    // Check that the form fields are rendered
    expect(screen.getByLabelText(/product type code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product type description/i)).toBeInTheDocument();
  });

  it('submits new product type', async () => {
    // Mock the usePostProductType hook's mutate function
    const mockMutate = vi.fn();
    vi.mocked(vi.fn(() => ({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    }))).mockReturnValueOnce({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    
    const user = userEvent.setup();
    render(<Products />);
    
    // Open the dialog
    const addButton = screen.getByRole('button', { name: /add/i });
    await user.click(addButton);
    
    // Fill the form
    await user.type(screen.getByLabelText(/product type code/i), 'TEST');
    await user.type(screen.getByLabelText(/product type description/i), 'Test Product Type');
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);
    
    // Wait for the form submission and verify the mutate function was called
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          productTypeCode: 'TEST',
          productTypeDesc: 'Test Product Type',
        })
      );
    });
  });
});
