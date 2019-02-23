<template>
  <q-layout view="hHh Lpr lFf ">
    <q-layout-header>
      <q-toolbar color="primary">
        <q-toolbar-title>Twitter List Image Viewer</q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <q-page>
        <q-list no-border>
          <q-item v-if="$store.state.user !== null">
            <q-item-side>
              <q-item-tile avatar>
                <img
                  :src="$store.state.user.profile_image_url_https"
                >
              </q-item-tile>
            </q-item-side>
            <q-item-main :label="$store.state.user.name" />
          </q-item>
          <q-item-separator />
          <q-list-header>Lists</q-list-header>
          <q-item
            v-for="list in $store.state.lists"
            :key="list.id_str"
            link
            :to="`/list/${list.id_str}`"
          >
            <q-item-main :label="list.name" />
          </q-item>
        </q-list>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>
