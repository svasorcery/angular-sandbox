import { Component, Input } from '@angular/core';

export class Coords {
    lat: number;
    lng: number;
}
export class MapLocationMarker {
    coords: Coords;
}
export class MapLocation {
    minClusterSize: number;
    gridSize: number;
    center: Coords;
    markers: MapLocationMarker[];
}


@Component({
    selector: 'map-google',
    template: `
        <agm-map
            [latitude]="map.center.lat"
            [longitude]="map.center.lng"
            style="height:238px">
            <agm-marker-cluster
                [minimumClusterSize]="map.minClusterSize"
                [gridSize]="map.gridSize">
                <!--[imagePath]="'/img/gmaps-cluster-m'"-->

                <agm-marker
                    *ngFor="let m of map.markers"
                    [latitude]="m.coords.lat"
                    [longitude]="m.coords.lng">
                    <!--[iconUrl]="m.icon"-->
                    <agm-snazzy-info-window [closeWhenOthersOpen]="true">
                        <ng-template>
                            <span>
                                lat:{{ m.coords.lat }},
                                lng:{{ m.coords.lng }}
                            </span>
                        </ng-template>
                    </agm-snazzy-info-window>
                </agm-marker>

            </agm-marker-cluster>
        </agm-map>
    `,
    styles: []
})
export class MapGoogleComponent {
    @Input() map: MapLocation;

    constructor() { }
}
