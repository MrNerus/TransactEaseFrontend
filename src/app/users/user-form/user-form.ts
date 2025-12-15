import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.html',
  styleUrls: ['./user-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DynamicFormComponent]
})
export class UserFormComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });
  data = signal<any>({});
  isViewMode = signal(false);

  constructor() {
    this.schemaService.getFormSchema('users').subscribe(schema => {
      this.schema.set(schema);
    });

    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (id) {
      this.userService.getUserById(id).subscribe(user => {
        if (user) {
          this.data.set(user);
        }
      });
    }

    if (url.includes('view')) {
      this.isViewMode.set(true);
    }
  }

  onSave(formData: any) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.updateUser({ ...formData, id }).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.addUser(formData).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
    this.router.navigate(['/users']);
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}