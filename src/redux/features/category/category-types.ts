export interface Category {
    categoryId: number;
    categoryName: string;
  }

  export interface CreateCategoryDto {
    categoryName: string;
  }

  export interface UpdateCategoryDto {
    categoryName?: string;
  }
