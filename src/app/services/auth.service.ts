import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/Rx';
import { UserService } from 'app/services/user.service';
import { User } from 'app/models/user';
import { ClkNotificationService } from 'app/services/clk-notification.service';
import { Message, LEVEL } from "app/models/message";

@Injectable()
export class AuthService {

    private authUser: Observable<firebase.User>;
    private newUser: boolean = false;
    private user: User = new User();
    private userTrigger: BehaviorSubject<any> = new BehaviorSubject<any>('');
    private userObservable: Observable<any> = this.userTrigger.asObservable();

    constructor(public afAuth: AngularFireAuth, private userService: UserService, private notificationService: ClkNotificationService) {
        this.authUser = afAuth.authState;
        this.authUser.subscribe(res => {
            if (res !== undefined && res !== null) {
                if (window.location.pathname === '/login') {
                    window.location.href = '/';
                }
                if (!this.newUser) {
                    this.userService.getUser(res.uid).subscribe(response => {
                        if (response !== null && response !== undefined) {
                            if (response.message === 'SUCCESS') {
                                this.userTrigger.next(response.resObject);
                            }
                        }
                    }, error => {
                        let message: Message = new Message();
                        message.alertLevel = LEVEL.ERROR;
                        message.messageBody = 'Something went wrong while retrieving your user!';
                        ClkNotificationService.notificationTrigger.next(message);
                        this.userTrigger.error(error);
                        console.error(error);
                    });
                } else {
                    this.user.userId = res.uid;
                    this.user.userRole = 2;
                    this.userService.addUser(this.user).subscribe(response => {
                        res.sendEmailVerification();
                        if (window.location.pathname !== '/') {
                            window.location.href = '/';
                        }
                    }, error => {
                        let message: Message = new Message();
                        message.alertLevel = LEVEL.ERROR;
                        message.messageBody = 'Something went wrong while signing you up! Contact us and we will sort out this mess for you';
                        ClkNotificationService.notificationTrigger.next(message);
                        console.error(error);
                    }
                    );
                }
            } else {
                this.userTrigger.next(res);
                if (window.location.pathname !== '/login' && window.location.pathname !== '/rules' && window.location.pathname !== '/about-us' && window.location.pathname !== '/schedule') {
                    window.location.href = '/login';
                }
            }
        }, error => {
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Auth service error!';
            this.userTrigger.error(error);
            console.error(error);
        });
    }

    public login(email: string, password: string) {
        this.afAuth.auth.signInWithEmailAndPassword(email, password).then(
            response => {
            }
        ).catch(ex => {
            console.error(ex);
            let message: Message = new Message();
            message.alertLevel = LEVEL.ERROR;
            message.messageBody = 'Invalid email or password'
            ClkNotificationService.notificationTrigger.next(message);
            this.userTrigger.error(ex);
        });
    }

    public thirdPartylogin(provider: string): void {
        if (provider === 'GOOGLE') {
            this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider);
        }
        if (provider === 'FACEBOOK') {
            this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider);
        }
    }

    public signUp(user: User) {
        this.user = user;
        this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(
            response => {
                this.newUser = true;
            }
        ).catch(ex => {

        });
    }

    public logout() {
        this.afAuth.auth.signOut();
    }

    public getUser(): Observable<firebase.User> {
        return this.authUser;
    }

    public getUserObservable(): Observable<any> {
        return this.userObservable;
    }

    public googlePopup(user: User): void {
        this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider).then(res => {
            console.log(res);
            this.newUser = true;
            this.user = user;
            this.user.email = res.user.email;
            this.user.userName = res.user.displayName;
        }).catch(err => {
            console.error(err);
        });
    }

    public facebookPopup(user: User): void {
        this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider).then(res => {
            console.log(res);
            this.newUser = true;
            this.user = user;
            this.user.email = res.user.email;
            this.user.userName = res.user.displayName;
        }).catch(err => {
            console.error(err);
        });
    }

}
