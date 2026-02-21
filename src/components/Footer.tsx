export default function Footer() {
    return (
        <footer className="mt-20 py-8 px-4 md:px-0 text-center" style={{ borderTop: '1px solid var(--card-border)' }}>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
                © {new Date().getFullYear()} Vlad Subbotin. All rights reserved.
            </p>
        </footer>
    );
}
