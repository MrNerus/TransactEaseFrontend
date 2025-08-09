import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { ROLES } from '../../services/permission.config';
import { Role } from '../user.interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  form = this.fb.group({
    id: [null as string | null],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    organizationId: ['', Validators.required],
    role: [null as Role | null, Validators.required],
    isActive: [true, Validators.required]
  });

  roles = ROLES;
  isEditMode = signal(false);
  isViewMode = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      const user = this.userService.getUserById(id);
      if (user) {
        this.form.patchValue({
          ...user,
          role: user.role
        });
      }
    }

    if (url.includes('view')) {
      this.isViewMode.set(true);
      this.form.disable();
    } else if (url.includes('edit')) {
      this.isEditMode.set(true);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedRole = ROLES.find(r => r.name === (formValue.role as any).name);

      const userPayload = {
        ...formValue,
        role: selectedRole
      };

      if (this.isEditMode()) {
        this.userService.updateUser(userPayload as any);
      } else {
        this.userService.addUser(userPayload as any);
      }
      this.router.navigate(['/users']);
    }
  }

  onCancel() {
    this.form.reset();
    this.router.navigate(['/users']);
  }

  compareRoles(r1: Role, r2: Role): boolean {
    return r1 && r2 ? r1.name === r2.name : r1 === r2;
  }
}