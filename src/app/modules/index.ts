import { ControlErrorModule } from './control-error';
import { ErrorsModule } from './errors';
import { FormsExtendedModule } from './forms';
import { LoaderModule } from './loader';
import { LockingModule } from './locking';
import { ScrollToModule } from './scroll-to';
import { WebSocketsModule } from './websockets';

export const modules = [
    ControlErrorModule,
    ErrorsModule,
    FormsExtendedModule,
    LoaderModule,
    LockingModule,
    WebSocketsModule.config({
        url: 'wss://localhost:8082/'
    }),
    ScrollToModule.forRoot()
];
