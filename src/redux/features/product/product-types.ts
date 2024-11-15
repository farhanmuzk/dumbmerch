// src/features/product/productTypes.ts
export interface ProductMedia {
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'GIF';
  }

  export interface Product {
    productId?: number;
    productName: string;
    productDescription?: string;
    productPrice: number;
    productStock: number;
    productCategoryId: number;
    productMedia?: ProductMedia[];
  }
