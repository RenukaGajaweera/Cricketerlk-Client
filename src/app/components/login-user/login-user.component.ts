import { Component } from '@angular/core';
import { AuthService } from "app/services/auth.service";
import { UserService } from "app/services/user.service";
import { DomSanitizer } from "@angular/platform-browser";
import { CommonProperties, Configurations } from "app/utils/constants";

declare var $;

@Component({
    selector: 'login-user',
    templateUrl: 'login-user.component.html',
    styleUrls: ['login-user.component.css'],
    providers: [UserService]
})

export class LoginUser {

    private userLoggedIn: boolean = false;
    private email: string = '';
    private password: string = '';
    private status: string = 'modal';
    private errorMessage: string = '';
    private validationMessage: string = '';
    private credentialsValidation: boolean = true;
    private user: any;
    private userImagePath;


    constructor(private authService: AuthService, private userService: UserService, private sanitizer: DomSanitizer) {
        this.authService.getUserObservable().subscribe(res => {
            if (res !== undefined && res !== null) {
                this.userLoggedIn = true;
                this.user = res;
                if (this.user.userImage !== null && this.user.userImage !== undefined && this.user.userImage !== '') {
                    this.userImagePath = Configurations.IMAGE_BASE + this.user.userImage;
                } else {
                    let imageUrl = Configurations.IMAGE_BASE + CommonProperties.NULL_USER_IMAGE;
                    this.userImagePath = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
                }
                $('#loginModal').modal('hide');
                this.status = 'modal';
            } else {
                this.userLoggedIn = false;
                this.status = 'modal';
            }
        }, error => {
            this.status = 'modal';
            console.error(error);
        });
    }

    private backToLogin(): void {
        this.status = 'modal';
    }

    private logInPopUp(): void {
    }

    private signOut(): void {
        this.authService.logout();
    }

    private login(): void {
        if (this.validate()) {
            this.status = 'loading';
            this.validationMessage = '';
            this.authService.login(this.email, this.password);
        }
    }

    private validate(): boolean {
        let validEmail = this.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g);
        if (validEmail !== undefined && validEmail !== null) {
            if (this.password !== undefined && this.password !== null && this.password !== '') {
                this.credentialsValidation = true;
                return this.credentialsValidation;
            }
            this.validationMessage = 'Password cannont be empty';
            this.credentialsValidation = false;
            return this.credentialsValidation;
        }
        this.validationMessage = 'Please Enter a valid e-mail';
        this.credentialsValidation = false;
        return this.credentialsValidation;
    }

    private loginWithPopUp(provider: string) {
        this.authService.thirdPartylogin(provider);
    }
}
