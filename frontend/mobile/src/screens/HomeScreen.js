import React, { useState } from 'react';
import {
    StyleSheet,
} from 'react-native';
import {Text, View, TextInput, TouchableOpacity} from "react-native";
import {StatusBar} from "expo-status-bar";
import { SafeAreaView } from 'react-native-safe-area-context';
import {BASE_URL} from "../networking/config";


function HomeScreen({ navigation }) {
    const [username, setUsername] = useState('studenciak');
    const [isUsernameHighlighted, setUserNameHighlighted] = useState(false);

    const [sessionId, setSessionId] = useState('ef6eb273-5a71-4b03-bd2b-940c4e65d1f9')
    const [isSessionIdHighlighted, setSessionIdHighlighted] = useState(false);

    const [isJoinSessionButtonEnabled, setJoinSessionButtonEnabled] = useState(true);

    const connect = () => {
        if (!username) {
            setUserNameHighlighted(true);
            return;
        }
        if (!sessionId) {
            setSessionIdHighlighted(true);
            return;
        }
        setJoinSessionButtonEnabled(false);
        fetch(`${BASE_URL}/session/connect`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                username: username,
                passcode: sessionId
            })
        })
            .then((response) => {console.log(response); return response.json();})
            .then((json) => {
                console.log(json)
                json.sessionId && navigation.navigate(
                    'Session',
                    { sessionId: json.sessionId.trim(), username, guestId: json.guestId }
                )
            })
            .catch((error) => console.error(error))
            .finally(() => setJoinSessionButtonEnabled(true))
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Dołącz{"\n"}do sesji</Text>
            <Text style={styles.inputLabel}>Nazwa użytkownika</Text>
            <TextInput
                style={[
                    styles.userNameInput,
                    isUsernameHighlighted && styles.highlighted
                ]}
                defaultValue={username}
                onChangeText={(text) => {
                    if (text) {
                        setUserNameHighlighted(false);
                    }
                    setUsername(text);
                }}
            />
            <Text style={styles.inputLabel}>Identyfikator sesji</Text>
            <View style={styles.sessionIdInputContainer}>
                <TextInput
                    style={[
                        styles.sessionIdInput,
                        isSessionIdHighlighted && styles.highlighted
                    ]}
                    defaultValue={sessionId}
                    onChangeText={(text) => {
                        if (text) {
                            setSessionIdHighlighted(false);
                        }
                        setSessionId(text);
                    }}
                    placeholder="#123456"
                />
                <TouchableOpacity
                    style={[
                        styles.joinByIdButton,
                        !isJoinSessionButtonEnabled && { backgroundColor: 'lightgray' }
                    ]}
                    onPress={connect}
                    disabled={!isJoinSessionButtonEnabled}
                >
                    <Text style={styles.joinByIdText}>Dołącz</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Zeskanuj QR kod sesji</Text>
            <TouchableOpacity style={styles.joinByQrCodeButton} onPress={() => {} }>
                <Text style={styles.joinByQrCodeText}>Skanuj kod QR</Text>
            </TouchableOpacity>
            <StatusBar style={"auto"} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffdab3',
        paddingHorizontal: 16
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 124,
    },
    userNameInput: {
        backgroundColor: 'lightgray',
        paddingHorizontal: 8,
        borderRadius: 4,
        height: 40,
    },
    sessionIdInput: {
        backgroundColor: 'lightgray',
        flex: 2,
        marginRight: 16,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    sessionIdInputContainer: {
        flexDirection: 'row',
    },
    joinByIdButton: {
        flex: 1,
        backgroundColor: 'orange',
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 10,
        height: 40,
    },
    inputLabel: {
        fontSize: 16,
        marginTop: 24,
        marginBottom: 4,
        marginLeft: 8,
    },
    joinByQrCodeButton: {
        alignSelf: "stretch",
        height: 64,
        marginTop: 8,
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "orange",
        borderRadius: 10,
    },
    joinByQrCodeText: {
        fontSize: 24,
    },
    joinByIdText: {
        fontSize: 16
    },
    highlighted: {
        borderWidth: 1,
        borderColor: 'orangered'
    }
});

export default HomeScreen;
