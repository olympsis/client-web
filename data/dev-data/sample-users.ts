import { UserSnippet } from '~/data/models/UserModels';

export const userSnippets = {
    alex: new UserSnippet("uuid-alex-123", "alex_runner", "https://example.com/alex.jpg"),
    sarah: new UserSnippet("uuid-sarah-456", "sarah_athlete", "https://example.com/sarah.jpg"),
    mike: new UserSnippet("uuid-mike-789", "mike_sports", "https://example.com/mike.jpg"),
    emma: new UserSnippet("uuid-emma-012", "emma_fitness", "https://example.com/emma.jpg"),
    chris: new UserSnippet("uuid-chris-345", "chris_coach", "https://example.com/chris.jpg"),
    john: new UserSnippet("uuid-john-145", "john_doe", "https://example.com/chris.jpg"),
    jane: new UserSnippet("uuid-jane-332", "jane_doe", "https://example.com/chris.jpg")
};