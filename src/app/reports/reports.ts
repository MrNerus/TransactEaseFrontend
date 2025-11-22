import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../services/schema.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DynamicFormComponent]
})
export class ReportsComponent {
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });

  constructor() {
    this.schemaService.getFormSchema('reports').subscribe(schema => {
      this.schema.set(schema);
    });
  }

  onGenerate(formData: any) {
    console.log('Generating report with data:', formData);
    alert('Report generation started! Check console for data.');
  }
}
