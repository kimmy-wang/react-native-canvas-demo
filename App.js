import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Button,
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
  const [canvasG, setCanvasG] = useState(null);
  const [fileType, setFileType] = useState('');
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
        const {uri, type, width, height} = response;
        setFileType(type);
        setImageUrl(uri);
        setCanvasDimensions({width, height});
      }
    });
  };

  const saveImage = async () => {
    if (canvasG) {
      const dataURL = await canvasG.toDataURL(fileType);
      console.log(dataURL);
    }
  };

  const handleCanvas = canvas => {
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      setCanvasG(canvas);
      const fillText = 'ReactNativeCanvasDemo!';
      const ctx = canvas.getContext('2d');
      loadImage(canvas, imageUrl)
        .then(async image => {
          ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
          ctx.font = '20px';
          ctx.fillStyle = 'rgba(255, 255, 255, 1)';

          ctx.save();
          const title = 'ReactNativeCanvasDemo';
          ctx.fillText(title, canvasWidth - 120, canvasHeight - 20);
          ctx.restore();

          const calHeight = Math.sqrt(
            Math.pow(canvasWidth, 2) + Math.pow(canvasHeight, 2),
          );
          const measure = await ctx.measureText(fillText);
          let nums = Math.ceil(calHeight / measure.width);
          let content = '';
          while (nums > 0) {
            if (content !== '') {
              content += '  ';
            }
            content += fillText;
            nums--;
          }

          const lines = Math.floor(calHeight / 50);
          for (let i = 0; i < lines; i++) {
            ctx.save();
            ctx.translate(canvasWidth / 2, -canvasHeight / 2);
            ctx.rotate((45 * Math.PI) / 180); //选择画布
            ctx.fillText(content, 0, 50 + 50 * i);
            ctx.restore();
          }
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
            <Button title="Save" onPress={saveImage} />
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
