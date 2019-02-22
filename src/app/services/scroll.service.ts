import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { PageScrollService, PageScrollInstance } from 'ngx-page-scroll';

import { PlatformService } from './platform.service';


@Injectable()
export class ScrollService {
    constructor(
        private platformService: PlatformService,
        private pageScrollService: PageScrollService,
        @Inject(DOCUMENT) private document: any
    ) {}

    scrollToTop() {
        if (this.platformService.isBrowser()) {
            window.scrollTo(0, 0);
        }
    }

    scrollToElement(element, duration = 0) {
        if (this.platformService.isBrowser()) {
            setTimeout(() => {
                const pageScrollInstance: PageScrollInstance = PageScrollInstance.newInstance({
                    document: this.document,
                    scrollTarget: element,
                    pageScrollDuration: duration
                });
                this.pageScrollService.start(pageScrollInstance);
            }, 10);
        }
    }

    scrollElementToBottom(element) {
        const viewPortHeight = window.innerHeight;

        const absolutePosition = this.getPosition(element.nativeElement);

        const elementHeight = element.nativeElement.getBoundingClientRect().height;
        const target = absolutePosition.y + elementHeight - viewPortHeight;
        window.scrollTo(0, target);
    }

    isElementInViewport(element) {
        const rect = element.nativeElement.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    private getPosition(element) {
        let xPosition = 0;
        let yPosition = 0;

        while (element) {
            xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
            yPosition += element.offsetTop - element.scrollTop + element.clientTop;
            element = element.offsetParent;
        }

        return { x: xPosition, y: yPosition };
    }
}
