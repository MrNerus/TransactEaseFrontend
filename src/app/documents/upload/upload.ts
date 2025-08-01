import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload.html',
  styleUrls: ['./upload.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadDocumentComponent {}
