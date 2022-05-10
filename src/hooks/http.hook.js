import { useState, useCallback } from "react";

export const useHttp = () => {
	
	const [process, setProcess] = useState("waiting");

	const request = useCallback(
		async (
			url,
			method = "GET",
			body = null,
			headers = { "Content-Type": "application/json" }
		) => {
		
			setProcess('loading');
			try {
				const responce = await fetch(url, {
					method,
					body,
					headers,
				});

				if (!responce.ok) {
					throw new Error(
						`Couldn't fetch ${url}, status: ${responce.status}`
					);
				}

				const data = await responce.json();

				return data;
			} catch (e) {
				setProcess("error");
				throw e;
			}
		},
		[]
	);

	const clearError = useCallback(() => {
		setProcess("loading");
	}, []);

	return {
		request,
		clearError,
		process,
		setProcess,
	};
};
