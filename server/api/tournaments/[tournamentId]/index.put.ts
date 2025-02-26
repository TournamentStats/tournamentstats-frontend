import { z } from 'zod'

import { serverSupabaseServiceRole } from '#supabase/server'
import { logAPI } from '~/server/utils/logging'
import { authentication } from '~/server/utils/middleware'

const requestBody = z.object({
	name: z.string().min(3).max(32),
	is_private: z.boolean(),
})

/**
 * PUT /tournaments/[tournamentId]
 */
export default defineEventHandler({
	onRequest: [
		authentication,
	],
	onBeforeResponse: [
		logAPI,
	],
	handler: async (event) => {
		const user = event.context.auth.user!

		const shortTournamentId = getRouterParam(event, 'tournamentId')

		if (!shortTournamentId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Bad Request',
				message: 'No tournament id given',
			})
		}

		const client = serverSupabaseServiceRole(event)
		const { name, is_private: isPrivate } = await readValidatedBody(event, data => requestBody.parse(data))

		const updateTournamentResponse = await client.from('tournament')
			.update({
				name: name,
				is_private: isPrivate,
			})
			.eq('short_id', shortTournamentId)
			.eq('owner_id', user.id)
			.select('short_id, owner_id, name, is_private, start_date, end_date')
			.maybeSingle()

		if (updateTournamentResponse.error) {
			event.context.errors.push(updateTournamentResponse.error)
			handleError(updateTournamentResponse)
		}

		if (!updateTournamentResponse.data) {
			throw createError({
				statusCode: 404,
				statusMessage: 'Not Found',
				message: 'Tournament not found',
			})
		}

		return updateTournamentResponse.data
	},
})
