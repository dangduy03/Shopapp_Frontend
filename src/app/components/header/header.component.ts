import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';  
import { UserService } from '../../service/user.service';
import { TokenService } from '../../service/token.service';
import { UserResponse } from '../../reponses/user/user.response';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [    
    CommonModule,
    NgbModule,
    RouterModule
  ]
})
export class HeaderComponent implements OnInit{
  userResponse?:UserResponse  | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;

  constructor(
    private userService: UserService ,       
    private tokenService: TokenService,    
    private router: Router,
  ) {
    
   }
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();    
  }  

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //console.error(`Clicked on "${index}"`);
    if(index === 0) {
      
      this.router.navigate(['/user-profile']);                      
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();    
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item    
  }

  
  setActiveNavItem(index: number) {    
    this.activeNavItem = index;
    //console.error(this.activeNavItem);
  }  
}
