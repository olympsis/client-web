import { Venue } from "../models/VenueModels";
import { Ownership, GeoJSON } from "../models/GenericModels";

const sampleVenues: Venue[] = [
    // Example 1: Soccer Stadium
    (() => {
      const venue = new Venue();
      venue.id = "ven_1001";
      venue.name = "Meadowlands Stadium";
      venue.owner = Ownership.decode({
        'name': 'City Sports Authority',
        'type': 'municipal'
      });
      venue.description = "Professional soccer stadium with state-of-the-art facilities, seating for 45,000 spectators, and a world-class playing surface.";
      venue.sports = ["soccer", "football"];
      venue.images = [
        "https://example.com/venues/meadowlands1.jpg",
        "https://example.com/venues/meadowlands2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-74.074, 40.813]
      });
      venue.city = "East Rutherford";
      venue.state = "New Jersey";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 2: Basketball Arena
    (() => {
      const venue = new Venue();
      venue.id = "ven_1002";
      venue.name = "Downtown Arena";
      venue.owner = Ownership.decode({
        'name': 'Metropolitan Sports Group',
        'type': 'private'
      });
      venue.description = "Multi-purpose indoor arena hosting basketball games, concerts, and other events with a capacity of 20,000.";
      venue.sports = ["basketball", "volleyball"];
      venue.images = [
        "https://example.com/venues/downtown1.jpg",
        "https://example.com/venues/downtown2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-118.267, 34.043]
      });
      venue.city = "Los Angeles";
      venue.state = "California";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 3: Tennis Club
    (() => {
      const venue = new Venue();
      venue.id = "ven_1003";
      venue.name = "Baseline Tennis Club";
      venue.owner = Ownership.decode({
        'name': 'Baseline Sports LLC',
        'type': 'private'
      });
      venue.description = "Premium tennis facility featuring 12 clay courts, 8 hard courts, and a clubhouse with fitness center.";
      venue.sports = ["tennis"];
      venue.images = [
        "https://example.com/venues/baseline1.jpg",
        "https://example.com/venues/baseline2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-80.191, 25.761]
      });
      venue.city = "Miami";
      venue.state = "Florida";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 4: Community Park
    (() => {
      const venue = new Venue();
      venue.id = "ven_1004";
      venue.name = "Green Valley Park";
      venue.owner = Ownership.decode({
        'name': 'City Parks Department',
        'type': 'municipal'
      });
      venue.description = "Community park with walking trails, basketball courts, baseball diamonds, and open spaces for various recreational activities.";
      venue.sports = ["basketball", "baseball", "running", "hiking"];
      venue.images = [
        "https://example.com/venues/greenvalley1.jpg",
        "https://example.com/venues/greenvalley2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-122.332, 47.606]
      });
      venue.city = "Seattle";
      venue.state = "Washington";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 5: Golf Course
    (() => {
      const venue = new Venue();
      venue.id = "ven_1005";
      venue.name = "Pinehurst Golf Club";
      venue.owner = Ownership.decode({
        'name': 'Pinehurst Resort',
        'type': 'private'
      });
      venue.description = "Historic 18-hole championship golf course with rolling fairways, challenging greens, and beautiful landscaping.";
      venue.sports = ["golf"];
      venue.images = [
        "https://example.com/venues/pinehurst1.jpg",
        "https://example.com/venues/pinehurst2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-79.482, 35.189]
      });
      venue.city = "Pinehurst";
      venue.state = "North Carolina";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 6: Ski Resort
    (() => {
      const venue = new Venue();
      venue.id = "ven_1006";
      venue.name = "Alpine Peaks Resort";
      venue.owner = Ownership.decode({
        'name': 'Mountain Adventures Inc',
        'type': 'private'
      });
      venue.description = "Mountain resort offering 40+ ski trails for all skill levels, snow parks, and equipment rentals.";
      venue.sports = ["skiing", "snowboarding"];
      venue.images = [
        "https://example.com/venues/alpine1.jpg",
        "https://example.com/venues/alpine2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-106.822, 39.482]
      });
      venue.city = "Aspen";
      venue.state = "Colorado";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 7: Fitness Center
    (() => {
      const venue = new Venue();
      venue.id = "ven_1007";
      venue.name = "PowerFit Gym";
      venue.owner = Ownership.decode({
        'name': 'PowerFit Franchises',
        'type': 'private'
      });
      venue.description = "Modern fitness facility with cardio equipment, free weights, group exercise studios, and personal training.";
      venue.sports = ["exercise"];
      venue.images = [
        "https://example.com/venues/powerfit1.jpg",
        "https://example.com/venues/powerfit2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-87.624, 41.881]
      });
      venue.city = "Chicago";
      venue.state = "Illinois";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 8: Skate Park
    (() => {
      const venue = new Venue();
      venue.id = "ven_1008";
      venue.name = "Urban Grind Skate Park";
      venue.owner = Ownership.decode({
        'name': 'City Recreation Department',
        'type': 'municipal'
      });
      venue.description = "Outdoor skate park featuring rails, ramps, half-pipes, and other obstacles for skaters of all skill levels.";
      venue.sports = ["skateboarding"];
      venue.images = [
        "https://example.com/venues/urbangrind1.jpg",
        "https://example.com/venues/urbangrind2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-122.419, 37.775]
      });
      venue.city = "San Francisco";
      venue.state = "California";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 9: Volleyball Beach Complex
    (() => {
      const venue = new Venue();
      venue.id = "ven_1009";
      venue.name = "Sunset Beach Volleyball Center";
      venue.owner = Ownership.decode({
        'name': 'Coastal Recreation Authority',
        'type': 'municipal'
      });
      venue.description = "Beachfront volleyball complex with 10 professional-grade sand courts and spectator areas.";
      venue.sports = ["volleyball"];
      venue.images = [
        "https://example.com/venues/sunset1.jpg",
        "https://example.com/venues/sunset2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-117.904, 33.742]
      });
      venue.city = "Huntington Beach";
      venue.state = "California";
      venue.country = "USA";
      return venue;
    })(),
    
    // Example 10: Multi-sport Complex
    (() => {
      const venue = new Venue();
      venue.id = "ven_1010";
      venue.name = "Riverside Sports Complex";
      venue.owner = Ownership.decode({
        'name': 'County Sports Commission',
        'type': 'municipal'
      });
      venue.description = "Large multi-sport facility with fields and courts for soccer, basketball, baseball, tennis, and more. Includes concessions and parking.";
      venue.sports = ["soccer", "basketball", "baseball", "tennis", "volleyball"];
      venue.images = [
        "https://example.com/venues/riverside1.jpg",
        "https://example.com/venues/riverside2.jpg"
      ];
      venue.location = GeoJSON.decode({
        'type': 'Point',
        'coordinates': [-97.743, 30.267]
      });
      venue.city = "Austin";
      venue.state = "Texas";
      venue.country = "USA";
      return venue;
    })()
];

export { sampleVenues };