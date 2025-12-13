import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationService } from '../organization.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
  selector: 'app-organization-form',
  templateUrl: './organization-form.html',
  styleUrls: ['./organization-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DynamicFormComponent]
})
export class OrganizationFormComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private organizationService = inject(OrganizationService);
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });
  data = signal<any>({});
  isViewMode = signal(false);

  constructor() {
    this.schemaService.getFormSchema('organizations').subscribe(schema => {
      this.schema.set(schema);
    });

    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      this.organizationService.getOrganizationById(id).subscribe(organization => {
        if (organization) {
          this.data.set(organization);
        }
      });
    }

    if (url.includes('view')) {
      this.isViewMode.set(true);
    }
  }

  onSave(formData: any) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.organizationService.updateOrganization({ ...formData, id }).subscribe(() => {
        this.router.navigate(['/organizations']);
      });
    } else {
      this.organizationService.addOrganization(formData).subscribe(() => {
        this.router.navigate(['/organizations']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/organizations']);
  }
}
