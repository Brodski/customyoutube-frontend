import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

import * as Common from './BusinessLogic/Common';
import * as GApiAuth from './HttpRequests/GApiAuth'
import { 
  IsInitFinishedContext, 
  IsLoggedContext, 
  UserContext, 
  UserSettingsContext } from './Contexts/UserContext'
import About from './Common/Home.jsx';
import Nav from './Common/Nav.jsx';
import SettingsNEW from './Settings/SettingsMain.jsx';
import YoutubeNEW from './Youtube/YoutubeMain.jsx';

// $ npm install --save moment <------For iso 8601 duration conversion
// $ npm install --save sortablejs 
// $ npm install --save react-modal
// $ npm install --save react-infinite-scroller
// $ npm install --save react-id-generator
// $ npm install --save env-cmd 
// $ npm install --save react-loading
// $ npm i --save install materialize-css@next
// $ npm install --save @mdi/font
// $ npm install --save @mdi/react @mdi/js
// $ npm install --save node-sass
// $ npm install --save human-format
// $ npm install react-responsive-carousel --save
// $ npm install --save prop-types
// $ npm i --save-dev eslint-plugin-sort-imports-es6-autofix

// get w/ useEffect & useState...... https://www.youtube.com/watch?v=bYFYF2GnMy8
// useEffect ... forms, button https://reactjs.org/docs/hooks-effect.html 
// 

function App() {

  const [user, setUser] = useState(Common.getMockUser())
  const [userSettings, setUserSettings] = useState(Common.getMockUser())
  const [isLogged2, setIsLogged2] = useState(false)
  const [isInitFinished2, setIsInitFinished2] = useState(false)

  async function initGApi() {
    
    const GoogleAuth = await GApiAuth.initGoogleAPI()  // Usually 500msisSignedIn.get())

    if (GApiAuth.isHeSignedIn() && user.isDemo) {
      await Common.loginAndSet(setUser, setUserSettings)
    }
    

    setIsInitFinished2(true)
    setIsLogged2(GApiAuth.isHeSignedIn())

    // solution to the 2% crash chance where i get random thread bug saying GoogleAuth is null. I think the interpreter does not fully await for initGoogleAPI()???
    while (GoogleAuth == null) {
      console.log("Shits null af ", GoogleAuth)
      await Common.sleep(500)
      initGApi()
      return;
    }

    GoogleAuth.isSignedIn.listen(function (val) {
      console.log('Signin state changed to ', val, "\nSetting to: ", GApiAuth.isHeSignedIn());
      setIsLogged2(GApiAuth.isHeSignedIn())
      window.location.reload(true);
    });
  }

  useEffect(() => {
    console.log("\n\n\n\n HELLO WELCOME TO 'APP.JS' !!!!!!!!!!!!\n\n\n\n")

    // adblock will block the googleapi script/link/cdn if its in the HTML
    // TODO, npm googleapis
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://apis.google.com/js/client.js";
    script.async = true
    document.body.appendChild(script)
    script.onload = () => {
      initGApi()
    }

    moment.updateLocale('en', {
      relativeTime: {
        m: "1 minute",
        h: "1 hour",
        d: "1 day",
        M: "1 month",
        y: "1 year",
      }
    });
  }, [])

  return (
    <Router>
      <Switch>
        <UserContext.Provider value={{ user, setUser }}>
          <UserSettingsContext.Provider value={{ userSettings, setUserSettings }}>
            <IsLoggedContext.Provider value={{ isLogged2, setIsLogged2 }}>
              <IsInitFinishedContext.Provider value={{ isInitFinished2, setIsInitFinished2 }}>

                <Nav />
                <Route path="/" exact component={YoutubeNEW} />

                <Route path="/about" component={About} />

                <Route path="/customize" component={SettingsNEW} />
              </IsInitFinishedContext.Provider>
            </IsLoggedContext.Provider>
          </UserSettingsContext.Provider>
        </UserContext.Provider>
      </Switch>
    </Router>
  );
}

export default App;