import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CashbackSchemeService } from '../cashback-scheme.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
  selector: 'app-cashback-scheme-form',
  templateUrl: './cashback-scheme-form.html',
  styleUrls: ['./cashback-scheme-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DynamicFormComponent]
})
export class CashbackSchemeFormComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cashbackSchemeService = inject(CashbackSchemeService);
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });
  data = signal<any>({});
  isViewMode = signal(false);

  constructor() {
    this.schemaService.getFormSchema('cashback-schemes').subscribe(schema => {
      this.schema.set(schema);
    });

    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      const scheme = this.cashbackSchemeService.getCashbackSchemeById(id);
      if (scheme) {
        this.data.set(scheme);
      }
    }

    if (url.includes('view')) {
      this.isViewMode.set(true);
    }
  }

  onSave(formData: any) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cashbackSchemeService.updateCashbackScheme({ ...formData, id });
    } else {
      this.cashbackSchemeService.addCashbackScheme(formData);
    }
    this.router.navigate(['/cashback-schemes']);
  }

  onCancel() {
    this.router.navigate(['/cashback-schemes']);
  }
}
