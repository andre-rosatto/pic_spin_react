import '../css/Disc.css';

interface DiscProps {
	tier: number,
	tierCount: number,
	imageURL: string,
	status: '' | 'enabled' | 'complete',
	rotation: number,
	onRotate: (tier: number, inc: number) => void
}

export default function Disc({ tier, tierCount, imageURL, status, rotation, onRotate }: DiscProps) {
	const offset = 100 / tierCount;
	const viewportWidth = document.documentElement.clientWidth;

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const parent = (e.target as HTMLDivElement).offsetParent as HTMLDivElement;
		const rect = parent.getBoundingClientRect();
		const midPoint = rect.left + rect.width / 2;
		const inc = e.clientX > midPoint ? 1 : -1;
		onRotate(tier, inc);
	}

	return (
		<div
			className={`Disc ${status}`}
			onClick={e => handleClick(e)}
			style={{
				width: `${100 - tier * offset}%`,
				backgroundImage: `url('${imageURL}')`,
				backgroundSize: `auto ${Math.min(viewportWidth * 0.9, 600)}px`,
				left: `${tier * offset / 2}%`,
				top: `${tier * offset / 2}%`,
				transform: `rotate(${rotation * 360 / 8}deg)`
			}}
		>
			<div className="hilite"></div>
		</div>
	);
}