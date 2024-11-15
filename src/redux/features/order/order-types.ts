// order-types.ts
import { z } from "zod";
import { UserProfile } from "../user/user-types";
// Define Zod schemas for order validation
export const OrderProductSchema = z.object({
  productId: z.number(),
  quantity: z.number().min(1),
});

export const OrderDataSchema = z.object({
  cartId: z.number(),
  products: z.array(OrderProductSchema),
});

export type OrderProduct = z.infer<typeof OrderProductSchema>;
export type OrderData = z.infer<typeof OrderDataSchema>;

export interface Transaction {
    orderId: number;
    userId: number;
    user : {
        name: string;
    };
    cartId: number;
    totalAmount: number;
    paymentUrl: string;
    createdAt: string;
    status: string;
    // Add other properties as needed
  }
export interface OrderResponse {
  orderId: number;
  order : {
    orderId: number;
    userId: number;
    cartId: number;
    totalAmount: number;
    paymentUrl: string;
    createdAt: string;
    status: string;
  }
  userId: number;
  cartId: number;
  totalAmount: number;
  paymentUrl: string;
  createdAt: string;
  status: string;
}
