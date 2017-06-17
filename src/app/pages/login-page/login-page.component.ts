import { Component } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { User } from 'app/models/user';
import { Country, CommonProperties, Configurations } from 'app/utils/constants';
import { UploadService } from 'app/services/upload.service';
import { RequestOptions, RequestMethod } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

declare var $;

@Component({
    selector: 'app-login',
    templateUrl: 'login-page.component.html',
    styleUrls: ['login-page.component.css']
})

export class LoginComponent {

    private email: string = '';
    private password: string = '';
    private userName: string = '';
    private errorMessage: string = '';
    private validationMessage: string = '';
    private errorModalMessage: boolean = false;
    private modalValidationMessage: string = '';
    private credentialsValidation: boolean = true;
    private user: User = new User();
    private userImagePath;
    private teamImagePath;
    private modalBody: string = 'user';
    private provider: string;
    private countries: any = Country;
    private selectedCountry: string = '';

    constructor(private authService: AuthService, private uploadService: UploadService, private sanitizer: DomSanitizer) {
        let backgroundImage: string = Configurations.IMAGE_BASE + 'assets/collage.jpg';
        $('#background').css('background-image', 'url(' + backgroundImage + ')');
        this.userImagePath = this.sanitizer.bypassSecurityTrustUrl(Configurations.IMAGE_BASE + CommonProperties.NULL_USER_IMAGE);
        this.teamImagePath = this.sanitizer.bypassSecurityTrustUrl(Configurations.IMAGE_BASE + CommonProperties.NULL_TEAM_IMAGE);
    }

    private signUp() {
        if (this.validate()) {
            // this.authService.signUp(this.email, this.userName, this.password);
            $('#signUpModal').modal({
                backdrop: 'static',
                keyboard: false,
                show: true
            });
            // $('#signUpModal').modal('show');
        }
    }

    private validate(): boolean {
        let validEmail = this.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g);
        let validUserName = this.userName !== undefined && this.userName !== null && this.userName !== '';
        let validPasword = this.password !== undefined && this.password !== null && this.password !== '' && this.password.length > 5;
        if (validEmail !== undefined && validEmail !== null) {
            if (!validUserName) {
                this.validationMessage = 'Invalid username. username cannot be empty';
                this.credentialsValidation = false;
                return this.credentialsValidation;
            }
            if (!validPasword) {
                this.validationMessage = 'Invalid password must be at least 6 characters';
                this.credentialsValidation = false;
                return this.credentialsValidation;
            }
            if (validUserName && validPasword) {
                this.credentialsValidation = true;
                return this.credentialsValidation;
            }
            //     if (this.password !== undefined && this.password !== null && this.password !== '') {
            //         if (this.password.length > 5) {
            //             this.credentialsValidation = true;
            //             return this.credentialsValidation;
            //         } else {
            //             this.validationMessage = 'Password must be at least 6 characters';
            //             this.credentialsValidation = false;
            //             return this.credentialsValidation;
            //         }
            //     }
            //     this.validationMessage = 'Password cannont be empty';
            //     this.credentialsValidation = false;
            //     return this.credentialsValidation;
        }
        this.validationMessage = 'Please Enter a valid e-mail';
        this.credentialsValidation = false;
        return this.credentialsValidation;
    }

    private popUploadScreen(divId: string): void {
        if (divId === 'user') {
            $('#userImageInput').click();
        }
        if (divId === 'team') {

        }
    }

    upload(formId: string) {
        // Get form
        let id: string = '#' + formId;
        var form = $(id)[0];
        var data = new FormData(form);
        // this.uploadService.makeFileRequest('http://localhost:8080/common/upload', data);
        let options: RequestOptions = new RequestOptions();
        options.method = RequestMethod.Post;
        options.body = data;
        this.uploadService.uploadImage(options).subscribe(response => {
            if (response.resObject !== undefined && response.resObject !== null && response.resObject !== '') {
                let url: string = Configurations.IMAGE_BASE + response.resObject;
                if (formId === 'teamImageForm') {
                    this.teamImagePath = this.sanitizer.bypassSecurityTrustUrl(url);
                    this.user.teamImage = response.resObject;
                }
                if (formId === 'userImageForm') {
                    this.userImagePath = this.sanitizer.bypassSecurityTrustUrl(url);
                    this.user.userImage = response.resObject;
                }
            }
        }, error => {
            console.error(error);
        });
    }

    private modalNavigation(progress: string): void {
        if (progress === 'next') {
            this.modalBody = 'team';
        }
        if (progress === 'back') {
            this.modalBody = 'user';
        }
        if (progress === 'finish') {
            this.saveUser();
        }
    }

    private saveUser(): void {
        if (this.user.teamName !== undefined && this.user.teamName !== null && this.user.teamName !== '') {
            this.user.email = this.email;
            this.user.userName = this.userName;
            this.user.password = this.password;
            if (this.user.supportingCountry === undefined || this.user.supportingCountry === null || this.user.supportingCountry === 0) {
                this.user.supportingCountry = 1;
                this.selectedCountry = 'SRI LANKA';
            }
            if(this.user.dob === undefined || this.user.dob === null) {
                this.user.dob = new Date();
            }
            if (this.provider === 'GOOGLE') {
                this.authService.googlePopup(this.user);
            } else if (this.provider === 'FACEBOOK') {
                this.authService.facebookPopup(this.user);
            } else {
                this.authService.signUp(this.user);
            }
            // console.log(this.user);
        } else {
            this.modalValidationMessage = 'Team Name cannot be empty';
            this.errorModalMessage = true;
        }
    }

    private signupFacebook(): void {
        this.provider = 'FACEBOOK';
        $('#signUpModal').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    }

    private signupGoogle(): void {
        this.provider = 'GOOGLE';
        $('#signUpModal').modal({
            backdrop: 'static',
            keyboard: false,
            show: true
        });
    }

    private selectCountry(country: any): void {
        this.selectedCountry = country.COUNTRY_NAME;
        this.user.supportingCountry = country.COUNTRY_CODE;
    }

    private closeModal(): void {
        $('#signUpModal').modal('hide');
    }

}
