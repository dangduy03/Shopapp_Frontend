import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../../models/product';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.service';
import { OrderService } from '../../service/order.service';
import { environment } from '../../environments/environment';
import { CommonModule, NgFor } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TokenService } from '../../service/token.service';
import { Order } from '../../models/order';
import { ApiResponse } from '../../reponses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { CouponService } from '../../service/coupon.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})

export class OrderComponent implements OnInit {
  private couponService = inject(CouponService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private tokenService = inject(TokenService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product; quantity: number }[] = [];
  totalAmount: number = 0; // Tổng tiền
  couponDiscount: number = 0; //số tiền được discount từ coupon
  couponApplied: boolean = false;
  cart: Map<number, number> = new Map();

  orderData: OrderDTO = {
    user_id: 0, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    status: 'pending',
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: [],
  };

  constructor() {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc
      email: ['', [Validators.required,Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod'],
    });
  }

  ngOnInit(): void {
    //this.cartService.clearCart();
    this.orderData.user_id = this.tokenService.getUserId();
    // Lấy danh sách sản phẩm từ giỏ hàng
    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng
    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    if (productIds.length === 0) {
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (apiResponse: ApiResponse) => {
        const products: Product[] = apiResponse.data
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.minioUrl}/${product.thumbnail}`;
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!,
          };
        });
        console.log('lỗi');
      },
      complete: () => {
        this.calculateTotal();
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });
  }

  // Khi bấm nút "Đặt hàng"
  placeOrder() {
    // debugger
    if (this.orderForm.errors == null) {
      // Gán giá trị từ form vào đối tượng orderData
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value,
      };
      this.orderData.cart_items = this.cartItems.map((cartItem) => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      this.orderData.total_money = this.totalAmount;
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: ApiResponse) => {
          console.error('Đặt hàng thành công');
          // Khi bấm nút "Đặt hàng"
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        complete: () => {
          this.calculateTotal();
        },
        error: (error: HttpErrorResponse) => {
          console.error(`Lỗi khi đặt hàng: ${error?.error?.message ?? ''}`);
        },
      });
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      console.error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal();
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      // Xóa sản phẩm khỏi danh sách cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tính toán lại tổng tiền
      this.calculateTotal();
    }
  }
  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
    const couponCode = this.orderForm.get('couponCode')!.value;
    if (!this.couponApplied && couponCode) {
      this.calculateTotal();
      this.couponService
        .calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (apiResponse: ApiResponse) => {
            this.totalAmount = apiResponse.data;
            this.couponApplied = true;
          },
        });
    }
  }
  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }

  updateQuantity(index: number, newQuantity: number) {
    if (newQuantity < 1) {
        this.cartItems[index].quantity = 1; // Không cho nhập số nhỏ hơn 1
    } else {
        this.cartItems[index].quantity = newQuantity;
    }
}

}
