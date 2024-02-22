import { useEffect, useState } from 'react';
import './App.css';
import Game from './components/Game';

export default function App() {
	const [imageURL, setImageURL] = useState('');

	const fetchImage = () => {
		const API = 'https://pixabay.com/api/?key=11863427-94c4daac966e6accaf134b1a6&per_page=200&orientation=horizontal&image_type=photo&min_width=600&min_height=600';
		fetch(API).then(res => res.json()).then(data => {
			setImageURL(data.hits[Math.floor(Math.random() * data.hits.length)].largeImageURL);
		});
	}

	useEffect(() => {
		fetchImage();
	}, []);

	const handleNextClick = () => {
		fetchImage();
	}

	return (
		<div className="App">
			<Game
				imageURL={imageURL}
				onNextClick={handleNextClick}
			/>
		</div>
	);
}