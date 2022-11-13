import { act } from 'react-dom/cjs/react-dom-test-utils.production.min'
import {SET_CHANNEL_INFO, SET_SOCKET, SET_CURRENT_CHAT, SET_MESSAGES, ADD_MESSAGE, LOGOUT, SET_CHAT_IMAGE, SET_USER_IMAGE} from './types'

const initialState = {
    chatId: null,
    chatName: null,
    imageUrl: null,
    creator: null,
    messages: [],
    socket: null
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case SET_USER_IMAGE: {
            const newState = {...state}

            newState.messages.forEach(msg => {
                if (msg.sender == action.payload.sender){
                    msg.imageUrl = action.payload.imageUrl
                }
            })

            return newState
        }
        case SET_CHAT_IMAGE:
            return {...state, imageUrl: action.payload.imageUrl}
        case ADD_MESSAGE:
            return {...state, messages: [action.payload, ...state.messages]}
        case SET_MESSAGES:
            return {...state, messages: action.payload}
        case SET_CURRENT_CHAT:
            return {...state, chatId: action.payload.id, chatName: action.payload.name, imageUrl: action.payload.imageUrl, creator: action.payload.creator}
        case SET_SOCKET:
            return {...state, socket: action.payload}
        case SET_CHANNEL_INFO:
            return {...state, channelId: action.payload.id, channelName: action.payload.name}
        case LOGOUT:
            return initialState; 
        default:    
            return state;
    }
}