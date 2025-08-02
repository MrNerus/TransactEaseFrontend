import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

interface Report {
  id: string;
  name: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {
  reports = signal<Report[]>([
    {
      id: 'report_1',
      name: 'Transaction Report',
    },
    {
      id: 'report_2',
      name: 'Cashback Report',
    },
    {
      id: 'report_3',
      name: 'User Activity Report',
    },
  ]);
}
