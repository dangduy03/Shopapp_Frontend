import { Component, OnInit, OnDestroy, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { UserResponse } from '../../reponses/user/user.response';
import { ProductService } from '../../service/product.service';
import { CategoryService } from '../../service/category.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { environment } from '../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../reponses/api.response';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../service/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, NgbModule, RouterModule, FormsModule],
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  // isPopoverOpen = false;
  activeNavItem: number = 0;
  cartItemCount: number = 0;
  cartTotal: number = 0;

  products: Product[] = [];
  categories: Category[] = []; // Dữ liệu động từ categoryService
  selectedCategoryId: number = 0; // Giá trị category được chọn
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  localStorage?: Storage;
  apiBaseUrl = environment.apiBaseUrl;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
    private destroyRef: DestroyRef
  ) { }
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.currentPage =
      Number(this.localStorage?.getItem('currentProductPage')) || 0;
    // this.getProducts(
    //   this.keyword,
    //   this.selectedCategoryId,
    //   this.currentPage,
    //   this.itemsPerPage
    // );
    // this.getCategories(0, 100);
    // this.updateCartInfo();
    // Theo dõi thay đổi giỏ hàng
    this.cartService.getCartUpdates().subscribe({
      next: () => {
        this.cartItemCount = this.cartService.getCartItemCount();
        this.cartTotal = this.cartService.getCartTotal();
      },
    });
  }


  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile']);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();
    }
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
    //console.error(this.activeNavItem);
  }

  // private updateCartInfo(): void {
  //   this.cartItemCount = this.cartService.getCartItemCount();
  //   this.cartTotal = this.cartService.getCartTotal();
  // }

  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      complete: () => { },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });
  }

  searchProducts() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    // this.getProducts(
    //   this.keyword,
    //   this.selectedCategoryId,
    //   this.currentPage,
    //   this.itemsPerPage
    // );
  }

  // getProducts(
  //   keyword: string,
  //   selectedCategoryId: number,
  //   page: number,
  //   limit: number
  // ) {
  //   this.productService
  //     .getProducts(keyword, selectedCategoryId, page, limit)
  //     .subscribe({
  //       next: (apiresponse: ApiResponse) => {
  //         console.log(apiresponse); // Kiểm tra toàn bộ phản hồi từ API

  //         const response = apiresponse.data;
  //         response.products.forEach((product: Product) => {
  //           // product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
  //           product.url = `${environment.minioUrl}/${product.thumbnail}`;
  //         });
  //         this.products = response.products;
  //         this.totalPages = response.totalPages;
  //         this.visiblePages = this.generateVisiblePageArray(
  //           this.currentPage,
  //           this.totalPages
  //         );
  //       },
  //       complete: () => {},
  //       error: (error: HttpErrorResponse) => {
  //         console.error(error?.error?.message ?? '');
  //       },
  //     });
  // }

  // onPageChange(page: number) {
  //   this.currentPage = page < 0 ? 0 : page;
  //   this.localStorage?.setItem('currentProductPage', String(this.currentPage));
  //   this.getProducts(
  //     this.keyword,
  //     this.selectedCategoryId,
  //     this.currentPage,
  //     this.itemsPerPage
  //   );
  // }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }

  // Hàm xử lý sự kiện khi sản phẩm được bấm vào
  onProductClick(productId: number) {
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/products', productId]);
  }
}
