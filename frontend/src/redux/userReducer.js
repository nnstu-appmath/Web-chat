import {LOGIN, LOGOUT, SET_LOADING, ADD_USER_CHAT_ROOM, SET_USER_IMAGE,SET_CHAT_IMAGE} from './types'

const initialState = {
    loading: true,
    authenticated: false,
    user: null,
    chatRooms: []
}

export default function reducer(state = initialState, action){
    switch(action.type){
        case SET_CHAT_IMAGE: {
            const newState = {...state, imageUrl: action.payload.imageUrl}

            newState.chatRooms.forEach(room => {
                if (room.roomId == action.payload.chatId){
                    console.log("YEEEEEEEEEEES")
                    room.imageUrl = action.payload.imageUrl
                }
            })

            return newState
        }
        case SET_USER_IMAGE: 
            return {...state, user: {...state.user, imageUrl: action.payload.imageUrl}}
        case ADD_USER_CHAT_ROOM: 
            return {...state, chatRooms: [action.payload, ...state.chatRooms]}
        case SET_LOADING:
            return {...state, loading: action.payload}
        case LOGIN:
            return {...state, user: action.payload.user, authenticated: true, chatRooms: action.payload.userChatRooms}
        case LOGOUT:
            return initialState; 
        default:    
            return state;
    }
}