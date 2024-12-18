import { Component, OnInit, Inject } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { TokenService } from '../../service/token.service';
import { ApiResponse } from '../../reponses/api.response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule
  ]
})

export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number  = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  visiblePages: number[] = [];
  keyword:string = "";
  localStorage?:Storage;
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,    
    private router: Router,
    private tokenService: TokenService,

    @Inject(DOCUMENT) private document: Document
    ) {
      this.localStorage = document.defaultView?.localStorage;
    }

    ngOnInit() {
      this.currentPage = Number(this.localStorage?.getItem('currentProductPage')) || 0; 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      this.getCategories(0, 100);
    }
    
    getCategories(page: number, limit: number) {
      this.categoryService.getCategories(page, limit).subscribe({
        next: (apiResponse: ApiResponse) => {  
          this.categories = apiResponse.data;
        },
        complete: () => {         
        },
        error: (error: HttpErrorResponse) => {          
          console.error(error?.error?.message ?? '');
        } 
      });
    }
    
    searchProducts() {
      this.currentPage = 0;
      this.itemsPerPage = 12     
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {

      this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
        next: (apiresponse: ApiResponse) => {
          console.log(apiresponse);  // Kiểm tra toàn bộ phản hồi từ API

          const response = apiresponse.data;
          response.products.forEach((product: Product) => {          
            // product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            product.url = `${environment.minioUrl}/${product.thumbnail}`;
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        }
      });    
    }

  //   getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
  //     this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
  //       next: (apiresponse: ApiResponse) => {
  //         console.log(apiresponse);  // Kiểm tra toàn bộ phản hồi từ API
  //         const response = apiresponse?.data;
   
  //         // Kiểm tra nếu response và products không undefined
  //         if (response && response.products) {
  //           response.products.forEach((product: Product) => {          
  //             product.url = `${environment.minioUrl}/${product.thumbnail}`;
  //           });
  //           this.products = response.products;
  //           this.totalPages = response.totalPages;
  //           this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  //         } else {
  //           console.error('API không trả về data hoặc products');
  //           // console.log(apiresponse);  // In ra phản hồi API để kiểm tra
  //         }
  //       },
  //       complete: () => {},
  //       error: (error: HttpErrorResponse) => {
  //         console.error('Lỗi xảy ra khi gọi API:', error?.error?.message ?? error.message);
  //       }
  //     });
  //  }

  // getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
  //   this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
  //     next: (apiresponse: ApiResponse) => {
  //       const response = apiresponse?.data;
    
  //       if (response && response.products && Array.isArray(response.products)) {
  //         response.products.forEach((product: Product) => {
  //           product.url = `${environment.minioUrl}/${product.thumbnail}`;
  //         });
  //         this.products = response.products;
  //         this.totalPages = response.totalPages;
  //         this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
  //       } else {
  //         // Xử lý khi không có products
  //         console.warn('No products found in the response.');
  //         this.products = []; // Gán giá trị mặc định để tránh lỗi
  //         this.totalPages = 0;
  //       }
  //     },
  //     error: (error: HttpErrorResponse) => {
  //       console.error('Error fetching products:', error?.message ?? '');
  //       // Xử lý lỗi khi không thể kết nối API hoặc API gặp lỗi
  //     }
  //   });
    
  // }
  
   
    
    onPageChange(page: number) {
      
      this.currentPage = page < 0 ? 0 : page;
      this.localStorage?.setItem('currentProductPage', String(this.currentPage)); 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    
    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
      const maxVisiblePages = 5;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
      let startPage = Math.max(currentPage - halfVisiblePages, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
    
      return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
    }
    
    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    onProductClick(productId: number) {
      ;
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/products', productId]);
    }
}
