app.component('signup-form',{
    template:
    /*html*/
    `
    <div>
        <form class="loginSignup-form" @submit.prevent="onSubmit">
            <h3>Signup</h3>
            <input id="name" v-model="name">
            <input id="passkey" v-model="passkey">
            <input class="button" type="submit" value="Signup">
        </form>
        <p class="loginSignup-text">Have an account? Login here</p>
        
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
                .post('/signup',{},{
                    params: {
                        name: this.name,
                        passkey: this.passkey
                    }
                })
                .then((response) => {
                    //not an error
                    this.errorMessage = 'Signed up. You can now login to your account'
                    this.showError = true

                    setTimeout(()=>{
                        this.showError = false
                    },5000)
                })
                .catch((error) => {
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

