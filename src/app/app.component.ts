import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    distance: string;
    hours: number;
    minutes: number;
    seconds: number;
    timeMinutes: number;
    timeSeconds: number;
    selectedDistanceUnit = 'miles';
    distances: string[] = ['marathon', 'half-marathon', '10k', '5k'];
    distanceSuggestions: any[];
    isSuggestedDistance = false;
    defaultPace = '00:00:00';

    private kilometerConversion = 0.62137119;
    private previousHours: number;
    private previousMinutes: number;
    private previousSeconds: number;
    private previousTimeMinutes: number;
    private previousTimeSeconds: number;

    isTimeSecondInRange(event) {
        if (this.timeSeconds > 59) {
            if (this.timeSeconds.toString().length > 2) {
                var newValue = this.timeSeconds.toString().slice(0, 2);
                event.target.value = newValue;
                this.timeSeconds = parseInt(newValue);
                this.previousTimeSeconds = this.timeSeconds;
            } else {
                event.target.value = this.previousTimeSeconds;
                this.timeSeconds = this.previousTimeSeconds;
            }
        } else {
            this.previousTimeSeconds = this.timeSeconds;
        }
    }
    isTimeMinuteInRange(event) {
        if (this.timeMinutes > 59) {
            if (this.timeMinutes.toString().length > 2) {
                var newValue = this.timeMinutes.toString().slice(0, 2);
                event.target.value = newValue;
                this.timeMinutes = parseInt(newValue);
                this.previousTimeMinutes = this.timeMinutes;
            } else {
                event.target.value = this.previousTimeMinutes;
                this.timeMinutes = this.previousTimeMinutes;
            }
        } else {
            this.previousTimeMinutes = this.timeMinutes;
        }
    }
    isSecondInRange(event) {
        if (this.seconds > 59) {
            if (this.seconds.toString().length > 2) {
                var newValue = this.seconds.toString().slice(0, 2);
                event.target.value = newValue;
                this.seconds = parseInt(newValue);
                this.previousSeconds = this.seconds;
            } else {
                event.target.value = this.previousSeconds;
                this.seconds = this.previousSeconds;
            }
        } else {
            this.previousSeconds = this.seconds;
        }
    }
    isMinuteInRange(event) {
        if (this.minutes > 59) {
            if (this.minutes.toString().length > 2) {
                var newValue = this.minutes.toString().slice(0, 2);
                event.target.value = newValue;
                this.minutes = parseInt(newValue);
                this.previousMinutes = this.minutes;
            } else {
                event.target.value = this.previousMinutes;
                this.minutes = this.previousMinutes;
            }
        } else {
            this.previousMinutes = this.minutes;
        }
    }
    isHourInRange(event) {
        if (this.hours > 99) {
            if (this.hours.toString().length > 2) {
                var newValue = this.hours.toString().slice(0, 2);
                event.target.value = newValue;
                this.hours = parseInt(newValue);
                this.previousHours = this.hours;
            } else {
                event.target.value = this.previousHours;
                this.hours = this.previousHours;
            }
        } else {
            this.previousHours = this.hours;
        }
    }

    selectDistance(event) {
        this.distanceSuggestions = [];
        for (let i = 0; i < this.distances.length; i++) {
            let distance = this.distances[i];
            if (distance.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.distanceSuggestions.push(distance);
            }
        }
    }

    checkUnitEnablement(event) {
        this.isSuggestedDistance = this.distances.indexOf(this.distance) >= 0;
    }

    setUnitEnablement(value) {
        this.isSuggestedDistance = this.distances.indexOf(value) >= 0;
    }

    calculatePaceTime() {
        if (this.timeMinutes || this.timeSeconds) {
            if (this.isSuggestedDistance) {
                return this.calculateTimePace(this.calculateDistance());
            } else if (/^\d{1,3}$/.test(this.distance)) {
                const distanceInMiles =
                    this.selectedDistanceUnit === 'miles'
                        ? parseFloat(this.distance)
                        : parseFloat(this.distance) * this.kilometerConversion;
                return this.calculateTimePace(distanceInMiles);
            } else {
                return this.defaultPace;
            }
        } else {
            return this.defaultPace;
        }
    }

    calculatePaceDistance() {
        if (this.hours || this.minutes || this.seconds) {
            if (this.timeMinutes || this.timeSeconds) {
                const time = this.calculateTime();
                const paceTime =
                    (this.timeMinutes > 0 ? this.timeMinutes * 60 : 0) +
                    (this.timeSeconds > 0 ? this.timeSeconds : 0);
                return (time / paceTime).toFixed(2);
            } else {
                return '0';
            }
        } else {
            return '0';
        }
    }

    calculatePace() {
        if (this.hours || this.minutes || this.seconds) {
            if (this.isSuggestedDistance) {
                return this.calculateDistancePace(this.calculateDistance());
            } else if (/^\d{1,3}(.\d*)?$/.test(this.distance)) {
                const distanceInMiles =
                    this.selectedDistanceUnit === 'miles'
                        ? parseFloat(this.distance)
                        : parseFloat(this.distance) * this.kilometerConversion;
                return this.calculateDistancePace(distanceInMiles);
            } else {
                return this.defaultPace;
            }
        } else {
            return this.defaultPace;
        }
    }

    private calculateTimePace(distanceInMiles: number): string {
        const paceTime =
            (this.timeMinutes > 0 ? this.timeMinutes * 60 : 0) +
            (this.timeSeconds > 0 ? this.timeSeconds : 0);
        const time = paceTime * distanceInMiles;
        let hourTime = Math.floor(time / 60 / 60);
        let minuteTime = Math.floor((time - hourTime * 60 * 60) / 60);
        let secondTime = Math.round(time - hourTime * 60 * 60 - minuteTime * 60);

        if (secondTime >= 60) {
            secondTime = 0;
            minuteTime += 1;
        }
        if (minuteTime >= 60) {
            minuteTime = 0;
            hourTime += 1;
        }

        return (
            this.formatTime(hourTime) +
            ':' +
            this.formatTime(minuteTime) +
            ':' +
            this.formatTime(secondTime)
        );
    }

    private calculateDistancePace(distanceInMiles: number): string {
        const pace = this.calculateTime() / distanceInMiles;
        let hourPace = Math.floor(pace / 60 / 60);
        let minutePace = Math.floor((pace - hourPace * 60 * 60) / 60);
        let secondPace = Math.round(pace - hourPace * 60 * 60 - minutePace * 60);

        if (secondPace >= 60) {
            secondPace = 0;
            minutePace += 1;
        }
        if (minutePace >= 60) {
            minutePace = 0;
            hourPace += 1;
        }

        return (
            this.formatTime(hourPace) +
            ':' +
            this.formatTime(minutePace) +
            ':' +
            this.formatTime(secondPace)
        );
    }

    private formatTime(time: number): string {
        return time < 10 ? '0' + time.toString() : time.toString();
    }

    private calculateTime(): number {
        return (
            (this.hours > 0 ? this.hours * 60 * 60 : 0) +
            (this.minutes > 0 ? this.minutes * 60 : 0) +
            (this.seconds > 0 ? this.seconds : 0)
        );
    }

    private calculateDistance(): number {
        switch (this.distance) {
            case 'marathon':
                return 26.2;
            case 'half-marathon':
                return 13.1;
            case '10k':
                return 10 * this.kilometerConversion;
            case '5k':
                return 5 * this.kilometerConversion;
        }
    }
}
