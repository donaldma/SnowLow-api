import 'mocha'

describe('tests', () => {
  it('test', () => {
    console.log('process.env.TEST_TOKEN', process.env.TEST_TOKEN)
    if(process.env.TEST === 'test') {
      console.log('ok it works')
    }
  })

})