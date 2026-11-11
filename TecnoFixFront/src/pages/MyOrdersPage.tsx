import { useEffect, useRef, useState } from 'react'
import MensajeError from '../components/MensajeError'
import Tooltip from '../components/Tooltip'
import { BUDGET_MESSAGES } from '../config/constantes'
import type { ClientOrder } from '../interfaces/ClientOrder'
import { approveBudget, getMyOrders, rejectBudget } from '../services/clientOrderService'
import { showConfirmationDialog } from '../utils/dialogo'
import { getErrorMessage } from '../utils/errores'
import { formatCurrency, formatDate } from '../utils/format'
import './MyOrdersPage.css'

type BudgetDecision = 'approve' | 'reject'

const DECISIONS = {
  approve: {
    confirmTitle: BUDGET_MESSAGES.approveConfirmTitle,
    confirmText: BUDGET_MESSAGES.approveConfirmText,
    confirmButton: 'Sí, aprobar',
    success: BUDGET_MESSAGES.approveSuccess,
    send: approveBudget,
  },
  reject: {
    confirmTitle: BUDGET_MESSAGES.rejectConfirmTitle,
    confirmText: BUDGET_MESSAGES.rejectConfirmText,
    confirmButton: 'Sí, rechazar',
    success: BUDGET_MESSAGES.rejectSuccess,
    send: rejectBudget,
  },
} as const

const SINGLE_COLUMN_QUERY = '(max-width: 800px)'

const getDeviceName = (order: ClientOrder): string => `${order.deviceType} · ${order.brandAndModel}`

function MyOrdersPage() {
  const [orders, setOrders] = useState<ClientOrder[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [decisionInProgress, setDecisionInProgress] = useState<BudgetDecision | null>(null)
  const [decisionError, setDecisionError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const detailRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let isMounted = true

    const loadOrders = async () => {
      try {
        const loadedOrders = await getMyOrders()
        if (!isMounted) return

        const firstPendingOrder = loadedOrders.find((order) => order.canDecideBudget)
        setOrders(loadedOrders)
        setSelectedOrderId((firstPendingOrder ?? loadedOrders[0])?.id ?? null)
      } catch (error) {
        if (isMounted) setLoadError(getErrorMessage(error))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadOrders()

    return () => {
      isMounted = false
    }
  }, [])

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrderId(orderId)
    setDecisionError('')
    setSuccessMessage('')

    if (window.matchMedia(SINGLE_COLUMN_QUERY).matches) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleDecision = async (decision: BudgetDecision) => {
    if (!selectedOrder) return

    const { confirmTitle, confirmText, confirmButton, success, send } = DECISIONS[decision]
    setDecisionError('')
    setSuccessMessage('')

    const isConfirmed = await showConfirmationDialog({
      title: confirmTitle,
      message: confirmText,
      confirmButtonText: confirmButton,
      cancelButtonText: 'Cancelar',
    })
    if (!isConfirmed) return

    setDecisionInProgress(decision)
    try {
      const updatedOrder = await send(selectedOrder.id)
      setOrders((current) => current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)))
      setSuccessMessage(success)
    } catch (error) {
      setDecisionError(getErrorMessage(error))
      const refreshedOrders = await getMyOrders().catch(() => null)
      if (refreshedOrders) setOrders(refreshedOrders)
    } finally {
      setDecisionInProgress(null)
    }
  }

  if (isLoading) {
    return (
      <section className="my-orders">
        <h1>Mis órdenes</h1>
        <p className="texto-suave">Cargando órdenes…</p>
      </section>
    )
  }

  return (
    <section className="my-orders">
      <h1>Mis órdenes</h1>
      <p className="texto-suave">Selecciona una orden para revisar su presupuesto.</p>

      <MensajeError message={loadError} />

      {!loadError && orders.length === 0 && <p className="my-orders__empty">{BUDGET_MESSAGES.noOrders}</p>}

      {orders.length > 0 && (
        <div className="my-orders__layout">
          <ul className="my-orders__list" aria-label="Listado de órdenes">
            {orders.map((order) => (
              <li key={order.id}>
                <button
                  type="button"
                  className={`order-item ${order.id === selectedOrderId ? 'order-item--selected' : ''}`}
                  aria-current={order.id === selectedOrderId}
                  onClick={() => handleSelectOrder(order.id)}
                >
                  <span className="order-item__header">
                    <strong>Orden N.º {order.id}</strong>
                    <span className={`order-status ${order.canDecideBudget ? 'order-status--pending' : ''}`}>
                      {order.status}
                    </span>
                  </span>
                  <span className="order-item__device">{getDeviceName(order)}</span>
                  <span className="order-item__issue">{order.issueDescription}</span>
                  <span className="order-item__date">Ingresada el {formatDate(order.createdAt)}</span>
                </button>
              </li>
            ))}
          </ul>

          {selectedOrder && (
            <article className="order-detail" aria-live="polite" ref={detailRef}>
              <header className="order-detail__header">
                <h2>Orden N.º {selectedOrder.id}</h2>
                <span className={`order-status ${selectedOrder.canDecideBudget ? 'order-status--pending' : ''}`}>
                  {selectedOrder.status}
                </span>
              </header>

              <dl className="order-detail__data">
                <div>
                  <dt>Equipo</dt>
                  <dd>{getDeviceName(selectedOrder)}</dd>
                </div>
                {selectedOrder.serialNumber && (
                  <div>
                    <dt>Número de serie</dt>
                    <dd>{selectedOrder.serialNumber}</dd>
                  </div>
                )}
                <div>
                  <dt>Falla reportada</dt>
                  <dd>{selectedOrder.issueDescription}</dd>
                </div>
                {selectedOrder.accessories && (
                  <div>
                    <dt>Accesorios entregados</dt>
                    <dd>{selectedOrder.accessories}</dd>
                  </div>
                )}
                <div>
                  <dt>Fecha de ingreso</dt>
                  <dd>{formatDate(selectedOrder.createdAt)}</dd>
                </div>
              </dl>

              <div className="order-detail__budget-title">
                <h3>Presupuesto</h3>
                <Tooltip texto={BUDGET_MESSAGES.help} />
              </div>

              {selectedOrder.budget && (
                <div className="budget">
                  <p className="budget__diagnosis">
                    <strong>Diagnóstico técnico:</strong> {selectedOrder.budget.diagnosis}
                  </p>
                  <dl className="budget__costs">
                    <div>
                      <dt>Mano de obra</dt>
                      <dd>{formatCurrency(selectedOrder.budget.laborCost)}</dd>
                    </div>
                    <div>
                      <dt>Repuestos</dt>
                      <dd>{formatCurrency(selectedOrder.budget.partsCost)}</dd>
                    </div>
                    <div className="budget__total">
                      <dt>Total</dt>
                      <dd>{formatCurrency(selectedOrder.budget.totalCost)}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {selectedOrder.canDecideBudget && (
                <>
                  <div className="order-detail__actions">
                    <button
                      type="button"
                      className="boton order-detail__reject"
                      disabled={decisionInProgress !== null}
                      onClick={() => handleDecision('reject')}
                    >
                      {decisionInProgress === 'reject' ? 'Rechazando…' : 'Rechazar presupuesto'}
                    </button>
                    <button
                      type="button"
                      className="boton boton--primario"
                      disabled={decisionInProgress !== null}
                      onClick={() => handleDecision('approve')}
                    >
                      {decisionInProgress === 'approve' ? 'Aprobando…' : 'Aprobar presupuesto'}
                    </button>
                  </div>
                  <MensajeError message={decisionError} />
                </>
              )}

              {!selectedOrder.canDecideBudget && !successMessage && (
                <MensajeError message={BUDGET_MESSAGES.notAvailable} />
              )}

              {successMessage && (
                <p className="order-detail__success" role="status">
                  {successMessage}
                </p>
              )}
            </article>
          )}
        </div>
      )}
    </section>
  )
}

export default MyOrdersPage
