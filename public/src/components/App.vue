<template lang="html">
  <div  v-loading.body="loading">
    <div class="message">
      {{ message }}
    </div>
    <div class="count">
      {{ count }}
    </div>
     <el-button @click.native="startHacking">Let's do itttttt</el-button>
  </div>
</template>

<script>
export default {
    data () {
        return {
            loading:false,
            count : 0,
            message: 'Helo, Vue.js 2.0..'
        }
    },
    props:["doJun"],
    mounted () {
        this.handle = setInterval(() => {
            this.count++
        }, 1000)
    },

    destroyed () {
        clearInterval(this.handle)
    },
    methods:{
        startHacking:function(){

           this.$emit("do-jun")
        }
    }
}
</script>

<style lang="css">
.message {
    color: pink;
    font-size: 5.4em;
}

    .count {
        color: #ffae70;
        font-size: 5.4em;
    }
</style>