app.component('login-form',{
    template:
    /*html*/
    `
    <form class="login-form" @submit.prevent="onSubmit">
        <h3>Login</h3>
        <input id="name" v-model="name">
        <input id="passkey" v-model="passkey" type="password">
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
            let userDetails = {
                name: this.name,
                passkey: this.passkey
            }

            console.log(userDetails)

            axios
                .post('/login',{},{
                    params: {
                        name: this.name,
                        passkey: this.passkey
                    }
                })
                .then((response) => {
                    localStorage.setItem('userid',response.data.id)
                    localStorage.setItem('name',response.data.name)
                    this.$emit('update-message')
                })
                .catch((error) => {
                    console.log(error.response)
                })

            this.name = ''
            this.passkey = ''   
        }
    }
})

