import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, Controls, PageChange, SearchChange } from '../data-table/data-table';
import { SchemaService } from '../services/schema.service';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: string;
}

@Component({
  selector: 'app-audit-logs',
  templateUrl: './audit-logs.html',
  styleUrls: ['./audit-logs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DataTableComponent]
})
export class AuditLogsComponent {
  private schemaService = inject(SchemaService);

  auditLogs = signal<AuditLog[]>([
    {
      id: 'log_1',
      timestamp: new Date(),
      user: 'admin',
      action: 'Created a new cashback scheme',
      details: 'Scheme Name: Premium Cashback',
    },
    {
      id: 'log_2',
      timestamp: new Date(),
      user: 'admin',
      action: 'Deactivated a cashback scheme',
      details: 'Scheme Name: Standard Cashback',
    },
    {
      id: 'log_3',
      timestamp: new Date(),
      user: 'user123',
      action: 'Uploaded a new document',
      details: 'Document Name: invoice.pdf',
    },
  ]);

  controls = signal<Controls>({ columns: [], searchableFields: [] });
  totalItems = signal(3); // Mock total items
  pageSize = signal(10);

  constructor() {
    this.schemaService.getTableSchema('audit-logs').subscribe(schema => {
      this.controls.set(schema);
    });
  }

  onPageChange(event: PageChange) {
    // Handle page change
  }

  onSearchChange(event: SearchChange) {
    // Handle search change
  }
}
