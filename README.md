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


## Planned Features

* Ability to save games and places.
* Icons for instances
* LUA Language Server (requires plugin)
* QL Improvements

## Known Issues

* Requests can fail often (Roblox Issue)

---

## v0.2

### Features

* Store game places
* Edit placeId
* Edit API key
* Delete stored places

### Bug fixes

* Clicking a script would keep adding it's text to the current editor.
* `Save All Files` would overwrite and perviously open scripts with nothing.

## How to create an API key

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

Enter and IP address and port you wish to use or use `0.0.0.0/0`

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/9.png)

Click **ADD IP ADDRESS**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/10.png)

Select and Expiration time if you wish.

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/11.png)

Click **SAVE & GENERATE KEY**

![Click Create API key](https://raw.githubusercontent.com/afoster549/roblox-editor/main/images/APIKEY/12.png)

Ensure you clikc **COPY KEY TO CLIPBOARD** and store this somewhere so you don't loose it.