app.component('login-form',{
    template:
    /*html*/
    `
    <div>
        <form class="login-form" @submit.prevent="onSubmit">
            <h3 id="login-text">Login</h3>
            <input id="name" v-model="name">
            <input id="passkey" v-model="passkey" type="password">
            <input class="button" type="submit" value="Login">
        </form>
        
        <p v-show="showError">{{errorMessage}}</p>
    </div>
    `,

    data(){
        return{
            name: '',
            passkey: '',
            errorMessage: '',
            showError: false
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
                    console.log(error.response.data.errorMessage)
                    this.errorMessage = error.response.data.errorMessage
                    this.showError = true
                    
                    setTimeout(()=>{
                        this.showError = false
                    },5000)
                })

            this.name = ''
            this.passkey = ''
        }
    }
})

