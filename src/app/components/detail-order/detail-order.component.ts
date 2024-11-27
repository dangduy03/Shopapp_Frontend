import { Component, OnInit } from '@angular/core';
import { OrderResponse } from '../../reponses/order/order.response';
import { OrderService } from '../../service/order.service';
import { OrderDetail } from '../../models/order.detail';
import { environment } from '../../../environments/environment';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

import { CommonModule} from '@angular/common';
import { ActivatedRoute} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../reponses/api.response';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
  ],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss'
})

export class OrderDetailComponent implements OnInit {  
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
    order_details: [] // Một mảng rỗng
  };  
  
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }
  
  getOrderDetails(): void {
    
    const orderId = Number(this.route.snapshot.paramMap.get('orderId'));
    this.orderService.getOrderById(orderId).subscribe({
      next: (apiResponse: ApiResponse) => {        
        ;   
        const response = apiResponse.data    
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address; 
        this.orderResponse.note = response.note;
        this.orderResponse.order_date = new Date(
          response.order_date[0], 
          response.order_date[1] - 1, 
          response.order_date[2]
        );        
        
        this.orderResponse.order_details = response.order_details
          .map((order_detail: OrderDetail) => {
          // order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
          order_detail.product.thumbnail = `${environment.minioUrl}/${order_detail.product.thumbnail}`;

          return order_detail;
        });        
        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.shipping_date = new Date(
          response.shipping_date[0], 
          response.shipping_date[1] - 1, 
          response.shipping_date[2]
        );
        
        this.orderResponse.shipping_method = response.shipping_method;
        
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
      },
      complete: () => {
        ;        
      },
      error: (error: HttpErrorResponse) => {
        ;
        console.error(error?.error?.message ?? '');
      } 
    });
  }
}
