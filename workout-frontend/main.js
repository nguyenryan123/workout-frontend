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
            selectedSet: null,
            calendar: {
                calendarDays: [],
                month: new Date().getMonth(),
                year: new Date().getFullYear()
            }
            

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
        },
        editWorkout(){
            let _workoutName = prompt("change workout name to:")
            if(_workoutName === null){
                console.log("empty")
            }
            else{
                axios
                    .post("/editWorkout",{},{
                        params: {
                            workoutName: _workoutName,
                            workoutId: this.selectedWorkout
                        }
                    })
                    .then((response) => {
                        this.getWorkouts()
                        this.getWorkoutDetails()
                        console.log(response)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        },
        editSet(){
            let _weight = prompt("change weight to:","-1")
            let _reps = prompt("change reps to:","-1")
            
            axios
                .post("/editSet",{},{
                    params: {
                        weight: _weight,
                        reps: _reps,
                        setId: this.selectedSet
                    }
                })
                .then((response) => {
                    this.getWorkoutDetails()
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        fillCalendarDays(year, month){
            let dateObj = new Date(year, month, 1)
            let lastDay = new Date(year, month + 1, 0)
            console.log('dayIndex: ' + dateObj.getDay())
            console.log('lastDay: ' + lastDay.getDate())

            for(let i = 0; i < dateObj.getDay(); i++){
                this.calendar.calendarDays.push(null)
            }

            for(let i = 1; i < lastDay.getDate() + 1; i++){
                this.calendar.calendarDays.push(i)
            }
            
            for(let i = this.calendar.calendarDays.length; i < 35; i++){
                this.calendar.calendarDays.push(null)
            }
        },
        selectDay(day){
            
            let _day = day
            if(day === null) return
            if(_day < 10){
                _day = '0' + _day
            }
            console.log(this.calendar.year + '-' + (this.calendar.month + 1) + '-' + _day)
        }
    },
    created(){
        this.updateMessage()
        this.getWorkouts()
        this.fillCalendarDays(this.calendar.year,this.calendar.month)
    }
})