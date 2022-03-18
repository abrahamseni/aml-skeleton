const { useSnack } = require('./useSnack')

const Elements = jest.requireActual('@reapit/elements')

module.exports = {
  __esModule: true,
  ...Elements,
  useSnack,
}
