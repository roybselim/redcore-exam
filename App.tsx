import React, {type PropsWithChildren, useEffect, useState, useRef} from 'react';
import { Dirs, FileSystem } from 'react-native-file-access';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  AppState,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [dirPresent, setDirectoryPresent] = useState<boolean>(false);
  const [books, setBooks] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

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
    const books = await FileSystem.ls(Dirs.DocumentDir + '/books');
    setBooks(books);
  }

  useEffect(() => {
    const ifNoBooksDirCreateOne = async () => {
      try {
        await listBooks();
      } catch (e) {
        // Create a directory called 'books'
        try{
          await FileSystem.mkdir(Dirs.DocumentDir + '/books');
          setDirectoryPresent(true);
        } catch (e) {
          setError('Error creating directoty')
        }
      }
    }

    ifNoBooksDirCreateOne();
  }, [])

  useEffect(() => {
    if(dirPresent && appStateVisible) {
      const listFilesInBooksDir = async () => {
        try{
          await listBooks();
        } catch(e){
          setError('Error checking for books');
        }
      }
    
      listFilesInBooksDir()
    }
  }, [dirPresent, appStateVisible])

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
          {books.map((book, index) => <View key={index}><Text>{book}</Text></View>)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
