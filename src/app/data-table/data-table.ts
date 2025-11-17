import { ChangeDetectionStrategy, Component, input, output, signal, computed, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Permission } from '../users/user.interface';

export interface ColumnDef {
  key: string;
  label: string;
  isDate?: boolean;
  isBoolean?: boolean;
}

export interface Controls {
  columns: ColumnDef[];
  searchableFields: string[];
}

export interface PageChange {
  page: number;
  pageSize: number;
}

export interface SearchChange {
  searchTerm: string;
  searchField: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.html',
  styleUrls: ['./data-table.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class DataTableComponent {
  Permission = Permission;
  data = input<any[]>([]);
  controls = input<Controls>({ columns: [], searchableFields: [] });
  totalItems = input(0);
  pageSize = input(20);
  pageSizeOptions = input([5, 10, 20, 50]);
  actions = input<TableAction[]>([]);
  @Output() action = new EventEmitter<{ type: string, row?: any }>();



  searchChange = output<SearchChange>();
  pageChange = output<PageChange>();

  currentPage = signal(1);
  pageInput = signal(1);
  searchTerm = signal('');
  searchField = signal('all');

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  onSearchChange(): void {
    this.currentPage.set(1);
    this.emitSearchChange();
  }

  onSearchFieldChange(): void {
    this.currentPage.set(1);
    this.emitSearchChange();
  }

  onPageSizeChange(): void {
    this.currentPage.set(1);
    this.emitPageChange();
  }

  goToPage(): void {
    const page = this.pageInput();
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.emitPageChange();
    } else {
      this.pageInput.set(this.currentPage());
    }
  }

  firstPage(): void {
    if (this.currentPage() !== 1) {
      this.currentPage.set(1);
      this.emitPageChange();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.emitPageChange();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.emitPageChange();
    }
  }

  lastPage(): void {
    if (this.currentPage() !== this.totalPages()) {
      this.currentPage.set(this.totalPages());
      this.emitPageChange();
    }
  }

  private emitSearchChange(): void {
    this.searchChange.emit({ searchTerm: this.searchTerm(), searchField: this.searchField() });
  }

  private emitPageChange(): void {
    this.pageChange.emit({ page: this.currentPage(), pageSize: this.pageSize() });
  }

}

export interface TableAction {
  type: string;            // 'add' | 'view' | 'edit' | 'delete' | ...
  label: string;           // Button text (if needed)
  icon: string;            // material icon
  placement: 'global' | 'row';
  permission: Permission;
}