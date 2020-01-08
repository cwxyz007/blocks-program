import { Block, BlockField, IBlockFieldOption } from '@/core'
import { ObserverCallbackFunc } from '@/shared'
import { FieldTypes } from './const'

export class BlockSlotField extends BlockField<Block> {
  get isSlot() {
    return true
  }

  constructor(name: string, value: Block | null = null, opt: IBlockFieldOption = {}) {
    super(name, value, {
      type: FieldTypes.blockSlot,
      ...opt
    })

    this.block.sub(this.blockChanged)
  }

  private blockChanged: ObserverCallbackFunc<Block> = (now, pre) => {
    this._value = now
  }

  /**
   * Whether block can connect to this field
   */
  checkConnection(block: Block): boolean {
    return !block.hasOutput
  }

  value() {
    return this._value
  }

  clone() {
    const { id, ...otherOption } = this.getOptions()

    const newField = new BlockSlotField(this.name, null, otherOption)

    const block = this.value()?.clone()

    block?.connectToField(newField)

    return newField
  }
}
