
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
/**
 * COMMENT REACTION ENUMS
 */
enum COMMENT_REACTION_TYPE {
    THUMBS_UP = 'thumbs_up',
    HEART = 'heart',
    LAUGH = 'laugh',
    FIRE = 'fire',
    SAD = 'sad',
    THUMBS_DOWN = 'thumbs_down'
}

/** Maps a reaction type enum to its corresponding emoji character. */
function reactionTypeToEmoji(type: COMMENT_REACTION_TYPE): string {
    switch (type) {
        case COMMENT_REACTION_TYPE.THUMBS_UP: return '👍';
        case COMMENT_REACTION_TYPE.HEART: return '❤️';
        case COMMENT_REACTION_TYPE.LAUGH: return '😂';
        case COMMENT_REACTION_TYPE.FIRE: return '🔥';
        case COMMENT_REACTION_TYPE.SAD: return '😢';
        case COMMENT_REACTION_TYPE.THUMBS_DOWN: return '👎';
    }
}

/** Converts a raw string value from the API into a COMMENT_REACTION_TYPE enum. */
function stringToCommentReactionType(value: string): COMMENT_REACTION_TYPE {
    switch (value) {
        case 'thumbs_up': return COMMENT_REACTION_TYPE.THUMBS_UP;
        case 'heart': return COMMENT_REACTION_TYPE.HEART;
        case 'laugh': return COMMENT_REACTION_TYPE.LAUGH;
        case 'fire': return COMMENT_REACTION_TYPE.FIRE;
        case 'sad': return COMMENT_REACTION_TYPE.SAD;
        case 'thumbs_down': return COMMENT_REACTION_TYPE.THUMBS_DOWN;
        default: return COMMENT_REACTION_TYPE.THUMBS_UP;
    }
}

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

enum COMPETITION_FORMAT {
    // General Team Sports
    BRACKET = 'bracket',
    LEAGUE = 'league',
    ROUND_ROBIN = 'round_robin',
    SINGLE_ELIMINATION = 'single_elimination',
    DOUBLE_ELIMINATION = 'double_elimination',
    BEST_OF_3 = 'best_of_3',
    BEST_OF_5 = 'best_of_5',
    WINNER_STAYS_ON = 'winner_stays_on',
    
    // Team Formats
    VERSUS_1 = '1v1',
    VERSUS_2 = '2v2',
    VERSUS_4 = '4v4',
    VERSUS_3 = '3v3',
    VERSUS_5 = '5v5',
    VERSUS_6 = '6v6',
    VERSUS_7 = '7v7',
    VERSUS_8 = '8v8',
    VERSUS_9 = '9v9',
    VERSUS_10 = '10v10',
    VERSUS_11 = '11v11',
    
    // Individual Sports
    TIME_TRIAL = 'time_trial',
    
    // Running
    SPRINT = 'sprint',
    LONG_DISTANCE = 'long_distance',
    RELAY = 'relay',
    
    // Cycling
    ROAD_RACE = 'road_race',
    CRITERIUM = 'criterium',
    STAGE_RACE = 'stage_race',
    
    // Golf
    STROKE_PLAY = 'stroke_play',
    MATCH_PLAY = 'match_play',
    SCRAMBLE = 'scramble',
    BEST_BALL = 'best_ball',
    STABLEFORD = 'stableford',
    SKINS_GAME = 'skins_game',
    ALTERNATE_SHOT = 'alternate_shot',
    SHAMBLE = 'shamble',
    MODIFIED_STABLEFORD = 'modified_stableford',
    SCRATCH = 'scratch',
    
    // Climbing
    BOULDERING = 'bouldering',
    LEAD_CLIMBING = 'lead_climbing',
    SPEED_CLIMBING = 'speed_climbing'
}

function stringToCompetitionFormat(formatString: string): COMPETITION_FORMAT {
    switch (formatString.toLowerCase()) {
      // General Team Sports
      case 'bracket':
        return COMPETITION_FORMAT.BRACKET;
      case 'league':
        return COMPETITION_FORMAT.LEAGUE;
      case 'round_robin':
      case 'round robin':
        return COMPETITION_FORMAT.ROUND_ROBIN;
      case 'single_elimination':
      case 'single elimination':
        return COMPETITION_FORMAT.SINGLE_ELIMINATION;
      case 'double_elimination':
      case 'double elimination':
        return COMPETITION_FORMAT.DOUBLE_ELIMINATION;
      case 'best_of_3':
      case 'best of 3':
      case 'bo3':
        return COMPETITION_FORMAT.BEST_OF_3;
      case 'best_of_5':
      case 'best of 5':
      case 'bo5':
        return COMPETITION_FORMAT.BEST_OF_5;
      case 'winner_stays_on':
      case 'winner stays on':
        return COMPETITION_FORMAT.WINNER_STAYS_ON;
      
      // Team Formats
      case '2v2':
        return COMPETITION_FORMAT.VERSUS_2;
      case '3v3':
        return COMPETITION_FORMAT.VERSUS_3;
      case '5v5':
        return COMPETITION_FORMAT.VERSUS_5;
      case '6v6':
        return COMPETITION_FORMAT.VERSUS_6;
      case '7v7':
        return COMPETITION_FORMAT.VERSUS_7;
      case '8v8':
        return COMPETITION_FORMAT.VERSUS_8;
      case '9v9':
        return COMPETITION_FORMAT.VERSUS_9;
      case '10v10':
        return COMPETITION_FORMAT.VERSUS_10;
      case '11v11':
        return COMPETITION_FORMAT.VERSUS_11;
      
      // Individual Sports
      case 'time_trial':
      case 'time trial':
        return COMPETITION_FORMAT.TIME_TRIAL;
      
      // Running
      case 'sprint':
        return COMPETITION_FORMAT.SPRINT;
      case 'long_distance':
      case 'long distance':
        return COMPETITION_FORMAT.LONG_DISTANCE;
      case 'relay':
        return COMPETITION_FORMAT.RELAY;
      
      // Cycling
      case 'road_race':
      case 'road race':
        return COMPETITION_FORMAT.ROAD_RACE;
      case 'criterium':
        return COMPETITION_FORMAT.CRITERIUM;
      case 'stage_race':
      case 'stage race':
        return COMPETITION_FORMAT.STAGE_RACE;
      
      // Golf
      case 'stroke_play':
      case 'stroke play':
        return COMPETITION_FORMAT.STROKE_PLAY;
      case 'match_play':
      case 'match play':
        return COMPETITION_FORMAT.MATCH_PLAY;
      case 'scramble':
        return COMPETITION_FORMAT.SCRAMBLE;
      case 'best_ball':
      case 'best ball':
        return COMPETITION_FORMAT.BEST_BALL;
      case 'stableford':
        return COMPETITION_FORMAT.STABLEFORD;
      case 'skins_game':
      case 'skins game':
        return COMPETITION_FORMAT.SKINS_GAME;
      case 'alternate_shot':
      case 'alternate shot':
        return COMPETITION_FORMAT.ALTERNATE_SHOT;
      case 'shamble':
        return COMPETITION_FORMAT.SHAMBLE;
      case 'modified_stableford':
      case 'modified stableford':
        return COMPETITION_FORMAT.MODIFIED_STABLEFORD;
      case 'scratch':
        return COMPETITION_FORMAT.SCRATCH;
      
      // Climbing
      case 'bouldering':
        return COMPETITION_FORMAT.BOULDERING;
      case 'lead_climbing':
      case 'lead climbing':
        return COMPETITION_FORMAT.LEAD_CLIMBING;
      case 'speed_climbing':
      case 'speed climbing':
        return COMPETITION_FORMAT.SPEED_CLIMBING;
      
      default:
        throw new Error(`Unknown competition format: ${formatString}`);
    }
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
    WAITLIST,
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

enum MEDIA_TYPE {
    IMAGE='image',
    VIDEO='video'
}

function stringToMediaType(value: string): MEDIA_TYPE {
    switch (value) {
        default:
            return MEDIA_TYPE.IMAGE;
        case 'video': 
            return MEDIA_TYPE.VIDEO;
    }
}

enum NEW_EVENT_ERROR {
    NO_TITLE=0,
    NO_DESCRIPTION=1,
    NO_ORGANIZERS=2,
    NO_VENUES=3,
    NO_IMAGE=4,
    INVALID_START_DATE=5,
    INVALID_END_DATE=6
}

enum RSVP_STATUS {
    YES=1,
    MAYBE=0
}

function rsvpStatusToNumber(status: RSVP_STATUS): number {
    return status;
}

function numberToRsvpStatus(num: number): RSVP_STATUS {
    switch (num) {
        case 1:
            return RSVP_STATUS.YES;
        case 0:
            return RSVP_STATUS.MAYBE;
        default:
            return RSVP_STATUS.MAYBE;
    }
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

    COMMENT_REACTION_TYPE,
    reactionTypeToEmoji,
    stringToCommentReactionType,

    CHAT_ROOM_TYPE,
    CHAT_MESSAGE_TYPE,
    
    COMPETITION_FORMAT,
    stringToCompetitionFormat,

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

    MEDIA_TYPE,
    stringToMediaType,

    NEW_EVENT_ERROR,

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
