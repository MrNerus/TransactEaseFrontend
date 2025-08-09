import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

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
    role: ['', Validators.required],
    isActive: [true, Validators.required]
  });

  isEditMode = signal(false);
  isViewMode = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      const user = this.userService.getUserById(id);
      if (user) {
        this.form.patchValue(user);
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
      if (this.isEditMode()) {
        this.userService.updateUser(this.form.value as any);
      } else {
        this.userService.addUser(this.form.value as any);
      }
      this.router.navigate(['/users']);
    }
  }

  onCancel() {
    this.form.reset();
    this.router.navigate(['/users']);
  }
}