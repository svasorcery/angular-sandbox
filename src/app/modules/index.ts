import { ControlErrorModule } from './control-error';
import { ErrorsModule } from './errors';
import { FormsExtendedModule } from './forms';
import { LockingModule } from './locking';
import { WebSocketsModule } from './websockets';

export const modules = [
    ControlErrorModule,
    ErrorsModule,
    FormsExtendedModule,
    LockingModule,
    WebSocketsModule.config({
        url: 'wss://localhost:8082/'
    }),
];
