import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.html',
  styleUrls: ['./user-view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule]
})
export class UserViewComponent {
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

  isLocked = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const user = this.userService.getUserById(id);
      if (user) {
        this.form.patchValue(user);
      }
    }
    this.form.disable();
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}
