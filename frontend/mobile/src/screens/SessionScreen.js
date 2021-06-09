import React, {useEffect, useState, useMemo} from "react";
import {StyleSheet, View, FlatList, Text, TextInput, TouchableOpacity} from "react-native";
import SockJS from "sockjs-client";
import {Stomp} from "@stomp/stompjs";
import {SafeAreaView} from "react-native-safe-area-context";
import {BASE_URL} from "../networking/config";

const reactions = ['👍', '👏', '📣', '⚡', '🚀', '🔥', '🛠️']

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    questionInput: {
        backgroundColor: 'lightgray',
        paddingHorizontal: 8,
        borderRadius: 4,
        height: 48,
        fontSize: 18,
    },
    nextQuestionButton: {
        alignSelf: 'flex-end',
        height: 40,
        marginTop: 8,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "orange",
        borderRadius: 10,
        paddingHorizontal: 16,
    },
});


const SessionScreen = ({ route }) => {
    const sessionNumber = route.params.sessionId;

    const [isConnected, setConnected] = useState(false)
    const [newMessage, setNewMessage] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [stomp, setStomp] = useState(undefined);

    const [messageText, setMessageText] = useState('');

    const [questions, setQuestions] = useState([]);
    const [activeQuestion, setActiveQuestion] = useState(undefined);

    const [answer, setAnswer] = useState(undefined);

    useEffect(() => {
        if (!newMessage) {
            return;
        }
        setMessages([newMessage, ...messages]);
        setNewMessage(undefined);
        console.log('new messages');
    }, [newMessage])

    useEffect(() => () => stomp?.deactivate(), [stomp]);

    const onMessageReceived = (payload) => {
        console.log('received message')
        // console.log(payload)
        const message = JSON.parse(payload.body);
        console.log(message);
        if (message.sender === route.params.username) {
            return;
        }
        if(message.type === 'COMMENT') {
            setNewMessage({
               type: 'incoming',
               content: message.content.replace(/['"]+/g, ''),
               sender: message.sender,
            });
        }
    };

    const onQuizReceived = (payload) => {
        console.log('received quiz')
        const message = JSON.parse(payload.body);
        const rawQuiz = JSON.parse(message.content);
        console.log(rawQuiz)
        const questions = rawQuiz.questions.map((rawQuestion) => ({
            question: rawQuestion.content,
            id: rawQuestion.id,
            answers: rawQuestion.open ? [] : rawQuestion.answers.map((a) => a.text)
        }))
        console.log(questions);
        setQuestions((oldQuestions) => [...oldQuestions, ...questions])
        setActiveQuestion((currentQuestion) => currentQuestion ?? questions[0])
    };

    const onError = (error) => {
        console.log('ERROR')
        console.log(error)
        console.error(error)
    }

    useEffect(() => {
        if(!sessionNumber) return;
        if(isConnected) return;
        console.log('creating stomp')
        const stompClient = Stomp.over(() => new SockJS(`${BASE_URL}/session-handling`))
        stompClient.connect(
            {},
            () => {
                setConnected(true)
                console.log('conneced')
                console.log(stompClient)
                stompClient?.subscribe(`/topic/session/${sessionNumber}`, onMessageReceived)
                stompClient?.subscribe(`/topic/session/${sessionNumber}/quiz`, onQuizReceived)
                stompClient?.send(`/app/socket/session/${sessionNumber}/new-user`,
                    {},
                    JSON.stringify({sender: route.params.guestId, type: 'CONNECT'})
                )
                setStomp(stompClient)
            },
            onError
        )
    }, [sessionNumber, setConnected, isConnected])


    const questionsView = useMemo(() => {
        console.log(activeQuestion)
        console.log(questions)
        console.log(questions.indexOf(activeQuestion))
        console.log(answer)
        const isABCDQuestion = activeQuestion
            && activeQuestion.answers
            && activeQuestion.answers.length > 1;
        return (activeQuestion && (
            <View style={{flex: 1, paddingHorizontal: 8}}>
                <Text style={{fontSize: 24, textAlign: 'center', marginTop: 48}}>{'Quiz'}</Text>
                <Text style={{fontSize: 24}}>{activeQuestion?.question}</Text>
                <Text style={{marginTop: 24}}>{'Twoja odpowiedź'}</Text>
                {isABCDQuestion ? (
                    <>
                        {activeQuestion.answers.map((answerText, i) => (
                            <TouchableOpacity
                                key={i.toString()}
                                style={{flexDirection: 'row', paddingVertical: 6}}
                                onPress={() =>{
                                    setAnswer(answerText);
                                }}
                            >
                                <View style={{
                                    height: 20,
                                    width: 20,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {answer === answerText && (
                                        <View
                                            style={{height: 14, width: 14, borderRadius: 7, backgroundColor: 'black'}}/>
                                    )}
                                </View>
                                <Text style={{marginHorizontal: 12, fontSize: 16}}>{answerText}</Text>
                            </TouchableOpacity>
                        ))}
                    </>
                ) : (
                    <View>
                        <TextInput
                            style={styles.questionInput}
                            defaultValue={answer}
                            onChangeText={(text) => {
                                setAnswer(text)
                            }}
                        />
                    </View>
                )}
                <TouchableOpacity style={styles.nextQuestionButton} onPress={() => {
                    const indexOfActiveQuestion = questions.indexOf(activeQuestion)
                    const content = {}
                    content[activeQuestion.id] = [answer];
                    const answerMessage = JSON.stringify({sender: route.params.username, type: 'QUIZ_ANSWERS', content: JSON.stringify(content) })
                    console.log('Sending answer')
                    console.log(content)
                    console.log(answerMessage)
                    stomp?.send(`/app/socket/session/${sessionNumber}/quiz-answers`,
                        {},
                        answerMessage
                    )
                    setAnswer(undefined);
                    if (indexOfActiveQuestion < questions.length - 1) {
                        setActiveQuestion(questions[indexOfActiveQuestion + 1])
                    } else {
                        setActiveQuestion(undefined)
                    }
                }}>
                    <Text style={{fontSize: 16}}>
                        {(questions.indexOf(activeQuestion) === questions.length - 1) ? 'Zapisz' : 'Następne pytanie'}
                    </Text>
                </TouchableOpacity>
            </View>
        ))
    }, [activeQuestion, questions, answer]);

    const chatView = useMemo(() => (
        <>
            <FlatList
                style={{flex: 1, paddingHorizontal: 8 }}
                contentContainerStyle={{ paddingTop: 16 }}
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
                                <Text style={{ fontSize: reactions.includes(item.content) ? 24 : 16 }}>{item.content}</Text>
                            </View>
                        </View>
                        <View style={{flex: 3}} />
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={{ borderTopLeftRadius: 14, borderTopRightRadius: 14, backgroundColor: 'white', paddingBottom: 4, paddingHorizontal: 8 }}>
                <View style={{ flexDirection: 'row', height: 42, alignItems: 'center', marginVertical: 8 }}>
                    {reactions.map((reaction, i) => (
                        <TouchableOpacity style={{ flex: 1, flexDirection: 'row',  }}
                                          key={i.toString()}
                            onPress={() => {
                                setNewMessage({
                                    type: 'outgoing',
                                    content: reaction,
                                    sender: ':)',
                                })
                                stomp?.send(`/app/socket/session/${sessionNumber}/send`,
                                    {},
                                    JSON.stringify({sender: route.params.username, type: 'COMMENT', content: `"${reaction}"`})
                                )
                            }}
                        >
                            <Text style={{ fontSize: 28, flex: 1, textAlign: 'center' }}>{ reaction }</Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
                            stomp?.send(`/app/socket/session/${sessionNumber}/send`,
                                {},
                                JSON.stringify({sender: route.params.username, type: 'COMMENT', content: `"${messageText}"`})
                            )
                        }}
                    >
                        <Text style={styles.sendText}>Wyślij</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    ), [messages, messageText, sessionNumber])

    return (
        <SafeAreaView style={styles.container}>
            { activeQuestion ? questionsView : chatView }
        </SafeAreaView>
    )
}

export default SessionScreen;
