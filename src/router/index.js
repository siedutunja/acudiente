import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    // 2025-03-01
    {
      path: '/',
      redirect: '/inicio',
      name: 'Inicio',
      component: () => import('@/containers/TheContainer'),
      children: [
        // 2025-03-01
        {
          path: 'inicio',
          //beforeEnter: autenticar,
          component: () => import('@/views/Inicio')
        },
      ]
    },
    // 2025-03-01
    {
      path: "*",
      component: () => import('@/views/pages/Extraviada')
    },
    // 2025-03-01
    {
      path: '/bienvenida',
      component: () => import('@/views/pages/Bienvenida')
    }
  ]
}

