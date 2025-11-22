import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../transaction.service';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';
import { PermissionService } from '../../services/permission.service';
import { Permission } from '../../users/user.interface';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DynamicFormComponent]
})
export class TransactionFormComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private transactionService = inject(TransactionService);
  private schemaService = inject(SchemaService);
  private permissionService = inject(PermissionService);

  schema = signal<FormSchema>({ fields: [] });
  data = signal<any>({});
  permission = signal<Permission>(Permission.allowInteraction);
  isViewMode = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    this.schemaService.getFormSchema('transactions').subscribe(schema => {
      this.schema.set(schema);
    });

    if (url.includes('view')) {
      this.isViewMode.set(true);
    }

    if (id) {
      const transaction = this.transactionService.getTransactionById(id);
      if (transaction) {
        this.data.set(transaction);
      }
    }

    this.permission.set(this.permissionService.getPermission('transaction_view'));
  }

  onSave(formData: any) {
    this.router.navigate(['/transactions']);
  }

  onCancel() {
    this.router.navigate(['/transactions']);
  }
}
