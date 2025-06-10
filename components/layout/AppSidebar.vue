<script setup lang="ts">
import type { NavGroup, NavLink, NavSectionTitle } from '~/types/nav'
import { navMenu, navMenuBottom } from '~/constants/menus'
import { useUser } from '~/composables/useUser'
import { useAppSettings } from '~/composables/useAppSettings'

function resolveNavItemComponent(item: NavLink | NavGroup | NavSectionTitle): any {
  if ('children' in item)
    return resolveComponent('LayoutSidebarNavGroup')

  return resolveComponent('LayoutSidebarNavLink')
}

const teams: {
  name: string
  logo: string
  plan: string
}[] = [
    {
      name: 'Acme Inc',
      logo: 'i-lucide-gallery-vertical-end',
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: 'i-lucide-audio-waveform',
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: 'i-lucide-command',
      plan: 'Free',
    },
  ]

const { user } = useUser()
const { sidebar } = useAppSettings()
const firstName = "Nuzair"
const lastName = "Nuwais"
const email = "nuzairnuwais@gmail.com"

</script>

<template>
  <Sidebar :collapsible="sidebar.collapsible" :side="sidebar.side" :variant="sidebar.variant">
    <SidebarHeader>
      <LayoutSidebarNavHeader :teams="teams" />
      <!-- <Search /> -->
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="(nav, indexGroup) in navMenu" :key="indexGroup">
        <SidebarGroupLabel v-if="nav.heading">
          {{ nav.heading }}
        </SidebarGroupLabel>
        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in nav.items" :key="index" :item="item" />
      </SidebarGroup>
      <SidebarGroup class="mt-auto">
        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenuBottom" :key="index" :item="item"
          size="sm" />
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <LayoutSidebarNavFooter v-if="user" :user="user" />
    </SidebarFooter>
    <SidebarRail />
    <div class="flex flex-row gap-5 items-center mb-2">
      <label className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img src='https://api.dicebear.com/9.x/lorelei/svg?seed=Aiden' alt="profile" />
        </div>
      </label>
      <div class="flex flex-col text-[0.9rem]">
        <div>
          {{ firstName }} {{ lastName }}

        </div>
        <div>
          {{ email }}
        </div>
      </div>

    </div>

  </Sidebar>
</template>

<style scoped></style>
