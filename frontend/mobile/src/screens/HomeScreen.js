import React from 'react';
import {
    StyleSheet,
} from 'react-native';
import {Text, View, TextInput, Button, TouchableOpacity} from "react-native";
import {StatusBar} from "expo-status-bar";
import { SafeAreaView } from 'react-native-safe-area-context';


function HomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Dołącz{"\n"}do sesji</Text>
            <Text style={styles.inputLabel}>Identyfikator sesji</Text>
            <View style={styles.sessionIdInputContainer}>
                <TextInput
                    style={styles.sessionIdInput}
                    onChangeText={() => {}}
                    placeholder="#123456"
                />
                <TouchableOpacity style={styles.joinByIdButton}>
                    <Text style={styles.joinByIdText}>Dołącz</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Zeskanuj QR kod sesji</Text>
            <TouchableOpacity style={styles.joinByQrCodeButton}>
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
    }
});

export default HomeScreen;
