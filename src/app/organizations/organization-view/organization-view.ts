import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../organization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organization-view',
  templateUrl: './organization-view.html',
  styleUrls: ['./organization-view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule]
})
export class OrganizationViewComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private organizationService = inject(OrganizationService);

  form = this.fb.group({
    id: [null as string | null],
    name: ['', Validators.required],
    parentId: [null as string | null]
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const organization = this.organizationService.getOrganizationById(id);
      if (organization) {
        this.form.patchValue(organization);
      }
    }
    this.form.disable();
  }

  onCancel() {
    this.router.navigate(['/organizations']);
  }
}