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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, ProductItemComponent],
})
export class HomeComponent implements OnInit {
  categories!: Category[];
  localStorage?: Storage;
  products?: any[];
  newerProducts?: any[];
  lastProducts?: any[];
  randomProducts?: any[];
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
    this.getProducts(undefined, undefined, undefined, 8);
    this.getProductsForHomePage();
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
          response.products.forEach((product: Product) => {});
          this.products = response.products;
        },
        complete: () => {},
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
      complete: () => {},
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });
  }
}
