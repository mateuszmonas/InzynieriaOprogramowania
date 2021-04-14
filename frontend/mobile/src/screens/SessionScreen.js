import React, {useEffect, useState} from "react";
import {StyleSheet, View, FlatList, Text, TextInput, TouchableOpacity} from "react-native";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {SafeAreaView} from "react-native-safe-area-context";
import {BASE_URL} from "../networking/config";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 8,
        paddingBottom: 4,
        backgroundColor: '#ffdab3',
    },
    messageInput: {
        backgroundColor: 'lightgray',
        flex: 7,
        marginRight: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    messageInputContainer: {
        flexDirection: 'row',
    },
    sendButton: {
        flex: 2,
        backgroundColor: 'orange',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 10,
        height: 40,
    },
    sendText: {
        fontSize: 16
    }
});


const SessionScreen = ({ route }) => {
    const sessionNumber = route.params.sessionId;

    const [isConnected, setConnected] = useState(false)
    const [newMessage, setNewMessage] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [stomp, setStomp] = useState(undefined);

    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        if (!newMessage) {
            return;
        }
        setMessages([newMessage, ...messages]);
        setNewMessage(undefined);
        console.log('new messages');
    }, [newMessage])

    const onMessageReceived = (payload) => {
        console.log('received message')
        console.log(payload)
        const message = JSON.parse(payload.body);
        console.log(message);
        if (message.sender === route.params.username) {
            return;
        }
        setNewMessage({
           type: 'incoming',
           content: message.content,
           sender: message.sender,
        });
    };

    const onError = (error) => {
        console.log('error')
        console.log(error)
        console.error(error)
    }

    useEffect(() => {
        if(!sessionNumber) return;
        if(isConnected) return;
        console.log('creating stomp')
        const socket = new SockJS(`${BASE_URL}/session-handling`)
        const stompClient = Stomp.over(socket)
        stompClient.connect(
            {},
            () => {
                setConnected(true)
                console.log('connected')
                console.log(stompClient)
                stompClient?.subscribe(`/topic/session/${sessionNumber}`, onMessageReceived)
                stompClient?.send(`/app/session/${sessionNumber}/new-user`,
                    {},
                    JSON.stringify({sender: 'studenciak', type: 'CONNECT'})
                )
                setStomp(stompClient)
            },
            onError
        )
    }, [sessionNumber, setConnected, isConnected])


    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={{flex: 1, paddingHorizontal: 8, paddingBottom: 8 }}
                data={messages}
                inverted
                renderItem={({item}) => (
                    <View style={{
                        flexDirection: (item.type === 'incoming') ? 'row' : 'row-reverse',
                    }}>
                        <View style={{
                            flex: 7,
                            flexDirection: 'row',
                            justifyContent: (item.type === 'incoming') ? 'flex-start' : 'flex-end',
                        }}>
                            <View style={{
                                marginVertical: 4,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                borderRadius: 12,
                                backgroundColor: 'white',
                                borderBottomLeftRadius: (item.type === 'incoming') ? 0 : 12,
                                borderBottomRightRadius: (item.type === 'incoming') ? 12 : 0,
                            }}>
                                { (item.type === 'incoming') && (
                                    <Text style={{fontWeight: 'bold'}}>{item.sender}</Text>
                                )}
                                <Text>{item.content}</Text>
                            </View>
                        </View>
                        <View style={{flex: 3}} />
                    </View>
                )}
            />
            <View style={styles.messageInputContainer}>
                <TextInput
                    style={styles.messageInput}
                    defaultValue={messageText}
                    onChangeText={(text) => setMessageText(text)}
                    placeholder="Wpisz swój komentarz tutaj..."
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => {
                        setNewMessage({
                            type: 'outgoing',
                            content: messageText,
                            sender: ':)',
                        })
                        setMessageText('');
                        stomp?.send(`/app/session/${sessionNumber}/send`,
                            {},
                            JSON.stringify({sender: route.params.username, type: 'COMMENT', content: messageText})
                        )
                    }}
                >
                    <Text style={styles.sendText}>Wyślij</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default SessionScreen;
