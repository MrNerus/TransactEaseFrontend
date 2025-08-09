import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CashbackSchemeService } from '../cashback-scheme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cashback-scheme-form',
  templateUrl: './cashback-scheme-form.html',
  styleUrls: ['./cashback-scheme-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class CashbackSchemeFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cashbackSchemeService = inject(CashbackSchemeService);

  form = this.fb.group({
    id: [null as string | null],
    name: ['', Validators.required],
    description: ['', Validators.required],
    isActive: [true, Validators.required]
  });

  isEditMode = signal(false);
  isViewMode = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      const scheme = this.cashbackSchemeService.getCashbackSchemeById(id);
      if (scheme) {
        this.form.patchValue(scheme);
      }
    }

    if (url.includes('view')) {
      this.isViewMode.set(true);
      this.form.disable();
    } else if (url.includes('edit')) {
      this.isEditMode.set(true);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.isEditMode()) {
        this.cashbackSchemeService.updateCashbackScheme(this.form.value as any);
      } else {
        this.cashbackSchemeService.addCashbackScheme(this.form.value as any);
      }
      this.router.navigate(['/cashback-schemes']);
    }
  }

  onCancel() {
    this.router.navigate(['/cashback-schemes']);
  }
}
