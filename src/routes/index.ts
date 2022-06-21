import { Express } from 'express';
import logIn from '../controllers/logIn.controller';
import {
    changePassword,
    getProfile,
    updateProfile,
} from '../controllers/profile.controller';
import signUp from '../controllers/signUp.controller';
import checkLogin from '../middleware/checkLogin.middleware';

const routes = (app: Express) => {
    // app.route('/').get(checkAPIHealth);
    app.route('/signup').post(signUp);
    app.route('/login').post(logIn);
    app.route('/profile').get(checkLogin, getProfile);
    app.route('/profile').put(checkLogin, updateProfile);
    app.route('/change-password').post(checkLogin, changePassword);
};
export default routes;
