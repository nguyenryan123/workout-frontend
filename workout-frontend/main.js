const app = Vue.createApp({
    data(){
        return{
            message: '',
            loggedIn: false,
            workouts: [],
            sets: []

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
                
                //temporary way to update workouts on login
                this.getWorkouts()
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
            else{
                this.loggedIn = false

                //clear workouts array
                this.workouts.length = 0
            }

            console.log(this.loggedIn)
        },
        getWorkouts(){
            axios
                .get("/workouts",{
                    params: {
                        userId: localStorage.getItem('userid')
                    }
                })
                .then((response) => {
                    this.workouts = response.data
                    // console.log(this.workouts[0].workoutName)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getSets(workout_id){
            axios
                .get("/sets",{
                    params: {
                        workoutId: workout_id
                    }
                })
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    created(){
        this.updateMessage()
        // this.getWorkouts()
        // this.getSets(1)
    }
})