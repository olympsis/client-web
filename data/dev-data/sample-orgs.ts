import { Organization, OrganizationDao } from '~/data/models/OrganizationModels';

export const organizationDaoSamples: OrganizationDao[] = [
    new OrganizationDao(
        "org_001",
        "National Sports Academy",
        "Premier multi-sport training facility focused on developing elite athletes",
        ["basketball", "volleyball", "swimming", "track"],
        "Los Angeles",
        "California",
        "USA",
        "https://example.com/logos/nsa-logo.png",
        "https://example.com/banners/nsa-facility.jpg",
        [/* Members would be populated here */],
        "post_123"
    ),

    new OrganizationDao(
        "org_002",
        "Metropolitan Athletics Club",
        "Urban sports complex offering diverse athletic programs for all ages",
        ["tennis", "soccer", "gymnastics", "martial-arts"],
        "Chicago",
        "Illinois",
        "USA",
        "https://example.com/logos/mac-logo.png",
        "https://example.com/banners/mac-complex.jpg",
        [/* Members would be populated here */],
        "post_456"
    ),

    new OrganizationDao(
        "org_003",
        "University Sports Foundation",
        "Collegiate athletics organization managing varsity and intramural sports",
        ["football", "basketball", "baseball", "soccer", "swimming"],
        "Boston",
        "Massachusetts",
        "USA",
        "https://example.com/logos/usf-logo.png",
        "https://example.com/banners/usf-campus.jpg",
        [/* Members would be populated here */],
        "post_789"
    ),

    new OrganizationDao(
        "org_004",
        "Youth Sports Development Center",
        "Focused on nurturing young talent through comprehensive sports programs",
        ["soccer", "basketball", "swimming", "athletics"],
        "Miami",
        "Florida",
        "USA",
        "https://example.com/logos/ysdc-logo.png",
        "https://example.com/banners/ysdc-center.jpg",
        [/* Members would be populated here */],
        "post_101"
    ),

    new OrganizationDao(
        "org_005",
        "Mountain Region Sports Alliance",
        "Consortium of winter and outdoor sports facilities in the mountain region",
        ["skiing", "snowboarding", "mountain-biking", "rock-climbing"],
        "Denver",
        "Colorado",
        "USA",
        "https://example.com/logos/mrsa-logo.png",
        "https://example.com/banners/mrsa-mountains.jpg",
        [/* Members would be populated here */],
        "post_202"
    )
];

// Assuming we have the necessary imports and class definitions
export const organizationSamples: Organization[] = [
    new Organization(
        "org_001",
        "University Athletic Association",
        "Comprehensive collegiate sports program managing multiple varsity and club teams",
        ["football", "basketball", "swimming", "track", "soccer"],
        "Ann Arbor",
        "Michigan",
        "USA",
        "https://example.com/logos/uaa-logo.png",
        "https://example.com/banners/uaa-stadium.jpg",
        [/* Members would be populated here */],
        "post_123",
        [
            // new ClubDao("club_101", "Varsity Football Team", "Division I football program"),
            // new ClubDao("club_102", "Swimming & Diving Club", "Competitive aquatics program"),
            // new ClubDao("club_103", "Track & Field Team", "Indoor and outdoor track programs")
        ],
        1640995200000  // Jan 1, 2022
    ),

    new Organization(
        "org_002",
        "City Sports & Recreation",
        "Municipal organization overseeing community sports programs and facilities",
        ["basketball", "soccer", "tennis", "volleyball"],
        "Seattle",
        "Washington",
        "USA",
        "https://example.com/logos/csr-logo.png",
        "https://example.com/banners/csr-center.jpg",
        [/* Members would be populated here */],
        "post_456",
        [],
        1643673600000  // Feb 1, 2022
    ),

    new Organization(
        "org_003",
        "Elite Training Academy",
        "Professional sports training center developing elite athletes",
        ["baseball", "football", "basketball", "soccer"],
        "Houston",
        "Texas",
        "USA",
        "https://example.com/logos/eta-logo.png",
        "https://example.com/banners/eta-facility.jpg",
        [/* Members would be populated here */],
        "post_789",
        [],
        1646092800000  // Mar 1, 2022
    ),

    new Organization(
        "org_004",
        "Mountain Sports Alliance",
        "Coordinating body for winter and mountain sports activities",
        ["skiing", "snowboarding", "mountain-biking", "rock-climbing"],
        "Boulder",
        "Colorado",
        "USA",
        "https://example.com/logos/msa-logo.png",
        "https://example.com/banners/msa-slopes.jpg",
        [/* Members would be populated here */],
        "post_101",
        [],
        1648771200000  // Apr 1, 2022
    ),

    new Organization(
        "org_005",
        "Aquatics Center Network",
        "Multi-location aquatics organization managing swimming programs",
        ["swimming", "water-polo", "diving", "synchronized-swimming"],
        "San Diego",
        "California",
        "USA",
        "https://example.com/logos/acn-logo.png",
        "https://example.com/banners/acn-pool.jpg",
        [/* Members would be populated here */],
        "post_202",
        [],
        1651363200000  // May 1, 2022
    )
];