const app = require('./app')
const { PORT } = require('./utils/config')
const { info } = require('./utils/logger')

app.listen(PORT || 3001, () => {
  info(`Server running on port ${PORT}`)
})
