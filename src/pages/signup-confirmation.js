import {useAuth} from "@/lib/auth";


const SignupConfirmation = () => {
    const {signUpError, user} = useAuth()

    return (
        <>
            {signUpError ?
                <div className="flex flex-col align-middle justify-center">
                    <h2>Sorry, there was an error signing up.</h2>
                    <p>{signUpError}</p>
                </div> :
                <div className="flex flex-col align-middle justify-center">
                    <h2>Thank you for registering!</h2>
                    <p>Please check your email to confirm your account.</p>
                </div>
            }
        </>
    )
}

export default SignupConfirmation