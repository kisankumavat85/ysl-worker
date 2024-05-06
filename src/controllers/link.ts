import { RequestHandler, error, json } from 'itty-router';
import { nanoid } from 'nanoid';

import { addLinkReqBodySchema } from '../schema';

const defaultExpiration = 60 * 60 * 24 * 30; // 30 days

export const addLink: RequestHandler = async (request, { kv }) => {
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

    return { success: true, slug, originalUrl: data.originalUrl };
  } catch {
    return error(500, {
      error: 'Internal server error',
      success: false,
    });
  }
};

export const getLink: RequestHandler = async (request, { kv }) => {
  try {
    const slug = request.params?.slug;

    if (!slug) {
      return error(422, {
        success: false,
        message: 'Slug is required',
      });
    }

    const originalUrl = await kv.get(slug);

    if (!originalUrl) {
      return error(404, {
        success: false,
        message: 'Original URL not found',
      });
    }

    return json({
      success: true,
      originalUrl,
      slug,
    });
  } catch {
    return error(500, {
      error: 'Internal server error',
      success: false,
    });
  }
};
