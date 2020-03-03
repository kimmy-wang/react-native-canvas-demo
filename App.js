import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Canvas from 'react-native-canvas';

import loadImage from './src/utils/image';

//图片选择器参数设置
const options = {
  title: '请选择图片来源',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '相册图片',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};
const App = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [canvasDimensions, setCanvasDimensions] = useState({});

  const {
    width: canvasWidth = 200,
    height: canvasHeight = 200,
  } = canvasDimensions;
  const canvasScale = canvasHeight / canvasWidth;
  const deviceWidth = Dimensions.get('window').width - 20;
  const deviceHeight = Dimensions.get('window').height;
  const windowScale = Math.floor(deviceHeight / deviceWidth);

  let scrollViewWidth, scrollViewHeight;
  if (canvasScale < windowScale) {
    scrollViewWidth = deviceWidth;
    scrollViewHeight = (deviceWidth * canvasHeight) / canvasWidth;
  } else {
    scrollViewHeight = deviceHeight;
    scrollViewWidth = (deviceHeight * canvasWidth) / canvasHeight;
  }

  const choosePic = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled.');
      } else if (response.error) {
        console.error('ImagePicker Error：' + response.error);
      } else {
        // let source = {uri: response.uri};
        // let source = {uri: 'data:image/jpeg;base64,' + response.data};
        const {uri, width, height} = response;
        setImageUrl(uri);
        setCanvasDimensions({width, height});
      }
    });
  };

  const handleCanvas = async canvas => {
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      loadImage(canvas, imageUrl)
        .then(image => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        })
        .catch(console.error);
    }
  };

  const headerContent = !imageUrl ? (
    <TouchableWithoutFeedback onPress={choosePic}>
      <View style={styles.defaultImageWrapper}>
        <Image
          resizeMode="contain"
          source={require('./src/assets/images/add.png')}
          style={styles.defaultImage}
        />
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback onPress={choosePic}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{height: scrollViewHeight}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            width: scrollViewWidth,
            ...styles.canvasWrapper,
          }}>
          <Canvas
            style={{
              ...styles.canvas,
            }}
            ref={handleCanvas}
          />
        </ScrollView>
      </ScrollView>
    </TouchableWithoutFeedback>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View>{headerContent}</View>
            <Text style={styles.sectionTitle}>React Native Canvas Demo</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#F3F3F3',
  },
  body: {
    backgroundColor: 'white',
    paddingTop: 24,
  },
  defaultImageWrapper: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
  },
  defaultImage: {
    width: 80,
    height: 80,
  },
  canvasWrapper: {
    alignSelf: 'center',
  },
  canvas: {
    alignSelf: 'center',
  },
  sectionTitle: {
    paddingTop: 24,
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
  },
});

export default App;
