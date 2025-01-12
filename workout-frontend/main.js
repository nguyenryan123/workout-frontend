const app = Vue.createApp({
    data(){
        return{
            message: '',
            loggedIn: false,
            workouts: [],
            workoutDetails: [],
            date: '',
            selectedWorkout: null,
            selectedSet: null,
            calendar: {
                calendarDays: [],
                month: new Date().getMonth(),
                year: new Date().getFullYear(),
                months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
                monthDisplayed: '',
                yearOptions: [],
                daysContainingWorkout: []
            },
            showDropdown: false,
            showCalendar: false,
            isHovered: false,
            daysHovered: [],
            dropdownHovered: []
            

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
            this.calendar.calendarDays.length = 0
            let dateObj = new Date(year, month, 1)
            let lastDay = new Date(year, month + 1, 0)
            let totalGrid = 35
            
            let now = new Date()
            let currentYear = now.getFullYear()
            
            this.calendar.yearOptions.length = 0

            
            for(let i = 2012; i < currentYear + 3; i++){
                this.calendar.yearOptions.push(i)
            }

            this.dropdownHovered = Array(this.calendar.yearOptions.length).fill(false)

            for(let i = 0; i < dateObj.getDay(); i++){
                this.calendar.calendarDays.push(null)
            }

            for(let i = 1; i < lastDay.getDate() + 1; i++){
                this.calendar.calendarDays.push(i)
            }
            
            if((dateObj.getDay() + lastDay.getDate()) > 35){
                totalGrid = 42
            }

            for(let i = this.calendar.calendarDays.length; i < totalGrid; i++){
                this.calendar.calendarDays.push(null)
            }

            this.daysHovered = Array(this.calendar.calendarDays.length).fill(false)

            this.calendar.monthDisplayed = this.calendar.months[this.calendar.month] + ' ' + this.calendar.year
        },
        selectDay(day){
            let _day = day
            if(day === null) return
            if(_day < 10){
                _day = '0' + _day
            }

            let _month = this.calendar.month + 1
            if(_month < 10){
                _month = '0' + _month
            }
            this.date = (this.calendar.year + '-' + _month + '-' + _day)
            this.showCalendar = false
            this.getWorkoutDetails()
        },
        incrementMonth(step){
            this.calendar.month += step
            if(this.calendar.month > 11){
                this.calendar.month = 0
            }
            if(this.calendar.month < 0){
                this.calendar.month = 11
            }
            this.calendar.calendarDays.length = 0
            this.fillCalendarDays(this.calendar.year, this.calendar.month)
            this.fillDaysContainingWorkout()
        },
        selectYear(year){
            this.calendar.year = year
            this.showDropdown = false
            this.fillCalendarDays(this.calendar.year,this.calendar.month)
            this.fillDaysContainingWorkout()
        },
        toggleDropdown(){
            this.showDropdown = !this.showDropdown
        },
        toggleCalendar(){
            this.showCalendar = !this.showCalendar
            this.fillDaysContainingWorkout()
        },
        fillDaysContainingWorkout(){
            this.calendar.daysContainingWorkout.length = 0

            let year = this.calendar.year
            let month = this.calendar.month + 1

            if(month < 10){
                month = '0' + month
            }

            axios
                .get("/checkDay",{
                    params: {
                        userId: localStorage.getItem('userid'),
                        date: year + '-' + month + '-' + '01'
                    }
                })
                .then((response) => {
                    this.calendar.daysContainingWorkout = response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        setDaysHovered(index, isHovered, calendarDay){
            if (calendarDay === null) return
            this.daysHovered[index] = isHovered
        },
        setDropdownHovered(index, isHovered){
            this.dropdownHovered[index] = isHovered
        }
    },
    created(){
        this.updateMessage()
        this.getWorkouts()
        this.fillCalendarDays(this.calendar.year,this.calendar.month)
        this.selectDay(new Date().getDate())
    }
})