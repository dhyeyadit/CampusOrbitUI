import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user/user.model';
import { UserService } from '../../../auth/user.service';
import { Module } from '../../../models/common/module.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  // Use signal for sidebar state
  userService = inject(UserService)
  sidebarExpanded = signal(false);
  loggedInUser = this.userService.user;
  sidebarData = this.userService.sidebar;
  activeModuleId = signal<string | null>(null);



  ngOnInit() {
    console.log(this.sidebarData());

  }
  toggleSidebar(expand: boolean) {
    this.sidebarExpanded.set(expand);
  }

  toggleModule(moduleId: string) {
    this.activeModuleId.update(current => current === moduleId ? null : moduleId);
  }
}
