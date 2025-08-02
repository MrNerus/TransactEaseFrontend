import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-cashback-scheme-form',
  templateUrl: './cashback-scheme-form.html',
  styleUrls: ['./cashback-scheme-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule]
})
export class CashbackSchemeFormComponent {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    isActive: [true, Validators.required]
  });

  onSubmit() {
    console.log(this.form.value);
  }
}
