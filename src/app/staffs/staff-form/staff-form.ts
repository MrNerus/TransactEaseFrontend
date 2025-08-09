import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../staff.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.html',
  styleUrls: ['./staff-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule]
})
export class StaffFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private staffService = inject(StaffService);

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
      const staff = this.staffService.getStaffById(id);
      if (staff) {
        this.form.patchValue(staff);
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
        this.staffService.updateStaff(this.form.value as any);
      } else {
        this.staffService.addStaff(this.form.value as any);
      }
      this.router.navigate(['/staffs']);
    }
  }

  onCancel() {
    this.form.reset();
    this.router.navigate(['/staffs']);
  }
}