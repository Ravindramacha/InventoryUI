export interface CategoryModel {
  categoryId: number;
  categoryName: string;
  categoryCode: string;
}

// Mock data for categories to be used in forms
export const mockCategories: CategoryModel[] = [
  { categoryId: 1, categoryName: 'Electronics', categoryCode: 'ELEC' },
  { categoryId: 2, categoryName: 'Furniture', categoryCode: 'FURN' },
  { categoryId: 3, categoryName: 'Office Supplies', categoryCode: 'OFSP' },
  { categoryId: 4, categoryName: 'Kitchen', categoryCode: 'KTCH' },
  { categoryId: 5, categoryName: 'Clothing', categoryCode: 'CLTH' },
  { categoryId: 6, categoryName: 'Automotive', categoryCode: 'AUTO' },
  { categoryId: 7, categoryName: 'Sports', categoryCode: 'SPRT' },
  { categoryId: 8, categoryName: 'Books', categoryCode: 'BOOK' },
  { categoryId: 9, categoryName: 'Toys', categoryCode: 'TOYS' },
  { categoryId: 10, categoryName: 'Others', categoryCode: 'OTHR' }
];
