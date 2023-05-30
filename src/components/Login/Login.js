import React, {
	useState,
	useReducer,
	useEffect,
	useContext,
	useRef
} from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const handleEmailState = (state, action) => {
	if (action.type === 'EMAIL_INPUT') {
		return { value: action.val, isValid: action.val.includes('@') };
	}
	if (action.type === 'INPUT_BLUR') {
		return { value: state.value, isValid: state.value.includes('@') };
	}
	return {
		value: '',
		isValid: ''
	};
};

const handlePasswordState = (state, action) => {
	if (action.type === 'PASSWORD_INPUT') {
		return { value: action.val, isValid: action.val.trim().length > 6 };
	}
	if (action.type === 'PASSWORD_BLUR') {
		return { value: state.value, isValid: state.value.trim().length > 6 };
	}
	return {
		value: '',
		isValid: ''
	};
};

const Login = (props) => {

	const authCtx = useContext(AuthContext);
	// const [enteredEmail, setEnteredEmail] = useState('');
	// const [emailIsValid, setEmailIsValid] = useState();

	const [emailState, dispatchEmail] = useReducer((handleEmailState), {
		value: '',
		isValid: ''
	});

	// const [enteredPassword, setEnteredPassword] = useState('');
	// const [passwordIsValid, setPasswordIsValid] = useState();

	const [passwordState, dispatchPassword] = useReducer((handlePasswordState), {
		value: '',
		isValid: ''
	});

	const [formIsValid, setFormIsValid] = useState(false);

	// useReducer and useState combined together for a specific value.
	const { isValid: emailIsValid } = emailState;
	const { isValid: passwordIsValid } = passwordState;

	useEffect((event) => {
		const identifier = setTimeout(
			() => {
				setFormIsValid(
					emailIsValid && passwordIsValid
				);
			},
			150
		);

		// Cleanup Function.
		return () => {
			clearTimeout(identifier);
		}

	}, [emailIsValid, passwordIsValid]);

	const emailChangeHandler = (event) => {
		dispatchEmail({ type: "EMAIL_INPUT", val: event.target.value });
		// setEnteredEmail(event.target.value);
		setFormIsValid(
			emailState.isValid && event.target.value.trim().length > 6
		);
	};

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: "PASSWORD_INPUT", val: event.target.value });
		//setEnteredPassword(event.target.value);
		// console.log("pass handler");
		// console.log(emailState.isValid);
		setFormIsValid(
			emailState.isValid && event.target.value.trim().length > 6
		);
	};

	const validateEmailHandler = () => {
		dispatchEmail({ type: "INPUT_BLUR" });
	};

	const validatePasswordHandler = () => {
		dispatchPassword({ type: "PASSWORD_BLUR" });
	};

	const submitHandler = (event) => {
		event.preventDefault();

		if (formIsValid) {
			authCtx.onLogin(emailState.value, passwordState.value);
		} else if (!emailIsValid) {
			emailRef.current.focus();
		} else {
			passwordRef.current.focus();
		}
	};

	const emailRef = useRef();
	const passwordRef = useRef();

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<Input
					ref={emailRef}
					label="E-mail"
					isValid={emailIsValid}
					type="email"
					id="email"
					value={emailState.value}
					onChange={emailChangeHandler}
					onBlur={validateEmailHandler}
				/>

				<Input
					ref={passwordRef}
					label="Password"
					isValid={passwordIsValid}
					type="password"
					id="password"
					value={passwordState.value}
					onChange={passwordChangeHandler}
					onBlur={validatePasswordHandler}
				/>
				<div className={classes.actions}>
					<Button type="submit" className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
