import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../organization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.html',
  styleUrls: ['./organization-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule]
})
export class OrganizationFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private organizationService = inject(OrganizationService);

  form = this.fb.group({
    id: [null as string | null],
    name: ['', Validators.required],
    parentId: [null as string | null]
  });

  isEditMode = signal(false);
  isViewMode = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      const organization = this.organizationService.getOrganizationById(id);
      if (organization) {
        this.form.patchValue(organization);
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
        this.organizationService.updateOrganization(this.form.value as any);
      } else {
        this.organizationService.addOrganization(this.form.value as any);
      }
      this.router.navigate(['/organizations']);
    }
  }

  onCancel() {
    this.form.reset();
    this.router.navigate(['/organizations']);
  }
}
