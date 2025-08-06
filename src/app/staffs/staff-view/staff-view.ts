import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../staff.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-view',
  templateUrl: './staff-view.html',
  styleUrls: ['./staff-view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule]
})
export class StaffViewComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private staffService = inject(StaffService);

  isEditMode = signal(false);
  isLocked = signal(false);

  form = this.fb.group({
    id: [null as string | null],
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    organizationId: ['', Validators.required],
    role: ['', Validators.required],
    isActive: [true, Validators.required]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const staff = this.staffService.getStaffById(id);
      if (staff) {
        this.form.patchValue(staff);
      }
    }
    this.form.disable();
  }

  onCancel() {
    this.router.navigate(['/staffs']);
  }
}