<template>
    <section class='home'>
        <div>
            <h1>CONRAD's Home page!</h1>
            <h2 @click='$router.push("/about")'>ABOUT</h2>
            <router-link to='/todos' tag='h2'>Todo App</router-link>
        </div>
    </section>
</template>
<script>
export default {
  methods: {
  }
}
</script>
