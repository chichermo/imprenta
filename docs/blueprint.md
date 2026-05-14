# Blueprint tecnico

## Objetivo

Construir una app web responsive para `Distribuidora San Pablo S.A.` con foco en:

- cotizaciones B2B
- venta de insumos para clinicas y salud
- trabajos de imprenta y senaletica
- ordenes de compra
- inventario
- preparacion para facturacion electronica chilena

## Stack base

- `Next.js` en `Vercel`
- `TypeScript`
- `Appwrite Auth`
- `Appwrite Databases`
- `Appwrite Storage`
- `Appwrite Functions`

## Modulos de primera fase

1. Clientes
2. Proveedores
3. Catalogo mixto de productos y servicios
4. Cotizaciones
5. Ordenes de trabajo
6. Inventario
7. Ordenes de compra
8. Dashboard

## Rutas iniciales del frontend

- `/`
- `/clientes`
- `/proveedores`
- `/catalogo`
- `/cotizaciones`
- `/ordenes-trabajo`
- `/compras`
- `/entregas`
- `/inventario`
- `/cobranzas`
- `/facturacion`
- `/reportes`

## Modelo de negocio

El sistema debe mezclar en un mismo flujo:

- productos fisicos de stock
- servicios de imprenta
- trabajos personalizados con especificaciones tecnicas

Por eso los documentos comerciales deben soportar `item_type`:

- `product`
- `service`
- `custom_job`

## Colecciones Appwrite sugeridas

### Core comercial

- `customers`
- `customer_contacts`
- `suppliers`
- `products`
- `services`
- `quotes`
- `quote_items`
- `work_orders`
- `purchase_orders`
- `purchase_order_items`
- `payments`

### Inventario

- `inventory_movements`
- `stock_reservations`

### Configuracion

- `company_settings`
- `price_lists`
- `users_profiles`
- `audit_logs`

### Tributario

- `invoices`
- `invoice_items`
- `dte_folios`
- `dte_submissions`

## Relaciones clave

- un `customer` tiene muchas `quotes`
- una `quote` tiene muchos `quote_items`
- una `quote` aprobada puede generar una `work_order`
- una `purchase_order` puede generar `inventory_movements`
- una `invoice` debe poder enlazarse a una `quote` o `delivery`
- un `dte_submission` debe enlazarse a una `invoice`

## Flujo operativo esperado

1. Crear o seleccionar cliente
2. Generar cotizacion
3. Aprobar cotizacion
4. Crear orden de trabajo si aplica
5. Reservar o descontar stock
6. Emitir orden de compra si falta abastecimiento
7. Entregar
8. Emitir factura electronica
9. Registrar pago o deuda

## Chile y facturacion electronica

La integracion tributaria debe quedar desacoplada del frontend.

### Recomendacion de arquitectura

- UI y formularios en `Next.js`
- logica tributaria en `Appwrite Functions`
- persistencia de XML/PDF en `Appwrite Storage`
- estados y trazabilidad en `dte_submissions`

### Documentos sugeridos

- Factura Electronica `33`
- Factura Exenta Electronica `34` si aplica
- Nota de Credito Electronica `61`
- Guia de Despacho Electronica `52` si aplica

### Datos necesarios

- RUT emisor
- razon social
- giro
- direccion
- certificado digital
- folios / CAF
- XML firmado
- track ID
- estado del envio

## Decisiones tomadas por ahora

- prioridad web responsive antes que PWA
- Appwrite como backend principal
- Vercel para frontend
- Chile como contexto legal de facturacion
- sin login por ahora para validar primero el flujo operativo
- construccion por fases para evitar sobrecarga inicial

## Siguiente implementacion recomendada

1. CRUD de clientes
2. CRUD de catalogo
3. flujo completo de cotizacion
4. orden de trabajo
5. inventario basico
6. integracion tributaria
7. Appwrite Auth y proteccion de rutas
