import { Component } from '@angular/core';

import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [MessageService]
})
export class AppComponent {
    distance: string;
    hours: number;
    minutes: number;
    seconds: number;
    selectedDistanceUnit = 'miles';
    distances: string[] = ['marathon', 'half-marathon', '10k', '5k'];
    distanceSuggestions: any[];
    isSuggestedDistance = false;
    defaultPace = '00:00:00';
    private kilometerConversion = 0.62137119;

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

    calculatePace() {
        if (this.hours || this.minutes || this.seconds) {
            if (this.isSuggestedDistance) {
                return this.calculateDistancePace(this.calculateDistance());
            } else if (/^\d{1,3}$/.test(this.distance)) {
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

    private calculateDistancePace(distanceInMiles: number): string {
        const pace = this.calculateTime() / distanceInMiles;
        let hourPace = Math.floor(pace / 60 / 60);
        let minutePace = Math.floor((pace - hourPace * 60) / 60);
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
