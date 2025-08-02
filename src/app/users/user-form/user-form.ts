import { ChangeDetectionStrategy, Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class UserFormComponent implements OnInit {
  userId = input<string | undefined>(undefined);

  private userService = inject(UserService);
  private router = inject(Router);

  fullName: string = '';
  email: string = '';
  organizationId: string = '';
  role: 'Admin' | 'Manager' | 'Operator' | 'Customer' = 'Customer';
  isActive: boolean = true;

  ngOnInit(): void {
    if (this.userId()) {
      const user = this.userService.getUserById(this.userId()!);
      if (user) {
        this.fullName = user.fullName;
        this.email = user.email;
        this.organizationId = user.organizationId;
        this.role = user.role;
        this.isActive = user.isActive;
      }
    }
  }

  onSubmit(): void {
    if (this.userId()) {
      // Edit existing user
      const updatedUser: User = {
        id: this.userId()!,
        fullName: this.fullName,
        email: this.email,
        organizationId: this.organizationId,
        role: this.role,
        isActive: this.isActive,
        createdAt: this.userService.getUserById(this.userId()!)?.createdAt || new Date().toISOString(),
      };
      this.userService.updateUser(updatedUser);
    } else {
      // Add new user
      this.userService.addUser({
        fullName: this.fullName,
        email: this.email,
        organizationId: this.organizationId,
        role: this.role,
        isActive: this.isActive,
      });
    }
    this.router.navigate(['/users']);
  }

  onCancel(): void {
    this.router.navigate(['/users']);
  }
}