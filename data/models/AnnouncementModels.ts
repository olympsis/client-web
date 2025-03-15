import { TEXT_EMPHASIS, ANNOUNCEMENT_SCOPE, ANNOUNCEMENT_STATUS, textEmphasisFromString, scopeFromString, statusFromString, textEmphasisToString, scopeToString, statusToString } from '../Enums';
import { GeoJSON } from './GenericModels';
import { Codable } from './Models';
import { UserSnippet } from './UserModels';

/**
 * Text style configuration for announcement text
 */
export class TextStyle extends Codable<TextStyle> {
    fontSize: string;
    fontWeight: string;
    color: string;
    textAlign: string;
    lineHeight: string;
    letterSpacing: string;

    constructor(
        fontSize: string = '16px',
        fontWeight: string = 'normal',
        color: string = '#000000',
        textAlign: string = 'left',
        lineHeight: string = '1.2',
        letterSpacing: string = 'normal'
    ) {
        super();
        this.fontSize = fontSize;
        this.fontWeight = fontWeight;
        this.color = color;
        this.textAlign = textAlign;
        this.lineHeight = lineHeight;
        this.letterSpacing = letterSpacing;
    }

    static override decode<TextStyle>(data: { [key: string]: any }): TextStyle {
        const object = Object();

        if (data) {
            object['fontSize'] = data['font_size'] || '16px';
            object['fontWeight'] = data['font_weight'] || 'normal';
            object['color'] = data['color'] || '#000000';
            object['textAlign'] = data['text_align'] || 'left';
            object['lineHeight'] = data['line_height'] || '1.2';
            object['letterSpacing'] = data['letter_spacing'] || 'normal';
        }

        Object.setPrototypeOf(object, TextStyle.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.fontSize) {
            data['font_size'] = this.fontSize;
        }
        if (this.fontWeight) {
            data['font_weight'] = this.fontWeight;
        }
        if (this.color) {
            data['color'] = this.color;
        }
        if (this.textAlign) {
            data['text_align'] = this.textAlign;
        }
        if (this.lineHeight) {
            data['line_height'] = this.lineHeight;
        }
        if (this.letterSpacing) {
            data['letter_spacing'] = this.letterSpacing;
        }

        return data;
    }
}

/**
 * Position configuration for announcement display
 */
export class PositionConfig extends Codable<PositionConfig> {
    alignment: string;
    verticalPos: string;
    xOffset: number;
    yOffset: number;
    zIndex: number;
    width: string;
    height: string;

    constructor(
        alignment: string = 'center',
        verticalPos: string = 'middle',
        xOffset: number = 0,
        yOffset: number = 0,
        zIndex: number = 1,
        width: string = '100%',
        height: string = 'auto'
    ) {
        super();
        this.alignment = alignment;
        this.verticalPos = verticalPos;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.zIndex = zIndex;
        this.width = width;
        this.height = height;
    }

    static override decode<PositionConfig>(data: { [key: string]: any }): PositionConfig {
        const object = Object();

        if (data) {
            object['alignment'] = data['alignment'] || 'center';
            object['verticalPos'] = data['vertical_pos'] || 'middle';
            object['xOffset'] = data['x_offset'] || 0;
            object['yOffset'] = data['y_offset'] || 0;
            object['zIndex'] = data['z_index'] || 1;
            object['width'] = data['width'] || '100%';
            object['height'] = data['height'] || 'auto';
        }

        Object.setPrototypeOf(object, PositionConfig.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.alignment) {
            data['alignment'] = this.alignment;
        }
        if (this.verticalPos) {
            data['vertical_pos'] = this.verticalPos;
        }
        if (this.xOffset !== undefined) {
            data['x_offset'] = this.xOffset;
        }
        if (this.yOffset !== undefined) {
            data['y_offset'] = this.yOffset;
        }
        if (this.zIndex !== undefined) {
            data['z_index'] = this.zIndex;
        }
        if (this.width) {
            data['width'] = this.width;
        }
        if (this.height) {
            data['height'] = this.height;
        }

        return data;
    }
}

/**
 * Action button configuration
 */
export class ActionButton extends Codable<ActionButton> {
    text: string;
    url: string;
    color: string;
    textColor: string;

    constructor(
        text: string = 'Learn More',
        url: string = '',
        color: string = '#2196F3',
        textColor: string = '#FFFFFF'
    ) {
        super();
        this.text = text;
        this.url = url;
        this.color = color;
        this.textColor = textColor;
    }

    static override decode<ActionButton>(data: { [key: string]: any }): ActionButton {
        const object = Object();

        if (data) {
            object['text'] = data['text'] || 'Learn More';
            object['url'] = data['url'] || '';
            object['color'] = data['color'] || '#2196F3';
            object['textColor'] = data['text_color'] || '#FFFFFF';
        }

        Object.setPrototypeOf(object, ActionButton.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.text) {
            data['text'] = this.text;
        }
        if (this.url) {
            data['url'] = this.url;
        }
        if (this.color) {
            data['color'] = this.color;
        }
        if (this.textColor) {
            data['text_color'] = this.textColor;
        }

        return data;
    }
}

/**
 * Main Announcement class
 */
export class Announcement extends Codable<Announcement> {
    id: string;
    creator: UserSnippet | undefined;
    title: string;
    subtitle: string;
    textEmphasis: TEXT_EMPHASIS;
    titleStyle: TextStyle;
    subtitleStyle: TextStyle;
    mediaURL: string;
    mediaType: string;
    actionButton: ActionButton;
    position: PositionConfig;
    scope: ANNOUNCEMENT_SCOPE;
    location: GeoJSON | undefined;
    status: ANNOUNCEMENT_STATUS;
    activeDate: number;
    expiryDate: number;
    createdAt: number;
    updatedAt: number;

    constructor(
        id: string,
        creator: UserSnippet | undefined,
        title: string,
        subtitle: string,
        textEmphasis: TEXT_EMPHASIS,
        titleStyle: TextStyle,
        subtitleStyle: TextStyle,
        mediaURL: string,
        mediaType: string,
        actionButton: ActionButton,
        position: PositionConfig,
        scope: ANNOUNCEMENT_SCOPE,
        location: GeoJSON | undefined,
        status: ANNOUNCEMENT_STATUS,
        activeDate: number,
        expiryDate: number,
        createdAt: number,
        updatedAt: number
    ) {
        super();
        this.id = id;
        this.creator = creator;
        this.title = title;
        this.subtitle = subtitle;
        this.textEmphasis = textEmphasis;
        this.titleStyle = titleStyle;
        this.subtitleStyle = subtitleStyle;
        this.mediaURL = mediaURL;
        this.mediaType = mediaType;
        this.actionButton = actionButton;
        this.position = position;
        this.scope = scope;
        this.location = location;
        this.status = status;
        this.activeDate = activeDate;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static override decode<Announcement>(data: { [key: string]: any }): Announcement {
        const object = Object();

        if (data) {
            object['id'] = data['id'] || data['_id'];
            object['creator'] = data['creator'] ? UserSnippet.decode(data['creator']) : undefined;
            object['title'] = data['title'] || '';
            object['subtitle'] = data['subtitle'] || '';
            object['textEmphasis'] = textEmphasisFromString(data['text_emphasis']);
            object['titleStyle'] = data['title_style'] ? TextStyle.decode(data['title_style']) : new TextStyle();
            object['subtitleStyle'] = data['subtitle_style'] ? TextStyle.decode(data['subtitle_style']) : new TextStyle();
            object['mediaURL'] = data['media_url'] || '';
            object['mediaType'] = data['media_type'] || 'image';
            object['actionButton'] = data['action_button'] ? ActionButton.decode(data['action_button']) : new ActionButton();
            object['position'] = data['position'] ? PositionConfig.decode(data['position']) : new PositionConfig();
            object['scope'] = scopeFromString(data['scope']);
            object['location'] = data['location'] ? GeoJSON.decode(data['location']) : undefined;
            object['status'] = statusFromString(data['status']);
            object['activeDate'] = data['active_date'] || Date.now();
            object['expiryDate'] = data['expiry_date'] || (Date.now() + 30 * 24 * 60 * 60 * 1000);
            object['createdAt'] = data['created_at'] || Date.now();
            object['updatedAt'] = data['updated_at'] || Date.now();
        }

        Object.setPrototypeOf(object, Announcement.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.id) {
            data['id'] = this.id;
        }
        if (this.creator) {
            data['creator'] = this.creator.encode();
        }
        if (this.title) {
            data['title'] = this.title;
        }
        if (this.subtitle) {
            data['subtitle'] = this.subtitle;
        }
        if (this.textEmphasis) {
            data['text_emphasis'] = textEmphasisToString(this.textEmphasis);
        }
        if (this.titleStyle) {
            data['title_style'] = this.titleStyle.encode();
        }
        if (this.subtitleStyle) {
            data['subtitle_style'] = this.subtitleStyle.encode();
        }
        if (this.mediaURL) {
            data['media_url'] = this.mediaURL;
        }
        if (this.mediaType) {
            data['media_type'] = this.mediaType;
        }
        if (this.actionButton) {
            data['action_button'] = this.actionButton.encode();
        }
        if (this.position) {
            data['position'] = this.position.encode();
        }
        if (this.scope) {
            data['scope'] = scopeToString(this.scope);
        }
        if (this.location) {
            data['location'] = this.location.encode();
        }
        if (this.status) {
            data['status'] = statusToString(this.status);
        }
        if (this.activeDate) {
            data['active_date'] = this.activeDate;
        }
        if (this.expiryDate) {
            data['expiry_date'] = this.expiryDate;
        }
        if (this.createdAt) {
            data['created_at'] = this.createdAt;
        }
        if (this.updatedAt) {
            data['updated_at'] = this.updatedAt;
        }

        return data;
    }
}

/**
 * Response for announcement list queries
 */
export class AnnouncementsResponse extends Codable<AnnouncementsResponse> {
    totalAnnouncements: number;
    announcements: Announcement[];

    constructor(totalAnnouncements: number, announcements: Announcement[]) {
        super();
        this.totalAnnouncements = totalAnnouncements;
        this.announcements = announcements;
    }

    static override decode<AnnouncementsResponse>(data: { [key: string]: any }): AnnouncementsResponse {
        const object = Object();

        if (data) {
            object['totalAnnouncements'] = data['total_announcements'] || 0;
            object['announcements'] = data['announcements'] 
                ? data['announcements'].map((item: any) => Announcement.decode(item))
                : [];
        }

        Object.setPrototypeOf(object, AnnouncementsResponse.prototype);
        return object;
    }

    override encode(): { [key: string]: any } {
        const data: { [key: string]: any } = {};

        if (this.totalAnnouncements !== undefined) {
            data['total_announcements'] = this.totalAnnouncements;
        }
        
        if (this.announcements) {
            data['announcements'] = this.announcements.map(announcement => announcement.encode());
        }

        return data;
    }
}