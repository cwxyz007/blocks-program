import { vec2Distance } from '../shared'
import { BlockSVG } from './BlockSVG'
import { Renderer } from './Renderer'
import { Connection, IConnectionOption } from './Connection'
import { config } from '../config'
import { DebugDotSVg } from './DebugDotSVG'

export interface IConnectionPair {
  from: Connection
  to: Connection
}

export class ConnectionManager {
  readonly $r: Renderer
  readonly maxRange: number
  connections: Set<Connection>

  constructor(renderer: Renderer, range = 10) {
    this.$r = renderer
    this.connections = new Set()
    this.maxRange = range
  }

  createConnection(b: BlockSVG, opt: IConnectionOption) {
    let conn = new Connection(b, opt)

    if (config.debug) {
      const dot = new DebugDotSVg(0, 0, conn.sourceBlock)
      conn = dot.proxyOnConnection(conn)
    }

    this.connections.add(conn)

    b.events.on('beforeDestroy', () => {
      this.connections.delete(conn)
    })

    return conn
  }

  getNearestConn(conn: Connection) {
    if (conn.isConnected) {
      return null
    }

    let nearestOne: Connection | null = null
    let minDistance = Infinity

    for (const c of this.connections) {
      if (conn.sourceBlock === c.sourceBlock || !conn.checkDestConn(c)) {
        continue
      }

      const destPos = c.sourceBlock.getWorldPosition()
      const curPos = conn.sourceBlock.getWorldPosition()
      const d = vec2Distance(
        {
          x: c.dx + destPos.x,
          y: c.dy + destPos.y
        },
        {
          x: conn.dx + curPos.x,
          y: conn.dy + curPos.y
        }
      )

      if (d < this.maxRange && d < minDistance) {
        minDistance = d
        nearestOne = c
      }
    }

    return nearestOne
  }

  getNearestConnPair(...conns: (Connection | undefined)[]) {
    let pair: IConnectionPair | null = null

    for (const conn of conns) {
      if (!conn) {
        continue
      }

      const dest = this.getNearestConn(conn)

      if (dest) {
        pair = {
          from: conn,
          to: dest
        }
      }
    }

    return pair
  }
}
