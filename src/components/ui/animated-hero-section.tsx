import { useEffect, useMemo, useRef } from "react";

const COLOR = "#FFFFFF";
const HIT_COLOR = "#5E5E5E";
const BALL_COLOR = "#FFFFFF";
const PADDLE_COLOR = "#FFFFFF";
const LETTER_SPACING = 1;
const WORD_SPACING = 3;

const PIXEL_MAP = {
	P: [
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
	],
	R: [
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 1, 0],
		[1, 0, 0, 1],
	],
	O: [
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
	],
	M: [
		[1, 0, 0, 0, 1],
		[1, 1, 0, 1, 1],
		[1, 0, 1, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 0, 0, 1],
	],
	T: [
		[1, 1, 1, 1, 1],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
	],
	I: [
		[1, 1, 1],
		[0, 1, 0],
		[0, 1, 0],
		[0, 1, 0],
		[1, 1, 1],
	],
	N: [
		[1, 0, 0, 0, 1],
		[1, 1, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 0, 0, 1, 1],
		[1, 0, 0, 0, 1],
	],
	G: [
		[1, 1, 1, 1, 1],
		[1, 0, 0, 0, 0],
		[1, 0, 1, 1, 1],
		[1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1],
	],
	S: [
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
		[0, 0, 0, 1],
		[1, 1, 1, 1],
	],
	A: [
		[0, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
	],
	L: [
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
	],
	Y: [
		[1, 0, 0, 0, 1],
		[0, 1, 0, 1, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
		[0, 0, 1, 0, 0],
	],
	U: [
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 1],
	],
	D: [
		[1, 1, 1, 0],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 0, 0, 1],
		[1, 1, 1, 0],
	],
	E: [
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
	],
	F: [
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
	],
	C: [
		[1, 1, 1, 1],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 0, 0, 0],
		[1, 1, 1, 1],
	],
	K: [
		[1, 0, 0, 1],
		[1, 0, 1, 0],
		[1, 1, 0, 0],
		[1, 0, 1, 0],
		[1, 0, 0, 1],
	],
	V: [
		[1, 0, 0, 0, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 0, 0, 1],
		[0, 1, 0, 1, 0],
		[0, 0, 1, 0, 0],
	],
};

interface Pixel {
	x: number;
	y: number;
	size: number;
	hit: boolean;
}

interface Ball {
	x: number;
	y: number;
	dx: number;
	dy: number;
	radius: number;
}

interface Paddle {
	x: number;
	y: number;
	width: number;
	height: number;
	targetY: number;
	isVertical: boolean;
}

interface AnimatedHeroSectionProps {
	line1?: string;
	line2?: string;
	className?: string;
}

const normalize = (line: string) =>
	line
		.toUpperCase()
		.split("")
		.filter((char) => char === " " || char in PIXEL_MAP)
		.join("")
		.replace(/\s+/g, " ")
		.trim();

export function AnimatedHeroSection({
	line1 = "PROMPTING",
	line2 = "IS ALL YOU NEED",
	className,
}: AnimatedHeroSectionProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pixelsRef = useRef<Pixel[]>([]);
	const ballRef = useRef<Ball>({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 });
	const paddlesRef = useRef<Paddle[]>([]);
	const scaleRef = useRef(1);
	const rafRef = useRef<number | null>(null);

	const words = useMemo(() => [normalize(line1), normalize(line2)], [line1, line2]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.imageSmoothingEnabled = false;

		const calculateWordWidth = (word: string, pixelSize: number) =>
			word.split("").reduce((width, letter) => {
				if (letter === " ") return width + WORD_SPACING * pixelSize;
				const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0;
				return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize;
			}, 0) - LETTER_SPACING * pixelSize;

		const initializeGame = () => {
			const scale = scaleRef.current;
			const largePixelSize = 12.2 * scale;
			const smallPixelSize = 6.8 * scale;
			const ballSpeed = 5.2 * scale;

			pixelsRef.current = [];

			const totalWidthLarge = calculateWordWidth(words[0], largePixelSize);
			const totalWidthSmall = calculateWordWidth(words[1], smallPixelSize);
			const totalWidth = Math.max(totalWidthLarge, totalWidthSmall);
			const scaleFactor = Math.min((canvas.width * 0.92) / Math.max(totalWidth, 1), 1.95);

			const adjustedLargePixelSize = largePixelSize * scaleFactor;
			const adjustedSmallPixelSize = smallPixelSize * scaleFactor;

			const largeTextHeight = 5 * adjustedLargePixelSize;
			const smallTextHeight = 5 * adjustedSmallPixelSize;
			const spaceBetweenLines = 4.4 * adjustedLargePixelSize;
			const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight;

			let startY = (canvas.height - totalTextHeight) / 2;

			words.forEach((word, wordIndex) => {
				const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize;
				const totalWidthLine = calculateWordWidth(word, pixelSize);
				let startX = (canvas.width - totalWidthLine) / 2;

				word.split("").forEach((letter) => {
					if (letter === " ") {
						startX += WORD_SPACING * pixelSize;
						return;
					}

					const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP];
					if (!pixelMap) return;

					for (let i = 0; i < pixelMap.length; i += 1) {
						for (let j = 0; j < pixelMap[i].length; j += 1) {
							if (!pixelMap[i][j]) continue;
							pixelsRef.current.push({
								x: startX + j * pixelSize,
								y: startY + i * pixelSize,
								size: pixelSize,
								hit: false,
							});
						}
					}

					startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize;
				});

				startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0;
			});

			ballRef.current = {
				x: canvas.width * 0.9,
				y: canvas.height * 0.1,
				dx: -ballSpeed,
				dy: ballSpeed,
				radius: adjustedLargePixelSize * 0.45,
			};

			const paddleWidth = adjustedLargePixelSize * 1.28;
			const paddleLength = 11.2 * adjustedLargePixelSize;

			paddlesRef.current = [
				{
					x: 0,
					y: canvas.height / 2 - paddleLength / 2,
					width: paddleWidth,
					height: paddleLength,
					targetY: canvas.height / 2 - paddleLength / 2,
					isVertical: true,
				},
				{
					x: canvas.width - paddleWidth,
					y: canvas.height / 2 - paddleLength / 2,
					width: paddleWidth,
					height: paddleLength,
					targetY: canvas.height / 2 - paddleLength / 2,
					isVertical: true,
				},
				{
					x: canvas.width / 2 - paddleLength / 2,
					y: 0,
					width: paddleLength,
					height: paddleWidth,
					targetY: canvas.width / 2 - paddleLength / 2,
					isVertical: false,
				},
				{
					x: canvas.width / 2 - paddleLength / 2,
					y: canvas.height - paddleWidth,
					width: paddleLength,
					height: paddleWidth,
					targetY: canvas.width / 2 - paddleLength / 2,
					isVertical: false,
				},
			];
		};

		const resizeCanvas = () => {
			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;
			scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000);
			initializeGame();
		};

		const updateGame = () => {
			const ball = ballRef.current;
			const paddles = paddlesRef.current;

			ball.x += ball.dx;
			ball.y += ball.dy;

			if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
				ball.dy = -ball.dy;
			}
			if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
				ball.dx = -ball.dx;
			}

			paddles.forEach((paddle) => {
				if (paddle.isVertical) {
					if (
						ball.x - ball.radius < paddle.x + paddle.width &&
						ball.x + ball.radius > paddle.x &&
						ball.y > paddle.y &&
						ball.y < paddle.y + paddle.height
					) {
						ball.dx = -ball.dx;
					}
				} else {
					if (
						ball.y - ball.radius < paddle.y + paddle.height &&
						ball.y + ball.radius > paddle.y &&
						ball.x > paddle.x &&
						ball.x < paddle.x + paddle.width
					) {
						ball.dy = -ball.dy;
					}
				}
			});

			paddles.forEach((paddle) => {
				if (paddle.isVertical) {
					paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, ball.y - paddle.height / 2));
					paddle.y += (paddle.targetY - paddle.y) * 0.1;
				} else {
					paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, ball.x - paddle.width / 2));
					paddle.x += (paddle.targetY - paddle.x) * 0.1;
				}
			});

			pixelsRef.current.forEach((pixel) => {
				if (
					pixel.hit ||
					ball.x + ball.radius <= pixel.x ||
					ball.x - ball.radius >= pixel.x + pixel.size ||
					ball.y + ball.radius <= pixel.y ||
					ball.y - ball.radius >= pixel.y + pixel.size
				) {
					return;
				}

				pixel.hit = true;
				const centerX = pixel.x + pixel.size / 2;
				const centerY = pixel.y + pixel.size / 2;
				if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
					ball.dx = -ball.dx;
				} else {
					ball.dy = -ball.dy;
				}
			});
		};

		const drawGame = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			pixelsRef.current.forEach((pixel) => {
				ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR;
				ctx.fillRect(pixel.x, pixel.y, Math.max(pixel.size - 0.6, 1), Math.max(pixel.size - 0.6, 1));
			});

			ctx.fillStyle = BALL_COLOR;
			ctx.beginPath();
			ctx.arc(ballRef.current.x, ballRef.current.y, ballRef.current.radius, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = PADDLE_COLOR;
			paddlesRef.current.forEach((paddle) => {
				ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
			});
		};

		const gameLoop = () => {
			updateGame();
			drawGame();
			rafRef.current = requestAnimationFrame(gameLoop);
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		rafRef.current = requestAnimationFrame(gameLoop);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
		};
	}, [words]);

	return (
		<canvas
			ref={canvasRef}
			className={className ?? "absolute inset-0 h-full w-full"}
			aria-label="Animated hero canvas with bouncing ball and pixel text"
		/>
	);
}

export function PromptingIsAllYouNeed() {
	return <AnimatedHeroSection line1="PROMPTING" line2="IS ALL YOU NEED" />;
}

export default PromptingIsAllYouNeed;
