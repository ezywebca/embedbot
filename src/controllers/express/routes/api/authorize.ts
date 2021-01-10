/**
 * Redirects the user to the Discord authorize page
 */
import { app } from 'app'

import root from '../../../../graphql/root'

app.use('/api/authorize', (req, res) => {
  const url = root.authorize()

  res.redirect(url)
})
