import React, {useEffect, useState, useRef} from 'react';
import { Dirs, FileSystem } from 'react-native-file-access';
import { useNavigation } from '@react-navigation/native';
import DocumentPicker from 'react-native-document-picker';

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

const Home = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [books, setBooks] = useState<string[]>([]);
    const [error, setError] = useState<string>('');

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    const navigation = useNavigation<any>();

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const listFilesInBooksDir = async () => {
            try{
                await listBooks();
            } catch(e){
                setError('Error checking for books');
            }
        }
        
        listFilesInBooksDir()
    }, [appStateVisible])


    const listBooks =  async (): Promise<void> => {
        const bookFolders = await FileSystem.ls(Dirs.DocumentDir);
        const newBooks: string[] = [];
        for(let i = 0; i < bookFolders.length; i++) {
            if(bookFolders[i].length === 36){
                const files = await FileSystem.ls(`${Dirs.DocumentDir}/${bookFolders[i]}`);
                newBooks.push(`${bookFolders[i]}/${files[0]}`);
            }
        }
        setBooks(newBooks);
    }

    const onPickHandler = (): void => {
        DocumentPicker.pickSingle({
            type: DocumentPicker.types.plainText,
            copyTo: 'documentDirectory',
        }).then((result) => {
            const destructuredPath = result.fileCopyUri?.split('/');
            const fileName = decodeURIComponent(destructuredPath?.pop() || '');
            const folderName = destructuredPath?.pop();
            setBooks([...books, `${folderName}/${fileName}`]);
        }).catch((error) => {
            setError('Error picking a document')
        })
    }

    return (
        <SafeAreaView style={styles.fullHeight}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.homeContainer}  
                style={styles.fullHeight}  
            >
                {books.map((book, index) => 
                    <TouchableOpacity  
                        key={index} 
                        onPress={() => {
                            navigation.navigate('Content', {title: book});
                        }}
                    >
                        <View style={styles.bookContainer}>
                            <Text style={styles.bookTitle}>
                                {book.split('/')[1].split('.')[0]}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.picker}
                    onPress={onPickHandler}
                >
                    <View style={styles.pickButton}>
                        <Text style={styles.btnTitle}>
                            {`Pick the book from any folder.`}
                        </Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  homeContainer: {
    margin: 15,
    flexGrow: 1,
  },
  bookTitle: {
    fontSize: 18,
  },
  fullHeight: {
    flexGrow: 1,
  },
  bookContainer: {
    backgroundColor: '#CDCDCD',
    padding: 20,
    paddingVertical: 30,
    margin: 10,
    borderRadius: 5,
  },
  picker: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  pickButton: {
    flex: 1,
    backgroundColor: '#7777AB',
    borderRadius: 5,
    padding: 20,
  },
  btnTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 16,
  }
});

export default Home;
