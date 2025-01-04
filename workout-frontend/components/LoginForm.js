app.component('login-form',{
    template:
    /*html*/
    `
    <form class="login-form" @submit.prevent="onSubmit">
        <h3>Login</h3>
        <input id="name" v-model="name">
        <input id="passkey" v-model="passkey">
        <input class="button" type="submit" value="Submit">
    </form>
    `,

    data(){
        return{
            name:'',
            passkey:''
        }
    },

    methods: {
        onSubmit(){
            console.log(this.name + ' ' + this.passkey)
        }
    }
})