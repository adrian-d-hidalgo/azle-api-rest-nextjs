import { Server } from 'azle';

import { app } from './src/app';

export default Server(() => {
    return app.listen();
});
