import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../service/product.service';
import { CartService } from '../../service/cart.service';
import { ProductImage } from '../../models/product.image';
import { environment } from '../../environments/environment';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiResponse } from '../../reponses/api.response';
import { CategoryService } from '../../service/category.service';
import { User } from '../../models/user';
import { CommentService } from '../../service/comment.service';
import { UserService } from '../../service/user.service';
import { UserResponse } from '../../reponses/user/user.response';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;

  newComment: string = '';
  comments: any[] = [];
  currentUser: any;

  constructor(
    private commentService: CommentService,
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    // Lấy productId từ URL
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    //const idParam = 9 //fake tạm 1 giá trị
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (apiResponse: ApiResponse) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          const response = apiResponse.data;
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.minioUrl}/${product_image.image_url}`;
            });
          }
          this.product = response;
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => { },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        },
      });
      this.currentUser = this.userService.getUserResponseFromLocalStorage();
      this.loadComments();
    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  getCurrentUser(): UserResponse | null {
    return this.userService.getUserResponseFromLocalStorage();
  }

  loadProductDetails() {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (apiResponse: ApiResponse) => {
        const response = apiResponse.data;
        if (response.product_images && response.product_images.length > 0) {
          response.product_images.forEach((product_image: ProductImage) => {
            product_image.image_url = `${environment.minioUrl}/${product_image.image_url}`;
          });
        }
        this.product = response;
        this.showImage(0);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      },
    });
  }

  loadComments() {
    this.commentService.getCommentsByProduct(this.productId).subscribe({
      next: (response) => {
        this.comments = response.data || [];
      },
      error: (err) => console.error('Error loading comments:', err)
    });
  }

  submitComment() {
    if (!this.newComment.trim() || !this.currentUser) return;

    this.commentService.addComment(
      this.productId,
      this.currentUser.id,
      this.newComment
    ).subscribe({
      next: (response) => {
        // Thêm comment mới vào đầu mảng comments
        this.comments.unshift({
          content: this.newComment,
          user_id: this.currentUser.id,
          user: {
            id: this.currentUser.id,
            fullname: this.currentUser.fullname
          },
          createdAt: new Date()
        });
        this.newComment = ''; // Xóa nội dung comment
      },
      error: (err) => console.error('Error submitting comment:', err)
    });
  }

  showImage(index: number): void {
    if (
      this.product &&
      this.product.product_images &&
      this.product.product_images.length > 0
    ) {
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

  addToCart(): void {
    this.isPressedAddToCart = true;
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');

    }
    this.router.navigate(['/cart']);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }

  buyNow(): void {
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }

  backToHome(): void {
    this.router.navigate(['/']);
  }
}
