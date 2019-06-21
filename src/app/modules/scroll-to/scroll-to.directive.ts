import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { ScrollToService } from './scroll-to.service';

@Directive({
  selector: '[scrollTo]'
})
export class ScrollToDirective implements OnInit {
  @Input() scrollTo: string | HTMLElement;
  @Input() scrollDuration: number;
  @Input() scrollOffset: number;

  constructor(private scrollToService: ScrollToService) { }

  ngOnInit(): void {
    this.scrollDuration = (!this.scrollDuration) ? 500 : this.scrollDuration;
    this.scrollOffset = (!this.scrollOffset) ? 0 : this.scrollOffset;
  }

  @HostListener('mousedown') onMouseDown = () =>
    this.scrollToService.scrollTo(this.scrollTo, this.scrollDuration, this.scrollOffset);

}
