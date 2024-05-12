import React, { useState, useLayoutEffect } from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import { get } from 'aws-amplify/api';
import {
    Button,
    Flex,
    Heading,
    View,
} from "@aws-amplify/ui-react";
import { getCurrentUser } from 'aws-amplify/auth';

import { fetchAuthSession } from 'aws-amplify/auth';
import DisplayScanData from './DisplayScanData';

const Dashboard = ({ isAuthenticated, onSignOut }) => {
    const [scanData, setScanData] = useState([]);
    const [selectedTimestamp, setSelectedTimestamp] = useState(null);
    const [selectedScanData, setSelectedScanData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useLayoutEffect(() => {
        checkAuthStatus();
        if (isAuthenticated) {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useLayoutEffect(() => {
        if (isAuthenticated) {
            getScanData();
        }
    }, [isAuthenticated]);

    useLayoutEffect(() => {
        if (scanData.length > 0) {
            showScanData(scanData[0].timestamp);
        }
    }, [scanData]);

    const checkAuthStatus = async () => {
        try {
            await getCurrentUser();
            isAuthenticated = true;
            setIsLoading(false);
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

    async function getScanData() {
        try {
            const { idToken } = (await fetchAuthSession()).tokens ?? {};
            const email = idToken ? idToken['payload']['email'] : null;

            const restOperation = get({
                apiName: 'webPresenceCloud',
                path: '/get-scan-data',
                options: {
                    queryParams: {
                        email: email
                    }
                }
            });

            const { body } = await restOperation.response;
            const response = await body.json();
            setScanData(response);
        } catch (e) {
            console.log('GET call failed: ', JSON.parse(e.response.body));
        }
    }

    const showScanData = (timestamp) => {
        setSelectedTimestamp(formatTimestamp(timestamp));
        const selectedData = scanData.find((data) => data.timestamp === timestamp);
        setSelectedScanData(selectedData ? selectedData.scan_data : null);
    };

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleString();
    }

    async function triggerScan() {
        try {
            const { idToken } = (await fetchAuthSession()).tokens ?? {};
            const email = idToken ? idToken['payload']['email'] : null;

            const restOperation = get({
                apiName: 'webPresenceCloud',
                path: '/trigger-scan',
                options: {
                    queryParams: {
                        email: email
                    }
                }
            });

            const { body } = await restOperation.response;
            const response = await body.json();
            await getScanData();
        } catch (e) {
            console.log('GET call failed: ', JSON.parse(e.response.body));
        }
    }

    return (
        <>
            <View className="App">
                <Heading level={1}>Dashboard</Heading>
                <View>
                    <Button onClick={getScanData}>Get Scanned Data</Button>
                    <Button onClick={triggerScan}>Trigger Scan</Button>{''}
                </View>
            </View>

            <div className="dashboard-container">
                <div className="scan-history">
                    <Heading level={2}>Scan History</Heading>
                    {scanData.length === 0 && <p>No scan data available. Click on Get Scanned Data to fetch the data.</p>}
                    <ul>
                        {scanData.map((data) => (
                            <li key={data.timestamp}>
                                <Button
                                    variant={data.timestamp === selectedTimestamp ? 'cta' : 'primary'}
                                    onClick={() => showScanData(data.timestamp)}
                                >
                                    {formatTimestamp(data.timestamp)}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="scan-result">
                    <Heading level={2}>Scan Result</Heading>
                    {!selectedTimestamp && <p>Select a timestamp to view the scan data.</p>}
                    {selectedTimestamp && (
                        <DisplayScanData scanData={selectedScanData} selectedTimestamp={selectedTimestamp} />
                    )}
                </div>

            </div>
        </>
    )
}

export default Dashboard;