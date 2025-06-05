// middleware/global.ts
export default defineNuxtRouteMiddleware((to) => {
    return navigateTo(to.fullPath, { middleware: ['auth'] })
  })