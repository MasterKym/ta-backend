import { Express } from 'express';
import checkAPIHealth from '../controllers/checkAPIHealth.controller';
import signUp from '../controllers/signUp.controller';
import logIn from '../controllers/logIn.controller';
import checkLogin from '../middleware/checkLogin.middleware';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import signOut from '../controllers/signOut.controller';

const routes = (app: Express) => {
  app.route('/ping').get(checkAPIHealth);
  app.route('/signup').post(signUp);
  app.route('/login').post(logIn);
  app
    .route('/profile')
    .get(checkLogin, getProfile)
    .put(checkLogin, updateProfile);
  app.route('/signout').post(checkLogin, signOut);
};
export default routes;
