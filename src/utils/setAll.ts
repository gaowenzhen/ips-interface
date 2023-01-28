export function setAll(state: any, properties: any) {
	if (properties) {
		const props = Object.keys(properties);
		props.forEach(key => {
			state[key] = properties[key];
		});
	}
}