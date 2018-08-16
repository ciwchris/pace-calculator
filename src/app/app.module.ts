import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SpinnerModule } from 'primeng/spinner';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [AppComponent],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        CardModule,
        AccordionModule,
        InputTextModule,
        SpinnerModule,
        MessagesModule,
        MessageModule,
        ButtonModule,
        AutoCompleteModule,
        RadioButtonModule,
        ServiceWorkerModule.register(environment.baseHref + '/ngsw-worker.js', {
            enabled: environment.production
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
