import path from 'path';
import express from 'express';
import routes from './routes/index';
import logger from './middleware/logger.middleware';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

// I think middleware should go before the routes
app.use(express.json());
app.use(logger);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add the listenets for all routes
routes(app);
app.listen(port, () => console.log(`The server is listning on port ${port}`));

export default app;
