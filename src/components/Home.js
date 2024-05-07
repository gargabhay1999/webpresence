import React from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  View,
} from "@aws-amplify/ui-react";

const Home = ({ isAuthenticated, onSignOut }) => {

  return (
    <div>
      <View className="App">
        <p>Welcome to Webpresence</p>
        {/* {!isAuthenticated && <p>Please sign in to access private pages.</p>} */}
      </View>
    </div>
  )
}

export default Home;