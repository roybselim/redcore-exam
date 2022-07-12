import React, {type PropsWithChildren, useEffect, useState, useRef} from 'react';
import { Dirs, FileSystem } from 'react-native-file-access';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker, { DocumentPickerOptions } from 'react-native-document-picker';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  AppState,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const Home = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [dirPresent, setDirectoryPresent] = useState<boolean>(false);
  const [books, setBooks] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [triggerRefresh, setTriggerRefresh] = useState(Date.now());

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const navigation = useNavigation<any>();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const listBooks =  async (): Promise<void> => {
    const books = await FileSystem.ls(Dirs.DocumentDir + '/Books' );
    setBooks(books);
    console.log(books)
  }

  useEffect(() => {
    const ifNoBooksDirCreateOne = async () => {
      try {
        await listBooks();
      } catch (e) {
        // Create a directory called 'books'
        try{
          await FileSystem.mkdir(Dirs.DocumentDir + '/Books');
          setDirectoryPresent(true);
        } catch (e) {
          setError('Error creating directoty')
        }
      }
    }

    ifNoBooksDirCreateOne();
  }, [])

  useEffect(() => {
    // if((dirPresent && appStateVisible) || ) {
      const listFilesInBooksDir = async () => {
        try{
          await listBooks();
        } catch(e){
          setError('Error checking for books');
        }
      }
    
      listFilesInBooksDir()
    // }
  }, [dirPresent, appStateVisible, triggerRefresh])

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={[backgroundStyle, styles.homeContainer]}>
          {books.map((book, index) => 
            <TouchableOpacity  key={index} onPress={() => {
                navigation.navigate('Content', {title: book})
            }}>
                <View><Text style={styles.bookTitle}>{book.split('.')[0]}</Text></View>
            </TouchableOpacity>
            )
          }
        <View>{!books.length ? <Text>Please download a book by dropping a file to the redcore's book folder.</Text>: <></>}</View>
        <TouchableOpacity
            style={{paddingTop: 50}}
            onPress={() => {
                DocumentPicker.pickSingle({
                    type: DocumentPicker.types.plainText,
                }).then((result) => {
                    FileSystem.cp(result.uri, Dirs.DocumentDir + '/Books/' + result.name)
                        .then(() => {
                            console.log('copied');
                            setTriggerRefresh(Date.now());
                        })
                        .catch((error) => {
                            setError('Error copying file.');
                            console.log(error)
                        })
                }).catch((error) => {
                    setError('Error picking a document')
                })
            }}
        ><Text>Or pick the book from any folder of your phone</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    margin: 15,
  },
  bookTitle: {
    fontSize: 18,
  }
});

export default Home;
