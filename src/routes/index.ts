import { Express } from 'express';
import checkAPIHealth from '../controllers/checkAPIHealth.controller';
import signUp from '../controllers/signUp.controller';
import logIn from '../controllers/logIn.controller';
import checkLogin from '../middleware/checkLogin.middleware';
import { getProfile } from '../controllers/profile.controller';

const routes = (app: Express) => {
  // app.route('/').get(checkAPIHealth);
  app.route('/signup').post(signUp);
  app.route('/login').post(logIn);
  app.route('/profile').get(checkLogin, getProfile);
};
export default routes;
