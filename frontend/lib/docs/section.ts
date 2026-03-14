export function getSection(path: string | undefined) {
    if (!path) return 'latest';
    const [dir] = path.split('/', 1);
    if (!dir) return 'framework';
    return (
        {
            ui: 'ui',
            headless: 'headless',
        }[dir] ?? 'latest'
    );
}
