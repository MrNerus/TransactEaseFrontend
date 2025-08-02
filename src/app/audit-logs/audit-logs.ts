import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';

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
  imports: [DatePipe]
})
export class AuditLogsComponent {
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
}
