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
        removeId(){
            localStorage.removeItem('userid')
        },
        removeName(){
            localStorage.removeItem('name')
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