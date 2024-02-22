import { useEffect, useState } from 'react';
import Disc from './Disc';
import '../css/Game.css';

const TIER_COUNT = 5;

export default function Game({ imageURL, onNextClick }: {
	imageURL: string,
	onNextClick: () => void
}) {
	const [width, setWidth] = useState(0);
	const [nextStatus, setNextStatus] = useState<'' | 'show' | 'hide'>('');
	const [rotations, setRotations] = useState(Array(TIER_COUNT).fill(0));
	const [discStatus, setDiscStatus] = useState<'' | 'enabled' | 'complete'>('');

	useEffect(() => {
		window.addEventListener('resize', resize);
		setDiscStatus('');
		setRotations(Array(TIER_COUNT).fill(0));
		resize();
		shuffle();
		return () => window.removeEventListener('resize', resize);
	}, [imageURL]);

	const shuffle = () => {
		setTimeout(() => {
			const newRotations = Array(TIER_COUNT).fill(0).map(() => Math.floor(Math.random() * 32 - 16));
			setRotations(newRotations);
			setDiscStatus('enabled');
		}, 1000);
	};

	const endLevel = () => {
		setDiscStatus('complete');
		setNextStatus('show');
	};

	const resize = () => {
		const viewportWidth = document.documentElement.clientWidth;
		setWidth(Math.min(viewportWidth * 0.9, 600));
	};

	const handleDiscRotate = (tier: number, inc: number) => {
		const newRotations = [...rotations];
		newRotations[tier] += inc;
		setRotations(newRotations);
		if (discStatus === 'enabled' && !newRotations.some(rotation => rotation % 8 !== 0)) {
			endLevel();
		}
	};

	const handleNextClick = () => {
		setNextStatus('hide');
		setTimeout(() => {
			setNextStatus('');
		}, 200);
		onNextClick();
	}

	return (
		<div
			className="Game"
			style={{
				width: `${width}px`,
				backgroundImage: `url('${imageURL}')`,
				backgroundSize: `auto ${width}px`
			}}
		>
			<div
				id="next"
				className={nextStatus}
				onClick={handleNextClick}
			></div>
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