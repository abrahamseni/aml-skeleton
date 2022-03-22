const { useSnack } = require('./useSnack')
const { FileInput } = require('./file-input')

const Elements = jest.requireActual('@reapit/elements')

module.exports = {
  __esModule: true,
  ...Elements,
  useSnack,
  FileInput,
}
