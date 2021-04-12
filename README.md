## Multi Omnichannel Chat Example
This Chatbot is a work in progress. Provided as an example for transfering between one Omni Channel to another
**This is _NOT_ Production Ready Code**

DISCLAIMER The sample scripts are not supported under any Microsoft standard support program or service. This is intended to be used in non-production environment only. The sample scripts are provided AS IS without warranty of any kind. Microsoft further disclaims all implied warranties including, without limitation, any implied warranties of merchantability or of fitness for a particular purpose. The entire risk arising out of the use or performance of the sample scripts and documentation remains with you. In no event shall Microsoft, its authors, owners of this github repro, or anyone else involved in the creation, production, or delivery of the scripts be liable for any damages whatsoever (including without limitation, damages for loss of business profits, business interruption, loss of business information, or other pecuniary loss) arising out of the use of or inability to use the sample scripts or documentation, even if Microsoft has been advised of the possibility of such damages.

# Setup 
1. Create a new .env based on the .env.config file with the required Omni Chat widget information.
    1. Go to the dynamics portal chat administration page 
    1. In the Widget snippet copy the data-app-id into the widgetId in the .env file
    1. In the Widget snippet copy the data-org-id into the orgId in the .env file
    1. In the Widget snippet copy the data-org-url into the url in the .env file
    1. repeat as necessary 
1. To run _local development_ you either need to allow CORS or disable authenication. The instructions for allowing CORs is below. _These steps are not required for hosting on the portal_
    1. Set the **development** protal to allow CORS by going to site setting HTTP/Access-Control-Allow-Origin and set to allow localhost. 
        ref: https://docs.microsoft.com/en-us/dynamics365/marketing/developer/portal-hosted#configuring-cross-origin-resource-sharing-cors
    1. Run chrome with the command line below to disable security (normal browser will block CORS on the user end so this needs to be disabled)
    `"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu --user-data-dir="C:\trash"`
    1. In the chrome window that opened log into the development portal
    1. Run `npm start`
    1. Browse to the local chat control in the chrome window at http://localhost:3000
1. To include on the portal page
    1. Host the complied files in a location of your choosing.
    1. Go to the site page in dynamics and include the deployed JS (and CSS if necessary) files. Unlike local development no special configuration is needed for authenication.



# How it works
1. The chat utilizes the Omni Channel SDK and can be expanded using that SDK. 
    ref https://github.com/microsoft/omnichannel-chat-sdk 
1. The WebChat component acts as an operator and enables transfers between Omni channels based on call backs
1. All Omni channel communcation and authenication happens in the ChatControl component. One of these is initialized for each Omni channel that could be used in startup. 
1. The createActivityMiddleware function translates special messages for communication and transferes.
1. From a user standpoint it appears that a new chat is started but what really happens is each chat is hidden and shown based on what is currently the active channel. 

# Note: 

Depending on the version of NPM the --legacy-peer-deps flag may be needed during the `npm install` command

# Needed improvements 
1. Remove the context for hiding and showing the chat as a group and make it specific to each omni channel. This will allow the chat to end independently and the reinitialize
2. Enable proper chat end on transfers and then enable past chat histry on re initialization. _The above will enable this._