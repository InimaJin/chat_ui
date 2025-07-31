function Contact({ panelRef, id, name, isActive, onSelect }) {
	const activeClass = isActive ? "active-contact" : "";
	return (
		<div
			onClick={() => {
				panelRef.current.classList.remove("active");
				onSelect(id);
			}}
			className={`contact ${activeClass}`}
		>
			<h3 className={isActive ? "box" : ""}>{name}</h3>
		</div>
	);
}

export function ContactsPanel({
	ref,
	contactsList,
	onContactSelect,
	activeContact,
}) {
	const contacts = contactsList.map((c) => {
		return (
			<Contact
				key={c.id}
				panelRef={ref}
				id={c.id}
				name={c.name}
				onSelect={onContactSelect}
				isActive={c.id === activeContact}
			/>
		);
	});

	return (
		<div ref={ref} className="side-panel contacts-panel">
			{contacts}
		</div>
	);
}
