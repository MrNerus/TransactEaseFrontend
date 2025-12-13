import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, Controls, PageChange, SearchChange } from '../data-table/data-table';
import { LookupService } from '../services/lookup.service';
import { SchemaService } from '../services/schema.service';

@Component({
    selector: 'app-lookup-selector',
    templateUrl: './lookup-selector.html',
    styleUrls: ['./lookup-selector.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, DataTableComponent]
})
export class LookupSelectorComponent {
    private lookupService = inject(LookupService);
    private schemaService = inject(SchemaService);

    resource = input.required<string>();
    displayField = input.required<string>();
    isOpen = input(false);

    itemSelected = output<any>();
    close = output<void>();

    data = signal<any[]>([]);
    totalItems = signal(0);
    pageSize = signal(10);
    searchTerm = signal('');
    actions = signal<any[]>([
        { type: 'select', label: 'Select', icon: 'check', placement: 'row', permission: 'allowInteraction' } // Mock permission
    ]);
    controls = signal<Controls>({ columns: [], searchableFields: [] });

    constructor() {
    }

    ngOnChanges() {
        if (this.isOpen()) {
            this.loadSchema();
            this.loadData();
        }
    }

    loadSchema(): void {
        this.schemaService.getTableSchema(this.resource()).subscribe(schema => {
            this.controls.set(schema);
        });
    }

    loadData(): void {
        this.lookupService.getData(
            this.resource(),
            this.searchTerm(),
            1,
            this.pageSize()
        ).subscribe(result => {
            this.data.set(result.data);
            this.totalItems.set(result.totalItems);
        });
    }

    onSearchChange(searchChange: SearchChange): void {
        this.searchTerm.set(searchChange.searchTerm);
        this.lookupService.getData(
            this.resource(),
            this.searchTerm(),
            1,
            this.pageSize()
        ).subscribe(result => {
            this.data.set(result.data);
            this.totalItems.set(result.totalItems);
        });
    }

    onPageChange(pageChange: PageChange): void {
        this.lookupService.getData(
            this.resource(),
            this.searchTerm(),
            pageChange.page,
            pageChange.pageSize
        ).subscribe(result => {
            this.data.set(result.data);
            this.totalItems.set(result.totalItems);
        });
    }

    onSelect(row: any) {
        this.itemSelected.emit(row);
        this.close.emit();
    }

    onClose() {
        this.close.emit();
    }

    onTableAction(e: { type: string, row?: any }) {
        if ((e.type === 'select' || e.type === 'rowClick' || e.type === 'rowEnter') && e.row) {
            this.onSelect(e.row);
        }
    }
}
