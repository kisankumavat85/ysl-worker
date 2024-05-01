import { IRequest, error, json } from 'itty-router';
import { nanoid } from 'nanoid';

import { addLinkReqBodySchema } from '../schema';

const defaultExpiration = 60 * 60 * 24 * 30; // 30 days

export const addLink = async (request: IRequest, { kv }: Env, ctx: ExecutionContext) => {
	try {
		const body = await request.json();
		const { success, data, error: validationError } = addLinkReqBodySchema.safeParse(body);

		if (!success) {
			return error(403, {
				error: validationError,
				success: false,
			});
		}

		const slug = nanoid(7);
		await kv.put(slug, data.originalUrl, {
			expirationTtl: data.expiration ?? defaultExpiration,
		});

		return { slug, originalUrl: data.originalUrl };
	} catch (e) {
		console.log('e ---', e);
		return error(500, {
			error: 'Internal server error',
			success: false,
		});
	}
};

export const getLink = async (request: IRequest, { kv }: Env, ctx: ExecutionContext) => {
	try {
		const slug = request.params?.slug;

		if (!slug) {
			error(422, {
				success: false,
				message: 'Slug is required',
			});
		}

		const data = await kv.get(slug);

		console.log('data', data);

		return json(data);
	} catch (e) {
		console.log('e ---', e);
		return error(500, {
			error: 'Internal server error',
			success: false,
		});
	}
};
