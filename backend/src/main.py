from flask import Flask, jsonify, request, json
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import firebase_admin
from firebase_admin import credentials, firestore
from time import time
import os
import sys
import re


if not firebase_admin._apps:
    cred = credentials.Certificate(os.path.join(sys.path[0], 'serviceAccountKey.json'))
    firebase_admin.initialize_app(cred)

db = firestore.client()

application = Flask(__name__)
socketio = SocketIO(application, cors_allowed_origins="*")
cors = CORS(application)
application.config['CORS_HEADERS'] = 'Content-Type'


@socketio.on('join_room')
@cross_origin()
def handle_join_room_event(data):
    print("join", data['room'])
    room = data['room']
    join_room(room)
    socketio.emit('join_room_announcement', data, room=room)


@socketio.on('leave_room')
@cross_origin()
def handle_leave_room_event(data):
    print("leave", data['room'])
    leave_room(data['room'])
    socketio.emit('leave_room_announcement', data, room=data['room'])


@socketio.on('send_message')
@cross_origin()
def send_message(data):
    db.collection('messages').add({
        'roomId': data['room'],
        'text': data['text'],
        'createdAt': time(),
        'sender': data["sender"],
        'imageUrl': data["imageUrl"],
        'username': data["username"]
    })

    socketio.emit('receive_message', data=data, room=data['room'])




@application.route('/api/create_user', methods=['POST'])
@cross_origin()
def signup_user():
    def isEmail(email):
        pattern = r'^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$'
        if re.match(pattern, email):
            return True
        return False

    def isEmpty(string):
        return len(string) == 0

    request_data = json.loads(request.data)

    if isEmpty(request_data['username']):
        return jsonify({'error': 'Username field is empty!'}), 400

    if isEmpty(request_data['email']):
        return jsonify({'error': 'Email field is empty!'}), 400

    if isEmpty(request_data['password']):
        return jsonify({'error': 'Password field is empty!'}), 400

    if isEmpty(request_data['confirmPassword']):
        return jsonify({'error': 'ConfirmPassword field is empty!'}), 400

    if not isEmail(request_data['email']):
        return jsonify({'error': 'Wrong email format!'}), 400

    if len(request_data['password']) < 6:
        return jsonify({'error': 'Password must contain at least 6 symbols!'}), 400

    if request_data['password'] != request_data['confirmPassword']:
        return jsonify({'error': 'Password does not match!'}), 400

    user = db.collection('users').where('email', '==', request_data['email']).get()
    if len(user) > 0:
        return jsonify({'error': 'Email already exist'}), 400

    db.collection('users').add({'username': request_data['username'],
                                'email': request_data['email'],
                                'password': request_data['password'],
                                'imageUrl': request_data['imageUrl'],
                                'createdAt': time()})
    return jsonify({'Success': 'Account created successfully'}), 200


@application.route('/api/create_chat_room', methods=['POST'])
@cross_origin()
def create_chat_room():
    request_data = json.loads(request.data)
    timestamp = time()
    room_credentials = {
        "name": request_data["name"],
        "creator": request_data["creator"],
        "lastUpdate": timestamp,
        "joined": [request_data['creator']],
        "imageUrl": request_data["imageUrl"],
        "username": request_data["username"]
    }

    snap = db.collection('rooms').add(room_credentials)

    return {"roomId": snap[1].id, 'lastUpdate': timestamp}, 200


@application.route('/api/search_room', methods=['POST'])
@cross_origin()
def search_room():
    request_data = json.loads(request.data)
    room_id = request_data["room_id"]
    data = db.document(f"rooms/{room_id}").get()
    room = data.to_dict()
    if room is None:
        return {"Fail": "No such room"}, 200

    room["roomId"] = room_id
    room["joined"].append(request_data["email"])
    db.document(f"rooms/{room_id}").update({
        "joined": room["joined"]
    })

    return {"Success": room}, 200


@application.route('/api/get_messages/<room_id>', methods=['GET'])
@cross_origin()
def get_messages(room_id):
    msg = db.collection('messages').get()
    msg_dict = [item.to_dict() for item in msg]
    result = []
    for msg in msg_dict:
        if msg["roomId"] == room_id:
            result.append(msg)
    result.sort(key=lambda x: x["createdAt"], reverse=True)

    return {"data": result}, 200


@application.route('/api/get_all_messages', methods=['GET'])
@cross_origin()
def get_all_messages():
    msg = db.collection('messages').get()
    msg_dict = [item.to_dict() for item in msg]

    return {"data": msg_dict}, 200


@application.route('/api/get_user', methods=['POST'])
@cross_origin()
def get_user():
    request_data = json.loads(request.data)

    user = db.collection('users').where('email', '==', request_data['email']).get()
    user_chat_rooms = db.collection('rooms').where('joined', "array_contains", request_data["email"]).order_by("lastUpdate", "DESCENDING").get()
    user_chat_rooms_dict = [item.to_dict() for item in user_chat_rooms]

    for i, item in enumerate(user_chat_rooms):
        user_chat_rooms_dict[i]["roomId"] = item.id
    user_dict = user[0].to_dict()
    user_dict["userId"] = user[0].id

    return jsonify({
        'userChatRooms': user_chat_rooms_dict,
        'user': user_dict
    }), 200


@application.route('/api/update_user_photo', methods=["POST"])
@cross_origin()
def update_user_photo():
    request_data = json.loads(request.data)
    user_id = request_data["userId"]
    print(request_data["imageUrl"], request_data["userId"])
    db.document(f'users/{user_id}').update({
        "imageUrl": request_data["imageUrl"]
    })

    return {"Success": "Updated"}, 200


@application.route('/api/update_chat_photo', methods=["POST"])
@cross_origin()
def update_chat_photo():
    request_data = json.loads(request.data)
    chat_id = request_data["chatId"]
    db.document(f'rooms/{chat_id}').update({
        "imageUrl": request_data["imageUrl"]
    })

    return {"Success": "Updated"}, 200


@application.route('/api/update_messages_photo', methods=["POST"])
@cross_origin()
def update_messages_photo():
    request_data = json.loads(request.data)
    messages = db.collection("messages").where("sender", "==", request_data["email"]).get()

    for msg in messages:
        db.document(f'messages/{msg.id}').update({
            "imageUrl": request_data["imageUrl"]
        })

    return {"Success": "Updated"}, 200


if __name__ == "__main__":
    application.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
