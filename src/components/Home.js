import React from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  View,
} from "@aws-amplify/ui-react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Button } from "react-bootstrap";

const Home = ({ isAuthenticated, onSignOut }) => {

  return (
    <div>
      <View className="App">
      <img
                            src="logo-small.png"
                            width="192"
                            height="192"
                            alt="Webpresence Logo"
                        />
        <h1>Webpresence</h1>
        <h3>Find out what attackers know about you just from your email!</h3>
        <Button href="/signin">Sign In</Button>
        <br></br><br></br><hr></hr><br></br>
        <div className="limit-width">
        <h2>FAQ</h2>
        <ListGroup>
          <ListGroupItem>
            <strong> How does it work? </strong>
            <p>Webpresence gets data directly from the various APIs that hackers use to target you, in real time. 
              Retrieved data is then processed and displayed in a detailed report containing all the information we could find. 
              These reports contain information like the accounts associated with your email, breached passwords, full names and more.</p>
            </ListGroupItem>
          <ListGroupItem>
            <strong>Why do I need to sign up to try?</strong>
            <p>We don't want attackers using our service for malicious purposes. Signing up is just a way to verify that you own the email address you're querying for.</p>
          </ListGroupItem>
          <ListGroupItem>
            <strong>Can I delete my account?</strong>
            <p>Ofcourse! You can contact us and we will delete the account, along with its associated data no questions asked.
              There will also be an option in the near future in your profile settings to delete it yourself.
            </p>
          </ListGroupItem>
        </ListGroup>
        </div>
        {/* {!isAuthenticated && <p>Please sign in to access private pages.</p>} */}
      </View>
    </div>
  )
}

export default Home;