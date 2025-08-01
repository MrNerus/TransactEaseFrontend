import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav/nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent],
  template: '<app-nav></app-nav><router-outlet></router-outlet>'
})
export class App {}
