"use client";

import { Booking } from "@/components/booking";
import { Hero } from "@/components/hero";
import { useRef, useState } from "react";

export default function Home() {
	const [active, setActive] = useState<boolean>(false);

	return (
		<>
			<Hero book={() => setActive(true)} />
			<Booking active={active} setActive={setActive} />
		</>
	);
}
