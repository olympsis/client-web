import { Club } from '~/data/models/ClubModels';
import { sampleOrgsDao } from './sample-orgs';

// Assuming we have the necessary imports and class definitions
const sampleClubs: Club[] = [
    new Club(
        "club_001",
        sampleOrgsDao[0],
        "Varsity Soccer Club",
        "Official university soccer club for competitive players",
        ["soccer"],
        "Boston",
        "Massachusetts",
        "USA",
        "https://example.com/logos/soccer.png",
        "https://example.com/banners/soccer-field.jpg",
        "public",
        [/* Members would be populated here */],
        ["varsity", "competitive", "division1"],
        ["Must maintain 3.0 GPA", "Attendance at 90% of practices required"],
        "post_123",
        1640995200000  // Jan 1, 2022
    ),

    new Club(
        "club_002",
        sampleOrgsDao[1],
        "Downtown Basketball Association",
        "Community basketball league for all skill levels",
        ["basketball"],
        "Chicago",
        "Illinois",
        "USA",
        "https://example.com/logos/basketball.png",
        "https://example.com/banners/court.jpg",
        "public",
        [/* Members would be populated here */],
        ["recreational", "community", "all-levels"],
        ["Respectful conduct required", "Weekly commitment expected"],
        "post_456",
        1643673600000  // Feb 1, 2022
    ),

    new Club(
        "club_003",
        sampleOrgsDao[2],
        "Junior Tennis Academy",
        "Elite tennis training program for youth athletes",
        ["tennis"],
        "Miami",
        "Florida",
        "USA",
        "https://example.com/logos/tennis.png",
        "https://example.com/banners/tennis-court.jpg",
        "private",
        [/* Members would be populated here */],
        ["youth", "competitive", "training"],
        ["Age limit: 12-18 years", "Equipment provided"],
        "post_789",
        1646092800000  // Mar 1, 2022
    ),

    new Club(
        "club_004",
        sampleOrgsDao[3],
        "CrossFit Warriors",
        "High-intensity functional fitness training",
        ["crossfit", "fitness"],
        "Austin",
        "Texas",
        "USA",
        "https://example.com/logos/crossfit.png",
        "https://example.com/banners/gym.jpg",
        "public",
        [/* Members would be populated here */],
        ["fitness", "strength", "conditioning"],
        ["Sign waiver before joining", "Bring own water bottle"],
        "post_101",
        1648771200000  // Apr 1, 2022
    ),

    new Club(
        "club_005",
        sampleOrgsDao[4],
        "Alpine Ski Club",
        "Winter sports enthusiasts group for skiing and snowboarding",
        ["skiing", "snowboarding"],
        "Denver",
        "Colorado",
        "USA",
        "https://example.com/logos/ski.png",
        "https://example.com/banners/mountain.jpg",
        "public",
        [/* Members would be populated here */],
        ["winter-sports", "outdoor", "adventure"],
        ["Safety first policy", "Equipment rental available"],
        "post_202",
        1651363200000  // May 1, 2022
    )
];

export { sampleClubs }