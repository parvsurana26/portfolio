import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import "./horizon-hero-section.css";

gsap.registerPlugin(ScrollTrigger);

type HeroSlide = {
	title: string;
	subtitleLine1: string;
	subtitleLine2: string;
};

type HorizonHeroProps = {
	sections: HeroSlide[];
	onCursorEnter?: (text: string) => void;
	onCursorLeave?: () => void;
};

type ThreeRefs = {
	scene: THREE.Scene | null;
	camera: THREE.PerspectiveCamera | null;
	renderer: THREE.WebGLRenderer | null;
	composer: EffectComposer | null;
	stars: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>[];
	nebula: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null;
	mountains: THREE.Mesh<THREE.ShapeGeometry, THREE.MeshBasicMaterial>[];
	animationId: number | null;
	targetCameraX?: number;
	targetCameraY?: number;
	targetCameraZ?: number;
	locations?: number[];
};

export const Component = ({
	sections,
	onCursorEnter,
	onCursorLeave,
}: HorizonHeroProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const titleRef = useRef<HTMLHeadingElement | null>(null);
	const subtitleRef = useRef<HTMLDivElement | null>(null);
	const progressRef = useRef<HTMLDivElement | null>(null);

	const smoothCameraPos = useRef({ x: 0, y: 30, z: 140 });
	const [scrollProgress, setScrollProgress] = useState(0);
	const [currentSection, setCurrentSection] = useState(1);
	const [isReady, setIsReady] = useState(false);

	const threeRefs = useRef<ThreeRefs>({
		scene: null,
		camera: null,
		renderer: null,
		composer: null,
		stars: [],
		nebula: null,
		mountains: [],
		animationId: null,
	});

	const heroScrollPhases = Math.max(sections.length, 3);
	const phaseProgress = scrollProgress * heroScrollPhases;
	const phaseIndex = Math.min(Math.floor(phaseProgress), heroScrollPhases - 1);
	const currentIndex = Math.min(phaseIndex, sections.length - 1);
	const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
	const withinPhase = phaseProgress - phaseIndex;
	const transitionRaw =
		currentIndex === nextIndex ? 0 : gsap.utils.clamp(0, 1, (withinPhase - 0.55) / 0.45);
	const transition = gsap.utils.clamp(0, 1, gsap.parseEase("power2.inOut")(transitionRaw));

	const currentContent = sections[currentIndex] ?? sections[0];
	const nextContent = sections[nextIndex] ?? sections[0];

	const layerStyle = (isNext: boolean): CSSProperties => {
		if (isNext) {
			return {
				opacity: transition,
				transform: `translateY(${(1 - transition) * 64}px)`,
			};
		}
		return {
			opacity: 1 - transition,
			transform: `translateY(${-transition * 64}px)`,
		};
	};

	const splitTitle = (text: string) =>
		text.split("").map((char, i) => (
			<span key={`${char}-${i}`} className="hz-title-char">
				{char === " " ? "\u00A0" : char}
			</span>
		));

	useEffect(() => {
		const initThree = () => {
			const { current: refs } = threeRefs;
			if (!canvasRef.current) return;

			refs.scene = new THREE.Scene();
			refs.scene.fog = new THREE.FogExp2(0x000000, 0.00028);

			refs.camera = new THREE.PerspectiveCamera(
				75,
				window.innerWidth / window.innerHeight,
				0.1,
				2000,
			);
			refs.camera.position.set(0, 20, 140);

			refs.renderer = new THREE.WebGLRenderer({
				canvas: canvasRef.current,
				antialias: true,
				alpha: true,
			});
			refs.renderer.setSize(window.innerWidth, window.innerHeight);
			refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
			refs.renderer.toneMappingExposure = 0.55;

			refs.composer = new EffectComposer(refs.renderer);
			refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
			refs.composer.addPass(
				new UnrealBloomPass(
					new THREE.Vector2(window.innerWidth, window.innerHeight),
					0.78,
					0.4,
					0.88,
				),
			);

			createStarField();
			createNebula();
			createMountains();
			cacheMountainLocations();
			animate();
			setIsReady(true);
		};

		const createStarField = () => {
			const { current: refs } = threeRefs;
			if (!refs.scene) return;
			const starCount = 2400;

			for (let i = 0; i < 3; i++) {
				const geometry = new THREE.BufferGeometry();
				const positions = new Float32Array(starCount * 3);
				const colors = new Float32Array(starCount * 3);
				const sizes = new Float32Array(starCount);

				for (let j = 0; j < starCount; j++) {
					const radius = 220 + Math.random() * 1000;
					const theta = Math.random() * Math.PI * 2;
					const phi = Math.acos(Math.random() * 2 - 1);

					positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
					positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
					positions[j * 3 + 2] = radius * Math.cos(phi);

					const color = new THREE.Color();
					const choice = Math.random();
					if (choice < 0.75) {
						color.setHSL(0, 0, 0.82 + Math.random() * 0.18);
					} else if (choice < 0.92) {
						color.setHSL(0.08, 0.6, 0.8);
					} else {
						color.setHSL(0.58, 0.55, 0.78);
					}

					colors[j * 3] = color.r;
					colors[j * 3 + 1] = color.g;
					colors[j * 3 + 2] = color.b;
					sizes[j] = Math.random() * 2 + 0.5;
				}

				geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
				geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
				geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

				const material = new THREE.ShaderMaterial({
					uniforms: {
						time: { value: 0 },
						depth: { value: i },
					},
					vertexShader: `
						attribute float size;
						attribute vec3 color;
						varying vec3 vColor;
						uniform float time;
						uniform float depth;

						void main() {
							vColor = color;
							vec3 pos = position;
							float angle = time * 0.05 * (1.0 - depth * 0.25);
							mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
							pos.xy = rot * pos.xy;
							vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
							gl_PointSize = size * (260.0 / -mvPosition.z);
							gl_Position = projectionMatrix * mvPosition;
						}
					`,
					fragmentShader: `
						varying vec3 vColor;

						void main() {
							float dist = length(gl_PointCoord - vec2(0.5));
							if (dist > 0.5) discard;
							float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
							gl_FragColor = vec4(vColor, alpha);
						}
					`,
					transparent: true,
					blending: THREE.AdditiveBlending,
					depthWrite: false,
				});

				const stars = new THREE.Points(geometry, material);
				refs.scene.add(stars);
				refs.stars.push(stars);
			}
		};

		const createNebula = () => {
			const { current: refs } = threeRefs;
			if (!refs.scene) return;

			const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
			const material = new THREE.ShaderMaterial({
				uniforms: {
					time: { value: 0 },
					color1: { value: new THREE.Color(0x123fdb) },
					color2: { value: new THREE.Color(0xc9116a) },
					opacity: { value: 0.25 },
				},
				vertexShader: `
					varying vec2 vUv;
					varying float vElevation;
					uniform float time;

					void main() {
						vUv = uv;
						vec3 pos = position;
						float e = sin(pos.x * 0.01 + time) * cos(pos.y * 0.012 + time) * 20.0;
						pos.z += e;
						vElevation = e;
						gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
					}
				`,
				fragmentShader: `
					uniform vec3 color1;
					uniform vec3 color2;
					uniform float opacity;
					uniform float time;
					varying vec2 vUv;
					varying float vElevation;

					void main() {
						float m = sin(vUv.x * 10.0 + time) * cos(vUv.y * 9.0 + time);
						vec3 color = mix(color1, color2, m * 0.5 + 0.5);
						float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
						alpha *= 1.0 + vElevation * 0.01;
						gl_FragColor = vec4(color, alpha);
					}
				`,
				transparent: true,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				depthWrite: false,
			});

			const nebula = new THREE.Mesh(geometry, material);
			nebula.position.z = -1050;
			refs.scene.add(nebula);
			refs.nebula = nebula;
		};

		const createMountains = () => {
			const { current: refs } = threeRefs;
			if (!refs.scene) return;

			const layers = [
				{ distance: -55, height: 58, color: 0x1a1a2e, opacity: 1 },
				{ distance: -100, height: 82, color: 0x16213e, opacity: 0.82 },
				{ distance: -150, height: 102, color: 0x103458, opacity: 0.62 },
				{ distance: -210, height: 122, color: 0x0d4665, opacity: 0.42 },
			];

			layers.forEach((layer, index) => {
				const points: THREE.Vector2[] = [];
				const segments = 48;

				for (let i = 0; i <= segments; i++) {
					const x = (i / segments - 0.5) * 1100;
					const y =
						Math.sin(i * 0.1) * layer.height +
						Math.sin(i * 0.05) * layer.height * 0.45 +
						Math.random() * layer.height * 0.2 -
						100;
					points.push(new THREE.Vector2(x, y));
				}

				points.push(new THREE.Vector2(5000, -300));
				points.push(new THREE.Vector2(-5000, -300));

				const shape = new THREE.Shape(points);
				const geometry = new THREE.ShapeGeometry(shape);
				const material = new THREE.MeshBasicMaterial({
					color: layer.color,
					transparent: true,
					opacity: layer.opacity,
					side: THREE.DoubleSide,
				});

				const mountain = new THREE.Mesh(geometry, material);
				mountain.position.z = layer.distance;
				mountain.position.y = layer.distance;
				mountain.userData = { baseZ: layer.distance, index };
				refs.scene?.add(mountain);
				refs.mountains.push(mountain);
			});
		};

		const cacheMountainLocations = () => {
			const { current: refs } = threeRefs;
			refs.locations = refs.mountains.map((mountain) => mountain.position.z);
		};

		const animate = () => {
			const { current: refs } = threeRefs;
			refs.animationId = requestAnimationFrame(animate);
			const time = Date.now() * 0.001;

			refs.stars.forEach((starField) => {
				starField.material.uniforms.time.value = time;
			});

			if (refs.nebula) {
				refs.nebula.material.uniforms.time.value = time * 0.45;
			}

			if (refs.camera && refs.targetCameraX !== undefined) {
				const smoothing = 0.05;
				smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothing;
				smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * smoothing;
				smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * smoothing;

				refs.camera.position.x = smoothCameraPos.current.x + Math.sin(time * 0.1) * 2;
				refs.camera.position.y = smoothCameraPos.current.y + Math.cos(time * 0.13) * 1.1;
				refs.camera.position.z = smoothCameraPos.current.z;
				refs.camera.lookAt(0, 10, -600);
			}

			refs.mountains.forEach((mountain, i) => {
				const p = 1 + i * 0.45;
				mountain.position.x = Math.sin(time * 0.1) * 2 * p;
				mountain.position.y = 48 + Math.cos(time * 0.14) * p;
			});

			refs.composer?.render();
		};

		initThree();

		const onResize = () => {
			const { current: refs } = threeRefs;
			if (refs.camera && refs.renderer && refs.composer) {
				refs.camera.aspect = window.innerWidth / window.innerHeight;
				refs.camera.updateProjectionMatrix();
				refs.renderer.setSize(window.innerWidth, window.innerHeight);
				refs.composer.setSize(window.innerWidth, window.innerHeight);
			}
		};

		window.addEventListener("resize", onResize);

		return () => {
			const { current: refs } = threeRefs;
			if (refs.animationId) cancelAnimationFrame(refs.animationId);
			window.removeEventListener("resize", onResize);

			refs.stars.forEach((starField) => {
				starField.geometry.dispose();
				starField.material.dispose();
			});

			refs.mountains.forEach((mountain) => {
				mountain.geometry.dispose();
				mountain.material.dispose();
			});

			if (refs.nebula) {
				refs.nebula.geometry.dispose();
				refs.nebula.material.dispose();
			}

			refs.renderer?.dispose();
		};
	}, []);

	useEffect(() => {
		if (!isReady) return;

		gsap.set([titleRef.current, subtitleRef.current, progressRef.current], {
			visibility: "visible",
		});

		const tl = gsap.timeline();
		if (titleRef.current) {
			tl.from(
				titleRef.current.querySelectorAll(".hz-title-char"),
				{
					y: 180,
					opacity: 0,
					duration: 1.2,
					stagger: 0.04,
					ease: "power4.out",
				},
				0,
			);
		}

		if (subtitleRef.current) {
			tl.from(
				subtitleRef.current.querySelectorAll(".hz-subtitle-line"),
				{
					y: 32,
					opacity: 0,
					duration: 0.9,
					stagger: 0.14,
					ease: "power3.out",
				},
				0.25,
			);
		}

		if (progressRef.current) {
			tl.from(progressRef.current, {
				y: 24,
				opacity: 0,
				duration: 0.8,
			}, 0.4);
		}

		return () => {
			tl.kill();
		};
	}, [isReady]);

	useEffect(() => {
		const onScroll = () => {
			const scrollY = window.scrollY;
			const heroTop = containerRef.current?.offsetTop ?? 0;
			const heroHeight = containerRef.current?.offsetHeight ?? window.innerHeight;
			const heroScrollable = Math.max(heroHeight - window.innerHeight, 1);
			const progress = gsap.utils.clamp(0, 1, (scrollY - heroTop) / heroScrollable);

			setScrollProgress(progress);

			const section = Math.floor(progress * heroScrollPhases);
			setCurrentSection(Math.min(section + 1, heroScrollPhases));

			const { current: refs } = threeRefs;
			const total = progress * Math.max(sections.length - 1, 1);
			const sectionProgress = total % 1;

			const positions = [
				{ x: 0, y: 28, z: 300 },
				{ x: 0, y: 40, z: -30 },
				{ x: 0, y: 52, z: -680 },
			];
			const curr = positions[section] ?? positions[0];
			const next = positions[section + 1] ?? curr;

			refs.targetCameraX = curr.x + (next.x - curr.x) * sectionProgress;
			refs.targetCameraY = curr.y + (next.y - curr.y) * sectionProgress;
			refs.targetCameraZ = curr.z + (next.z - curr.z) * sectionProgress;

			refs.mountains.forEach((mountain, i) => {
				const speed = 1 + i * 0.85;
				const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;

				if (refs.nebula) {
					refs.nebula.position.z = targetZ + progress * speed * 0.01 - 90;
				}

				if (progress > 0.72) {
					mountain.position.z = 600000;
				} else if (refs.locations) {
					mountain.position.z = refs.locations[i];
				}
			});

			if (refs.nebula && refs.mountains[3]) {
				refs.nebula.position.z = refs.mountains[3].position.z;
			}
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, [heroScrollPhases, sections.length]);

	const heroMinHeight = useMemo(
		() => `${(heroScrollPhases + 1) * 100}vh`,
		[heroScrollPhases],
	);

	return (
		<section id="home" ref={containerRef} className="hz-hero-wrap" style={{ minHeight: heroMinHeight }}>
			<div className="hz-sticky-stage">
				<canvas ref={canvasRef} className="hz-hero-canvas" />

				<div
					className="hz-hero-content"
					onMouseEnter={() => onCursorEnter?.("View Work")}
					onMouseLeave={() => onCursorLeave?.()}
				>
					<div className="hz-text-stack">
						<div className="hz-layer" style={layerStyle(false)}>
							<h1
								ref={titleRef}
								className="hz-title"
								aria-label={currentContent.title}
							>
								{splitTitle(currentContent.title)}
							</h1>
							<div ref={subtitleRef} className="hz-subtitle">
								<p className="hz-subtitle-line">{currentContent.subtitleLine1}</p>
								<p className="hz-subtitle-line">{currentContent.subtitleLine2}</p>
							</div>
						</div>

						{currentIndex !== nextIndex && transition > 0.08 && (
							<div className="hz-layer" style={layerStyle(true)} aria-hidden="true">
								<h1
									className="hz-title"
									aria-label={nextContent.title}
								>
									{splitTitle(nextContent.title)}
								</h1>
								<div className="hz-subtitle">
									<p className="hz-subtitle-line">{nextContent.subtitleLine1}</p>
									<p className="hz-subtitle-line">{nextContent.subtitleLine2}</p>
								</div>
							</div>
						)}
					</div>
				</div>

				<div ref={progressRef} className="hz-scroll-progress" style={{ visibility: "hidden" }}>
					<span className="hz-scroll-text">Scroll</span>
					<div className="hz-progress-track">
						<div className="hz-progress-fill" style={{ width: `${scrollProgress * 100}%` }} />
					</div>
					<span className="hz-counter">
						{String(currentSection).padStart(2, "0")} / {String(heroScrollPhases).padStart(2, "0")}
					</span>
				</div>
			</div>
		</section>
	);
};

