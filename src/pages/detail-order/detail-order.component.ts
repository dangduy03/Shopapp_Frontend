import { Component, inject, OnInit } from '@angular/core';
import { OrderResponse } from '../../reponses/order/order.response';
import { OrderService } from '../../service/order.service';
import { OrderDetail } from '../../models/order.detail';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../reponses/api.response';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss',
})
export class OrderDetailComponent implements OnInit {
  isLoading = true;
  errorMessage: string | null = null;
  orderId: number | null = null;
  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [], // Một mảng rỗng
  };
  private orderService = inject(OrderService);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
  ) { }

  ngOnInit(): void {
    this.getOrderDetails();
    this.loadOrderDetails();
  }

  getOrderDetails(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.orderService.getOrderById(orderId).subscribe({
      next: (apiResponse: ApiResponse) => {
        const response = apiResponse.data;
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address;
        this.orderResponse.note = response.note;
        this.orderResponse.order_date = response.order_date;
        this.orderResponse.order_details = response.order_details.map(
          (order_detail: any) => {
            return {
              product: {
                id: order_detail.product_id,
                name: order_detail.product_name,
                thumbnail: `${environment.minioUrl}/products/${order_detail.thumbnail}`,
                price: order_detail.price
              },
              number_of_products: order_detail.number_of_products,
              total_money: order_detail.total_money || order_detail.price * order_detail.number_of_products
            };
          }
        );
        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.shipping_date = new Date(
          response.shipping_date[0],
          response.shipping_date[1] - 1,
          response.shipping_date[2]
        );
        this.orderResponse.shipping_method = response.shipping_method;
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
        this.isLoading = false;
      },
      complete: () => { },
      error: (error: HttpErrorResponse) => {
        console.error('Error:', error);
        this.isLoading = false;
        this.errorMessage = 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.';
        if (error.status === 401) {
          this.errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          this.router.navigate(['/login']);
        }
      }
    });
  }

  private loadOrderDetails(): void {
    if (!this.orderId) return;

    this.isLoading = true;
    this.errorMessage = null;

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response) => this.getOrderDetails(),
      error: (error) => this.getOrderDetails()
    });
  }

  retryLoading(): void {
    this.loadOrderDetails();
  }

  backToHome(): void {
    // Thêm phương thức này để quay lại trang chủ
    this.router.navigate(['/']);
  }

          // this.orderResponse.order_details = response.order_details.map(
        //   (order_detail: OrderDetail) => {
        //     order_detail.product.thumbnail = `${environment.minioUrl}/${order_detail.product.thumbnail}`;

        //     return order_detail;
        //   }
        // );
}
