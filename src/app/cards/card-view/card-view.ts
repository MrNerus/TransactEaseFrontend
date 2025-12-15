import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../card.service';
import { Card } from '../card.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.html',
  styleUrls: ['./card-view.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class CardViewComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);

  card: Card | undefined;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cardService.getCardById(id).subscribe(card => {
        this.card = card;
      });
    }
  }

  onCancel() {
    this.router.navigate(['/cards']);
  }
}
