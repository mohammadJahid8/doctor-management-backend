import express from 'express';
import { UserRoutes } from '../modules/user/user.route.js';
import { AppointmentRoutes } from '../modules/appointment/appointment.routes.js';
import { ArticleRoutes } from '../modules/article/article.routes.js';
import { BillingRoutes } from '../modules/billing/billing.routes.js';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/appointment',
    route: AppointmentRoutes,
  },
  {
    path: '/article',
    route: ArticleRoutes,
  },
  {
    path: '/billing',
    route: BillingRoutes,
  },
];

moduleRoutes?.forEach(route => router.use(route.path, route.route));

export default router;
