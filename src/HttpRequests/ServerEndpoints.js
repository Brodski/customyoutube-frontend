import axios from 'axios';

import  * as GApiAuth from './GApiAuth';

const SPRING_BACKEND= `http://${process.env.REACT_APP_SPRINGB_DOMAIN}` 

axios.defaults.baseURL = SPRING_BACKEND;

//https://www.npmjs.com/package/axios#handling-errors

axios.interceptors.request.use( (config) => {
  //console.log(`Request was made to ${config.url}`)  
  return config
}, error => {
  console.log("Request error")
  return Promise.reject(error)

})

axios.interceptors.response.use( (res) => {
  //console.log(`Response recieved with status ${res.status} `)  
  return res
}, error => {
  console.log('Response error')
  return Promise.reject(error)
})


export async function loginToBackend() {
  if (!GApiAuth.isHeSignedIn()) {
    console.log('User is not logged in. Returning')
    return
  }
  let idtoken = GApiAuth.getToken()
  // eslint-disable-next-line consistent-return
  return axios.post('/user/login', { "idtoken": idtoken })
    .then(res => {
      console.log('User login successful')
      return res
    })
    .catch(e => {
      console.log(`Axios request failed: Login ${e}`);
      return e
    })

}

export async function saveUser(user) {
  if (!GApiAuth.isHeSignedIn()) {
    console.log('User is not logged in. Returning')
    return
  }
  let idtoken = GApiAuth.getToken()
  return axios.post(`${SPRING_BACKEND}/user/save`, { "idtoken": idtoken, "user": user })
    .then(res => {
      console.log(`User has been saved with status code ${res.status}`)
      return res
    })
    .catch(e => {
      console.log(`Axios request failed: save user ${e}`);
      return e
    })
  }
