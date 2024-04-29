import React, { useState, useEffect } from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import { get } from 'aws-amplify/api';
import {
    Button,
    Flex,
    Heading,
    Text,
    View,
} from "@aws-amplify/ui-react";

import { fetchAuthSession } from 'aws-amplify/auth';

const Dashboard = () => {
    const [scanData, setScanData] = useState([]);

    useEffect(() => {
    }, []);

    async function getScanData() {
        try {
            const { idToken } = (await fetchAuthSession()).tokens ?? {};
            const email = idToken ? idToken['payload']['email'] : null;
            console.log("User's email:", idToken['payload']['email']);

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

            console.log('GET call succeeded');
            console.log(response[0]['scan_data']);
            setScanData(response[0]['scan_data']);
        } catch (e) {
            console.log('GET call failed: ', JSON.parse(e.response.body));
        }
    }

    async function triggerScan() {
        try {
            const { idToken } = (await fetchAuthSession()).tokens ?? {};
            const email = idToken ? idToken['payload']['email'] : null;
            console.log("User's email:", idToken['payload']['email']);

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

            console.log('GET call succeeded');
            console.log(response['scanData']);
            setScanData(JSON.stringify(response['scanData']));
        } catch (e) {
            console.log('GET call failed: ', JSON.parse(e.response.body));
        }
    }

    return (
        <View className="App">
            <Heading level={1}>Dashboard</Heading>
            <View>
                <Button onClick={getScanData}>Get Scanned Data</Button>
                <Button onClick={triggerScan}>Trigger Scan</Button>
                <Flex
                    key="scanData"
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Text as="span">{scanData}</Text>
                </Flex>

            </View>
        </View>
    )
}

export default Dashboard;