import React, { useState, useEffect, useLayoutEffect } from "react";
import "../App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  View,
} from "@aws-amplify/ui-react";
import { getCurrentUser } from 'aws-amplify/auth';

function DataRemovalTips() {
  return (
    <div className="data-removal-tips">
      <h2>Steps to Remove Your Data From Websites</h2>
      <ul>
        <li>
          <strong>Contact the Website Directly:</strong> The first step is to reach out to the website's administrator or support team. Many websites have a contact form or email address specifically for privacy inquiries. Politely explain that you would like your data removed and provide any necessary information they may need to identify your account or data.
        </li>
        <li>
          <strong>Check the Website's Privacy Policy:</strong> Review the website's privacy policy to understand their data retention and removal policies. Some websites may outline specific procedures for data removal.
        </li>
        <li>
          <strong>Use Opt-Out or Removal Tools:</strong> Some websites offer opt-out or data removal tools that allow you to remove your information from their database. Look for options like "unsubscribe," "opt-out," or "remove my information" on the website.
        </li>
        <li>
          <strong>Utilize Privacy Tools:</strong> There are third-party privacy tools and services available that can help you identify and remove your personal information from various websites. These tools often automate the process and can save you time.
        </li>
        <li>
          <strong>Legal Options:</strong> In some cases, if a website is unwilling to remove your data or if they are violating privacy laws, you may have legal options available to you. Consulting with a lawyer who specializes in privacy law can help you understand your rights and options.
        </li>
        <li>
          <strong>Regularly Monitor and Update:</strong> Keep track of where your data is stored online and periodically review and update your privacy settings or request removal as needed. It's important to stay vigilant, especially as new websites and services emerge.
        </li>
      </ul>
      <p>
        <em>Remember that while you can request the removal of your data from certain websites, it may not always be possible to completely erase all traces of your information, especially if it has been shared with third parties.</em>
      </p>
    </div>
    );
}

function InternetSecurityTips() {
  return (
    <div className="internet-security-tips">
      <h2>Tips to Protect Your Data on the Internet</h2>
      <ul>
        <li>
          <strong>Use Strong, Unique Passwords:</strong> Create strong passwords for your accounts, and avoid using the same password for multiple accounts. Consider using a password manager to generate and store complex passwords securely.
        </li>
        <li>
          <strong>Enable Two-Factor Authentication (2FA):</strong> Whenever possible, enable two-factor authentication for your online accounts. This adds an extra layer of security by requiring a second form of verification, such as a code sent to your phone, in addition to your password.
        </li>
        <li>
          <strong>Keep Software Updated:</strong> Regularly update your operating system, web browsers, and software applications to patch security vulnerabilities. Enable automatic updates whenever possible to ensure you have the latest security patches.
        </li>
        <li>
          <strong>Be Cautious with Personal Information:</strong> Be mindful of the personal information you share online. Avoid sharing sensitive information such as your full name, address, phone number, or financial details unless necessary.
        </li>
        <li>
          <strong>Use Secure Connections:</strong> When accessing websites or online services, make sure the connection is secure by looking for "https://" in the URL and a padlock icon in the browser address bar. Avoid using public Wi-Fi networks for sensitive activities unless you're using a VPN (Virtual Private Network).
        </li>
        <li>
          <strong>Be Wary of Phishing Attempts:</strong> Be cautious of unsolicited emails, messages, or phone calls asking for personal information or login credentials. Phishing scams often mimic legitimate organizations to trick you into revealing sensitive data.
        </li>
        <li>
          <strong>Review Privacy Settings:</strong> Regularly review and adjust the privacy settings on your social media accounts and other online services. Limit the amount of personal information you share publicly and be selective about who can see your posts and profile information.
        </li>
        <li>
          <strong>Use Encryption:</strong> Use encrypted communication tools and services whenever possible, especially for sensitive information. This includes encrypted messaging apps, email providers that support encryption, and secure file storage services.
        </li>
        <li>
          <strong>Backup Your Data:</strong> Regularly backup your important files and data to an external hard drive or a secure cloud storage service. This helps protect your data in case of device loss, theft, or hardware failure.
        </li>
        <li>
          <strong>Educate Yourself:</strong> Stay informed about common online threats and best practices for internet security. Take advantage of resources such as cybersecurity blogs, forums, and online courses to learn how to better protect yourself online.
        </li>
      </ul>
    </div>
  );
}

const Tips = ({ isAuthenticated, onSignOut }) => {
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
      <DataRemovalTips></DataRemovalTips>
      <InternetSecurityTips></InternetSecurityTips>
    </View>
  )
}

export default Tips;