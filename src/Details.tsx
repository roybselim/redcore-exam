import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';

interface IDetailsProps {
	route: {
		params: {
			title: string;
		}
	}
}

const Details = (props: IDetailsProps) => {
	const {params: {title}} = props.route;
	const [content, setContent] = useState<string>('');
	const [error, setError] = useState<string>('');

	useEffect(() => {
		const readBookContent = async () => {
			try{
				const bookContent = await FileSystem.readFile(`${Dirs.DocumentDir}/${title}`);
				setContent(bookContent);
			} catch(e) {
				setError('Error reading book content');
			}
		}

		readBookContent();
	}, [])

  return (
    <ScrollView style={styles.detailsContainer}>
      <Text>
				{content}
			</Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  detailsContainer: {
    margin: 15,
  }
});

export default Details;