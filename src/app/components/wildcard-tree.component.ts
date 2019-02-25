import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface Breadcrumb {
  name: string;
  path: string;
}

export interface TreeItem {
  id: number;
  parentId: number;
  type: 'group' | 'item';
  name: string;
}

export class TreeBuilder {
  private data: TreeItem[];
  private id: number;
  private idPath: number[];

  constructor() {
    this.data = [];
    this.id = 0;
    this.idPath = [];
  }

  public getData(): TreeItem[] {
    return this.data;
  }

  public group(name: string): TreeBuilder {
    this.data.push({
      id: ++this.id,
      parentId: this.idPath[this.idPath.length - 1] || 0,
      type: 'group',
      name: name
    });

    this.idPath.push(this.id);

    return this;
  }

  public item(name: string): TreeBuilder {
    this.data.push({
      id: ++this.id,
      parentId: this.idPath[this.idPath.length - 1] || 0,
      type: 'item',
      name: name
    });

    return this;
  }

  public up(): TreeBuilder {
    this.idPath.pop();

    return this;
  }
}

interface TreeItemWithPath extends TreeItem {
  path: string;
}


@Component({
  selector: 'wildcard-tree',
  template: `
    <nav class='breadcrumbs'>
      <a [routerLink]='featureRoot'>Go</a>
      <ng-template *ngFor='let breadcrumb of breadcrumbs'>
        <span>/</span>
        <a [routerLink]='breadcrumb.path'> {{ breadcrumb.name }}</a>
      </ng-template>
    </nav>

    <ul *ngIf='groups.length' class='groups'>
      <li *ngFor='let group of groups'>
        <a [routerLink]='group.path'>{{ group.name }}</a>
      </li>
    </ul>

    <ul *ngIf='items.length' class='items'>
      <li *ngFor='let item of items'>{{ item.name }}</li>
    </ul>
  `,
  styles: [`
    :host {
      border-top: 2px solid #cccccc;
      display: block;
      font-size: 20px;
      line-height: 28px;
      margin: 20px 0px 20px 0px;
      padding-top: 20px;
    }
    .breadcrumbs {
      display: flex;
    }
    .breadcrumbs a {
      margin-right: 12px;
    }
    .breadcrumbs span {
      color: #999999;
      margin-right: 12px;
    }
  `]
})
export class WildCardTreeComponent implements OnInit, OnDestroy {
  @Input() treeData: TreeItem[];
  public breadcrumbs: Breadcrumb[];
  public featureRoot: string;
  public groups: TreeItemWithPath[];
  public items: TreeItemWithPath[];

  private activatedRoute: ActivatedRoute;
  private data: TreeItemWithPath[];
  private router: Router;
  private urlSubscription: Subscription | null;

  constructor(activatedRoute: ActivatedRoute, router: Router) {
    this.activatedRoute = activatedRoute;
    this.router = router;

    this.breadcrumbs = [];
    this.groups = [];
    this.items = [];
    this.urlSubscription = null;

    this.featureRoot = '/wildcard';
  }

  ngOnInit(): void {
    this.data = this.treeData.map(treeItem => {
      return {
        ...treeItem,
        path: encodeURIComponent(treeItem.name)
      };
    });
    this.urlSubscription = this.activatedRoute.url.subscribe(urlSegments => {
      const names = urlSegments.map(urlSegment =>
        decodeURIComponent(urlSegment.path)
      );
      this.renderTree(names);
    });
  }

  ngOnDestroy(): void {
    this.urlSubscription && this.urlSubscription.unsubscribe();
  }

  private createBreadcrumbs(names: string[]): Breadcrumb[] {
    let runningPath = this.featureRoot;
    const breadcrumbs = names.map((name: string) => {
      runningPath += '/' + encodeURIComponent(name);
      return {
        name: name,
        path: runningPath
      };
    });
    return breadcrumbs;
  }

  private filterData = (parentId: number, type: string): TreeItemWithPath[] =>
    this.data.filter(item => item.parentId === parentId && item.type === type);

  private getContextId(names: string[]): number | null {
    let parentId = 0;
    for (const name of names) {
      const context = this.data.find(
        item =>
          item.parentId === parentId &&
          item.type === 'group' &&
          item.name === name
      );

      if (context === null) {
        return null;
      }
      parentId = context.id;
    }
    return parentId;
  }

  private renderTree(names: string[]): void {
    const parentId = this.getContextId(names);

    if (parentId === null) {
      this.router.navigate([this.featureRoot]);
      return;
    }

    this.breadcrumbs = this.createBreadcrumbs(names);
    this.groups = this.filterData(parentId, 'group');
    this.items = this.filterData(parentId, 'item');
  }
}
