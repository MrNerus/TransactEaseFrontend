import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StaffService } from '../staff.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
  selector: 'app-staff-form',
  templateUrl: './staff-form.html',
  styleUrls: ['./staff-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DynamicFormComponent]
})
export class StaffFormComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private staffService = inject(StaffService);
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });
  data = signal<any>({});
  isViewMode = signal(false);

  constructor() {
    this.schemaService.getFormSchema('staffs').subscribe(schema => {
      this.schema.set(schema);
    });

    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      this.staffService.getStaffById(id).subscribe(staff => {
        if (staff) {
          this.data.set(staff);
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
      this.staffService.updateStaff({ ...formData, id }).subscribe(() => {
        this.router.navigate(['/staffs']);
      });
    } else {
      this.staffService.addStaff(formData).subscribe(() => {
        this.router.navigate(['/staffs']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/staffs']);
  }
}