import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';

import { environment } from '../../../../../environments/environment';
import { ProductImage } from '../../../../models/product.image';
import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../../../service/product.service';
import { CategoryService } from '../../../../service/category.service';
import { ApiResponse } from '../../../../reponses/api.response';

@Component({
  selector: 'app-detail.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})

export class UpdateProductAdminComponent implements OnInit {
  productId: number;
  product: Product;
  updatedProduct: Product;
  categories: Category[] = []; // Dữ liệu động từ categoryService
  currentImageIndex: number = 0;
  images: File[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,    
    private location: Location,
  ) {
    this.productId = 0;
    this.product = {} as Product;
    this.updatedProduct = {} as Product;  
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.getProductDetails();
    });
    this.getCategories(1, 100);
  }
  
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        ;
        this.categories = apiResponse.data;
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

  getProductDetails(): void {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (apiResponse: ApiResponse) => {

        this.product = apiResponse.data;
        this.updatedProduct = { ...apiResponse.data };                
        this.updatedProduct.product_images.forEach((product_image:ProductImage) => {
          // product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
          product_image.image_url = `${environment.minioUrl}/${product_image.image_url}`;

        });
      },
      complete: () => {
        
      },
      error: (error: HttpErrorResponse) => {
        ;
        console.error(error?.error?.message ?? '');
      } 
    });     
  }

  updateProduct() {
    // Implement your update logic here
    const updateProductDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: this.updatedProduct.price,
      description: this.updatedProduct.description,
      category_id: this.updatedProduct.category_id
    };
    this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
      next: (apiResponse: ApiResponse) => {  
                
      },
      complete: () => {
        ;
        this.router.navigate(['/admin/products']);        
      },
      error: (error: HttpErrorResponse) => {
        ;
        console.error(error?.error?.message ?? '');
      } 
    });  
  }
   
  showImage(index: number): void {
    
    if (this.product && this.product.product_images && 
        this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ        
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }        
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }  

  nextImage(): void {
    
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    
    this.showImage(this.currentImageIndex - 1);
  } 

  onFileChange(event: any) {
    // Retrieve selected files from input element
    const files = event.target.files;
    // Limit the number of selected files to 5
    if (files.length > 5) {
      console.error('Please select a maximum of 5 images.');
      return;
    }
    // Store the selected files in the newProduct object
    this.images = files;
    this.productService.uploadImages(this.productId, this.images).subscribe({
      next: (apiResponse: ApiResponse) => {
        
        // Handle the uploaded images response if needed              
        console.log('Images uploaded successfully:', apiResponse);
        this.images = [];       
        // Reload product details to reflect the new images
        this.getProductDetails(); 
      },
      error: (error: HttpErrorResponse) => {
        ;
        console.error(error?.error?.message ?? '');
      } 
    })
  }
  
  deleteImage(productImage: ProductImage) {
    if (confirm('Are you sure you want to remove this image?')) {
      // Call the removeImage() method to remove the image   
      this.productService.deleteProductImage(productImage.id).subscribe({
        next:(productImage: ProductImage) => {
          location.reload();          
        },        
        error: (error: HttpErrorResponse) => {
          ;
          console.error(error?.error?.message ?? '');
        } 
      });
    }   
  }
}
