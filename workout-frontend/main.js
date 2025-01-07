const app = Vue.createApp({
    data(){
        return{
            message: ''
        }
    },
    methods:{
        getAccounts(){
            axios
                .get("/accounts")
                .then(function (response){
                    console.log(response)
                })
        },
        logout(){
            localStorage.removeItem('name')
            localStorage.removeItem('userid')
            this.updateMessage()
        },
        updateMessage(){
            const name = localStorage.getItem('name')
            const userid = localStorage.getItem('userid')
            
            if(name && userid){
                this.message = 'hi ' + name + ' // id: ' + userid
            }
            else this.message = ''
        }
    },
    created(){
        this.updateMessage()
    }
})