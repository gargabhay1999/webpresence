import React, { useEffect } from 'react';
// import { withAuthenticator } from 'aws-amplify-react';
import {
    Button,
    withAuthenticator,
} from "@aws-amplify/ui-react";

const SignIn = () => {
    useEffect(() => {
        window.location.href = '/';
    }, []);

    return (
        <>
        </>
    );
};

export default withAuthenticator(SignIn);