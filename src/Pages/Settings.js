import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../Contexts/UserContext.js'
import { ButtonsAuthDebug } from '../Components/ButtonsAuthDebug';
import { LoginLogout } from '../Components/LoginLogout'
import * as GApiAuth from '../HttpRequests/GApiAuth'
import { User } from '../Classes/User'
import { Subscription } from '../Classes/Subscription'
import * as ServerEndpoints from '../HttpRequests/ServerEndpoints';

import Sortable from 'react-sortablejs';
import PropTypes from 'prop-types';
import * as MySortables from '../Components/MySortables'
import * as SettingsLogic from '../BusinessLogic/SettingsLogic'
//
//  https://github.com/SortableJS/react-sortablejs

//var Sortable = require('react-sortablejs');

export const Settings2 = (props) => {

  console.log('Settings 2 props.mockUser')
  console.log(props.mockUser)
  const [subs, setSubs] = useState(props.mockUser)
  const [availableSubs, setAvailableSubs] = useState([''])

  useEffect(() => {
    setStuff()
  }, []);

  const setStuff = async () => {

    setSubs(props.mockUser) 
    setAvailableSubs(subs.map(s => s.channelName))
  }

  function changeShit(order, sortable, evt) {  }

  function logSubzButton() {
      console.log('subs');
      console.log(subs);
      console.log( subs.map(s => s.channelName))
      //setAvailableSubs(subs.map(s => s.channelName))
}


    return (
    
      <div>
        <h1> Settings2 </h1>
        
        <button onClick={logSubzButton}> log subs & subList </button>

        <Sortable
          className="block-list"
          options={{
            group: 'shared',
          }}
          chosenClass="sortable-chosen"
          onChange={(order, sortable, evt) => { changeShit(order, sortable, evt) }} >
          {availableSubs.map(s => (<div className="block" data-id={s} key={s} > {s} </div> ))}
        </Sortable>
      </div>
    )


}

const UnsortedSubsShelf = (props) => {
  console.log("Unsorted Subs Shelf")
  
const [subList, setSubsList] = useState(props.mockUser.map( s => s.channelName))
  
  function changeShit(order, sortable, evt) {  
    setSubsList(order)
    }

  function logButton() {
      console.log('subsList: '); console.log(subList);
  }
  return (
    <div>
      <h1> Unsorted Sub Shelf </h1>
        
      <button onClick={logButton}> log subs & subList </button>

      <Sortable
        className="block-list"
        options={{
          group: 'shared',
          animation: 100,
          swapThreshold: .1,     
        }}
        chosenClass="sortable-chosen"
        onChange={(order, sortable, evt) => { changeShit(order, sortable, evt) }} >
        {subList.map(s => (<div className="block" data-id={s} key={s} > {s} </div> ))}
      </Sortable>
    </div>
    )



}

export const Settings = () => {

  const { user, setUser } = useContext(UserContext);
  const [subs, setSubs] = useState([ ])
  const [subsList, setSubsList] = useState([ ])
  let mockUser;
  useEffect(() => {
    getShit()
  }, []);
    
  async function getShit() {
    mockUser = await ServerEndpoints.getMockUser()
    await setSubs(mockUser.subscriptions)
    //await setSubsList( mockUser.subscriptions.map( s => s.channelName ))

    //subz = subs.map(s => (<div className="block" data-id={s.channelName} key={s.channelId} > {s.channelName} </div> ))
  }

  const SettingsIn = () => {

    const ff = ['Apple', 'Banana', 'Cherry', 'Grape'];

    return (
      <div>
      <MySortables.SharedGroup items={ff} />
        <MySortables.SharedGroup2 items={subsList} onChange={setSubsList}/>
        <h1> SettingsIn </h1>
        <button onClick={() => { console.log('subs: '); console.log(subs); }} >log subs </button>
 
        <Sortable
          className="block-list"
          options={{
            group: 'shared'
          }}
          chosenClass="sortable-chosen"
          onChange={(order, sortable, evt) => { setSubs(order) }} >
          {subs.map(s => (<div className="block" data-id={s.channelName} key={s.channelId} > {s.channelName} </div> ))}
        </Sortable>
      </div>
    )

  }

  const SettingsOut = () => {

    return(
      <h1> Fool! Log in! </h1>
    )
  }


    return (
    <div>  
        <h1> ```````````````````````` </h1>
        {!user ? <SettingsOut /> : <UnsortedSubsShelf  mockUser={subs}/> }
        <h1> ~~~~~~~~~~~~~~~~~~~~~~~~~ </h1>
          {!user ? <SettingsOut /> : <Settings2  mockUser={subs}/> }
        <h1> ~~~~~~~~~~~~~~~~~~~~~~~~~ </h1>
        {!user ? <SettingsOut /> : <SettingsIn /> }
      <div/>
        <h3> user message: {user} </h3>
        <button onClick={() => setUser('man this is it')} > change user message </button>
      <div/>
        <LoginLogout user={user}/>
      <div/>


      <h3>====== Sortables testing & examples  =======</h3>
      <MySortables.FruitsSort />
      <MySortables.GeneralList />
      <MySortables.Fruits />
        <h3> Shared grup </h3>
      <MySortables.SharedGroup items={['Apple', 'Banana', 'Cherry', 'Grape']} />
            <h4> (shared) extra space for testing </h4>
      <MySortables.SharedGroup items={['Lemon', 'Orange', 'Pear', 'Peach']} />
      <MySortables.ControlGroup />
      <h3>====================================</h3>
      <div/>
      <ButtonsAuthDebug/>
    </div>
  );
}
