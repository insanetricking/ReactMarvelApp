import "./comicsList.scss";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import ErrorMessage from "../errorMessage/ErrorMessage";
import Spinner from "../spinner/Spinner";

const setContent = (process, Component, newItemLoading) => {
	switch (process) {
		case "waiting":
			return <Spinner />;
			break;
		case "loading":
			return newItemLoading ? <Component /> : <Spinner />;
			break;
		case "confirmed":
			return <Component />;
			break;
		case "error":
			return <ErrorMessage />;
			break;
		default:
			throw new Error("Unexpected process state");
	}
};

const ComicsList = () => {
	const [comicsList, setComicsList] = useState([]);
	const [offset, setOffset] = useState(0);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [comicsListEnded, setComicsListEnded] = useState(false);

	const {getAllComics, process, setProcess } = useMarvelService();

	// console.log(getAllComics());

	useEffect(() => {
		onRequest(offset, true);
	}, []);

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);

		getAllComics(offset).then((res) => onComicsListLoaded(res)).then(() => setProcess("confirmed"));
	};

	const onComicsListLoaded = (newArr) => {
		let ended = false;
		if (newArr.length < 8) {
			ended = true;
		}
		setNewItemLoading(false);
		setComicsList((arr) => [...arr, ...newArr]);
		setOffset((offset) => offset + 8);
		setComicsListEnded(ended);
	};

	function renderItems(arr) {
		const items = arr.map((item, index) => {
			const { title, thumbnail, price, id } = item;

			return (
				<li className="comics__item" key={index}>
					<Link to={`/comics/${id}`}>
						<img src={thumbnail} alt="ultimate war" className="comics__item-img" />
						<div className="comics__item-name">{title}</div>
						<div className="comics__item-price">{price}</div>
					</Link>
				</li>
			);
		});

		return <ul className="comics__grid">{items}</ul>;
	}


	return (
		<div className="comics__list">
			{setContent(process, () => renderItems(comicsList), newItemLoading)}
			<button
				disabled={newItemLoading}
				style={{ display: comicsListEnded ? "none" : "block" }}
				className="button button__main button__long"
				onClick={() => onRequest(offset)}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	);
};

export default ComicsList;
