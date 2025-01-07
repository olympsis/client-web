enum Sports {
    Running = "running",
    Soccer = "soccer",
    Basketball = "basketball",
    Tennis = "tennis",
    Volleyball = "volleyball",
    Snowboarding = "snowboarding",
    Golf = "golf",
    Hiking = "hiking",
    Baseball = "baseball", 
    Skiing = "skiing",
    Exercise = "exercise",
    Skateboarding = "skateboarding",
}
  
// Mapping from sports enum to image filenames
const SportsImages: { [key in Sports]: string } = {
    [Sports.Running]: "running.svg",
    [Sports.Soccer]: "soccer.svg",
    [Sports.Basketball]: "basketball.svg",
    [Sports.Tennis]: "tennis.svg",
    [Sports.Volleyball]: "volleyball.svg",
    [Sports.Golf]: "golf.svg",
    [Sports.Hiking]: "hiking.svg",
    [Sports.Baseball]: "baseball.svg",
    [Sports.Snowboarding]: "snowboarding.svg",
    [Sports.Skiing]: "skiing.svg",
    [Sports.Exercise]: "exercise.svg",
    [Sports.Skateboarding]: "skateboarding.svg",
};

export {
    Sports,
    SportsImages
}