import { BlockTextField } from '@/fields'
import { Text } from '../lib'

export class BlockTextFieldSVG extends Text {
  $f: BlockTextField

  constructor(field: BlockTextField) {
    super()

    this.$f = field
    this.addClasses('s_field_text')

    this.text(this.$f.value() || '')
  }
}
