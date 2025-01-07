app.component('signup-form',{
    template:
    /*html*/
    `
    <div>
        <form class="signup-form" @submit.prevent="onSubmit">
            <h3>Signup</h3>
            <input id="name" v-model="name">
            <input id="passkey" v-model="passkey">
            <input class="button" type="submit" value="Submit">
        </form>
        
        <p>{{errorMessage}}</p>
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
                    this.errorMessage = 'Signed up. You can now login to your account'
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

