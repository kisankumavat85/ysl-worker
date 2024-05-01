import { AutoRouter } from 'itty-router';
import { addLink, getLink } from './controllers/link';

const router = AutoRouter({
	base: '/api',
});

router.post('/link/add', addLink);
router.get('/link/:slug', getLink);

export default { ...router };
