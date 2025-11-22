import { ChangeDetectionStrategy, Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormArray, FormGroup, Validators } from '@angular/forms';
import { Controls } from '../data-table/data-table';
import { FilterPayload, FilterCondition, FilterOperator } from '../data-table/filter.interface';

@Component({
    selector: 'app-advanced-filter',
    templateUrl: './advanced-filter.html',
    styleUrls: ['./advanced-filter.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule]
})
export class AdvancedFilterComponent {
    private fb = inject(FormBuilder);

    schema = input.required<Controls>();
    isOpen = input(false);

    applyFilter = output<FilterPayload>();
    close = output<void>();

    filterForm = this.fb.group({
        logic: ['and' as const, Validators.required],
        conditions: this.fb.array<FormGroup>([])
    });

    get conditions() {
        return this.filterForm.get('conditions') as FormArray;
    }

    operators: { value: FilterOperator; label: string }[] = [
        { value: 'eq', label: 'Equals' },
        { value: 'neq', label: 'Not Equals' },
        { value: 'contains', label: 'Contains' },
        { value: 'gt', label: 'Greater Than' },
        { value: 'gte', label: 'Greater Than or Equal' },
        { value: 'lt', label: 'Less Than' },
        { value: 'lte', label: 'Less Than or Equal' },
        { value: 'between', label: 'Between' },
        { value: 'in', label: 'In List' }
    ];

    addCondition() {
        const conditionGroup = this.fb.group({
            field: ['', Validators.required],
            operator: ['eq', Validators.required],
            value: ['', Validators.required],
            valueEnd: [''] // For 'between' operator
        });
        this.conditions.push(conditionGroup);
    }

    removeCondition(index: number) {
        this.conditions.removeAt(index);
    }

    clearFilters() {
        this.conditions.clear();
    }

    onApply() {
        if (this.filterForm.valid) {
            const formValue = this.filterForm.value;

            const payload: FilterPayload = {
                logic: formValue.logic as 'and' | 'or',
                conditions: (formValue.conditions || []).map((c: any) => {
                    let value = c.value;
                    if (c.operator === 'between') {
                        value = [c.value, c.valueEnd];
                    } else if (c.operator === 'in') {
                        // Assuming comma separated for 'in' if text input, 
                        // but for simplicity let's keep it as string or handle basic splitting if needed.
                        // For now, let's just pass the string value.
                        if (typeof value === 'string') {
                            value = value.split(',').map(v => v.trim());
                        }
                    }

                    return {
                        field: c.field,
                        operator: c.operator,
                        value: value
                    };
                })
            };

            this.applyFilter.emit(payload);
            this.close.emit();
        }
    }

    onClose() {
        this.close.emit();
    }

    getFieldLabel(key: string): string {
        const col = this.schema().columns.find(c => c.key === key);
        return col ? col.label : key;
    }

    getInputType(index: number): string {
        const condition = this.conditions.at(index);
        const fieldKey = condition.get('field')?.value;
        const col = this.schema().columns.find(c => c.key === fieldKey);

        if (col?.isDate) return 'date';
        if (col?.isBoolean) return 'boolean'; // We might handle boolean differently
        // We could infer number if we had that info in schema, but for now text/number is fine
        return 'text';
    }

    isDate(index: number): boolean {
        return this.getInputType(index) === 'date';
    }

    isBoolean(index: number): boolean {
        return this.getInputType(index) === 'boolean';
    }
}
