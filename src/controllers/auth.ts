import { error, RequestHandler } from 'itty-router';

export const auth: RequestHandler = async (request, { API_KEY }) => {
  try {
    const xApiKey = request.headers.get('x-api-key');
    const basicAuth = request.headers.get('Authorization')?.split('Basic ')[1];
    const apiKey = xApiKey ?? basicAuth;

    console.log('xApiKey', xApiKey);
    console.log('apiKey', apiKey);

    if (!apiKey || apiKey !== API_KEY) {
      return error(401, {
        success: false,
        message: 'API key required',
      });
    }
  } catch {
    return error(500, {
      error: 'Internal server error',
      success: false,
    });
  }
};
