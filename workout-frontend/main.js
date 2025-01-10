const app = Vue.createApp({
    data(){
        return{
            message: '',
            loggedIn: false,
            workouts: [],
            workoutDetails: [],
            date: '',
            formDate: {
                year: '',
                month: '',
                day: ''
            },
            selectedWorkout: null,
            selectedSet: null

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
                this.getWorkoutDetails()
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
                this.workoutDetails.length = 0
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
                    console.log(response.data)
                    this.workouts = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        getWorkoutDetails(){
            axios
                .get("/allWorkoutDetails",{
                    params: {
                        userId: localStorage.getItem('userid'),
                        date: this.date
                    }
                })
                .then((response) => {
                    console.log(response)
                    this.workoutDetails = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        selectWorkout(workoutId){
            // console.log(workoutId)
            this.selectedWorkout = workoutId
            console.log(this.selectedWorkout)
        },
        selectSet(setId){
            this.selectedSet = setId
            console.log(this.selectedSet)
        },
        setDate(){
            // console.log(this.formDate.year + '-' + this.formDate.month + '-' +this.formDate.day)
            this.date = this.formDate.year + '-' + this.formDate.month + '-' +this.formDate.day
            this.getWorkoutDetails()
        },
        addWorkout(){
            let workout_name = prompt("Enter name of workout")
            if(workout_name === null){
                console.log("empty prompt")
            }
            else{
                axios
                    .post("/workouts",{},{
                        params: {
                            workoutName: workout_name,
                            userId: localStorage.getItem('userid')
                        }
                    })
                    .then((response) => {
                        console.log(response)
                        this.getWorkouts()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        },
        addSet(){
            let _weight = prompt('weight')
            let _reps = prompt('reps')
            if(_weight === null || _reps === null){
                console.log("empty input")
            }
            else{
                axios
                    .post("/sets",{},{
                        params: {
                            weight: _weight,
                            reps: _reps,
                            workoutId: this.selectedWorkout,
                            workoutDate: this.date
                        }
                    })
                    .then((response) => {
                        console.log(response)
                        this.getWorkoutDetails()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        },
        deleteWorkout(){
            axios
                .post("/deleteWorkout",{},{
                    params: {
                        workoutId: this.selectedWorkout
                    }
                })
                .then((response) => {
                    console.log(response)
                    this.getWorkouts()
                    this.getWorkoutDetails()
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        deleteSet(){
            axios
                .post("/deleteSet",{},{
                    params: {
                        setId: this.selectedSet
                    }
                })
                .then((response) => {
                    console.log(response)
                    this.getWorkoutDetails()
                })
        }
    },
    created(){
        this.updateMessage()
        this.getWorkouts()
    }
})