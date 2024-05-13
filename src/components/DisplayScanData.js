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
    const { email, ipapi, google_search, twitter_exists, spotify_exists, haveibeenpwned } = scanData;


    useEffect(() => {
    }, []);

    const renderGoogleSearchLinks = () => {
        if (google_search && google_search.length > 0) {
            return (
                <View>
                    <h3>Google Search </h3>
                    {google_search.map((link, index) => (
                        <a href={link} key={index} target="_blank">{link} <br /></a> 
                    ))}
                    <br />
                </View>
            );
        } else {
            return <Text>No Google search results found. <br /></Text> ;
        }
    };

    const renderBreachData = () => {
        if (haveibeenpwned && haveibeenpwned.length > 0) {
            return (
                <View>
                    <h3>Breach Data</h3>
                    {haveibeenpwned.map((breach, index) => (
                        <div key={index}>
                            <h4>{breach.Name}</h4>
                            <p>Domain: {breach.Domain}</p>
                            <p>Breach Date: {breach.BreachDate}</p>
                            <div dangerouslySetInnerHTML={{ __html: breach.Description }} />
                            <p>Data Classes: {breach.DataClasses.join(', ')}</p>
                        </div>
                    ))}
                </View>
            );
        } else {
            return <Text>No breaches found.</Text>;
        }
    };

    return (
        <View>
            <h3 level={2}>Timestamp: {selectedTimestamp}</h3>
            <div>
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
                    {/* <p>Instagram: {instagram_exists ? 'Exists' : 'Does not exist'}</p> */}
                    <p>Twitter: {twitter_exists ? 'Exists' : 'Does not exist'}</p>
                    <p>Spotify: {spotify_exists ? 'Exists' : 'Does not exist'}</p>
                </div>
                {renderBreachData()}
                <Button href="/tips">Remove your data</Button>
            </div>
        </View>
    )
}

export default DisplayScanData;