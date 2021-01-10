/**
 * Redirects the user to the Bots invite URL
 */
import { app } from 'app'

import root from '../../../../graphql/root'

app.use('/api/invite', (req, res) => {
  const url = root.invite()

  res.redirect(url)
})
