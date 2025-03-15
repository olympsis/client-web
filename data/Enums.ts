
enum APPLICATION_STATUS {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

enum AUTH_STATUS {
    unknown,
    new_user,
    not_finished,
    authenticated,
    returning_user,
    unauthenticated
}

/**
 * CHAT ENUMS
 */
enum CHAT_ROOM_TYPE {
    GROUP = 'group',
    DIRECT = 'direct'
}

enum CHAT_MESSAGE_TYPE {
    TEXT = 'text',
    IMAGE = 'image',
    EVENT = 'event',
    VENUE = 'venue'
}

enum CROP_SHAPE {
    SQUARE='square',
    LANDSCAPE='landscape',
    PORTRAIT='portrait',
    CIRCLE='circle'
};

/**
 * EVENT ENUMS
 */

enum EVENT_PENDING_STATE {
    RSVP='rsvp',
    WAITLIST='waitlist',
    CANCEL='cancel',
}

enum EVENT_RECURRENCE_FREQUENCY {
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY'
}

enum EVENT_RSVP_STATUS {
    MAYBE = 'maybe',
    YES = 'yes'
}
function eventRSVPToNumber(rsvp: EVENT_RSVP_STATUS): number {
    switch (rsvp) {
        default:
            return 0;
        case EVENT_RSVP_STATUS.YES:
            return 1;
    }
}
function numberToEventRSVP(rsvp: number): EVENT_RSVP_STATUS {
    switch (rsvp) {
        default:
            return EVENT_RSVP_STATUS.MAYBE;
        case 1:
            return EVENT_RSVP_STATUS.YES;
    }
}

enum EVENT_SKILL_LEVEL {
    ANY_LEVEL='any level',
    AMATEUR='amateur',
    INTERMEDIATE='intermediate',
    EXPERT='expert'
}
function eventSkillLevelToNumber(level: EVENT_SKILL_LEVEL): number {
    switch (level) {
        case EVENT_SKILL_LEVEL.ANY_LEVEL:
            return 0;
        case EVENT_SKILL_LEVEL.AMATEUR:
            return 1;
        case EVENT_SKILL_LEVEL.INTERMEDIATE:
            return 2;
        case EVENT_SKILL_LEVEL.EXPERT:
            return 3;
        default:
            return 0;
    }
}
function numberToEventSkillLevel(level: number): EVENT_SKILL_LEVEL {
    switch (level) {
        default:
            return EVENT_SKILL_LEVEL.ANY_LEVEL;
        case 1:
            return EVENT_SKILL_LEVEL.AMATEUR;
        case 2:
            return EVENT_SKILL_LEVEL.INTERMEDIATE;
        case 3:
            return EVENT_SKILL_LEVEL.EXPERT;
    }
}

enum EVENT_STATE {
    PENDING,
    LIVE,
    COMPLETED,
}

enum EVENT_TYPE {
    REGULAR = 'regular',
    COMPETITIVE = 'competitive'
}
function eventTypeToNumber(type: EVENT_TYPE): number {
    switch (type) {
        default:
            return 0;
        case EVENT_TYPE.COMPETITIVE:
            return 1;
    }
}
function numberToEventType(type: number): EVENT_TYPE {
    switch (type) {
        default:
            return EVENT_TYPE.REGULAR;
        case 1:
            return EVENT_TYPE.COMPETITIVE;
            
    }
}

enum EVENT_VISIBILITY {
    PUBLIC = 'public',
    GROUPS = 'groups',
    PRIVATE = 'private'
}
function eventVisibilityToNumber(visibility: EVENT_VISIBILITY): number {
    switch (visibility) {
        default:
            return 0;
        case EVENT_VISIBILITY.GROUPS:
            return 1;
        case EVENT_VISIBILITY.PRIVATE:
            return 2;
    }
}
function numberToEventVisibility(visibility: number): EVENT_VISIBILITY {
    switch (visibility) {
        default: 
            return EVENT_VISIBILITY.PUBLIC;
        case 1:
            return EVENT_VISIBILITY.GROUPS;
        case 2:
            return EVENT_VISIBILITY.PRIVATE;
    }
}

enum GROUP_ROLE {
    OWNER = 'owner',
    ADMIN = 'admin',
    MEMBER = 'member'
}
function stringToGroupRole(role: string): GROUP_ROLE {
    switch (role.toLowerCase()) {
        case 'owner':
            return GROUP_ROLE.OWNER;
        case 'admin':
            return GROUP_ROLE.ADMIN;
        case 'member':
        default:
            return GROUP_ROLE.MEMBER;
    }
}

enum GROUP_TYPE {
    CLUB = "club",
    ORGANIZATION = "organization"
}
function groupTypeToNumber(type: GROUP_TYPE): number {
    switch (type) {
        default:
            return 0;
        case GROUP_TYPE.ORGANIZATION:
            return 1;
    }
}
function numberToGroupType(type: number): GROUP_TYPE {
    switch (type) {
        default: 
            return GROUP_TYPE.CLUB;
        case 1:
            return GROUP_TYPE.ORGANIZATION;
    }
}

enum GROUP_VISIBILITY {
    PUBLIC='public',
    PRIVATE='private'
}

/**
 * Platform supported sports
 */
enum SPORTS {
    RUNNING='running',
    SOCCER='soccer',
    TENNIS='tennis',
    GOLF='golf',
    VOLLEYBALL='volleyball',
    BASKETBALL='basketball',
    CYCLING='cycling',
    PICKLEBALL='pickleball',
    BADMINTON='badminton',
    PING_PONG='ping-pong',
    WEIGHTS='weights',
    CLIMBING='climbing',
    HIKING='hiking',
    FOOTBALL='football',
    SPIKE='spike',
    RACQUETBALL='racquetball',
    SKIING='skiing',
    SNOWBOARDING='snowboarding'
}

/**
 * Takes the enum and returns a display variant of the sport
 * 
 * @param sport enum of sport type
 * @returns return the proper name of the sport
 */
function sportToString(sport: SPORTS) : string {
    switch (sport) {
        case SPORTS.RUNNING:
            return 'Running';
        case SPORTS.SOCCER:
            return 'Soccer';
        case SPORTS.TENNIS:
            return 'Tennis';
        case SPORTS.GOLF:
            return 'Golf';
        case SPORTS.VOLLEYBALL:
            return 'Volleyball';
        case SPORTS.BASKETBALL:
            return 'Basketball';
        case SPORTS.CYCLING:
            return 'Cycling';
        case SPORTS.PICKLEBALL:
            return 'Pickleball';
        case SPORTS.BADMINTON:
            return 'Badminton';
        case SPORTS.PING_PONG:
            return 'Ping Pong';
        case SPORTS.WEIGHTS:
            return 'Weights';
        case SPORTS.CLIMBING:
            return 'Climbing';
        case SPORTS.HIKING:
            return 'Hiking';
        case SPORTS.FOOTBALL:
            return 'Football';
        case SPORTS.SPIKE:
            return 'Spike';
        case SPORTS.RACQUETBALL:
            return 'Racquetball';
        case SPORTS.SKIING:
            return 'Skiing';
        case SPORTS.SNOWBOARDING:
            return 'Snowboarding';
    }
}

/**
 * Takes a string and returns a sport enum associated with the string
 * 
 * @param sport - string value of the sport
 * @returns sport enum
 */
function stringToSport(sport: string): SPORTS | undefined {
    // Convert input to lowercase and trim for consistency
    const normalizedInput = sport.toLowerCase().trim();
    
    // Check if the normalized input exists as a value in the enum
    const enumValue = Object
        .values(SPORTS)
        .find(value => value === normalizedInput);
    
    // Return the enum if found, undefined if not
    return enumValue as SPORTS | undefined;
}

/**
 * Gets the internal images for sports
 * 
 * @param sport - sport to find images for
 * @returns return an array of image urls
 */
function sportsInternalImages(sport: SPORTS) : string[] {
    switch (sport) {
        case SPORTS.BADMINTON:
            return [];
        case SPORTS.BASKETBALL:
            return ['event-images/basketball-0.jpg', 'event-images/basketball-1.jpg', 'event-images/basketball-2.jpg'];
        case SPORTS.CLIMBING:
            return ['event-images/climbing-0.jpg', 'event-images/climbing-1.jpg', 'event-images/climbing-2.jpg'];
        case SPORTS.CYCLING:
            return ['event-images/cycling-0.jpg', 'event-images/cycling-1.jpg'];
        case SPORTS.FOOTBALL:
            return ['event-images/football-0.jpg'];
        case SPORTS.GOLF:
            return ['event-images/golf-0.jpg', 'event-images/golf-1.jpg', 'event-images/golf-2.jpg'];
        case SPORTS.HIKING:
            return ['event-images/hiking-0.jpg', 'event-images/hiking-1.jpg'];
        case SPORTS.PICKLEBALL:
            return ['event-images/pickleball-0.jpg', 'event-images/pickleball-1.jpg', 'event-images/pickleball-2.jpg'];
        case SPORTS.PING_PONG:
            return [];
        case SPORTS.RACQUETBALL:
            return ['event-images/racquetball-0.jpg'];
        case SPORTS.RUNNING:
            return ['event-images/running-0.jpg', 'event-images/running-1.jpg'];
        case SPORTS.SKIING:
            return [];
        case SPORTS.SOCCER:
            return ['event-images/soccer-0.jpg', 'event-images/soccer-1.jpg', 'event-images/soccer-2.jpg'];
        case SPORTS.SNOWBOARDING:
            return [];
        case SPORTS.SPIKE:
            return ['event-images/spike-0.jpg'];
        case SPORTS.TENNIS:
            return ['event-images/tennis-0.jpg', 'event-images/tennis-1.jpg', 'event-images/tennis-2.jpg'];
        case SPORTS.VOLLEYBALL:
            return ['event-images/volleyball-0.jpg', 'event-images/volleyball-1.jpg', 'event-images/volleyball-2.jpg'];
        case SPORTS.WEIGHTS:
            return ['event-images/weights-0.jpg', 'event-images/weights-1.jpg'];
    }
}

enum VIEW_SIZE {
    MOBILE,
    MEDIUM,
    LARGE
}

enum VIEW_STATE {
    PENDING,
    LOADING,
    SUCCESS,
    FAILURE
}

/**
 * Enum for announcement text emphasis options
 */
enum TEXT_EMPHASIS {
    TITLE = 'title',
    SUBTITLE = 'subtitle',
    EQUAL = 'equal'
}

function textEmphasisFromString(value: string): TEXT_EMPHASIS {
    switch (value) {
        case 'subtitle': return TEXT_EMPHASIS.SUBTITLE;
        case 'equal': return TEXT_EMPHASIS.EQUAL;
        default: return TEXT_EMPHASIS.TITLE;
    }
}

function textEmphasisToString(value: TEXT_EMPHASIS): string {
    return value;
}

/**
 * Enum for announcement visibility scope
 */
enum ANNOUNCEMENT_SCOPE {
    LOCAL = 'local',
    GLOBAL = 'global',
    APPLICATION_WIDE = 'application-wide'
}

function scopeFromString(value: string): ANNOUNCEMENT_SCOPE {
    switch (value) {
        case 'local': return ANNOUNCEMENT_SCOPE.LOCAL;
        case 'application-wide': return ANNOUNCEMENT_SCOPE.APPLICATION_WIDE;
        default: return ANNOUNCEMENT_SCOPE.GLOBAL;
    }
}

function scopeToString(value: ANNOUNCEMENT_SCOPE): string {
    return value;
}

/**
 * Enum for announcement status
 */
enum ANNOUNCEMENT_STATUS {
    PENDING = 'pending',
    IN_REVIEW = 'in-review',
    ACTIVE = 'active',
    EXPIRED = 'expired'
}

function statusFromString(value: string): ANNOUNCEMENT_STATUS {
    switch (value) {
        case 'in-review': return ANNOUNCEMENT_STATUS.IN_REVIEW;
        case 'active': return ANNOUNCEMENT_STATUS.ACTIVE;
        case 'expired': return ANNOUNCEMENT_STATUS.EXPIRED;
        default: return ANNOUNCEMENT_STATUS.PENDING;
    }
}

function statusToString(value: ANNOUNCEMENT_STATUS): string {
    return value;
}

export {
    AUTH_STATUS,
    APPLICATION_STATUS,
    ANNOUNCEMENT_SCOPE,
    scopeFromString,
    scopeToString,

    ANNOUNCEMENT_STATUS,
    statusFromString,
    statusToString,

    CHAT_ROOM_TYPE,
    CHAT_MESSAGE_TYPE,
    CROP_SHAPE,
    
    EVENT_PENDING_STATE,
    EVENT_RECURRENCE_FREQUENCY,
    
    EVENT_RSVP_STATUS,
    eventRSVPToNumber,
    numberToEventRSVP,
    
    EVENT_SKILL_LEVEL,
    eventSkillLevelToNumber,
    numberToEventSkillLevel,
    
    EVENT_STATE,

    EVENT_TYPE,
    eventTypeToNumber,
    numberToEventType,
    
    EVENT_VISIBILITY,
    eventVisibilityToNumber,
    numberToEventVisibility,
    
    GROUP_ROLE,
    stringToGroupRole,
    
    GROUP_TYPE,
    groupTypeToNumber,
    numberToGroupType,
    
    GROUP_VISIBILITY,

    SPORTS,
    sportToString,
    stringToSport,
    sportsInternalImages,

    TEXT_EMPHASIS,
    textEmphasisFromString,
    textEmphasisToString,

    VIEW_SIZE,
    VIEW_STATE
}
