import useMarvelService from "../../services/MarvelService";
import { useState, useEffect, useRef, useMemo } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PropTypes from "prop-types";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

// import setContent from "../../utils/setContent";

import "./charList.scss";

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

const CharList = (props) => {
	const [charList, setCharList] = useState([]);
	const [newItemLoading, setNewItemLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charEnded, setCharEnded] = useState(false);

	const { getAllCharacters, process, setProcess } = useMarvelService();

	useEffect(() => {
		onRequest(offset, true);
	}, []);

	const onRequest = (offset, initial) => {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);

		getAllCharacters(offset)
			.then((res) => onCharListLoaded(res))
			.then(() => setProcess("confirmed"));
	};

	const onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		setCharList((charList) => [...charList, ...newCharList]);
		setNewItemLoading((newItemLoading) => false);
		setOffset((offset) => offset + 9);
		setCharEnded((charEnded) => ended);
	};

	const itemRefs = useRef([]);

	const focusOnItem = (id) => {
		itemRefs.current.forEach((item) => item.classList.remove("char__item_selected"));
		itemRefs.current[id].classList.add("char__item_selected");
		itemRefs.current[id].focus();
	};

	function renderItems(arr) {
		console.log('render');
		const items = arr.map((item, i) => {
			const { name, thumbnail, id } = item;

			let imgStyle = { objectFit: "cover" };
			if (
				thumbnail ===
				"http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
			) {
				imgStyle = { objectFit: "unset" };
			}

			return (
				<CSSTransition key={id} timeout={500} classNames="char_item">
					<li
						tabIndex={0}
						ref={(el) => (itemRefs.current[i] = el)}
						className="char__item"
						key={id}
						onClick={() => {
							props.onCharSelected(id);
							focusOnItem(i);
						}}
						onKeyPress={(e) => {
							if (e.key === " " || e.key === "Enter") {
								props.onCharSelected(id);
								focusOnItem(i);
							}
						}}
					>
						<img src={thumbnail} alt={name} style={imgStyle} />
						<div className="char__name">{name}</div>
					</li>
				</CSSTransition>
			);
		});

		return (
			<ul className="char__grid">
				<TransitionGroup component={null}>{items}</TransitionGroup>
			</ul>
		);
	}

  const elements = useMemo(() => {
    return setContent(process, () => renderItems(charList), newItemLoading);
    // eslint-disable-next-line
}, [process])

// TransitionGroup работать не будет за счет постоянного пересоздания компонента
// разбор в следующем уроке
return (
    <div className="char__list">
        {elements}
        <button 
            disabled={newItemLoading} 
            style={{'display' : charEnded ? 'none' : 'block'}}
            className="button button__main button__long"
            onClick={() => onRequest(offset)}>
            <div className="inner">load more</div>
        </button>
    </div>
)
}

CharList.propTypes = {
onCharSelected: PropTypes.func.isRequired
}

export default CharList;