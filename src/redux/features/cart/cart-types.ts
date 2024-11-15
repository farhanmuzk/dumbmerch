export interface ProductMedia {
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO' | 'GIF';
}

export interface CartItem {
    cartId: number;
    cartItemId: number;
    productId: number;
    quantity: number;
    userId: number;
    product: {
        productName: string;
        productPrice: number;
        productDescription: string;
        productMedia?: ProductMedia[];
    };
}

export interface CartState {
    cartId: number | null;
    cart: {
        cartItems: CartItem[];
    };
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}
