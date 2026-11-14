import type { OrderHistoryEntry } from '../interfaces/OrderHistory'
import { formatDateTime } from '../utils/format'
import './OrderHistory.css'

interface OrderHistoryProps {
  entries: OrderHistoryEntry[]
}

function OrderHistory({ entries }: OrderHistoryProps) {
  if (!entries || entries.length === 0) {
    return <p className="order-history__empty">Sin eventos registrados.</p>
  }

  return (
    <ol className="order-history" aria-label="Bitácora de la orden">
      {entries.map((entry) => (
        <li key={entry.id} className="order-history__item">
          <div className="order-history__header">
            <time className="order-history__date" dateTime={entry.date}>
              {formatDateTime(entry.date)}
            </time>
            {entry.newStatus && <span className="order-history__status">{entry.newStatus}</span>}
          </div>
          <p className="order-history__action">{entry.action}</p>
          <p className="order-history__actor">
            Responsable:{' '}
            {entry.userName ? (
              <strong>
                {entry.userName}
                {entry.userRole ? ` · ${entry.userRole}` : ''}
              </strong>
            ) : (
              <span className="order-history__no-actor">No registrado (evento histórico)</span>
            )}
          </p>
        </li>
      ))}
    </ol>
  )
}

export default OrderHistory
