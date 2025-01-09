const app = Vue.createApp({
    data(){
        return{
            message: '',
            loggedIn: false,
            workouts: []

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
        },
        getWorkouts(){
            console.log('userid: ' + localStorage.getItem('userid'))
            axios
                .get("/workouts",{
                    params: {
                        userId: localStorage.getItem('userid')
                    }
                })
                .then((response) => {
                    this.workouts = response.data
                    console.log(this.workouts[0].workoutName)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    created(){
        this.updateMessage()
        this.getWorkouts()
    }
})