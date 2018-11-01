import { Component, AfterViewInit, Input, ElementRef, ContentChildren,
    Directive, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';

@Directive({
    selector: '.carousel-item'
})
export class CarouselItemElement {

}


@Directive({
    selector: '[carouselItem]'
})
export class CarouselItemDirective {
    constructor(public template: TemplateRef<any> ) { }
}


@Component({
    selector: 'carousel',
    exportAs: 'carousel',
    template: `
        <section class="carousel-wrapper" [ngStyle]="carouselWrapperStyle">
            <ul class="carousel-inner" #carousel>
                <li *ngFor="let item of items;" class="carousel-item">
                    <ng-container [ngTemplateOutlet]="item.tpl"></ng-container>
                </li>
            </ul>
        </section>
        <div *ngIf="showControls" style="margin-top: 1em">
            <button (click)="previous()" class="btn btn-default">Prev</button>
            <button (click)="next()" class="btn btn-default">Next</button>
        </div>
    `,
    styles: [`
        ul {
            list-style: none;
            margin: 0;
            padding: 0;
            width: 6000px;
        }

        .carousel-wrapper {
            overflow: hidden;
        }

        .carousel-inner {
            display: flex;
        }
    `]
})
export class CarouselComponent implements AfterViewInit {
    @Input() timing = '250ms ease-in';
    @Input() showControls = true;
    @ContentChildren(CarouselItemDirective) items: QueryList<CarouselItemDirective>;
    @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;
    @ViewChild('carousel') private carousel: ElementRef;
    private player: AnimationPlayer;
    private itemWidth: number;
    private currentSlide = 0;
    carouselWrapperStyle = {};

    constructor(private builder: AnimationBuilder) { }

    ngAfterViewInit() { console.log(this.items);
        this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
        this.carouselWrapperStyle = {
            width: `${this.itemWidth}px`
        };
    }


    public next = (): void => {
        if (this.currentSlide + 1 === this.items.length) { return; }
        this.currentSlide = (this.currentSlide + 1) % this.items.length;
        const offset = this.currentSlide * this.itemWidth;
        const myAnimation: AnimationFactory = this.buildAnimation(offset);
        this.player = myAnimation.create(this.carousel.nativeElement);
        this.player.play();
    }

    public previous = (): void => {
        if (this.currentSlide === 0) { return; }

        this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
        const offset = this.currentSlide * this.itemWidth;

        const slideAnimation: AnimationFactory = this.buildAnimation(offset);
        this.player = slideAnimation.create(this.carousel.nativeElement);
        this.player.play();
    }


    private buildAnimation = (offset: number): AnimationFactory =>
        this.builder.build([
            animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
        ])
}
