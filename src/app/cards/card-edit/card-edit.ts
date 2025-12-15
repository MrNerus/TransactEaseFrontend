import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CardService } from '../card.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
    selector: 'app-card-edit',
    templateUrl: './card-edit.html',
    styleUrls: ['./card-edit.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DynamicFormComponent]
})
export class CardEditComponent {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private cardService = inject(CardService);
    private schemaService = inject(SchemaService);

    schema = signal<FormSchema>({ fields: [] });
    data = signal<any>({});
    cardId: string | null = null;

    constructor() {
        this.schemaService.getFormSchema('cards').subscribe(schema => {
            this.schema.set(schema);
        });

        this.cardId = this.route.snapshot.paramMap.get('id');
        if (this.cardId) {
            this.cardService.getCardById(this.cardId).subscribe(card => {
                if (card) {
                    this.data.set(card);
                }
            });
        }
    }

    onSave(formData: any): void {
        if (this.cardId) {
            this.cardService.updateCard({ ...formData, id: this.cardId }).subscribe(() => {
                this.router.navigate(['/cards']);
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/cards']);
    }
}
