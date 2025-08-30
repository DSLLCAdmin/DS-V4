"use client";
import { Users, Star, Calendar, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FloatingElement, ScrollReveal } from "@/components/floating-elements";
import { Navigation } from "@/components/navigation";

const circles = [
	{
		label: "StreetCircle",
		value: "156 Members",
		icon: Users,
		color: "bg-swatch101 text-black",
		desc: "Connect with fellow Streeters for lively discussions and events.",
	},
	{
		label: "DarkStreet Reads",
		value: "12 Monthly Sessions",
		icon: Calendar,
		color: "bg-swatch102 text-black",
		desc: "Join our monthly reading sessions and explore new genres.",
	},
	{
		label: "StreetList",
		value: "47 Curated Titles",
		icon: BookOpen,
		color: "bg-swatch103 text-black",
		desc: "A curated list of must-read books for every DarkStreeter.",
	},
	{
		label: "Streeter's Choice",
		value: "4.9 Avg. Rating",
		icon: Star,
		color: "bg-swatch104 text-black",
		desc: "Top picks and reviews from the StreetVerse community.",
	},
];

export default function StreetCircle() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-[#8B0000] via-[#DC143C] to-[#FF6347] overflow-hidden relative">
			{/* Metallic overlay effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)] pointer-events-none"></div>
			<Navigation />
			<div className="max-w-5xl mx-auto px-4 py-16">
				<ScrollReveal>
					<h1 className="text-5xl font-bold text-white mb-10 text-center drop-shadow-lg">
						StreetCircle & Literary Life
					</h1>
				</ScrollReveal>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
					{circles.map((circle, index) => (
						<ScrollReveal key={circle.label} delay={index * 100}>
							<FloatingElement speed={0.03 + index * 0.01}>
								<Card
									className={`rounded-3xl shadow-xl p-8 flex flex-col items-center ${circle.color} hover:scale-105 transition-all duration-300`}
								>
									<circle.icon className="h-12 w-12 mb-4" />
									<h2 className="text-2xl font-bold mb-2">
										{circle.label}
									</h2>
									<p className="text-lg mb-2 font-semibold">
										{circle.value}
									</p>
									<p className="text-gray-700 text-center">
										{circle.desc}
									</p>
								</Card>
							</FloatingElement>
						</ScrollReveal>
					))}
				</div>
			</div>
			<Navigation variant="footer" />
		</div>
	);
}