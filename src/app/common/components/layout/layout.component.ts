import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../auth/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  // Use signal for sidebar state
  userService=inject(UserService)
  sidebarExpanded = signal(false);
  loggedInUser = this.userService.user;

  
  toggleSidebar(expand: boolean) {
    this.sidebarExpanded.set(expand);
  }
}
