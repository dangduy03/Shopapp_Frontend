import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../../reponses/api.response';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports:
  [
    CommonModule

  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  cartItems: { product: Product; quantity: number }[] = [];
  totalAmount: number = 0;
  isLoading: boolean = true;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());

    if (productIds.length === 0) {
      this.isLoading = false;
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (apiResponse: ApiResponse) => {
        const products: Product[] = apiResponse.data;
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.minioUrl}/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: cart.get(productId)!,
          };
        });
        this.calculateTotal();
      },
      complete: () => {
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart items:', error);
        this.isLoading = false;
      }
    });
  }

  increaseQuantity(productId: number): void {
    this.cartService.addToCart(productId, 1);
    this.updateCartItemQuantity(productId, 1);
  }

  decreaseQuantity(productId: number): void {
    const currentQuantity = this.getProductQuantity(productId);
    if (currentQuantity > 1) {
      this.cartService.addToCart(productId, -1);
      this.updateCartItemQuantity(productId, -1);
    }
  }

  removeItem(productId: number): void {
    if (confirm('Are you sure you want to remove this item from your cart?')) {
      this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
      this.cartService.getCart().delete(productId);
      this.cartService.saveCartToLocalStorage();
      this.calculateTotal();
    }
  }

  private updateCartItemQuantity(productId: number, change: number): void {
    const item = this.cartItems.find(item => item.product.id === productId);
    if (item) {
      item.quantity += change;
      this.calculateTotal();
    }
  }

  private getProductQuantity(productId: number): number {
    const item = this.cartItems.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  proceedToCheckout(): void {
    this.router.navigate(['/orders']);
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }
}
