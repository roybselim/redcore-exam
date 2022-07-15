import React, { useRef } from 'react';
import { View, Text } from 'react-native'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import { Dirs, FileSystem } from 'react-native-file-access';
import { useNavigation } from '@react-navigation/native';

const options = [
  'Delete', 
  'Cancel', 
]

interface IThreeDotsMenuProps {
  title: string;
}

const ThreeDotsMenu = (props: IThreeDotsMenuProps) => {
  const {title} = props;
  const actionSheetRef = useRef<any>();
  const navigation = useNavigation<any>();

  const showActionSheet = () => {
    actionSheetRef.current.show()
  }

  const deleteBook = async () => {
    try {
      const destructuredPath = title.split('/');
      await FileSystem.unlink(`${Dirs.DocumentDir}/${destructuredPath.join('/')}`); 
      await FileSystem.unlink(`${Dirs.DocumentDir}/${destructuredPath[0]}`); 
      navigation.navigate("Books");
    } catch (error) {}
  }

  return (
    <View>
      <Text onPress={showActionSheet} style={{fontWeight: '900'}}>...</Text>
      <ActionSheet
          ref={actionSheetRef}
          title={<Text style={{color: '#000', fontSize: 18}}>Book actions</Text>}
          options={options}
          cancelButtonIndex={1}
          onPress={(index) => { 
            if(index === 0){
              deleteBook();
            }
          }}
        />
    </View>
  )
}

export default ThreeDotsMenu;
