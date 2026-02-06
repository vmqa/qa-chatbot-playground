export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-2 text-center">
      <p className="text-xs text-[var(--text-secondary)]">
        &copy; {new Date().getFullYear()} Marco
      </p>
    </footer>
  );
}
