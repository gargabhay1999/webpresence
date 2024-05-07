import React, { useEffect } from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import {
    Text,
    View,
} from "@aws-amplify/ui-react";
import { Button } from "react-bootstrap";


const DisplayScanData = ({ scanData, selectedTimestamp }) => {

    scanData = JSON.parse(scanData);
    const { email, ipapi, google_search, instagram_exists, twitter_exists, spotify_exists } = scanData;


    useEffect(() => {
    }, []);

    const renderGoogleSearchLinks = () => {
        if (google_search && google_search.length > 0) {
            return (
                <View>
                    <h3>Google Search </h3>
                    {google_search.map((link, index) => (
                        <Text key={index}>{link}</Text>
                    ))}
                </View>
            );
        } else {
            return <Text>No Google search results found.</Text>;
        }
    };

    return (
        <View>
            <u><h3 level={2}>Scan Data for Timestamp: {selectedTimestamp}</h3></u>
            <div>
                <u><h2>Scan Results</h2></u>
                <div>
                    <h3>Email</h3>
                    <p>{email}</p>
                </div>
                <div>
                    <h3>IP Details</h3>
                    {ipapi && (
                        <>
                            <p>IP Address: {ipapi.ip}</p>
                            <p>City: {ipapi.city}</p>
                            <p>Region: {ipapi.region}</p>
                            <p>Country: {ipapi.country_name}</p>
                            <p>Postal Code: {ipapi.postal}</p>
                        </>
                    )}
                </div>
                <div>
                    {renderGoogleSearchLinks()}
                </div>
                <div>
                    <h3>Social Media Presence</h3>
                    <p>Instagram: {instagram_exists ? 'Exists' : 'Does not exist'}</p>
                    <p>Twitter: {twitter_exists ? 'Exists' : 'Does not exist'}</p>
                    <p>Spotify: {spotify_exists ? 'Exists' : 'Does not exist'}</p>
                </div>
                <Button href="/tips">Remove your data</Button>
            </div>
        </View>
    )
}

export default DisplayScanData;