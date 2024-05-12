const { exec } = require('child_process');
const fs = require('fs');
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const triggerscan = async (email) => {
    console.log("Making mosint scan for :", email);
    const filename = `/tmp/` + email.split("@")[0] + `_output.json`;

    console.log("Filename:", filename);

    const command = `/var/task/mosint-x86_64 ${email} -s -o ${filename} -c /var/task/config.yaml`;
    console.log("Executing command:", command);

    try {
        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${error}`);
                    throw new Error('Failed to execute scan');
                    // return res.status(500).json({ error: `Failed to execute scan for ${email}` });
                } else {
                    console.log(`Scan execution successful for ${email}`);
                    fs.readFile(`${filename}`, { encoding: 'utf8', flag: 'r' }, async (err, data) => {
                        console.log("Reading file:", filename);
                        if (err) {
                            console.error(`Error reading file: ${err}`);
                            throw new Error('Failed to read scan data');
                            // return res.status(500).json({ error: 'Failed to read scan data' });
                        }
                        console.log(`File data: ${data}`);
                        const scanData = JSON.parse(data);
                        console.log("Scan Data:", scanData);
                        const params = {
                            TableName: 'webpresence-scan-storage',
                            Item: {
                                'user_email': email,
                                'timestamp': Math.floor(Date.now() / 1000).toString(),
                                'scan_data': JSON.stringify(scanData)
                            }
                        };

                        dynamodb.put(params, (err, data) => {
                            if (err) {
                                console.error(`DynamoDB error: ${err}`);
                                throw new Error('Failed to store scan data');
                                // return res.status(500).json({ error: 'Failed to store scan data' });
                            }
                            console.log(`Scan data stored for ${email}`);
                            return scanData;
                            return res.json({ scanData });
                        });
                        console.log("Now starting email");
                        let emailString = "Webpresence Email\n";
                        emailString += "Email: " + scanData["email"] + "\n"
                        emailString += "IP Address: " + scanData["ipapi"]["ip"] + "\n"
                        emailString += "City: " + scanData["ipapi"]["city"] + "\n"
                        emailString += "Region: " + scanData["ipapi"]["region"] + "\n"
                        emailString += "Country: " + scanData["ipapi"]["country_name"] + "\n"
                        emailString += "Postal Code: " + scanData["ipapi"]["postal"] + "\n"
                        if (scanData["twitter_exists"] == true) {
                            emailString += "Twitter: " + "Exists" + "\n"
                        }
                        else {
                            emailString += "Twitter: " + "Does not exist" + "\n"
                        }
                        if (scanData["spotify_exists"] == true) {
                            emailString += "Spotify: " + "Exists" + "\n"
                        }
                        else {
                            emailString += "Spotify: " + "Does not exist" + "\n"
                        }
                        if (scanData["google_search"]) {
                            emailString += "Links:\n";
                            scanData["google_search"].forEach(element => {
                                emailString += element + "\n";
                            });
                        }

                        if (scanData["breachdirectory"]["success"] == true) {
                            scanData["breachdirectory"]["result"] && scanData["breachdirectory"]["result"].forEach(element => {
                                emailString += "\n"
                                emailString += "Source: " + element["sources"] + "\n"
                                if (element["has_password"] || element["hash_password"]) {
                                    emailString += "Password: " + element["password"] + "\n"
                                    emailString += "SHA1 Hashed Password: " + element["sha1"] + "\n"
                                }
                            });
                        }

                        console.log("Email String:", emailString);

                        const ses = new AWS.SES({ apiVersion: '2010-12-01' });
                        const email_params = {
                            Destination: {
                                ToAddresses: [email] // Replace with recipient email address
                            },
                            Message: {
                                Body: {
                                    Text: {
                                        Data: emailString
                                    }
                                },
                                Subject: {
                                    Data: 'WebPresence Scan Results'
                                }
                            },
                            Source: 'mj3102@nyu.edu' // Replace with sender email address
                        };
                        console.log("Email Params:", email_params);
                        try {
                            console.log("Sending email");
                            const data = await ses.sendEmail(email_params).promise();
                            console.log('Email sent:', data);
                            resolve();
                        } catch (error) {
                            console.error('Error sending email:', error);
                            return { statusCode: 500, body: JSON.stringify('Error sending email') };
                        }
                    });
                }
            });
        });
        console.log(`outside exec for ${email}`);
        return { statusCode: 200, body: JSON.stringify('Email sent successfully') };
    } catch (error) {
        console.error('Error executing scan:', error);
        return { statusCode: 500, body: JSON.stringify('Error executing scan') };
    }
}
module.exports = { triggerscan };