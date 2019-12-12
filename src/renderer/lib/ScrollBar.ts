import { Rect } from './Shape'
import { G } from './G'
import { SElement } from './SElement'
import { Sizeable, Dragger } from '../utils'
import { EventEmitter, Observer, ObserverCallbackFunc } from '@/shared'

type IScrollBarEventMap = {
  'scroll'(pos: number): void
}

export class ScrollBar extends G {
  events: EventEmitter<IScrollBarEventMap>
  dragger: Dragger

  isVertical: boolean

  background: Rect

  scrollBar: Rect

  /**
   * scroll current position
   */
  current: Observer<number>

  /**
   * scroll bar length / scroll total length [0 - 1]
   */
  ratio: number

  private _view: {
    length: number
    thickness: number
  }

  get length() {
    return this._view.length
  }

  get thickness() {
    return this._view.thickness
  }

  /**
   *
   * @param ratio =scroll bar length / scroll total length
   * @param length Scroll viewport length
   * @param thickness
   * @param isVertical
   */
  constructor(ratio: number, length = 100, isVertical = false, thickness = 2) {
    super()
    this.ratio = ratio
    this._view = { thickness, length }
    this.isVertical = isVertical
    this.current = new Observer(0)

    this.events = new EventEmitter()

    this._initSVG()
    this.addClasses('s_scroll')
    this.current.sub(this._posUpdate)
    this.dragger = new Dragger(this.scrollBar.dom)

    this._initDragger()
  }

  private _initDragger() {
    this.dragger.on('dragging', (dx, dy) => {
      const dmove = this.isVertical ? dy : dx
      this.scrollTo(this.current.value + dmove)
    })
  }

  private _initSVG() {
    if (this.isVertical) {
      this.background = new Rect(this.thickness, this.length, this.thickness / 2)
      this.scrollBar = new Rect(this.thickness, this.length * this.ratio, this.thickness / 2)
    } else {
      this.background = new Rect(this.length, this.thickness, this.thickness / 2)
      this.scrollBar = new Rect(this.length * this.ratio, this.thickness, this.thickness / 2)
    }
    this.background.addClasses('s_scroll_background')
    this.scrollBar.addClasses('s_scroll_bar')

    this.scrollTo(this.current.value)
  }

  private _posUpdate: ObserverCallbackFunc<number> = (now) => {
    if (this.isVertical) {
      this.scrollBar.move(0, now)
    } else {
      this.scrollBar.move(now, 0)
    }
  }

  resize() {
    if (this.isVertical) {
      this.background.attr({ width: this.thickness, height: this.length })
      this.scrollBar.attr({ width: this.thickness, height: this.length * this.ratio })
    } else {
      this.background.attr({ width: this.length, height: this.thickness })
      this.scrollBar.attr({ width: this.length * this.ratio, height: this.thickness })
    }
  }

  setRatio(ratio: number) {
    this.ratio = ratio
    this.resize()
  }

  setViewport(length: number, thickness?: number) {
    this._view.length = length
    this._view.thickness = thickness ?? this.thickness
    this.resize()
  }

  scrollTo(pos: number) {
    const maxLen = this.length * (1 - this.ratio)
    const current = pos < 0 ? 0 : pos > maxLen ? maxLen : pos
    this.current.set(current)
  }

  render(el: SElement) {
    super.render(el)
    this.background.render(this)
    this.scrollBar.render(this)
  }

  destroy() {
    super.destroy()
    this.dragger.destroy()
  }
}

export class ScrollPair extends G {
  vertical: ScrollBar

  horizontal: ScrollBar

  readonly thickness: number

  size: Sizeable

  /**
   *
   * @param hRatio Scroll bar ratio [0 - 1]
   * @param vRatio Scroll bar ratio [0 - 1]
   * @param width View size width
   * @param height View size height
   */
  constructor(hRatio: number, vRatio: number, width: number, height: number, thickness = 2) {
    super()
    this.thickness = thickness
    this.size = new Sizeable(width, height)

    this.vertical = new ScrollBar(vRatio, height - this.thickness, true, this.thickness)
    this.vertical.addClasses('s_scrolls_vertical')
    this.horizontal = new ScrollBar(hRatio, width - this.thickness, false, this.thickness)
    this.horizontal.addClasses('s_scrolls_horizontal')

    this.setRatio(hRatio, vRatio)
    this.setSize(width, height)
    this.addClasses('s_scrolls')
  }

  scrollTo(x: number, y: number) {
    this.horizontal.scrollTo(x)
    this.vertical.scrollTo(y)
  }

  setSize(width: number, height: number) {
    this.size.set({ width, height })

    this.horizontal.setViewport(width - this.thickness)
    this.horizontal.move(0, height - this.thickness)

    this.vertical.setViewport(height - this.thickness)
    this.vertical.move(width - this.thickness, 0)
  }

  setRatio(hRatio: number, vRatio: number) {
    this.horizontal.setRatio(hRatio)
    this.vertical.setRatio(vRatio)
  }

  render(el: SElement, showHorizontal = true, showVertical = true) {
    super.render(el)

    showHorizontal && this.horizontal.render(this)
    showVertical && this.vertical.render(this)
  }

  destroy() {
    super.destroy()
  }
}
