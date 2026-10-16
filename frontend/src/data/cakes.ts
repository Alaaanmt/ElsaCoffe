import imgTortaFranui from '@/assets/img/torta-franui.png'
import imgTortitaNegra from '@/assets/img/tortita-negra-sandwich.png'
import imgTortaMatilda  from '@/assets/img/torta-matilda.png'

export interface TortaEncargo {
  id: string
  nombre: string
  descripcion: string
  rinde: string
  precio: string
  badge?: string
  imagen: string
}

export const tortasCompletas: TortaEncargo[] = [
  {
    id: 'matilda',
    nombre: 'Torta Matilda',
    descripcion: 'Intenso bizcocho húmedo de chocolate puro, relleno y cubierto con abundante dulce de leche artesanal y ganache de chocolate semiamargo.',
    rinde: '10 a 12 porciones',
    precio: '$90.000',
    badge: 'Más elegida',
    imagen: imgTortaMatilda
  },
  {
    id: 'red-velvet',
    nombre: 'Red Velvet',
    descripcion: 'Clásico bizcocho rojo aterciopelado con un toque sutil de cacao, intercalado con capas de frosting suave de queso crema y vainilla.',
    rinde: '10 a 12 porciones',
    precio: '$90.000',
    imagen: imgTortitaNegra
  },
  {
    id: 'carrot-cake',
    nombre: 'Carrot Cake',
    descripcion: 'Torta húmeda de zanahorias frescas, nueces tostadas y especias dulces, cubierta con una delicada crema de queso y frosting.',
    rinde: '8 a 10 porciones',
    precio: '$90.000',
    imagen: imgTortaFranui
  },
  {
    id: 'torta-vasca',
    nombre: 'Torta Vasca (Cheesecake)',
    descripcion: 'Típica tarta de queso de origen vasco, tostada por fuera y cremosa por dentro, elaborada sin base de masa y con una textura inigualable.',
    rinde: '10 porciones',
    precio: '$90.000',
    badge: 'Sin TACC opcional',
    imagen: imgTortitaNegra
  },
  {
    id: 'torta-patagonica',
    nombre: 'Torta Patagónica',
    descripcion: 'Delicado bizcocho húmedo relleno de dulce de leche artesanal y una selección de frutos rojos frescos de la región.',
    rinde: '10 a 12 porciones',
    precio: '$90.500',
    imagen: imgTortaFranui
  },
  {
    id: 'crumble-manzana',
    nombre: 'Crumble de Manzana',
    descripcion: 'Base de masa sablé crujiente, generoso relleno de manzanas tiernizadas a la canela y cubierta crocante de manteca y almendras.',
    rinde: '8 a 10 porciones',
    precio: '$90.000',
    imagen: imgTortitaNegra
  },
  {
    id: 'elsa',
    nombre: 'Torta Especial ELSA',
    descripcion: 'Nuestra receta insignia de la casa: capas húmedas de biscuit de almendras, crema ligera de chocolate blanco y reducción de frutos rojos.',
    rinde: '12 porciones',
    precio: '$90.000',
    badge: 'De la casa',
    imagen: imgTortaFranui
  }
]