import React, { Component, ErrorInfo } from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        // Perbarui state sehingga berikutnya render akan menampilkan fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Anda dapat melakukan sesuatu dengan kesalahan tersebut, seperti melaporkannya
        console.error("Kesalahan ditangkap dalam Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Anda dapat mengganti UI dengan fallback UI
            return <h1>Terjadi kesalahan. Silakan coba lagi nanti.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
