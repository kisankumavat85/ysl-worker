import { AutoRouter } from 'itty-router';

import { addLink, getLink } from './controllers/link';
import { auth } from './controllers/auth';

const router = AutoRouter({
  base: '/api',
});

router.post('/link/add', auth, addLink);
router.get('/link/:slug', auth, getLink);

export default { ...router };
