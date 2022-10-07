# What'sUp Bot

**Link on [GitHubPages][gitPages]**

## Final JS-Course Work
- [What'sUp Bot](#whatsup-bot)
  - [Final JS-Course Work](#final-js-course-work)
  - [Features](#features)
    - [**Key Features**](#key-features)
    - [**Aux Features**](#aux-features)
  - [Architecture](#architecture)
  - [Plugins](#plugins)
  - [Loading](#loading)
  - [Installation](#installation)
  
[![Build status](https://ci.appveyor.com/api/projects/status/i6u0692t36derfbt?svg=true)](https://ci.appveyor.com/project/KirillKazakoff/diplomafront)

What'sUp Bot is the application which purpose is
to store, send and record some user data.

## Features
- Key Features      
    - Storing all data on the server
    - Lazy load from server on user scroll 
    - Rendering the sent files preview
    - Send files with Drag and Drop or header button
    - Send user text with footer input
    - Links recognition in user text
    - The possibility of downloading files by user
- Aux Features
    - Reading media (audio and video files)
    - Recording media with videoJs plugin
    - Zip files when upload and unzip files on download from server  
    - ServiceWorker and WebWorker tech implementation
    - Content filtration in header input

---
### **Key Features**
1. ### Storing all data on the server: 
    - **Realization:** </br> 
    Server is build with Koa framework on node-js. A data that was sent by user is posting on the server with several requests. The first one sends file's data (name, id, etc), the second one sends file itself.

        On 'data post' file is transforming to FormData object and then server gets it with Koa-multer middleware.
        On 'data get' file is taken from the 'public' directory on the server.

        On the first load, users get few files (now there are 5 files) - it happens by combination of several requests: the first one gets the data about these files.

        When response on the first request is received, other 'getFile' requests will happen one by one (synchronously) in line with the first request data. Finally, all messages will be rendered. 
        When user scroll to the end of the chat-container, the aforementioned instruction will be repeated.
        
        When the last file is sent, server will send the response with 'false'.

    </br>
2. ### Rendering the sent files preview:
    - **How does it work:** </br> When you send some data (by text input either drag and Drop or header button) then it will be rendered. Messages are distinguished by several types
    - **Realization:** </br> Look at the [Architecture](#architecture)

        </br>
3. ### Send files with Drag and Drop or header button
    - **How does it work:** </br> You cand drop files to the app either by drag and drop or by button in header section: ![SendFilesGif]
    - **Realization:** </br> Look at the [Architecture](#architecture)

        </br>
4. ### Send user text with footer text input
   - **How does it work:** </br> Just type your marvellous text in the footer text input: ![UserInputGif]
   - **Realization:** </br> Before sending on server it will be transformed into file Object (for the compatibility with other types of message).

        </br>
5. ### Links recognition in user text
   - **How does it work:** </br> Just insert a linkable text in the text input and then it will be transformed in link: ![LinkInTextGif]
   - **Realization:** </br> It's being parsed with regExp

        </br>
6. ### The possibility of downloading files by user
   - **How does it work:** </br> I guess it's kinda self-explanatory feature. But ok, here is the gif just in case: ![DownloadGif]
   - **Realization:** </br> When message is being rendered then it's download button initialised by link that equal with file url.
   
        </br>
---
### **Aux Features**
1. ### Reading media (audio and video files)
    - **How does it work:** </br> Just click on the play button
    - **Realization:** </br> On media upload it's being parsed by file type. Then corresponding html markup is creating and url is being put in the src.

        </br>
2. ### Recording media with videoJs plugin
    - **How does it work:** </br> Each time when you click on a record button (video or audio) then it opens a recorder.
  
      After that, you can choose whether you want to delete: ![CancelGif]

      Or send the record: ![SuccessGif]
      Each recorder has itself max record time. When time's up it just stops the record.
    - **Realization:** </br> There's being used [videoJs][PlVideo] package with [Record plugin][PlVideoR]. On the record click it starts recording at the same time. Each time when a record stops previous record instances are being deleted and new ones are being created.
    - **Why it's so silly (non-obligatory to read):** </br> It maybe a little bit confusing but because of lack of documentaion I've had no idea what to do and I had to came up with this trick. The problem is that when you click on video record button it works great. But when you click again then it isn't being refreshed, yet instead it remembers the previous video and the video timer is being hidden in result. 

       </br>
3. ### Zip files when upload and unzip files on download from server:
    - **Realization:** </br> There's being used [jsZip package][PlJsZip]. </br>When user send data it is being zipped asynchronously in WebWorker and then sent to the server.
    When user get data from server then it is's being unzipped synchronously and then rendered. 

    </br>
4. ### ServiceWorker implementation
    - **How does it work:** </br> After the first reload app save cache and then in case if you don't have network connection you will get your previous sent files: ![ServiceWorkerGif]
    - **Realization:** </br> In case of lost connection client will send getAllFilesData request on server instead of ordinary getFilesData request. Then this request will be caught by ServiceWorker and it will take it's previous result from cache and send it back to the client side.

    </br>

5. ### Content filtration
    - **How does it work** </br> Type in search input a needed filter. After that, your messages will be filtered by the inserted filter. There are few filter types that you can use: pic(pictures, images), video, audio, doc(text, documents): ![FilterGif]

    User can't create new messages during filter is active. 
    - **Realization** </br> When user input data in filter field then client sends a request with current filter state to the server. There messages are filtered and sent back to user. 

---

PS: A lot of features huh :) but in fact it's still a useless piece of s$$$. Anyway, who cares? Just let's move on.

---

## Architecture 
1. ### Frontend (actually it sucks)
    Project is distinguished on several parts:
    - **Components:** parts of the bot (header, content, footer)
    - **Controller:** module that binds all components together
    - **Lib:** aux things - utils and template engine
    - **Request:** api module for connection between server and client
    - **Service-worker:** ServiceWorker itself (omg lmao)
    - **Upload:** basically it is a structure, responding for file parsing. 
    The key idea there is to use closure in controller. Then this handler is imparted to all components. This handler either just render message or as well send it to the server. (If user upload data then bot render message and send file to the server, in case if it takes message from server then it just renderes message)

       </br>

1. ### Backend (sucks even more)
    Project is distinguished on several parts:
    - **Db:** database module logic, contains lazyLoad logic, etc
    - **InitFiles:** test file load (static)
    - **Public:** here are being stored files sent by the user (static)
    - **Routes:** interaction with client requests
    - **ServerApp:** app entry point, here starts serve

        The key idea there is to use koa-multer and koa-body middlewares on different routes. When it gets fileData then it uses koa-body and when it gets file itself then it uses koa-multer to put file in public directory

</br>

## Plugins 

| Plugin              | README                                           |
| ------------------- | ------------------------------------------------ |
| Koa                 | [plugins/koa/README.md][PlKoa]                   |
| Koa-multer          | [plugins/koa-multer/README.md][PlKoaM]           |
| Koa-body            | [plugins/koa-body/README.md][PlKoaB]             |
| Koa-static          | [plugins/koa-static/README.md][PlKoaS]           |
| Koa-router          | [plugins/koa-router/README.md][PlKoaR]           |
| Koa-combine-routers | [plugins/koa-combine-routers/README.md][PlKoaCR] |
| Webpack             | [plugins/webpack/README.md][PlWebpack]           |
| VideoJs             | [plugins/videoJs/README.md][PlVideo]             |
| VideoJs Record      | [plugins/videoJsRecord/README.md][PlVideoR]      |
| jsZip               | [plugins/jsZip/README.md][PlJsZip]               |

</br>

## Loading
You should wait about 20 sec before data will be loaded. You will be seing loader while data is loading

</br>

## Installation
If you want to run the application then you should separatelly load two git repos: this one (client side) and [this] (server side).
After that you need to install dependencies (oh wow) in both projects:
```sh
yarn
```


Then:
- In backend project you should start 'dev' script if you want to contribute.
    If you just want to run it then use 'start' script
    ```sh
    yarn dev
    yarn start
    ``` 

- In frontend project you just should use 'start' script. (but before you need to build project with webpack with 'build' command). 

  ```sh
  yarn build
  yarn start
  ```





<!-- Links in text -->
[this]: <https://github.com/KirillKazakoff/diplomaBack>
[gitPages]: <https://kirillkazakoff.github.io/WhatsUpBot/>

[SendFilesGif]: ./assets/SendFiles.gif
[UserInputGif]: ./assets/UserInput.gif
[LinkInTextGif]: ./assets/LinkInText.gif
[DownloadGif]: ./assets/Download.gif
[CancelGif]: ./assets/Cancel.gif
[SuccessGif]: ./assets/Success.gif
[ServiceWorkerGif]: ./assets/Service-Worker.gif
[FilterGif]: ./assets/Filter.gif

   <!-- Table  -->
   [PlKoa]: <https://github.com/koajs/koa/blob/master/Readme.md>
   [PlKoaM]: <https://github.com/koajs/multer/blob/master/README.md>
   [PlKoaB]: <https://github.com/koajs/koa-body#readme>
   [PlKoaS]: <https://github.com/koajs/static#readme>
   [PlKoaR]: <https://github.com/koajs/router#readme>
   [PlKoaCR]: <https://github.com/saadq/koa-combine-routers/blob/master/README.md>
   [PlWebpack]: <https://github.com/webpack/webpack/blob/main/README.md>
   [PlVideo]: <https://github.com/videojs>
   [PlVideoR]: <https://github.com/collab-project/videojs-record>
   [PlJsZip]: <https://github.com/Stuk/jszip/blob/master/README.markdown>
