import { ThemeProvider } from "./theme";
import { Home } from "./pages";

function App() {
	return (
		<ThemeProvider>
			<Home />
		</ThemeProvider>
	);
}

export default App;
