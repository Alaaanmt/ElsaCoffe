export interface MenuItem {
  nombre: string;
  descripcion?: string;
  precio: string;
  badge?: string;
}

export interface MenuCategoria {
  id: string;
  titulo: string;
  subtitulo: string;
  items: MenuItem[];
}

export const categoriasMenu: MenuCategoria[] = [
  {
    id: 'cafeteria',
    titulo: 'Cafetería & Lattes',
    subtitulo: 'Café de especialidad y opciones frías o calientes.',
    items: [
      { nombre: 'Pocillo', descripcion: 'Espresso suave y cremoso', precio: '$4.200' },
      { nombre: 'Americano', precio: '$4.500' },
      { nombre: 'Café con Leche', precio: '$5.100' },
      { nombre: 'Flat White', precio: '$5.500' },
      { nombre: 'Capuccino', descripcion: 'Con canela y chocolate rallado', precio: '$7.800' },
      { nombre: 'Vainilla / Avellana (Lattes)', descripcion: 'Syrup, leche, shot de café y espuma', precio: '$8.000', badge: 'Popular' }
    ]
  },
  {
    id: 'desayunos',
    titulo: 'Desayunos & Meriendas',
    subtitulo: 'Para disfrutar con infusión y delicias artesanales.',
    items: [
      { nombre: 'Clásico', descripcion: 'Infusión + 2 facturas a elección', precio: '$7.500' },
      { nombre: 'De Campo', descripcion: 'Infusión + 2 tostadas con queso crema, mermelada, ddl y manteca', precio: '$11.000' },
      { nombre: 'Salado', descripcion: 'Infusión + tostada con palta, huevo y mini exprimido', precio: '$16.000', badge: 'Recomendado' },
      { nombre: 'Elsa Fit', descripcion: 'Infusión + yogurt con granola casera, frutas de estación y miel', precio: '$15.000' }
    ]
  },
  {
    id: 'almorza',
    titulo: 'Almorzá en Elsa',
    subtitulo: 'De 12 a 15 hs. Opciones frescas y sabrosas.',
    items: [
      { nombre: 'Brioché de Lomito', descripcion: 'Cheddar y huevo a la plancha', precio: '$14.300' },
      { nombre: 'Ciabatta de Crudo', descripcion: 'Jamón crudo, queso tybo, cherrys confitados, rúcula y queso crema', precio: '$16.000' },
      { nombre: 'Ensalada Caesar', descripcion: 'Mix de verdes, pollo grillé, parmesano, crutones y aderezo caesar', precio: '$16.000' },
      { nombre: 'Tarta del Día', descripcion: 'Con mix de verdes y tomate (Incluye bebida y café)', precio: '$17.300', badge: 'Ejecutivo' }
    ]
  },
  {
    id: 'pasteleria',
    titulo: 'Panadería & Pastelería',
    subtitulo: 'Elaboración 100% artesanal propia.',
    items: [
      { nombre: 'Medialunas (Manteca o Grasa)', precio: '$2.000' },
      { nombre: 'Croissant Tradicional', precio: '$4.200' },
      { nombre: 'Tortita Rellena', descripcion: 'Tortita negra rellena de jamón crudo, queso tybo, rúcula y tomate', precio: '$7.500' },
      { nombre: 'Matilda', descripcion: 'Bizcocho de chocolate, dulce de leche y ganache de chocolate', precio: '$14.000', badge: 'Artesanal' },
      { nombre: 'Cheesecake de Frutos Rojos', precio: '$13.500' }
    ]
  }
];