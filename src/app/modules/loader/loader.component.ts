import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { LoaderService } from './loader.service';
import { LoaderState } from './loader';

@Component({
  selector: 'app-loader',
  templateUrl: 'loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  // @Input() value = 50;
  // @Input() mode = 'indeterminate';
  // @Input() color = 'primary';

  state$: Observable<LoaderState>;

  constructor(private loaderService: LoaderService) {
    this.state$ = this.loaderService.loaderState$;
  }

}
