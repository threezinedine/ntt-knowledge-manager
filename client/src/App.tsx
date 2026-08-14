import { useEffect, useState } from "react";
import { ProtectedRoute, ThemeProvider } from "./features";
import { Home, Login, NotFound, Settings, Workspace } from "./pages";

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

	if (route === "settings") {
		return (
			<ProtectedRoute>
				<Settings />
			</ProtectedRoute>
		);
	}

	if (route === "workspace") {
		return (
			<ProtectedRoute>
				<Workspace />
			</ProtectedRoute>
		);
	}

	if (route === "") {
		return <Home />;
	}

	return <NotFound />;
}

function App() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}

export default App;
