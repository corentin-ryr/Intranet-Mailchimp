# Faster Email Campaigns *using Mailchimp API*

## Table of Contents
1. [Introduction](#introduction)
2. [Development](#development)
   1. [Front-End](#front-end)
   2. [Back-End](#back-end)
3. [Deployed Version](#deployed-version)
   1. [Website](#website)
   2. [Clearance](#clearance)

## Introduction
The goal of this project is to take advantage of the Mailchimp API to send quickly custom HTML-emails to a professional mailing-list.
As the sent emails all use the same template, and as the only difference between them is the content of the sections, we created a website allowing users to write the text of these sections.
Then, the node.js backend creates the HTML content of the email from the content written, and creates a Mailchimp campaign.
Finally, a test email is sent to auditors for review.

![](/resources/ExampleMRI.png)

## Development
### Front-End
The Front-End development uses the [Vue.js](https://vuejs.org) framework, with the [Vuetify](https://vuetifyjs.com/en/) library. This allow beautiful handcrafted Material Design components.

![](/resources/SendingAnimation.gif)

### Back-End
The Back-End uses [Node.js](https://nodejs.org/en/), with the [Mailchimp API](https://mailchimp.com/developer/marketing/api/). This Back-End is hosted with Firebase, using [Cloud Functions for Firebase](https://firebase.google.com/docs/functions). 

## Deployed Version
### Website
The deployed version of this website is accessible here: [MRI Website](https://mri.telecom-etude.fr)

### Clearance
The ability to create campaigns with this deployed website is restricted to active members of [Telecom Etude](https://telecom-etude.fr) Junior-Entreprise.
This is achieved with the necessity to sign in with a *@telecom-etude.fr* Google Workspace account.

### Documentation
Documentation is available at this link:
https://corentin-ryr.github.io/Intranet-Mailchimp/
