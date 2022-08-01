import { Express } from 'express';
import checkAPIHealth from '../controllers/checkAPIHealth.controller';
import signUp from '../controllers/signUp.controller';
import logIn from '../controllers/logIn.controller';
import checkLogin from '../middleware/checkLogin.middleware';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import logout from '../controllers/logout.controller';

const routes = (app: Express) => {
  app.route('/').get(checkAPIHealth);
  app.route('/signup').post(signUp);
  app.route('/login').post(logIn);
  app.route('/profile').get(checkLogin, getProfile);
  // update profile
  app.route('/profile').put(checkLogin, updateProfile);
  // remove the cookie and logout
  app.route('/profile/logout').post(checkLogin, logout);
};
export default routes;
