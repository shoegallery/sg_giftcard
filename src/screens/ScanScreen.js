
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner-plus';

const ScanScreen = () => {
    const [isScan, setIsScan] = useState(true);

    const onStartPress = () => {
        requestPermissionsAsync().then(() => {});
    };

    const onStopPress = () => {
        setIsScan(true);
    };

    const requestPermissionsAsync = async () => {
        let permis = await BarCodeScanner.getPermissionsAsync();
        if (permis["status"] !== "granted") permis = await BarCodeScanner.requestPermissionsAsync();
        setIsScan(permis["status"] === "granted");
    };

    const onBarCodeScanned = (result) => {
       

        if(result["data"].length===8){
          setIsScan(false);
          console.log(result["data"]);
          console.log(result["data"].length);
          alert("二维码内容: " + result["data"]);
        }
       else{console.log("false")}
       
    };

    useEffect(() => {
        // ComponentDidMount logic here
        return () => {
            // ComponentWillUnmount logic here
        };
    }, []); // Empty dependency array ensures this effect runs once on mount

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={{
                    width: "100%", height: "60%", overflow: "hidden", justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    {
                        <BarCodeScanner
                            onBarCodeScanned={isScan ? onBarCodeScanned : null}
                            style={{ width: "100%", height: "100%", backgroundColor: "#eaeaea" }}
                        />
                    }
                </View>
                <TouchableOpacity onPress={onStartPress}>
                    <Text>点击开始</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onStopPress}>
                    <Text>点击停止</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#eaeaea",
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ScanScreen;
