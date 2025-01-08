import { Venue } from "../models/VenueModels"

export const DEV_VENUES: Venue[] = [
    Venue.decode(
        {
            "id": "63ae1f481d438440be1f76fb",
            "name": "Chelsea Piers",
            "owner": {
                "name": "Chelsea Piers LLC",
                "type": "private"
            },
            "description": "Chelsea Piers is a multi-sport complex located in Stamford, Connecticut. It features a wide variety of sports and recreational activities, including ice skating, rock climbing, golf, batting cages, and more. The complex has several indoor and outdoor facilities, including a golf club with a driving range and a mini golf course, a field house with turf fields and basketball courts, and an ice rink. Chelsea Piers also has a full-service gym and fitness center, as well as a spa and salon. In addition to its sports and fitness facilities, the complex has a variety of dining options, including a food court, a café, and a full-service restaurant. Overall, Chelsea Piers is a state-of-the-art sports and recreational destination that offers something for everyone.",
            "sports": [
                "soccer",
                "pickleball",
                "basketball",
                "hockey",
                "tennis",
                "golf"
            ],
            "images": [
                "field-images/226f8aef-247f-4015-8426-85aa93c0e5e6.jpg",
                "field-images/95ba205c-fd42-4ed8-ab8e-e74759363b87.jpg",
                "field-images/d35eeade-512f-4d0c-a1fe-3268d94b4c82.jpg"
            ],
            "location": {
                "type": "Point",
                "coordinates": [
                    -73.516258,
                    41.051696
                ]
            },
            "city": "Stamford",
            "state": "CT",
            "country": "United States"
        },
    ),

    Venue.decode(
        {
            "id": "639aa6fe0710e5e04e653678",
            "name": "Lione Park",
            "owner": {
                "name": "Stamford City",
                "type": "public"
            },
            "description": "Lionne Park is a public park located in Stamford, Connecticut. It features a turf field, which is suitable for a variety of sports and activities. The field is well-maintained and offers a smooth and even surface for sports like soccer, football, and lacrosse. Overall, Lionne Park is a great destination for sports enthusiasts, and anyone looking to enjoy some time outside in a beautiful, natural setting.",
            "sports": [
                "soccer",
                "pickleball"
            ],
            "images": [
                "field-images/78c7efcd-6ec3-4324-a468-ad0ea1e0c177.jpg"
            ],
            "location": {
                "type": "Point",
                "coordinates": [
                    -73.556503,
                    41.054057
                ]
            },
            "city": "Stamford",
            "state": "CT",
            "country": "United States"
        }
    ),

    Venue.decode(
        {
            "id": "66d63e7d854f78a933738d6d",
            "name": "Wagner Playground Fields",
            "owner": {
                "name": "New York City",
                "type": "public"
            },
            "description": "Wagner Playground, located in East Harlem, Manhattan, is a small, jointly operated playground at East 120th Street between 1st and 2nd Avenues. This playground, established in 1957, features a variety of recreational amenities including sports fields primarily used for soccer and other athletic activities.",
            "sports": [
                "soccer",
                "basketball",
                "baseball"
            ],
            "images": [
                "field-images/60276d5e-9acf-4e06-9b65-847f6e5aed1c.jpg",
                "field-images/f38077ee-e41c-406e-aaf9-c3b6855dd569.jpg",
                "field-images/3e5c8bfc-9883-47a2-b075-7bbc6f06febf.jpg"
            ],
            "location": {
                "type": "Point",
                "coordinates": [
                    -73.934862,
                    40.799758
                ]
            },
            "city": "New York",
            "state": "NY",
            "country": "United States"
        }
    )
]