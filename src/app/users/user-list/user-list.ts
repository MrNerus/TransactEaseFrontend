import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class UserListComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<User[]>([]);
  searchTerm = signal('');
  searchField = signal<keyof User | 'all'>('all');
  currentPage = signal(1);
  pageSize = signal(20); // Default page size set to 20
  pageSizeOptions = [5, 10, 20, 50]; // Options for rows per page
  totalItems = signal(0);
  pageInput = signal(1);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    const result = this.userService.getUsers(
      this.searchTerm(),
      this.searchField(),
      this.currentPage(),
      this.pageSize()
    );
    this.users.set(result.users);
    this.totalItems.set(result.totalItems);
    this.pageInput.set(this.currentPage());
  }

  onSearchChange(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  onSearchFieldChange(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  onPageSizeChange(): void {
    this.currentPage.set(1);
    this.loadUsers();
  }

  goToPage(): void {
    const page = this.pageInput();
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadUsers();
    } else {
      this.pageInput.set(this.currentPage());
    }
  }

  firstPage(): void {
    if (this.currentPage() !== 1) {
      this.currentPage.set(1);
      this.loadUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.loadUsers();
    }
  }

  lastPage(): void {
    if (this.currentPage() !== this.totalPages()) {
      this.currentPage.set(this.totalPages());
      this.loadUsers();
    }
  }

  addUser(): void {
    this.router.navigate(['/users/add']);
  }

  editUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  deleteUser(id: string): void {
    if (confirm(`Are you sure you want to delete user ${id}?`)) {
      this.userService.deleteUser(id);
      this.loadUsers();
    }
  }
}