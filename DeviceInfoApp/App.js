import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import deviceInfoModule from 'react-native-device-info';
import PercentageCircle from 'react-native-percentage-circle';
import AnimatedLottieView from 'lottie-react-native';
const App = () => {
  const [deviceName, setDeviceName] = useState('');
  const [totalDisk, settotalDisk] = useState('');
  const [freeDisk, setfreeDisk] = useState('');
  const [usedDisk, setusedDisk] = useState('');
  const [persent, setPersent] = useState('');
  const [isCharging, setIsCharging] = useState(false);
  const [baterryLevel, setBatteryLevel] = useState(0);
  const [json, setJson] = useState('charging.json');
  let jsonPath = '';
  if (isCharging) {
    jsonPath = 'charging.json';
  } else if (baterryLevel < 20) {
    jsonPath = 'low.json';
  } else if (baterryLevel == 100) {
    jsonPath = 'battery-full.json';
  }
  useEffect(() => {
    deviceInfoModule
      .getTotalDiskCapacity()
      .then(capacity => settotalDisk(capacity));
    deviceInfoModule.getDeviceName().then(name => setDeviceName(name));
    deviceInfoModule.getFreeDiskStorage().then(free => setfreeDisk(free));
    var persent = (freeDisk / totalDisk) * 100;
    setPersent(Math.floor(persent));
    setusedDisk(totalDisk - freeDisk);
    deviceInfoModule.isBatteryCharging().then(charge => setIsCharging(charge));
    deviceInfoModule.getBatteryLevel().then(e => setBatteryLevel(e * 100));
  }, []);

  const version = deviceInfoModule.getSystemVersion();

  return (
    <View style={styles.container}>
      <View style={styles.deviceInfo}>
        <View style={styles.infoName}>
          <Text style={styles.infoName.text}>Device Name: {deviceName}</Text>
          <Text style={styles.infoName.text}>Version: {version}</Text>
        </View>
        <View style={styles.circle}>
          <PercentageCircle
            borderWidth={4}
            radius={40}
            percent={persent}
            color={'red'}></PercentageCircle>
          <View style={styles.diskInfo}>
            <Text style={styles.diskInfo.text}>
              Used: {(freeDisk / 1073741824).toFixed(2)} GB {baterryLevel}
            </Text>
            <Text style={styles.diskInfo.text}>
              Total: {(totalDisk / 1073741824).toFixed(2)} GB
            </Text>
          </View>
        </View>
        <AnimatedLottieView
          source={require(`./Lottiejsons/${jsonPath}`)}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  deviceInfo: {
    backgroundColor: '#282A3A',
    flex: 0.7,
    borderRadius: 15,
    width: '90%',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoName: {
    alignItems: 'center',
    text: {
      fontSize: 18,
      color: 'white',
      fontWeight: '600',
    },
  },
  circle: {
    marginTop: 10,
    alignItems: 'center',
  },
  diskInfo: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    marginTop: 20,
    text: {
      backgroundColor: '#FF7B54',
      padding: 5,
      borderRadius: 10,
      color: 'white',
    },
  },
});
