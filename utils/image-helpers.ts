function generateImageURL(link: string | undefined | null) : string {
    if (!link) return '';
    // If the link is already a full URL, return it as-is
    if (link.startsWith('http://') || link.startsWith('https://')) {
        return link;
    }
    return "https://storage.googleapis.com/olympsis-" + link;
}

export {
    generateImageURL
}