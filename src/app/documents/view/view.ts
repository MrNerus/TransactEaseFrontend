import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-view-documents',
  templateUrl: './view.html',
  styleUrls: ['./view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewDocumentsComponent {}
