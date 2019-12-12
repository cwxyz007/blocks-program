import { EventEmitter } from '../EventEmitter'

describe('EventEmitter', () => {
  let e: EventEmitter

  beforeEach(() => {
    e = new EventEmitter()
  })

  it('on', () => {
    const fn = jest.fn()
    e.on('test', fn)

    const evts = e.events('test')
    expect(evts[0]).toBe(fn)
  })

  it('off', () => {
    const fn = () => {}

    e.on('testoff', fn)
    expect(e.events('testoff')[0]).toBe(fn)

    e.off('testoff', fn)
    const evts = e.events('testoff')
    expect(evts.length).toBe(0)
  })

  it('emit', async (done) => {
    const fn = jest.fn()
    e.on('test', fn)

    e.emit('test')
    expect(fn).toBeCalledTimes(1)

    e.on('test1', (p) => {
      expect(p).toBe(1)
      done()
    })

    e.emit('test1', 1)
  })
})
