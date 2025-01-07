const app = Vue.createApp({
    data(){
        return{
            message: '',
            loggedIn: false
        }
    },
    methods:{
        getAccounts(){
            axios
                .get("/accounts")
                .then((response) => {
                    console.log(response)
                })
        },
        logout(){
            localStorage.removeItem('name')
            localStorage.removeItem('userid')
            this.updateMessage()
            this.updateLoggedIn()
        },
        updateMessage(){
            const name = localStorage.getItem('name')
            const userid = localStorage.getItem('userid')
            
            if(name && userid){
                this.message = 'hi ' + name + ' // id: ' + userid
            }
            else this.message = ''
            
            this.updateLoggedIn()
        },
        updateLoggedIn(){
            const name = localStorage.getItem('name')
            const userid = localStorage.getItem('userid')
            if(name && userid){
                this.loggedIn = true
            }
            else this.loggedIn = false

            console.log(this.loggedIn)
        }
    },
    created(){
        this.updateMessage()
    }
})