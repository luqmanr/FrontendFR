<template>
    <div class="pattern-selection row">
        <span class="col-sm-12" style="text-align: left;">Hadapkan wajah Anda, sesuai dengan Pattern di bawah ini!</span>
        <div class="col-sm-9 row">
            <div v-for="selection,index in facePattern" class="col-sm-12" style="text-align: left; padding: 2em 0;">
                <span style="color: white; margin: 5vh 0vw 0vh 0vw;">Pattern {{index+1}}: </span>
                <select v-model.lazy="facePattern[index]" class="col-sm-6" align-self="end" style="margin: 0vh 0vw 5vh 0vw;">
                    <option v-for="pattern,index in patternSelection" :key="index">{{pattern}}</option>
                </select>
            </div>
        </div>
        <button class="col-sm-3" @click="RandomizePattern()">
            <span>🔀 | Randomize Pattern</span>
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            facePattern: [],
            patternSelection: ['up','right','down','left'],
        }
    },
    methods: {
        RandomizePattern() {
            this.facePattern = ['-']
            var numbers = []
            var i
            for (i = 0; i < this.patternSelection.length; i++) {
                numbers.push(i)
            }  
            function shuffle(a) {
                var j, x, i;
                for (i = a.length - 1; i > 0; i--) {
                    j = Math.floor(Math.random() * (i + 1));
                    x = a[i];
                    a[i] = a[j];
                    a[j] = x;
                }
                return a;
            }
            var pattern = shuffle(numbers)
            for (i = 0; i < this.facePattern.length; i++) {
                this.facePattern[i] = this.patternSelection[pattern[i]]
            }
        },
    },
    mounted() { 
        this.RandomizePattern()
    },
    watch: {
        facePattern(pattern) {
            this.$emit("facePattern", pattern)
        }
    }
}
</script>

<style scoped>
.pattern-selection {
    /* font */
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;

    text-align: center;
    justify-content: center;
}
button {
    /* font */
    font-family: Helvetica Neue Bold;
    font-weight: bold;
    font-size: large;
    color: white;
    text-shadow: 2px 2px 4px #000000;

    background-color: #374369;
    border: none;
    border-radius: 2em;
    height: 6em;
    max-height: 10em;
} button:hover {
    background-color: #5b6ca3;
} button:focus {
    outline: 0 !important;
}
</style>