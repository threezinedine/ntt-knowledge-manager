import { useEffect, useState } from "react";
import { ThemeProvider } from "./theme";
import { Home, Login } from "./pages";

function getRoute(): string {
	return window.location.hash.replace(/^#\/?/, "");
}

function useHashRoute(): string {
	const [route, setRoute] = useState(getRoute);

	useEffect(() => {
		const handleHashChange = () => setRoute(getRoute());
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, []);

	return route;
}

function AppContent() {
	const route = useHashRoute();

	if (route === "login") {
		return <Login />;
	}

	return <Home />;
}

function App() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}

export default App;
