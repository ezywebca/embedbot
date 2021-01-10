/**
 * Generates an invite for a server
 * @example
 * /api/server/299881420891881473
 */
import { app } from 'app'
import fetchInvite from 'engine/util/fetchInvite'

app.use('/api/server/:server/:channel?', async (req, res) => {
  const { server, channel } = req.params
  try {
    const invite = await fetchInvite({ server, channel })
    res.redirect(invite, 301)
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    })
  }
})
