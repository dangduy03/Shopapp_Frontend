import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'product-item',
  styleUrls: ['./product-item.component.scss'],
  standalone: true,
  imports: [],
  template: `
    <div class="card" style="width: 18rem;">
      <img
        [src]="imageUrl"
        class="card-img-top"
        style="background-position-x: 12px ;"
      />
      <div class="card-body">
        <h5 class="card-title text-truncate">{{ name }}</h5>
        <p class="card-text">
          {{ '$' + price }}
        </p>
      </div>
    </div>
  `,
})
export class ProductItemComponent {
  @Input() imageUrl!: String;
  @Input() name!: String;
  @Input() price!: String;
  constructor() {}
}
