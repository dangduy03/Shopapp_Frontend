import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'product-list',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [],
  template: ` <div class="card" style="width: 18rem;"></div> `,
})
export class ProductItemComponent {
  @Input() imageUrl!: String;
  constructor() {}
}
