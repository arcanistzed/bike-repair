import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo, useRef, useState } from "react";
import CalendarDaysIcon from "./icons/calendar-days";
import MinusIcon from "./icons/minus";
import PlusIcon from "./icons/plus";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type Appointment = {
	valid: boolean;
	repairType: string;
	date: Date | null;
	time: string;
	expert: string;
	location: "store" | "mobile";
	address: string;
};

const repairTypes = [
	{ id: "tune-up", name: "Tune-up", price: 50 },
	{ id: "brake-repair", name: "Brake Repair", price: 75 },
	{ id: "flat-tire", name: "Flat Tire", price: 30 },
	{ id: "other", name: "Other", price: 0 },
];

const experts = [
	{ id: "john", name: "John", experience: "10+ years" },
	{ id: "sarah", name: "Sarah", experience: "5 years" },
	{ id: "mike", name: "Mike", experience: "15 years" },
	{ id: "emily", name: "Emily", experience: "8 years" },
];

export function Booking({
	active,
	setActive,
}: Readonly<{
	active: boolean;
	setActive: (active: boolean) => void;
}>) {
	const bookingRef = useRef<HTMLFormElement>(null);

	const [validated, setValidated] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [phone, setPhone] = useState<string>("");

	const [appointments, setAppointments] = useState<Appointment[]>([
		{
			valid: false,
			repairType: "",
			date: null,
			time: "",
			expert: "",
			location: "store",
			address: "",
		},
	]);

	const handleAddAppointment = () => {
		setAppointments([
			...appointments,
			{
				valid: false,
				repairType: "",
				date: null,
				time: "",
				expert: "",
				location: "store",
				address: "",
			},
		]);
	};

	const handleRemoveAppointment = (index: number) => {
		setAppointments(appointments.filter((_, i) => i !== index));
	};

	const handleAppointmentChange = (
		index: number,
		key: string,
		value: string | boolean | Date | null,
	) => {
		setAppointments((appointments) =>
			appointments.map((appointment, i) =>
				i === index ? { ...appointment, [key]: value } : appointment,
			),
		);
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		alert(`${name}, your appointment${appointments.length > 1 ? "s have" : " has"} been scheduled.`);
		window.location.reload();
	};

	useEffect(() => {
		if (active) {
			bookingRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
			setTimeout(() => {
				bookingRef.current?.querySelector("input")?.focus();
			}, 500);
			setActive(false);
		}
	}, [active]);

	useEffect(() => {
		if (
			name &&
			email &&
			phone &&
			RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).exec(email) &&
			RegExp(/^(?:\(\d{3}\)|\d{3})[- ]?\d{3}[- ]?\d{4}$/).exec(phone) &&
			appointments.length > 0 &&
			appointments.every((appointment) => appointment.valid)
		) {
			setValidated(true);
		} else {
			setValidated(false);
		}
	}, [name, email, phone, appointments]);

	return (
		<section className="w-full h-full py-12 md:py-24 lg:py-32 xl:py-48 grid place-items-center">
			<div className="container px-4 md:px-6">
				<Card>
					<CardHeader>
						<CardTitle>Schedule Your Bike Repair</CardTitle>
						<CardDescription>
							Fill out the form below to book your appointment.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="grid gap-4" onSubmit={onSubmit} ref={bookingRef}>
							<div className="grid sm:grid-cols-3 gap-4">
								<div className="flex flex-col gap-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										placeholder="Enter your name"
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										placeholder="Enter your email"
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div className="flex flex-col gap-2">
									<Label htmlFor="phone">Phone</Label>
									<Input
										id="phone"
										placeholder="Enter your phone number"
										type="tel"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
									/>
								</div>
							</div>
							{appointments.map((_appointment, i) => (
								<Appointment
									key={i}
									index={i}
									count={appointments.length}
									handleAppointmentChange={handleAppointmentChange}
									handleRemoveAppointment={handleRemoveAppointment}
									handleAddAppointment={handleAddAppointment}
								/>
							))}
							<ConfirmDialog
								name={name}
								email={email}
								phone={phone}
								appointments={appointments}
								validated={validated}
								onConfirm={() => bookingRef.current?.requestSubmit()}
							/>
						</form>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}

function Appointment({
	index,
	count,
	handleAppointmentChange,
	handleRemoveAppointment,
	handleAddAppointment,
}: Readonly<{
	index: number;
	count: number;
	handleAppointmentChange: (
		index: number,
		key: string,
		value: string | boolean | Date | null,
	) => void;
	handleRemoveAppointment: (index: number) => void;
	handleAddAppointment: () => void;
}>) {
	const [validated, setValidated] = useState<boolean>(false);
	const [repairType, setRepairType] = useState<string>("");
	const [date, setDate] = useState<Date | null>(null);
	const [time, setTime] = useState<string>("");
	const [location, setLocation] = useState<"store" | "mobile">("store");
	const [address, setAddress] = useState<string>("");
	const [expert, setExpert] = useState<string>("");

	const hours = useMemo(() => {
		if (!date) return [];
		const start = date.getDay() === 6 ? 10 : 9;
		const end = date.getDay() === 6 ? 16 : 18;
		const hours = [];
		for (let i = start; i <= end; i++) {
			hours.push(`${i}:00`);
		}
		return hours;
	}, [date]);

	const handleAdd = () => {
		if (validated) {
			handleAddAppointment();
		}
	};

	const handleRemove = (index: number) => {
		handleRemoveAppointment(index);
	};

	useEffect(() => {
		if (
			repairType &&
			date &&
			time &&
			expert &&
			repairTypes.find((type) => type.id === repairType) &&
			date instanceof Date &&
			date.getTime() > Date.now() &&
			hours.includes(time) &&
			experts.find((e) => e.id === expert) &&
			(location === "store" || (location === "mobile" && address))
		) {
			setValidated(true);
			handleAppointmentChange(index, "valid", true);
		} else {
			setValidated(false);
			handleAppointmentChange(index, "valid", false);
		}

		handleAppointmentChange(index, "repairType", repairType);
		handleAppointmentChange(index, "date", date);
		handleAppointmentChange(index, "time", time);
		handleAppointmentChange(index, "expert", expert);
		handleAppointmentChange(index, "location", location);
		handleAppointmentChange(index, "address", address);
	}, [repairType, date, time, expert, location, address]);

	return (
		<div className="p-4 border border-gray-200 rounded-lg flex flex-col gap-4">
			<div className="grid sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="repair-type">Repair Type</Label>
					<Select value={repairType} onValueChange={(value) => setRepairType(value)}>
						<SelectTrigger>
							<SelectValue placeholder="Select repair type" />
						</SelectTrigger>
						<SelectContent>
							{repairTypes.map((type) => (
								<SelectItem key={type.id} value={type.id}>
									{type.name} - ${type.price}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="expert">Expert</Label>
					<Select value={expert} onValueChange={(value) => setExpert(value)}>
						<SelectTrigger>
							<SelectValue placeholder="Select expert" />
						</SelectTrigger>
						<SelectContent>
							{experts.map((expert) => (
								<SelectItem key={expert.id} value={expert.id}>
									{expert.name} - {expert.experience}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="grid sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-2">
					<Label htmlFor="appointment-date">Appointment Date</Label>
					<input type="hidden" name="appointment-date" value={date?.toISOString()} />
					<Popover key={date?.toISOString()}>
						<PopoverTrigger asChild>
							<Button
								className="w-full justify-start text-left font-normal"
								variant="outline"
							>
								<CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
								{date ? date.toDateString() : "Select a date"}
							</Button>
						</PopoverTrigger>
						<PopoverContent align="start" className="w-auto p-0">
							<Calendar
								initialFocus
								mode="single"
								onSelect={(day) => {
									if (day) setDate(day);
								}}
								selected={date ?? undefined}
								disabled={(day) => day < new Date() || day.getDay() === 0}
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="appointment-time">Appointment Time</Label>
					<Select value={time} onValueChange={(value) => setTime(value)} disabled={!date}>
						<SelectTrigger>
							<SelectValue placeholder="Select time" />
						</SelectTrigger>
						<SelectContent>
							{hours.map((hour) => {
								return (
									<SelectItem key={hour} value={hour}>
										{hour}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="flex gap-4">
				<div className="flex flex-col gap-4">
					<Label htmlFor={`appointment-location-${index}`}>Location</Label>
					<RadioGroup
						id={`appointment-location-${index}`}
						value={location}
						onValueChange={(value) => {
							if (value === "store" || value === "mobile") {
								setLocation(value);
							} else {
								setLocation("store");
							}
						}}
						className="flex flex-col gap-4"
					>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="store" id={`location-store-${index}`} />
							<Label htmlFor={`location-store-${index}`}>Store</Label>
						</div>
						<div className="flex items-center gap-2">
							<RadioGroupItem value="mobile" id={`location-mobile-${index}`} />
							<Label htmlFor={`location-mobile-${index}`}>Mobile</Label>
						</div>
					</RadioGroup>
				</div>
				<div className="flex flex-col gap-4">
					{location === "mobile" && (
						<>
							<Label htmlFor={`appointment-address-${index}`} className="my-auto">
								Address
							</Label>
							<Input
								id={`appointment-address-${index}`}
								placeholder="Enter your address"
								value={address}
								onChange={(e) => {
									setAddress(e.target.value);
								}}
							/>
						</>
					)}
				</div>
				{index === count - 1 && (
					<div className="flex flex-col ml-auto gap-2">
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={handleAdd}
							className="flex items-center gap-2"
							disabled={!validated}
						>
							<PlusIcon className="h-4 w-4" />
							Add
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={() => handleRemove(index)}
							className="flex items-center gap-2"
							disabled={count <= 1}
						>
							<MinusIcon className="h-4 w-4" />
							Remove
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

function ConfirmDialog({
	name,
	email,
	phone,
	appointments,
	validated,
	onConfirm,
}: Readonly<{
	name: string;
	email: string;
	phone: string;
	appointments: Appointment[];
	validated: boolean;
	onConfirm: () => void;
}>) {
	return (
		<Dialog>
			{validated ? (
				<DialogTrigger asChild>
					<Button className="w-full" size="lg" type="button">
						Confirm Appointment
					</Button>
				</DialogTrigger>
			) : (
				<Button className="w-full" size="lg" type="submit" disabled>
					Confirm Appointment
				</Button>
			)}
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Appointment Confirmed</DialogTitle>
					<DialogDescription>
						Your bike repair appointment has been scheduled.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-3 items-center gap-4">
						<Label className="text-right" htmlFor="name">
							Name
						</Label>
						<div className="col-span-2">{name}</div>
					</div>
					<div className="grid grid-cols-3 items-center gap-4">
						<Label className="text-right" htmlFor="email">
							Email
						</Label>
						<div className="col-span-2">{email}</div>
					</div>
					<div className="grid grid-cols-3 items-center gap-4">
						<Label className="text-right" htmlFor="phone">
							Phone
						</Label>
						<div className="col-span-2">{phone}</div>
					</div>
					{appointments.map((appointment, i) => (
						<div
							key={i}
							className="p-4 border border-gray-200 rounded-lg flex flex-col gap-4"
						>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label className="text-right" htmlFor="repair-type">
									Repair Type
								</Label>
								<div className="col-span-2">
									{
										repairTypes.find(
											(type) => type.id === appointment.repairType,
										)?.name
									}
								</div>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label className="text-right" htmlFor="appointment-date">
									Appointment Date
								</Label>
								<div className="col-span-2">
									{appointment.date?.toDateString()}
								</div>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label className="text-right" htmlFor="appointment-time">
									Appointment Time
								</Label>
								<div className="col-span-2">{appointment.time}</div>
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<Label className="text-right" htmlFor="expert">
									Expert
								</Label>
								<div className="col-span-2">
									{experts.find((e) => e.id === appointment.expert)?.name}
								</div>
							</div>
						</div>
					))}
				</div>
				<DialogFooter>
					<Button className="w-full" onClick={onConfirm}>
						Book Appointment
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
