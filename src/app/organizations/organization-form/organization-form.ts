import { ChangeDetectionStrategy, Component, inject, input, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../organization.service';
import { Organization } from '../organization.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.html',
  styleUrls: ['./organization-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class OrganizationFormComponent implements OnInit {
  organizationId = input<string | undefined>(undefined);
  formSubmitted = output<void>();

  private organizationService = inject(OrganizationService);
  private router = inject(Router);

  organizationName: string = '';
  parentOrganizationId: string | undefined = undefined;

  ngOnInit(): void {
    if (this.organizationId()) {
      const org = this.organizationService.getOrganizationById(this.organizationId()!);
      if (org) {
        this.organizationName = org.name;
        this.parentOrganizationId = org.parentId;
      }
    }
  }

  onSubmit(): void {
    if (this.organizationId()) {
      // Edit existing organization
      const updatedOrg: Organization = {
        id: this.organizationId()!,
        name: this.organizationName,
        parentId: this.parentOrganizationId,
        createdAt: this.organizationService.getOrganizationById(this.organizationId()!)?.createdAt || new Date().toISOString(),
      };
      this.organizationService.updateOrganization(updatedOrg);
    } else {
      // Add new organization
      this.organizationService.addOrganization({
        name: this.organizationName,
        parentId: this.parentOrganizationId,
      });
    }
    this.router.navigate(['/organizations']);
  }

  onCancel(): void {
    this.router.navigate(['/organizations']);
  }
}
