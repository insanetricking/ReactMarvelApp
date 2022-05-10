import Helmet from "react-helmet";

import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

const ComicsPage = () => {
  return (
    <>
    <Helmet>
    <meta
					name="description"
					content="Page With list of comics"
				/>
				<title>Comics Page</title>
    </Helmet>
      <AppBanner />
      <ComicsList />
    </>
  );
};

export default ComicsPage;