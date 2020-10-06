<template>
    <div>
        HELLO WORLD
    </div>
</template>

<script>
export default {
    props: ['testProp'],
    data() {
        return {
            helloWorldText: "hello world!!"
        }
    },
    methods: {
        helloWorld() {
            this.$emit('helloWorldClicked', this.helloWorldText)
        }
    },
    watch: { 
        testProp(e) {
            this.helloWorld()
        }
    }
}
</script>
