# Roblox Editor

Allows you to edit Roblox scripts outside of Roblox studio.

## Features

* Explore your roblox game within VS code and select items you wish to edit.
* Allows the editing of Scripts through the new Open Cloud [Engine Instance](https://create.roblox.com/docs/en-us/cloud/open-cloud/instance) feature.

> WARNING The Engine Instance feature is in beta and so has restrictions currently.
> * You can only read and update Script, LocalScript, and ModuleScript objects.
> * You can't update scripts that are currently open in Roblox Studio.
> * You can't update scripts that are part of a package.
> * You can only use API key authentication. Create an [API key](https://create.roblox.com/docs/en-us/cloud/open-cloud/api-keys) with Engine (Beta) added as an API system.

## Usage

To open a place run the command `Open Place`

This will bring up a menu you can select from any of your perviously opend places or add a new place.

Adding a new place requires both a palceId and an API key see [here](#how-to-create-an-api-key) on how to create one.

You can then browse through your game in the **Explorer** view.

To edit a script simply click on it this will open up a new code editor with the script in it.

To save your changes use either `alt+d` to save the current script or `alt+k d` to save all open scripts.

Currently you need to re-open the game inorder to view your changes in scripts. However this is going to be fixed!

> NOTE! Scripts can only be updated if there is no current live editing session.

## Planned Features

- [x] Save palces
- [x] Edit saved palces
- [x] Instance icons
- [ ] Unload game
- [ ] Reload game
- [ ] LUA Language Server (requires plugin)
- [ ] QL Improvements

## Known Issues

* Requests can fail often (Roblox Issue)

---

## v0.2

### Features

* Instance Icons
* Code Improvements

> NOTE! It is currently not possible to see exactly what an Instance is other than scripts so Icons are based on the name.

### Bug fixes

* None

# How to create an API key

Navigate to https://create.roblox.com/dashboard/credentials?activeTab=ApiKeysTab

Click **Create API key**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/1.png)

Give it a Name

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/2.png)

Click **Select API System** and select **Engine (Beta)**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/3.png)

Click **ADD API SYSTEM**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/4.png)

Click **Select an Experience** and select the game you wan't to add

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/5.png)

Click **ADD EXPERIENCE**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/6.png)

Click **Select Operations to Add**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/7.png)

Select both **Read** and **Write**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/8.png)

Enter an IP address and port you wish to use or `0.0.0.0/0`

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/9.png)

Click **ADD IP ADDRESS**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/10.png)

Select and Expiration time if you wish.

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/11.png)

Click **SAVE & GENERATE KEY**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/12.png)

Ensure you click **COPY KEY TO CLIPBOARD** and store this somewhere so you don't loose it.