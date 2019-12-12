import { ScrollBar, ScrollPair } from '@/renderer/lib'

describe('ScrollBar', () => {
  let bar: ScrollBar

  beforeEach(() => {
    bar = new ScrollBar(1, 100, false, 2)
  })

  it('new', () => {
    bar = new ScrollBar(1, 100, false, 2)

    expect(bar.background.attr('width')).toBe(100)
    expect(bar.background.attr('height')).toBe(2)

    expect(bar.scrollBar.attr('width')).toBe(100)
    expect(bar.scrollBar.attr('height')).toBe(2)

    bar = new ScrollBar(0.1, 200, true, 2)

    expect(bar.background.attr('height')).toBe(200)
    expect(bar.background.attr('width')).toBe(2)

    expect(bar.scrollBar.attr('height')).toBe(200 * 0.1)
    expect(bar.scrollBar.attr('width')).toBe(2)
  })

  it('setRatio', () => {
    bar.setRatio(0.5)

    expect(bar.background.attr('width')).toBe(100)
    expect(bar.background.attr('height')).toBe(2)

    expect(bar.scrollBar.attr('width')).toBe(100 * 0.5)
    expect(bar.scrollBar.attr('height')).toBe(2)
  })

  it('setViewport', () => {
    bar.setViewport(200, 4)
    expect(bar.background.attr('width')).toBe(200)
    expect(bar.background.attr('height')).toBe(4)

    expect(bar.scrollBar.attr('width')).toBe(200)
    expect(bar.scrollBar.attr('height')).toBe(4)
  })

  it('scrollTo', () => {
    bar.setRatio(0.1)

    bar.scrollTo(10)
    expect(bar.scrollBar.attr('x')).toBe(10)

    bar.scrollTo(-1)
    expect(bar.scrollBar.attr('x')).toBe(0)

    bar.scrollTo(100)
    expect(bar.scrollBar.attr('x')).toBe(90)
  })
})

describe('ScrollPair', () => {
  let scroll: ScrollPair

  beforeEach(() => {
    scroll = new ScrollPair(0.1, 0.2, 100, 200, 2)
  })

  it('new', () => {
    // scroll max length = length - thickness
    expect(scroll.horizontal.background.attr('width')).toBe(100 - 2)
    expect(scroll.horizontal.background.attr('height')).toBe(2)

    expect(scroll.vertical.background.attr('height')).toBe(200 - 2)
    expect(scroll.vertical.background.attr('width')).toBe(2)

    expect(scroll.horizontal.ratio).toBe(0.1)
    expect(scroll.vertical.ratio).toBe(0.2)
  })

  it('setRatio', () => {
    scroll.setRatio(0.2, 0.1)

    expect(scroll.horizontal.scrollBar.attr('width')).toBe((100 - 2) * 0.2)
    expect(scroll.vertical.scrollBar.attr('height')).toBe((200 - 2) * 0.1)
  })

  it('setSize', () => {
    scroll.setSize(200, 100)

    expect(scroll.horizontal.background.attr('width')).toBe(200 - 2)
    expect(scroll.horizontal.y).toBe(100 - 2)

    expect(scroll.vertical.background.attr('height')).toBe(100 - 2)
    expect(scroll.vertical.x).toBe(200 - 2)
  })

  it('scrollTo', () => {
    scroll.scrollTo(20, 20)

    expect(scroll.horizontal.scrollBar.attr('x')).toBe(20)
    expect(scroll.vertical.scrollBar.attr('y')).toBe(20)

    scroll.scrollTo(-20, -20)

    expect(scroll.horizontal.scrollBar.attr('x')).toBe(0)
    expect(scroll.vertical.scrollBar.attr('y')).toBe(0)

    scroll.scrollTo(2000, 2000)

    expect(scroll.horizontal.scrollBar.attr('x')).toBe((100 - 2) * (1 - 0.1))
    expect(scroll.vertical.scrollBar.attr('y')).toBe((200 - 2) * (1 - 0.2))
  })
})