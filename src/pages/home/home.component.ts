import { Component, OnInit, Inject, signal } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { TokenService } from '../../service/token.service';
import { ApiResponse } from '../../reponses/api.response';
import { ProductItemComponent } from '../../components/home/product-item/product-item.component';
// import { BaseComponent } from '../../app/components/base/base.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ProductItemComponent],
})
// export class HomeComponent extends BaseComponent implements OnInit {
export class HomeComponent implements OnInit {
  categories!: Category[];
  localStorage?: Storage;
  products?: any[];
  newerProducts?: any[];
  lastProducts?: any[];
  randomProducts?: any[];
  apiBaseUrl = environment.apiBaseUrl;

  currentPage: number = 0;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  selectedCategoryId: number = 0; // Giá trị category được chọn
  activeNavItem: number = 0;
  cartItemCount: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private tokenService: TokenService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // super();
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit() {
    this.getProducts(undefined, undefined, undefined, 8);
    this.getProductsForHomePage();
    // this.updateCartCount();
  }

  getProducts(
    keyword?: string,
    selectedCategoryId?: number,
    page?: number,
    limit?: number
  ) {
    this.productService
      .getProducts(keyword, selectedCategoryId, page, limit)
      .subscribe({
        next: (apiresponse: ApiResponse) => {
          const response = apiresponse.data;
          response.products.forEach((product: Product) => { });
          this.products = response.products;
        },
        complete: () => { },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        },
      });
  }

  getProductsForHomePage() {
    this.productService.getProductsForHomePage().subscribe({
      next: (apiresponse: ApiResponse) => {
        const response = apiresponse.data;
        this.newerProducts = response[0].slice(0, -1);
        this.lastProducts = response[1].slice(0, -1);
        this.randomProducts = response[2].slice(0, -1);
      },
      complete: () => { },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });
  }


  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  onProductClick(productId: number) {
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]);
  }

  onPageChange(page: number) {
    this.currentPage = page < 0 ? 0 : page;
    this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    this.router.navigate(['/home'], { queryParams: { page: this.currentPage } });
  }

  // Thêm hàm trackPage để sử dụng trong *ngFor
  trackPage(index: number, item: number): number {
    return item;
  }

  // setActiveNavItem(index: number) {
  //   this.activeNavItem = index;
  //   //console.error(this.activeNavItem);
  // }

  // Hàm cập nhật số lượng sản phẩm trong giỏ hàng
  // updateCartCount() {
    // Giả sử giỏ hàng lưu trong localStorage hoặc service
  //   const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  //   this.cartItemCount = cart.length;
  // }

//   addToCart(product: any) {
//     let cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     cart.push(product);
//     localStorage.setItem('cart', JSON.stringify(cart));
//     this.updateCartCount();
// }


}
