import { useEffect, useState } from 'react';
import Disc from './Disc';
import '../css/Game.css';

const TIER_COUNT = 5;

export default function Game() {
	const [imageURL, setImageURL] = useState('');
	const [width, setWidth] = useState(0);
	const [nextStatus, setNextStatus] = useState<'' | 'show' | 'hide'>('');
	const [rotations, setRotations] = useState(Array(TIER_COUNT).fill(0));
	const [discStatus, setDiscStatus] = useState<'' | 'enabled' | 'complete'>('');

	useEffect(() => {
		window.addEventListener('resize', resize);
		startLevel();
		resize();
		return () => window.removeEventListener('resize', resize);
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const levelComplete = discStatus === 'enabled' && !rotations.some(rotation => rotation % 8 !== 0);
		if (levelComplete) {
			endLevel();
		}
	}, [rotations, discStatus]);

	const startLevel = () => {
		const API = 'https://pixabay.com/api/?key=11863427-94c4daac966e6accaf134b1a6&per_page=200&orientation=horizontal&image_type=photo&min_width=600&min_height=600';
		fetch(API).then(res => res.json()).then(data => {
			setRotations(Array(TIER_COUNT).fill(0));
			setDiscStatus('');
			setImageURL(data.hits[Math.floor(Math.random() * data.hits.length)].largeImageURL);
			setTimeout(() => {
				const randomRotations = rotations.map(() => Math.floor(Math.random() * 32 - 16));
				setRotations(randomRotations);
				setDiscStatus('enabled');
			}, 1000);
		});
	};

	const endLevel = () => {
		setDiscStatus('complete');
		setNextStatus('show');
	}

	const handleDiscRotate = (tier: number, inc: number) => {
		const newRotations = [...rotations];
		newRotations[tier] += inc;
		setRotations(newRotations);
	};

	const handleNextClick = () => {
		startLevel();
		setNextStatus('hide');
		setTimeout(() => {
			setNextStatus('');
		}, 200);
	};

	const resize = () => {
		const viewportWidth = document.documentElement.clientWidth;
		setWidth(Math.min(viewportWidth * 0.9, 600));
	};

	return (
		<div
			className="Game"
			style={{
				width: `${width}px`,
				backgroundImage: `url('${imageURL}')`,
				backgroundSize: `auto ${width}px`
			}}>
			<div id="next" className={nextStatus} onClick={handleNextClick}></div>
			{rotations.map((rotation, idx) => (
				<Disc
					key={idx}
					tier={idx}
					tierCount={TIER_COUNT}
					imageURL={imageURL}
					status={discStatus}
					rotation={rotation}
					onRotate={handleDiscRotate}
				/>
			))}
		</div>
	);
}