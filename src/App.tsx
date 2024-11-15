import { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes/index";
import ErrorBoundary from "./components/common/ErrorBoundary"; // Pastikan jalur ini benar

const router = createBrowserRouter(routes);

const App = () => {
    return (
        <ErrorBoundary>
            <Suspense fallback={<div>Loading...</div>}>
                <RouterProvider router={router} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default App;
