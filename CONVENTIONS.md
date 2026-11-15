# Estándar de programación y estilo visual — TecnoFix

Estándar del equipo Balatrines para el código del repositorio (requerimiento no funcional NF04) y para la interfaz (NF01).
Lo revisa el líder de programación en cada Pull Request. Un PR que no lo cumpla se corrige antes de hacer merge.

## 1. Idioma

| Qué | Idioma |
|---|---|
| Código: clases, métodos, variables, archivos, rutas de la API, tablas y columnas | Inglés |
| Textos que ve el usuario: etiquetas, botones, mensajes, correos | Español, con trato de **usted** |
| Comentarios en el código y mensajes de commit | Español |

Los mensajes de validación se copian **textuales** desde la tarjeta de la ERS (por ejemplo, «Correo electrónico o contraseña incorrectos»).

## 2. Nombres en el backend (C# / .NET)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases, interfaces, DTO, controladores | PascalCase; interfaces con prefijo `I` | `ClientOrderService`, `IOrderRepository`, `CreateOrderDto` |
| Métodos | PascalCase; los asíncronos terminan en `Async` | `ApproveBudgetAsync` |
| Propiedades de DTO | PascalCase | `LaborCost`, `IssueDescription` |
| Propiedades de entidades (`Models`) | camelCase, igual que la columna en la base de datos | `order.clientId`, `order.status` |
| Variables locales y parámetros | camelCase | `clientId`, `decisionLog` |
| Campos privados | `_camelCase` | `_orderRepository` |
| Constantes | PascalCase | `BudgetNotAvailableMessage` |

- Los nombres son mnemotécnicos: describen qué representan (`technician`, no `t` ni `ingeniero`).
- Los estados de una orden se usan siempre desde `Models/OrderStatus.cs`, nunca escritos a mano.

### Arquitectura (MVC por capas)

`controllers` recibe la petición y valida el rol → `Services` aplica las reglas de la ERS → `Repositories` accede a la base de datos → `DTOs` definen lo que entra y sale de la API.
Las validaciones de la ERS se aplican **siempre en el backend**, aunque también estén en el frontend.

### Migraciones (EF Core)

- Una migración por cambio de modelo, generada sobre `main` actualizado.
- **Nunca** se comenta ni se edita a mano el `Up` de una migración ya generada. Si choca con otra, se borra y se vuelve a generar.
- Antes del PR se corre el backend contra una base vacía y se verifica que no aparezca `PendingModelChangesWarning`.

## 3. Nombres en el frontend (React / TypeScript)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes y páginas (archivo y función) | PascalCase; las páginas terminan en `Page` | `MyOrdersPage.tsx` |
| Funciones, variables y hooks | camelCase; los hooks empiezan con `use` | `handleDecision`, `useAuth` |
| Servicios de API | camelCase, terminan en `Service` | `clientOrderService.ts` |
| Constantes de módulo | UPPER_SNAKE_CASE | `BUDGET_MESSAGES` |
| Clases CSS | kebab-case, estilo BEM | `order-detail__header` |

## 4. Git

- **Ramas:** `feature/<ID>-descripcion` para requerimientos, `fix/<ID>-descripcion` para correcciones, `docs/...` para documentación. Ejemplo: `feature/ORD-003-aprobar-rechazar-presupuesto`.
- **Commits:** Conventional Commits con el ID del requerimiento como alcance: `tipo(ID): descripción en minúsculas`.
  Tipos: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`. Ejemplo: `feat(ORD-003): implementar aprobacion y rechazo de presupuesto`.
- Commits pequeños y frecuentes, cada uno con un solo cambio.
- **Pull Request:** todo cambio entra a `main` por PR, con al menos una aprobación de otro integrante. El líder de programación revisa este estándar.
- No se sube al repositorio ningún archivo con claves (`appsettings.json`, `.env`).

## 5. Estilo visual común (NF01)

| Elemento | Regla |
|---|---|
| Colores base | Paleta aprobada por el cliente: primario `#064789`, secundario `#427AA1`, fondo `#EBF2FA` |
| Tipografía | `Segoe UI` (variables de `index.css`); no se definen otras fuentes en los componentes |
| Mensajes de error | Texto `#f56558`. Bajo el campo cuando corresponden a un campo; en recuadro (fondo `#FDECEA`) cuando son del formulario o de la operación |
| Mensajes de éxito | Recuadro verde: texto `#155724` sobre `#D4EDDA` (tono pendiente de confirmación por correo con el cliente) |
| Confirmación «¿Está seguro?» | Siempre con `showConfirmationDialog` (`utils/dialogo.ts`), nunca con `confirm()` ni con un modal propio |
| Botones | Clases `boton boton--primario`; el texto usa un verbo en infinitivo («Registrar técnico», «Aprobar presupuesto») |
| Carga | El botón se deshabilita y cambia su texto mientras espera («Registrando…», «Aprobando…») |
| Ayuda en línea (NF03) | Componente `Tooltip` |

## 6. Pendientes conocidos

Partes del código que todavía no cumplen este estándar y se corregirán en los próximos PR:

- DTO con nombres en español: `RegistroClienteDto`, `RegistroTecnicoDto` (propiedades `NombreCompleto`, `Telefono`, `Especialidad`).
- Archivos del frontend en español: `CampoFormulario`, `MensajeError`, `RutaProtegida`, `RegistroCliente`, `RegistroOrdenForm`, `DiagnosticoOrderForm`, `menuPorRol`, `constantes`, `dialogo`, `errores`, `validaciones`.
- Propiedades de `User` y `Role` que mezclan mayúsculas (`ID`, `RUT`, `CreateOnly`).
- Registrar técnico usa un modal propio en vez de `showConfirmationDialog`; registro de cliente, registrar orden y diagnóstico muestran el éxito en una ventana emergente en vez del recuadro verde.
