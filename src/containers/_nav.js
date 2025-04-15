let menu = []
let indice = 0
menu = [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavTitle',
        _children: ['Menú Principal']
      }
    ]
  }
]
// CONSULTA
menu[0]._children.push(
  {
    _name: 'CSidebarNavDropdown',
    name: 'Consultas',
    icon: 'cilDescription',
    items: []
  }
)
indice++
menu[0]._children[indice].items.push({ name: 'Consulta Estudiante', to: '/'})

export default menu