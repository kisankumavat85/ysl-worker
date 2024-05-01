import z from 'zod';

export const addLinkReqBodySchema = z.object({
	originalUrl: z.string({ required_error: 'Original URL is required' }).url({
		message: 'Invalid URL',
	}),
	expiration: z.number().optional(),
});

export type AddLinkReqBody = z.infer<typeof addLinkReqBodySchema>;
