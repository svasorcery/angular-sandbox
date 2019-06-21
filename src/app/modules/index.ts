import { ControlErrorModule } from './control-error';
import { ErrorsModule } from './errors';
import { FormsExtendedModule } from './forms';
import { LockingModule } from './locking';
import { WebSocketsModule } from './websockets';
import { ScrollToModule } from './scroll-to';

export const modules = [
    ControlErrorModule,
    ErrorsModule,
    FormsExtendedModule,
    LockingModule,
    WebSocketsModule.config({
        url: 'wss://localhost:8082/'
    }),
    ScrollToModule.forRoot()
];
