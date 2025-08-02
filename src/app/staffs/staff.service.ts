import { Injectable, signal } from '@angular/core';
import { Staff } from './staff.interface';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private staffs = signal<Staff[]>([
    {
      id: 'staff1',
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      organizationId: 'org1',
      role: 'Admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff2',
      fullName: 'Bob Johnson',
      email: 'bob@example.com',
      organizationId: 'org2',
      role: 'Manager',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff3',
      fullName: 'Charlie Brown',
      email: 'charlie@example.com',
      organizationId: 'org4',
      role: 'Operator',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff4',
      fullName: 'Diana Prince',
      email: 'diana@example.com',
      organizationId: 'org5',
      role: 'Customer',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff5',
      fullName: 'Eve Adams',
      email: 'eve@example.com',
      organizationId: 'org1',
      role: 'Customer',
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  getStaffs(searchTerm: string = '', searchField: keyof Staff | 'all' = 'all', page: number = 1, pageSize: number = 10): {
    staffs: Staff[];
    totalItems: number;
  } {
    let filtered = this.staffs();

    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(staff => {
        if (searchField === 'all') {
          return Object.values(staff).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          );
        } else {
          const value = staff[searchField];
          return String(value).toLowerCase().includes(searchTerm);
        }
      });
    }

    const totalItems = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginated = filtered.slice(startIndex, endIndex);

    return { staffs: paginated, totalItems };
  }

  getStaffById(id: string): Staff | undefined {
    return this.staffs().find(staff => staff.id === id);
  }

  addStaff(staff: Omit<Staff, 'id' | 'createdAt'>): void {
    const newStaff: Staff = {
      id: 'staff' + (this.staffs().length + 1),
      createdAt: new Date().toISOString(),
      ...staff,
    };
    this.staffs.update(staffs => [...staffs, newStaff]);
  }

  updateStaff(updatedStaff: Staff): boolean {
    let updated = false;
    this.staffs.update(staffs =>
      staffs.map(staff => {
        if (staff.id === updatedStaff.id) {
          updated = true;
          return { ...staff, ...updatedStaff };
        }
        return staff;
      })
    );
    return updated;
  }

  deleteStaff(id: string): boolean {
    const initialLength = this.staffs().length;
    this.staffs.update(staffs => staffs.filter(staff => staff.id !== id));
    return this.staffs().length < initialLength;
  }
}
