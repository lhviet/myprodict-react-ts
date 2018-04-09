import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import PageLayout from '../_PageLayout';
import * as actions from "../../actions";
import { IStoreState } from '../../types';
import './PageLogin.css';
import ClientGoogleSignInButton from "../../components/_client/ClientGoogleSignInButton";
import ClientFacebookSignInButton from "../../components/_client/ClientFacebookSignInButton";
import {authConnectToGoogle, authLoginByGoogle} from "../../utils/auth-util";
import {IUserState} from "../../reducers/user";
import {EUserProvider} from "myprodict-model/lib-esm";

interface PageLoginProps {
  user: IUserState;
  setLoggedIn(token: string): any;
  setLoggedOut(): void;
}
interface PageLoginState {
  isUsernameRequested: boolean;
  provider: EUserProvider;
  username: string;
  password: string;
  email: string;
  signupToken: string;
}
class PageLogin extends React.Component<PageLoginProps, PageLoginState> {

  constructor(props: PageLoginProps, context: any) {
    super(props, context);
    this.state = {
      isUsernameRequested: false,
      provider: EUserProvider.Local,
      username: '',
      password: '',
      email: '',
      signupToken: '',
    };
  }

  onGoogleSigninSuccess = async (googleUser: gapi.auth2.GoogleUser) => {
    if (!googleUser.isSignedIn()) {
      console.log('Google sign-in failed.');
      // this.loginError.isLoginError = true;
      // this.loginError.reason = 'unknown';
      return;
    }
    // The ID token you need to pass to your backend:
    const authRes = googleUser.getAuthResponse();
    const id_token = authRes.id_token;
    try {
      const {data} = await authLoginByGoogle(id_token, true);
      const {token, openid_email} = data.data;
      console.log('onGoogleSigninSuccess data = ', data.data);
      if (token && token.trim().length > 0) {
        // logged-in, update the status of authentication to be Logged-in
        this.props.setLoggedIn(token);
      }
      else if (openid_email && openid_email.trim().length > 0) {
        // new user, request to input additional info: username
        this.setState({
          isUsernameRequested: true,
          provider: EUserProvider.Google,
          email: openid_email,
          signupToken: id_token
        });
      }

      // this.loginByOpenId(BMModel.AUTH_PROVIDER.GOOGLE, token, openid_email, id_token);
      googleUser.disconnect();
    } catch (err) {
      console.error('auth loginByGoogle ERROR = ', err);
    }
  };

  onGoogleSigninFailure = () => {
    /*this.local.isSubmitting = false;
    this.loginError.isLoginError = true;
    this.loginError.reason = 'unknown';*/
    console.log('on Google Failed !!!');
  };

  // TODO: checking if username existed
  onChangeUsername = (e: React.FormEvent<HTMLInputElement>) => this.setState({username: e.currentTarget.value});
  onChangePassword = (e: React.FormEvent<HTMLInputElement>) => this.setState({password: e.currentTarget.value});

  signupOpenId = async () => {
    const {provider, username, email, signupToken, password} = this.state;
    if (provider !== EUserProvider.Local && username && email && signupToken) {
      try {
        const {data} = await authConnectToGoogle(email, username, signupToken, password);
        const {token} = data.data;
        console.log('signupOpenId data = ', data.data);
        if (token) {
          this.props.setLoggedIn(token);
        }
        else {
          console.error('signupOpenId with authConnectToGoogle ERROR, NO TOKEN returned !!!');
        }
      } catch (err) {
        console.error('signupOpenId with authConnectToGoogle ERROR = ', err)
      }
    }
  }

  logout = () => {
    if (gapi && gapi.auth2) {
      gapi.auth2.getAuthInstance().signOut().then(() => console.log('Google user signed out.'));
    }
    this.props.setLoggedOut();
  }

  render() {
    return <PageLayout>
      {!this.props.user.auth_isLoggedIn && <div className='page-login'>
        <div className="card card-body">
          <div className="social-login-section">
            <ClientGoogleSignInButton
              signinSuccess={this.onGoogleSigninSuccess}
              signinFailure={this.onGoogleSigninFailure}
            />
            <ClientFacebookSignInButton />
          </div>
          {!this.state.isUsernameRequested && <div className={'local-login-section'}>
            <label className="pt-3 text-center">OR</label>
            <form name="loginForm">
              <div className="form-group">
                <input className="form-control mb-2" name="username" placeholder="Username/Email" required/>
                <input className="form-control" name="password" placeholder="Password"/>
              </div>
              <div className={'form-group'}>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text text-muted">
                      <input name="keepSignIn" type="checkbox"/>
                    </div>
                  </div>
                  <label className="form-control">Keep signed in</label>
                  <span className="input-group-append">
                      <button className="btn btn-success login-btn" type="button">
                        <span>Login</span>
                      </button>
                    </span>
                </div>
              </div>
            </form>
          </div>}
          {this.state.isUsernameRequested && <div className={'form-group'}>
            <h5>{'Please select your Username to finish the process'}</h5>
            <div className="form-group">
              <input className="form-control mb-2" name="username" placeholder="Username/Email" onChange={this.onChangeUsername}/>
              <input className="form-control" name="password" placeholder="Password" onChange={this.onChangePassword}/>
            </div>
            <div className={'form-group text-center'}>
              <button className="btn btn-success login-btn" type="button" onClick={this.signupOpenId}>
                <span>Login</span>
              </button>
            </div>
          </div>}
        </div>
      </div>}

      {this.props.user.auth_isLoggedIn && <div>
        <h1>Welcome, you Logged-In.</h1>
        <div className={'form-group text-center pt-3'}>
          <button className={'btn btn-danger'} onClick={this.logout}>Logout</button>
        </div>
      </div>}
    </PageLayout>;
  }
}

const mapStateToProps = (state: IStoreState) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
  setLoggedIn: (token: string) => dispatch(actions.setLoggedIn(token)),
  setLoggedOut: () => dispatch(actions.setLoggedOut()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PageLogin);
