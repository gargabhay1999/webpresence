import React, { useState, useEffect, useLayoutEffect } from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import {
    View,
} from "@aws-amplify/ui-react";
import { getCurrentUser } from 'aws-amplify/auth';
import { Button } from "react-bootstrap";
import { fetchAuthSession } from 'aws-amplify/auth';
import { get, post } from 'aws-amplify/api';



function ProfileMain() {
    const [isSubscribed, setIsSubscribed] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchUserPreferences = async () => {
            try {
                const { idToken } = (await fetchAuthSession()).tokens ?? {};
                const email = idToken ? idToken['payload']['email'] : null;
                setEmail(email);
                const restOperation = get({
                    apiName: 'webPresenceCloud',
                    path: '/user-profile',
                    options: {
                        queryParams: {
                            email: email,
                        }
                    }
                });

                const { body } = await restOperation.response;
                const response = await body.json();
                if (response['Items'].length > 0) {
                        setIsSubscribed(response['Items'][0]['is_subscribed']);
                    } else {
                    const restOperation = post({
                        apiName: 'webPresenceCloud',
                        path: '/user-profile',
                        options: {
                            body: {
                                isSubscribed: false,
                                email: email
                            }
                        }
                    });
                    const { body } = await restOperation.response;
                    const response = await body.json();
                    setIsSubscribed(false);
                }
            } catch (error) {
                console.error('Error fetching user preferences');
            }
        }

        fetchUserPreferences();
    }, [email]);

    const handleSubscription = async () => {
        try {
            const restOperation = post({
                apiName: 'webPresenceCloud',
                path: '/user-profile',
                options: {
                    body: {
                        isSubscribed: !isSubscribed,
                        email: email
                    }
                }
            });
            await restOperation.response;
            setIsSubscribed(!isSubscribed);
        } catch (error) {
            console.error('Error updating user preferences');
        }
    }

    return (
        <div className="limit-width">
            <h3>Profile</h3>
            <p>Welcome {email} to your profile page.</p>
            {isSubscribed ? (<p>You are subscribed to fortnightly alerts.</p>) : (<p>Want to get alerts in case more information about you leaks? Subscribe for free to get fortnightly alerts on your email!</p>)}
            {isSubscribed !== null && (
                <Button variant="primary" onClick={handleSubscription}>
                    {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                </Button>
            )}
        </div>
    );
}

const Profile = ({ isAuthenticated, onSignOut }) => {
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useLayoutEffect(() => {
        checkAuthStatus();
        if (isAuthenticated) {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const checkAuthStatus = async () => {
        try {
            await getCurrentUser();
            isAuthenticated = true;
            console.log(isAuthenticated);
            setIsLoading(false);
            console.log('User is signed in');
        } catch (error) {
            isAuthenticated = false;
            console.log(isAuthenticated);
            setIsLoading(false);
            console.error('User is not signed in');
            window.location.href = '/signin';
        }
    };

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <View className="App">
            <ProfileMain></ProfileMain>
        </View>
    )
}

export default Profile;