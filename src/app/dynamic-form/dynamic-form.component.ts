import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormSchema } from '../services/schema.service';
import { Permission } from '../users/user.interface';

@Component({
    selector: 'app-dynamic-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="dynamic-form-container">
      @for (field of schema().fields; track field.key) {
        <div class="form-group">
          <label [for]="field.key" class="form-label">{{ field.label }}</label>
          
          @switch (field.type) {
            @case ('text') {
              <input 
                [type]="field.type" 
                [id]="field.key" 
                [formControlName]="field.key"
                class="form-control"
                [class.readonly]="isReadonly(field.key)"
              />
            }
            @case ('number') {
              <input 
                type="number" 
                [id]="field.key" 
                [formControlName]="field.key"
                class="form-control"
                [class.readonly]="isReadonly(field.key)"
              />
            }
            @case ('date') {
               <input 
                type="date" 
                [id]="field.key" 
                [formControlName]="field.key"
                class="form-control"
                [class.readonly]="isReadonly(field.key)"
              />
            }
            @case ('select') {
              <select 
                [id]="field.key" 
                [formControlName]="field.key"
                class="form-control"
                [class.readonly]="isReadonly(field.key)"
              >
                @for (opt of field.options; track opt.value) {
                  <option [value]="opt.value">{{ opt.label }}</option>
                }
              </select>
            }
             @case ('textarea') {
              <textarea 
                [id]="field.key" 
                [formControlName]="field.key"
                class="form-control"
                [class.readonly]="isReadonly(field.key)"
              ></textarea>
            }
          }
          
          @if (form.get(field.key)?.invalid && form.get(field.key)?.touched) {
            <div class="error-message">
              {{ field.label }} is required.
            </div>
          }
        </div>
      }

      @if (permission() === Permission.allowInteraction && !viewOnly()) {
         <div class="form-actions">
            <button type="submit" [disabled]="form.invalid" class="btn btn-primary">Save</button>
            <button type="button" (click)="onCancel()" class="btn btn-secondary">Cancel</button>
         </div>
      }
    </form>
  `,
    styles: [`
    .dynamic-form-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 600px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .form-label {
      font-weight: 500;
      color: var(--text-color, #333);
    }
    .form-control {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
    }
    .form-control.readonly {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
    .error-message {
      color: red;
      font-size: 0.875rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    .btn-primary:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent {
    Permission = Permission;
    schema = input.required<FormSchema>();
    data = input<any>({});
    permission = input<Permission>(Permission.allowInteraction);
    viewOnly = input<boolean>(false); // Force view-only mode regardless of permission (e.g. for view pages)

    save = output<any>();
    cancel = output<void>();

    form: FormGroup = new FormGroup({});

    constructor() {
        // Re-build form when schema or data changes
        // In a real app, we'd use an effect() or similar to react to input changes more robustly
        // For now, we'll assume schema is stable or we'd need a more complex setup
    }

    ngOnChanges() {
        this.buildForm();
    }

    private buildForm() {
        const group: any = {};
        const currentData = this.data() || {};

        this.schema().fields.forEach(field => {
            const value = currentData[field.key] || '';
            const validators = field.required ? [Validators.required] : [];

            const control = new FormControl({ value, disabled: this.isReadonly(field.key) }, validators);
            group[field.key] = control;
        });

        this.form = new FormGroup(group);
    }

    isReadonly(key: string): boolean {
        if (this.permission() === Permission.viewOnly || this.viewOnly()) return true;

        const field = this.schema().fields.find(f => f.key === key);
        return field?.readonly || false;
    }

    onSubmit() {
        if (this.form.valid) {
            this.save.emit(this.form.getRawValue());
        }
    }

    onCancel() {
        this.cancel.emit();
    }
}
