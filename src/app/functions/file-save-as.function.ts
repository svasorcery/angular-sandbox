export function saveAs(blob: any, name?: string): void {
    const URL = window.URL;
    const a = document.createElement('a');
    name = name || blob.name || 'download';

    a.download = name;
    a.target = '_blank';
    a.rel = 'noopener'; // tabnabbing

    if (typeof blob === 'string') {
        // Support regular links
        a.href = blob;
        a.dispatchEvent(new MouseEvent('click'));
    } else {
        // Support blobs
        a.href = URL.createObjectURL(blob);
        setTimeout(() => { URL.revokeObjectURL(a.href); }, 40000); // 40s
        setTimeout(() => { a.dispatchEvent(new MouseEvent('click')); }, 0);
    }
}
