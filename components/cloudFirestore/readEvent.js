import firebase from 'firebase/app'
import 'firebase/firestore'
import { useEffect, useState } from "react";
import { getEventFromCookie, removeEventCookie, setEventCookie } from "./eventCookie";

export const readEventData = async (eventId, id) => {
  // removeEventCookie()
  const eventDataFromCookie = getEventFromCookie()
  if(eventDataFromCookie){
    console.log("cookie!!")
    return eventDataFromCookie
  } 
  try {
    const doc = firebase.firestore()
      .collection("testUsers")
      .doc(id)
      .collection("events")
      .doc(eventId)
    const data = await doc.get();
    if (data.exists) {
      console.log(data.data())
      setEventCookie(data.data())
      return data.data()
    }else{
      console.log("no Data")
      return new Error("no Data")
    }
  } catch (e) {
    console.log(e)
    return new Error(e)
  }
}