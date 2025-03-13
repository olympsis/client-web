export function detectPrivateBrowsing() {
    return new Promise(resolve => {
        try {
            const testKey = 'test';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            resolve(false); // localStorage works, not private mode
        } catch (e) {
            resolve(true); // localStorage doesn't work, likely private mode
        }
    });
}