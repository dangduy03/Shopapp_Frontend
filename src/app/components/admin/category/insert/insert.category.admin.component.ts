import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { InsertCategoryDTO } from '../../../../dtos/category/insert.category.dto';
import { Category } from '../../../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../../../service/category.service';
import { ProductService } from '../../../../service/product.service';

@Component({
  selector: 'app-insert.category.admin',
  templateUrl: './insert.category.admin.component.html',
  styleUrls: ['./insert.category.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,    
  ]
})
export class InsertCategoryAdminComponent implements OnInit {
  insertCategoryDTO: InsertCategoryDTO = {
    name: '',    
  };
  categories: Category[] = []; // Dữ liệu động từ categoryService
  constructor(    
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,    
    private productService: ProductService,    
  ) {
    
  } 
  ngOnInit() {
    
  }   

  insertCategory() {    
    this.categoryService.insertCategory(this.insertCategoryDTO).subscribe({
      next: (response) => {
        
        this.router.navigate(['/admin/categories']);        
      },
      error: (error: HttpErrorResponse) => {
        ;
        console.error(error?.error?.message ?? '');
      }        
    });    
  }
}