import { useTheme } from "@/providers/theme";
import { useNavigate } from "@tanstack/react-router";
import { useHover, useIsFirstRender } from "@uidotdev/usehooks";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useMemo, type FC } from "react";
import type { IconType } from "react-icons";
import { FaGithub, FaMoon, FaSun, FaXTwitter } from "react-icons/fa6";
import { LuLanguages } from "react-icons/lu";
import { UnderlineLink } from "./atoms/underline-link";
import { MagicCard } from "./ui/magic-card";
import { ShineBorder } from "./ui/shine-border";
import { WordRotate } from "./ui/word-rotate";

type NavBarItemType = {
	key: string;
	label?: string;
	icon?: IconType;
	onClick?: () => void;
};

type NavBarItemsType = Record<"left" | "right" | "middle", NavBarItemType[]>;

type InfoBarItemsType = string[];

const _duration_ = 0.4;

export const DynamicIsland: FC = () => {
	const navigate = useNavigate();
	const { currentTheme, setTheme } = useTheme();
	const [hoverRef, isHovered] = useHover();

	const navBarItems: NavBarItemsType = useMemo(
		() => ({
			left: [
				{
					key: "logo",
					label: "Francis's melody",
				},
			],
			right: [
				{
					key: "theme",
					icon:
						currentTheme === "light" || currentTheme === "system"
							? FaMoon
							: FaSun,
					onClick: () => {
						setTheme(
							currentTheme === "light" || currentTheme === "system"
								? "dark"
								: "light",
						);
					},
				},
				{
					key: "language",
					icon: LuLanguages,
				},
				{
					key: "github",
					icon: FaGithub,
					onClick: () => {
						window.location.assign("https://github.com/francismiko");
					},
				},
				{
					key: "twitter",
					icon: FaXTwitter,
					onClick: () => {
						window.location.assign("https://x.com/Francismiko1");
					},
				},
			],
			middle: [
				{
					key: "home",
					label: "主页",
					onClick: () => {
						navigate({ to: "/" });
					},
				},
				{
					key: "blog",
					label: "博客",
					onClick: () => {
						navigate({ to: "/blog" });
					},
				},
				{
					key: "project",
					label: "项目",
					onClick: () => {
						navigate({ to: "/project" });
					},
				},
				{
					key: "sponsor",
					label: "赞助",
					onClick: () => {
						navigate({ to: "/sponsor" });
					},
				},
			],
		}),
		[currentTheme, setTheme, navigate],
	);

	const infoBarItems: InfoBarItemsType = useMemo(
		() => ["👋 hi, I'm francis", "欢迎来到我的站点"],
		[],
	);

	return (
		<div className="fixed flex justify-center w-full top-4 z-100">
			<ShineBorder
				className="rounded-full"
				borderRadius={999}
				color={
					currentTheme === "dark"
						? ["#9966FF", "#01FFFF", "#66FFCC"]
						: ["#e0e0e0", "#8f8f8f", "#2b2b2b"]
				}
			>
				<MagicCard
					className="bg-black rounded-full"
					gradientColor={currentTheme === "dark" ? "#8c8c8c" : "#ffffff"}
					gradientSize={150}
					gradientOpacity={0.2}
				>
					<motion.div
						ref={hoverRef}
						initial={false}
						animate={{
							width: isHovered ? "42rem" : "12rem",
							height: isHovered ? "3.6rem" : "2.4rem",
						}}
						transition={{ duration: _duration_, ease: "easeOut" }}
						className="relative flex overflow-hidden rounded-full select-none"
					>
						<AnimatePresence mode="popLayout">
							{isHovered ? (
								<NavBar key="navigation" items={navBarItems} />
							) : (
								<InfoBar key="information" items={infoBarItems} />
							)}
						</AnimatePresence>
					</motion.div>
				</MagicCard>
			</ShineBorder>
		</div>
	);
};

const NavBar: FC<{ items: NavBarItemsType }> = memo(({ items }) => {
	const isFirstRender = useIsFirstRender();

	const sideBarAnimation = {
		initial: isFirstRender
			? {
					opacity: 0,
					scale: 0.4,
					filter: "blur(8px)",
				}
			: false,
		exit: {
			opacity: 0,
			scale: 0.4,
			filter: "blur(8px)",
		},
		animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
		transition: { duration: _duration_, ease: "easeInOut" },
	};

	const middleBarAnimation = {
		initial: isFirstRender ? { opacity: 0, scale: 1, y: -50 } : false,
		exit: { opacity: 0, scale: 1, y: 50 },
		animate: { opacity: 1, scale: 1, y: 0 },
		transition: { duration: _duration_, ease: "easeOut" },
	};

	const LeftBar: FC = memo(() => (
		<motion.div
			{...sideBarAnimation}
			className="flex flex-row items-center w-1/4 gap-4 pl-4 text-white text-nowrap"
		>
			{items.left.map((item) => (
				<span key={item.key}>{item.label}</span>
			))}
		</motion.div>
	));

	const RightBar: FC = memo(() => (
		<motion.div
			{...sideBarAnimation}
			className="flex flex-row-reverse items-center w-1/4 gap-2 pr-4 text-lg text-white text-nowrap"
		>
			{items.right.map((item) => (
				<div
					key={item.key}
					onClick={item.onClick}
					className="flex items-center justify-center transition ease-in-out rounded-full duration-250 size-8 hover:bg-neutral-700"
				>
					{item.icon && <item.icon />}
				</div>
			))}
		</motion.div>
	));

	const MiddleBar: FC = memo(() => (
		<motion.div
			{...middleBarAnimation}
			className="absolute flex items-center justify-center w-full h-full gap-4 text-white grow px-1/4 text-nowrap"
		>
			{items.middle.map((item) => (
				<UnderlineLink key={item.key} onClick={item.onClick}>
					<span>{item.label}</span>
				</UnderlineLink>
			))}
		</motion.div>
	));

	return (
		<div className="absolute flex w-full h-full place-content-between">
			<LeftBar />
			<MiddleBar />
			<RightBar />
		</div>
	);
});

const InfoBar: FC<{ items: InfoBarItemsType }> = memo(({ items }) => {
	return (
		<motion.div
			exit={{ opacity: 0, y: 50 }}
			transition={{ duration: _duration_, ease: "easeOut" }}
			className="absolute flex items-center justify-center flex-1 w-full h-full text-white"
		>
			<WordRotate
				words={items}
				framerProps={{
					initial: { opacity: 0, y: -50 },
					animate: { opacity: 1, y: 0 },
					exit: { opacity: 0, y: 50 },
					transition: { duration: _duration_, ease: "easeOut" },
				}}
			/>
		</motion.div>
	);
});
