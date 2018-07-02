import { Component, Input, Output, OnChanges, AfterViewInit, OnDestroy,
    ComponentRef, ViewContainerRef, ElementRef, ChangeDetectorRef,
    ViewChild, EventEmitter, Renderer, Directive, HostListener,
    ComponentFactoryResolver, ComponentFactory, SimpleChange
} from '@angular/core';

@Directive({
    selector: '[popover]',
    exportAs: 'popover'
})
export class PopoverDirective implements OnChanges {
    protected PopoverComponent = PopoverContentComponent;
    protected popover: ComponentRef<PopoverContentComponent>;
    protected visible: boolean;

    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected resolver: ComponentFactoryResolver
    ) { }

    @Input('popover') content: string|PopoverContentComponent;
    @Input() popoverDisabled: boolean;
    @Input() popoverAnimation: boolean;
    @Input() popoverPlacement: 'top'|'bottom'|'left'|'right'|'auto'|'auto top'|'auto bottom'|'auto left'|'auto right';
    @Input() popoverTitle: string;
    @Input() popoverOnHover: boolean = false;
    @Input() popoverCloseOnClickOutside: boolean;
    @Input() popoverCloseOnMouseOutside: boolean;
    @Input() popoverDismissTimeout: number = 0;
    @Output() onShown = new EventEmitter<PopoverDirective>();
    @Output() onHidden = new EventEmitter<PopoverDirective>();


    @HostListener('click')
    showOrHideOnClick(): void {
        if (this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        this.toggle();
    }

    @HostListener('focusin')
    @HostListener('mouseenter')
    showOnHover(): void {
        if (!this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        this.show();
    }

    @HostListener('focusout')
    @HostListener('mouseleave')
    hideOnHover(): void {
        if (this.popoverCloseOnMouseOutside) return;
        if (!this.popoverOnHover) return;
        if (this.popoverDisabled) return;
        this.hide();
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        if (changes['popoverDisabled']) {
            if (changes['popoverDisabled'].currentValue) {
                this.hide();
            }
        }
    }


    public toggle() {
        if (!this.visible) {
            this.show();
        } else {
            this.hide();
        }
    }

    public show() {
        if (this.visible) return;

        this.visible = true;
        if (typeof this.content === 'string') {
            const factory = this.resolver.resolveComponentFactory(this.PopoverComponent);
            if (!this.visible)
                return;

            this.popover = this.viewContainerRef.createComponent(factory);
            const popover = this.popover.instance as PopoverContentComponent;
            popover.popover = this;
            popover.content = this.content as string;
            if (this.popoverPlacement !== undefined)
                popover.placement = this.popoverPlacement;
            if (this.popoverAnimation !== undefined)
                popover.animation = this.popoverAnimation;
            if (this.popoverTitle !== undefined)
                popover.title = this.popoverTitle;
            if (this.popoverCloseOnClickOutside !== undefined)
                popover.closeOnClickOutside = this.popoverCloseOnClickOutside;
            if (this.popoverCloseOnMouseOutside !== undefined)
                popover.closeOnMouseOutside = this.popoverCloseOnMouseOutside;

            popover.onCloseFromOutside.subscribe(() => this.hide());
            // if dismissTimeout option is set, then this popover will be dismissed in dismissTimeout time
            if (this.popoverDismissTimeout > 0)
                setTimeout(() => this.hide(), this.popoverDismissTimeout);
        } else {
            const popover = this.content as PopoverContentComponent;
            popover.popover = this;
            if (this.popoverPlacement !== undefined)
                popover.placement = this.popoverPlacement;
            if (this.popoverAnimation !== undefined)
                popover.animation = this.popoverAnimation;
            if (this.popoverTitle !== undefined)
                popover.title = this.popoverTitle;
            if (this.popoverCloseOnClickOutside !== undefined)
                popover.closeOnClickOutside = this.popoverCloseOnClickOutside;
            if (this.popoverCloseOnMouseOutside !== undefined)
                popover.closeOnMouseOutside = this.popoverCloseOnMouseOutside;

            popover.onCloseFromOutside.subscribe(() => this.hide());
            // if dismissTimeout option is set, then this popover will be dismissed in dismissTimeout time
            if (this.popoverDismissTimeout > 0)
                setTimeout(() => this.hide(), this.popoverDismissTimeout);
            popover.show();
        }

        this.onShown.emit(this);
    }

    public hide() {
        if (!this.visible) return;

        this.visible = false;
        if (this.popover)
            this.popover.destroy();

        if (this.content instanceof PopoverContentComponent)
            (this.content as PopoverContentComponent).hideFromPopover();

        this.onHidden.emit(this);
    }

    public getElement() {
        return this.viewContainerRef.element.nativeElement;
    }

}



@Component({
    selector: 'popover-content',
    template: `
        <div #popoverDiv class="popover {{ effectivePlacement }}"
            [style.top]="top + 'px'"
            [style.left]="left + 'px'"
            [class.in]="isIn"
            [class.fade]="animation"
            style="display: block"
            role="popover">
            <div [hidden]="!closeOnMouseOutside" class="virtual-area"></div>
            <div class="arrow"></div>
            <h3 class="popover-title" [hidden]="!title">{{ title }}</h3>
            <div class="popover-content">
                <ng-content></ng-content>
                {{ content }}
            </div>
        </div>
    `,
    styles: [`
        .popover .virtual-area {
            height: 11px;
            width: 100%;
            position: absolute;
        }
        .popover.top .virtual-area {
            bottom: -11px;
        }
        .popover.bottom .virtual-area {
            top: -11px;
        }
        .popover.left .virtual-area {
            right: -11px;
        }
        .popover.right .virtual-area {
            left: -11px;
        }
    `]
})
export class PopoverContentComponent implements AfterViewInit, OnDestroy {
    @Input() content: string;
    @Input() placement: 'top' | 'bottom' | 'left' | 'right' | 'auto' | 'auto top' | 'auto bottom' | 'auto left' | 'auto right' = 'bottom';
    @Input() title: string;
    @Input() animation: boolean = true;
    @Input() closeOnClickOutside: boolean = false;
    @Input() closeOnMouseOutside: boolean = false;

    @ViewChild('popoverDiv') popoverDiv: ElementRef;

    popover: PopoverDirective;
    onCloseFromOutside = new EventEmitter();
    top: number = -10000;
    left: number = -10000;
    isIn: boolean = false;
    displayType: string = 'none';
    effectivePlacement: string;

    onDocumentMouseDown = (event: any) => {
        const element = this.element.nativeElement;
        if (!element || !this.popover) return;
        if (element.contains(event.target) || this.popover.getElement().contains(event.target)) return;
        this.hide();
        this.onCloseFromOutside.emit(undefined);
    }

    constructor(
        protected element: ElementRef,
        protected cdr: ChangeDetectorRef,
        protected renderer: Renderer
    ) { }


    listenClickFunc: any;
    listenMouseFunc: any;

    ngAfterViewInit(): void {
        if (this.closeOnClickOutside) {
            this.listenClickFunc = this.renderer.listenGlobal('document', 'mousedown', (event: any) => this.onDocumentMouseDown(event));
        }

        if (this.closeOnMouseOutside) {
            this.listenMouseFunc = this.renderer.listenGlobal('document', 'mouseover', (event: any) => this.onDocumentMouseDown(event));
        }

        this.show();
        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        if (this.closeOnClickOutside)
            this.listenClickFunc();

        if (this.closeOnMouseOutside)
            this.listenMouseFunc();
    }


    public show(): void {
        if (!this.popover || !this.popover.getElement())
            return;

        const p = this.positionElements(this.popover.getElement(), this.popoverDiv.nativeElement, this.placement);
        this.displayType = 'block';
        this.top = p.top;
        this.left = p.left;
        this.isIn = true;
    }

    public hide(): void {
        this.top = -10000;
        this.left = -10000;
        this.isIn = true;
        this.popover.hide();
    }

    public hideFromPopover() {
        this.top = -10000;
        this.left = -10000;
        this.isIn = true;
    }


    protected positionElements(hostEl: HTMLElement, targetEl: HTMLElement, positionStr: string, appendToBody: boolean = false): { top: number, left: number } {
        let positionStrParts = positionStr.split('-');
        let pos0 = positionStrParts[0];
        let pos1 = positionStrParts[1] || 'center';
        let hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);
        let targetElWidth = targetEl.offsetWidth;
        let targetElHeight = targetEl.offsetHeight;

        this.effectivePlacement = pos0 = this.getEffectivePlacement(pos0, hostEl, targetEl);

        let shiftWidth: any = {
            center: function (): number {
                return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
            },
            left: function (): number {
                return hostElPos.left;
            },
            right: function (): number {
                return hostElPos.left + hostElPos.width;
            }
        };

        let shiftHeight: any = {
            center: function (): number {
                return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
            },
            top: function (): number {
                return hostElPos.top;
            },
            bottom: function (): number {
                return hostElPos.top + hostElPos.height;
            }
        };

        let targetElPos: { top: number, left: number };
        switch (pos0) {
            case 'right':
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: shiftWidth[pos0]()
                };
                break;

            case 'left':
                targetElPos = {
                    top: shiftHeight[pos1](),
                    left: hostElPos.left - targetElWidth
                };
                break;

            case 'bottom':
                targetElPos = {
                    top: shiftHeight[pos0](),
                    left: shiftWidth[pos1]()
                };
                break;

            default:
                targetElPos = {
                    top: hostElPos.top - targetElHeight,
                    left: shiftWidth[pos1]()
                };
                break;
        }

        return targetElPos;
    }

    protected position(nativeEl: HTMLElement): { width: number, height: number, top: number, left: number } {
        let offsetParentBCR = { top: 0, left: 0 };
        const elBCR = this.offset(nativeEl);
        const offsetParentEl = this.parentOffsetEl(nativeEl);
        if (offsetParentEl !== window.document) {
            offsetParentBCR = this.offset(offsetParentEl);
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        const boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left
        };
    }

    protected offset(nativeEl: any): { width: number, height: number, top: number, left: number } {
        const boundingClientRect = nativeEl.getBoundingClientRect();
        return {
            width: boundingClientRect.width || nativeEl.offsetWidth,
            height: boundingClientRect.height || nativeEl.offsetHeight,
            top: boundingClientRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
            left: boundingClientRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft)
        };
    }

    protected getStyle(nativeEl: HTMLElement, cssProp: string): string {
        if ((nativeEl as any).currentStyle) // IE
            return (nativeEl as any).currentStyle[cssProp];

        if (window.getComputedStyle)
            return (window.getComputedStyle as any)(nativeEl)[cssProp];

        return (nativeEl.style as any)[cssProp];
    }

    protected isStaticPositioned(nativeEl: HTMLElement): boolean {
        return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
    }

    protected parentOffsetEl(nativeEl: HTMLElement): any {
        let offsetParent: any = nativeEl.offsetParent || window.document;
        while (offsetParent && offsetParent !== window.document && this.isStaticPositioned(offsetParent)) {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || window.document;
    }

    protected getEffectivePlacement(placement: string, hostElement: HTMLElement, targetElement: HTMLElement): string {
        const placementParts = placement.split(' ');
        if (placementParts[0] !== 'auto') {
            return placement;
        }

        const hostElBoundingRect = hostElement.getBoundingClientRect();

        const desiredPlacement = placementParts[1] || 'bottom';

        if (desiredPlacement === 'top' && hostElBoundingRect.top - targetElement.offsetHeight < 0) {
            return 'bottom';
        }
        if (desiredPlacement === 'bottom' && hostElBoundingRect.bottom + targetElement.offsetHeight > window.innerHeight) {
            return 'top';
        }
        if (desiredPlacement === 'left' && hostElBoundingRect.left - targetElement.offsetWidth < 0) {
            return 'right';
        }
        if (desiredPlacement === 'right' && hostElBoundingRect.right + targetElement.offsetWidth > window.innerWidth) {
            return 'left';
        }

        return desiredPlacement;
    }
}
