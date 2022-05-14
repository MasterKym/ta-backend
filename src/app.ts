import express from 'express';
import routes from './routes/index';
import logger from './middleware/logger.middleware';

const app = express();
const port = process.env.PORT || 4000;

// I think middleware should go before the routes
app.use(express.json());
app.use(logger);

// add the listenets for all routes
routes(app);
app.listen(port, () => console.log(`The server is listning on port ${port}`));

export default app;
