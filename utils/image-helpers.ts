function generateImageURL(link: string) : string {
    return "https://storage.googleapis.com/olympsis-" + link;
}

export {
    generateImageURL
}