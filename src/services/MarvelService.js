import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
	const {  request, clearError, process, setProcess } =
		useHttp();

	const _apiBase =
		"https://gateway.marvel.com:443/v1/public/";
	const _apiKey = "apikey=eb2f840ef700b4a768b458a8c7547d36"; // '_' Значение этого свойства нельзя менять
	const _baseOffSet = 210;

	const getAllComics = async (offset = "0") => {
		console.log(offset);
		const res = await request(
			`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`
		);

		return res.data.results.map(_transformComics);
	};

	const getComic = async (id) => {
		const res = await request(
			`${_apiBase}comics/${id}?${_apiKey}`
		);
		return _transformComics(res.data.results[0]);
	};

	const getAllCharacters = async (offset = _baseOffSet) => {
		const res = await request(
			`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
		);
		return res.data.results.map(_transformCharacter);
	};

	const getCharacter = async (id) => {
		const res = await request(
			`${_apiBase}characters/${id}?${_apiKey}`
		);
		return _transformCharacter(res.data.results[0]);
	};
	const getCharacterByName = async (name) => {
		const res = await request(
			`${_apiBase}characters?name=${name}&${_apiKey}`
		);
		return res.data.results.map(_transformCharacter);
	};

	const _transformComics = (comics) => {
		return {
			id: comics.id,
			title: comics.title,
			description:
				comics.description || "There is no description",
			pageCount: comics.pageCount
				? `${comics.pageCount} pages`
				: "No information about the number of pages",
			thumbnail:
				comics.thumbnail.path +
				"." +
				comics.thumbnail.extension,
			language: comics.textObjects.language || "en-us",
			price: comics.prices[0].price
				? `${comics.prices[0].price} $`
				: "not available",
		};
	};

	const _transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description
				? char.description
				: "Here is no description for this character",
			thumbnail:
				char.thumbnail.path +
				"." +
				char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items,
		};
	};

	return {
		process,
		setProcess,
		getAllCharacters,
		getCharacter,
		clearError,
		getAllComics,
		getComic,
		getCharacterByName,
	};
};

export default useMarvelService;
