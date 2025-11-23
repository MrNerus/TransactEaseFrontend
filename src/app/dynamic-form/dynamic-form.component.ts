import { Component, input, output, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { FormSchema } from '../services/schema.service';
import { Permission } from '../users/user.interface';
import { LookupSelectorComponent } from '../lookup-selector/lookup-selector';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LookupSelectorComponent],
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
            @case ('lookup') {
                <div class="lookup-container">
                    <input 
                        type="text" 
                        [value]="getLookupDisplayValue(field.key)"
                        class="form-control"
                        readonly
                    />
                    <input type="hidden" [formControlName]="field.key">
                    @if (!isReadonly(field.key)) {
                        <button type="button" class="btn btn-secondary" (click)="openLookup(field.key)">
                            <span class="material-icons">search</span>
                        </button>
                    }
                </div>
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

    @if (activeLookupField()) {
        <app-lookup-selector
            [resource]="getLookupResource(activeLookupField()!)"
            [displayField]="getLookupDisplayField(activeLookupField()!)"
            [isOpen]="!!activeLookupField()"
            (itemSelected)="onLookupSelect($event)"
            (close)="closeLookup()"
        ></app-lookup-selector>
    }
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
      color: var(--text-main);
    }
    .form-control {
      padding: 0.5rem;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      font-size: 1rem;
    }
    .form-control.readonly {
      background-color: var(--background-dark);
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
      background-color: var(--primary-color);
      color: white;
    }
    .btn-primary:disabled {
      background-color: var(--border-color);
      cursor: not-allowed;
    }
    .btn-secondary {
      background-color: var(--border-color);
      color: white;
    }
    .lookup-container {
        display: flex;
        gap: 0.5rem;
    }
    .lookup-container input {
        flex: 1;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormComponent {
  Permission = Permission;
  schema = input.required<FormSchema>();
  data = input<any>({});
  permission = input<Permission>(Permission.allowInteraction);
  viewOnly = input<boolean>(false);

  save = output<any>();
  cancel = output<void>();

  form: FormGroup = new FormGroup({});

  // State for lookup
  activeLookupField = signal<string | null>(null);
  lookupDisplayValues = signal<{ [key: string]: string }>({});

  constructor() { }

  ngOnChanges() {
    this.buildForm();
  }

  private buildForm() {
    const group: any = {};
    const currentData = this.data() || {};
    const displayValues: { [key: string]: string } = {};

    this.schema().fields.forEach(field => {
      const value = currentData[field.key] || '';
      const validators = field.required ? [Validators.required] : [];

      const control = new FormControl({ value, disabled: this.isReadonly(field.key) }, validators);
      group[field.key] = control;

      // Initialize display value for lookups if data exists
      if (field.type === 'lookup') {
        displayValues[field.key] = value;
      }
    });

    this.form = new FormGroup(group);
    this.lookupDisplayValues.set(displayValues);
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

  // Lookup Logic
  openLookup(key: string) {
    this.activeLookupField.set(key);
  }

  closeLookup() {
    this.activeLookupField.set(null);
  }

  onLookupSelect(item: any) {
    const key = this.activeLookupField();
    if (key) {
      const field = this.schema().fields.find(f => f.key === key);
      if (field) {
        // Update form control with ID
        this.form.get(key)?.setValue(item.id);
        this.form.markAsDirty();

        // Update display value
        const displayField = field.displayField || 'name'; // Default to 'name'
        const displayValue = item[displayField] || item.id;

        this.lookupDisplayValues.update(values => ({
          ...values,
          [key]: displayValue
        }));
      }
    }
  }

  getLookupDisplayValue(key: string): string {
    return this.lookupDisplayValues()[key] || '';
  }

  getLookupResource(key: string): string {
    const field = this.schema().fields.find(f => f.key === key);
    return field?.lookupResource || '';
  }

  getLookupDisplayField(key: string): string {
    const field = this.schema().fields.find(f => f.key === key);
    return field?.displayField || 'name';
  }
}
