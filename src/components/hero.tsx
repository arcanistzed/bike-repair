import { Button } from "@/components/ui/button";
import ClockIcon from "./icons/clock";
import LocateIcon from "./icons/locate";
import PhoneIcon from "./icons/phone";

export function Hero({ book }: Readonly<{ book: () => void }>) {
	return (
		<section className="w-full h-full py-12 md:py-24 lg:py-32 xl:py-48 grid place-items-center">
			<div className="container px-4 md:px-6">
				<div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
					<div className="flex flex-col justify-center gap-2 lg:gap-4 items-start">
						<h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
							Get Your Bike Back on the Road
						</h1>
						<p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
							Book your bike repair appointment today and get back to riding in no
							time.
						</p>
						<div className="grid gap-2">
							<div className="flex items-center gap-2">
								<LocateIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
								<p className="text-sm text-gray-500 dark:text-gray-400">
									123 Main St, Ottawa
								</p>
							</div>
							<div className="flex items-center gap-2">
								<PhoneIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
								<p className="text-sm text-gray-500 dark:text-gray-400">
									(613) 123-1234
								</p>
							</div>
							<div className="flex items-center gap-2">
								<ClockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Mon-Fri: 9am-6pm, Sat: 10am-4pm
								</p>
							</div>
						</div>
						<Button size="lg" onClick={book}>
							Book Appointment
						</Button>
					</div>
					<img
						alt="Bike Repair"
						className="rounded-xl object-cover h-full"
						src="/bike-repair.jpg"
					/>
				</div>
			</div>
		</section>
	);
}
