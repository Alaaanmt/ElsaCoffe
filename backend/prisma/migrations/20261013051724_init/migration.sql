-- CreateEnum
CREATE TYPE "TipoEntrega" AS ENUM ('RETIRO', 'ENVIO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('MERCADOPAGO', 'TRANSFERENCIA', 'EFECTIVO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION', 'LISTO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'PAGADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE', 'ENTREGADO');

-- CreateEnum
CREATE TYPE "Turno" AS ENUM ('MANANA', 'TARDE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" INTEGER NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "rinde" TEXT,
    "categoria" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryZone" (
    "id" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "costoEnvio" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "numeroPedido" SERIAL NOT NULL,
    "nombreCliente" TEXT NOT NULL,
    "apellidoCliente" TEXT NOT NULL,
    "emailCliente" TEXT NOT NULL,
    "telefonoCliente" TEXT NOT NULL,
    "notasCliente" TEXT,
    "tipoEntrega" "TipoEntrega" NOT NULL,
    "calleEnvio" TEXT,
    "numeroEnvio" TEXT,
    "pisoDeptoEnvio" TEXT,
    "ciudadEnvio" TEXT,
    "codigoPostal" TEXT,
    "indicacionesEnvio" TEXT,
    "costoEnvio" INTEGER NOT NULL DEFAULT 0,
    "subtotal" INTEGER NOT NULL,
    "totalFinal" INTEGER NOT NULL,
    "metodoPago" "MetodoPago" NOT NULL,
    "estadoPago" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "estadoPedido" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "estadoEntrega" "EstadoEntrega" NOT NULL DEFAULT 'PENDIENTE',
    "fechaTurno" DATE NOT NULL,
    "turno" "Turno" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "nombreProducto" TEXT NOT NULL,
    "imagenProducto" TEXT,
    "precioUnitario" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryZone_codigoPostal_key" ON "DeliveryZone"("codigoPostal");

-- CreateIndex
CREATE UNIQUE INDEX "Order_numeroPedido_key" ON "Order"("numeroPedido");

-- CreateIndex
CREATE INDEX "Order_estadoPedido_createdAt_idx" ON "Order"("estadoPedido", "createdAt");

-- CreateIndex
CREATE INDEX "Order_fechaTurno_turno_idx" ON "Order"("fechaTurno", "turno");

-- CreateIndex
CREATE INDEX "Order_emailCliente_idx" ON "Order"("emailCliente");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
