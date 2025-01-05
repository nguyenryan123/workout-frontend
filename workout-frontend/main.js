const app = Vue.createApp({
    data(){
        return{
            message: 'test',
        }
    },
    methods:{
        getAccounts(){
            console.log("clicked")
            axios
                .get("/accounts")
                .then(function (response){
                    console.log(response)
                })
        }
    }
})