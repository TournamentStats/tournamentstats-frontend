import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler((event) => {
	const user = event.context.auth.user
	const tournamentId = getRouterParam(event, 'tournamentId')

	const client = await serverSupabaseServiceRole(event)

	const response = await client.from('tournament')
		.select('short_id, owner_id, name, is_private, start_date, end_date, image_path')
		.eq('short_id', tournamentId)
		.single()

	const { data } = response
	handleError(user, response)
	return data
})
