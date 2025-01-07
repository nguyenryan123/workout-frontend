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
        updateMessage(){
            this.message = 'updated'
            console.log('updated')
            // this.message = localStorage.getItem('userid')
        }
    }
})